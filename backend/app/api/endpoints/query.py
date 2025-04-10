# app/api/endpoints/query.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.core.llm_chain import create_qa_chain
from backend.app.core.vectorstore import create_vectorstore
from langchain_core.documents import Document
from urllib.parse import unquote
from langchain_openai import ChatOpenAI
from elasticsearch import Elasticsearch
import os

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_question(request: QueryRequest):
    qa_chain = create_qa_chain()
    answer = qa_chain.run(request.question)
    return {"answer": answer}

@router.post("/ask/{filename}")
async def ask_file(filename: str, request: QueryRequest):
    try:
        filename = unquote(filename)  # URL 디코딩 추가
        vectorstore = create_vectorstore()
        # ----------------------------------------------------------------------------------
        # filename 메타데이터 기준으로 검색
        # docs = vectorstore.similarity_search(
        #     query=request.question,
        #     filter={"filename": filename},  # 메타데이터에 filename 필터 적용
        #     k=3  # top 3 문서 가져오기
        # )
        # ----------------------------------------------------------------------------------
        # 직접 filter 없이 검색 후, 수동 필터링 시도
        # docs = vectorstore.similarity_search(
        #     query=request.question,
        #     k=10  # 검색 결과 수를 충분히 확보
        # )

        # 수동 필터링
        # filtered_docs = [doc for doc in docs if doc.metadata.get("filename") == filename]

        # if not docs:
        #     return {"answer": "관련된 내용을 찾을 수 없습니다."}

        # 문서들을 연결해서 답변 생성
        # combined_content = "\n".join(doc.page_content for doc in docs)
        # return {"answer": combined_content}
        # ----------------------------------------------------------------------------------
        question = request.question
        # 🔥 Elasticsearch 직접 raw query
        es_query = {
            "size": 10,
            "query": {
                "bool": {
                    "must": [
                        {"match": {"content": question}}
                    ],
                    "filter": [
                        {"term": {"metadata.filename.keyword": filename}}
                    ]
                }
            }
        }
        response = vectorstore.search(index="rag-index", body=es_query)

        hits = response["hits"]["hits"]
        if not hits:
            return {"answer": "관련된 내용을 찾을 수 없습니다.", "suggestions": []}

        combined_text = "\n".join(hit["_source"]["content"] for hit in hits)

        # 답변 요약 (LLM 사용)
        llm = ChatOpenAI(model="gpt-4o", temperature=0.2)
        summary_prompt = f"다음 문서 내용을 사용해 질문에 대해 핵심 요약 답변을 작성해줘.\n\n문서 내용:\n{combined_text}\n\n질문: {question}\n\n요약 답변:"
        summary_response = llm.invoke(summary_prompt)
        summary = summary_response.content.strip()

        # 추가 질문 추천
        followup_prompt = f"사용자가 '{question}' 라고 질문했어. 이 질문을 기반으로 추가로 할 만한 질문 3개를 추천해줘. 짧고 명확하게."
        followup_response = llm.invoke(followup_prompt)
        followup_questions = followup_response.content.strip().split('\n')

        return {
            "answer": summary,
            "suggestions": [q.strip('- ').strip() for q in followup_questions if q.strip()]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 실패: {str(e)}")