# app/api/endpoints/upload.py
from fastapi import APIRouter, UploadFile, File
from backend.app.core.vectorstore import create_vectorstore
import fitz # PyMuPDF
import io


router = APIRouter()


@router.post("/upload")
async def upload_text(file: UploadFile = File(...)):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        # PDF 파일 처리
        doc = fitz.open(stream=content, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])

    elif file.content_type.startswith("text/"):
        # 일반 텍스트 파일 처리
        text = content.decode("utf-8", errors="ignore")

    else:
        return {"message": "지원되지 않는 파일 형식입니다."}

    # 벡터 저장
    vectorstore = create_vectorstore()
    vectorstore.add_texts([text])

    return {"message": "파일 업로드 및 벡터 저장 완료"}
