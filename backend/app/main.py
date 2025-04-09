# app/main.py
from dotenv import load_dotenv
from fastapi import FastAPI
from backend.app.api.endpoints import upload, query

load_dotenv()

app = FastAPI()

app.include_router(upload.router, prefix="/api")
app.include_router(query.router, prefix="/api")
