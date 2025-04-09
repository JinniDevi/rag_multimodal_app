# app/api/endpoints/query.py
from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.core.llm_chain import create_qa_chain

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/ask/")
async def ask_question(request: QueryRequest):
    qa_chain = create_qa_chain()
    answer = qa_chain.run(request.question)
    return {"answer": answer}
