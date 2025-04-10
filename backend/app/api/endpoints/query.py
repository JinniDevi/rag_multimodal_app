# app/api/endpoints/query.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.core.llm_chain import create_qa_chain
from backend.app.core.vectorstore import create_vectorstore
from langchain_core.documents import Document
from urllib.parse import unquote

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

        # filename 메타데이터 기준으로 검색
        docs = vectorstore.similarity_search(
            query=request.question,
            filter={"filename": filename},  # 메타데이터에 filename 필터 적용
            k=3  # top 3 문서 가져오기
        )

        if not docs:
            return {"answer": "관련된 내용을 찾을 수 없습니다."}

        # 문서들을 연결해서 답변 생성
        combined_content = "\n".join(doc.page_content for doc in docs)
        return {"answer": combined_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 실패: {str(e)}")