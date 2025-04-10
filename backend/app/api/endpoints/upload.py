from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import fitz  # PyMuPDF
from PIL import Image
import torch
import clip
import re
import io
from backend.app.core.vectorstore import create_vectorstore

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 파일(app/api/endpoints/upload.py) 기준
BASE_DIR = os.path.dirname(BASE_DIR)  # app/api/endpoints
BASE_DIR = os.path.dirname(BASE_DIR)  # app/api
BASE_DIR = os.path.dirname(BASE_DIR)  # app
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")  # 절대 경로로 수정

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, clip_preprocess = clip.load("ViT-B/32", device=device)


def clean_text(text):
    # 특수문자, 이상한 코드 삭제
    text = text.replace("\r", "\n").replace("\t", " ")
    text = re.sub(r"[^\x20-\x7E가-힣\n]", "", text)  # 한글, 영어, 숫자, 공백, 줄바꿈만 남기기
    text = "\n".join([line.strip() for line in text.split("\n") if line.strip()])
    return text


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()

    vectorstore = create_vectorstore()

    if file.filename.endswith(".pdf"):
        doc = fitz.open(stream=content, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])
        # 텍스트 클린업
        text = clean_text(text)

        vectorstore.add_texts(
            [text],
            metadatas=[{
                "filename": file.filename,
                "filetype": "pdf"
            }]
        )

        # 서버에 파일 저장
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)

    elif file.content_type.startswith("text/"):
        text = content.decode("utf-8", errors="ignore")
        # 텍스트 클린업
        text = clean_text(text)

        vectorstore.add_texts(
            [text],
            metadatas=[{
                "filename": file.filename,
                "filetype": "text"
            }]
        )

        # 서버에 파일 저장
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(content)

    elif file.content_type.startswith("image/"):
        # 이미지 파일 처리
        try:
            # image = clip_preprocess(Image.open(file_path)).unsqueeze(0).to(device)
            # 업로드된 메모리 스트림에서 이미지 열기
            image = Image.open(io.BytesIO(content))
            image = clip_preprocess(image).unsqueeze(0).to(device)

            with torch.no_grad():
                image_features = clip_model.encode_image(image)
            image_embedding = image_features.squeeze().cpu().tolist()

            # 직접 vectorstore에 삽입 (텍스트 없이 embedding만 저장하는 방법 필요)
            vectorstore.add_vectors(
                embeddings=[image_embedding],
                metadatas=[{
                    "filename": file.filename,
                    "filetype": "image"
                }]
            )

            # 서버에 파일 저장
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(content)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"이미지 처리 실패: {str(e)}")

    else:
        raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")



    return {"message": "파일 업로드 및 벡터 저장 완료"}
