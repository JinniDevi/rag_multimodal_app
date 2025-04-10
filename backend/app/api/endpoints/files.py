from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

# UPLOAD_DIR = "backend/uploads"  # 상대 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 파일(app/api/endpoints/upload.py) 기준
BASE_DIR = os.path.dirname(BASE_DIR)  # app/api/endpoints
BASE_DIR = os.path.dirname(BASE_DIR)  # app/api
BASE_DIR = os.path.dirname(BASE_DIR)  # app
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")  # 절대 경로로 수정

# 폴더 없으면 자동 생성
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# 파일 목록 조회
@router.get("/files")
async def list_files():
    try:
        files = os.listdir(UPLOAD_DIR)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 파일 삭제
@router.delete("/files/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": f"{filename} 삭제 완료"}
    else:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
