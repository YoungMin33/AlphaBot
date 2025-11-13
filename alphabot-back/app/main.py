from fastapi import FastAPI
import logging
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from app.db import engine
from app.models import Base
from app.routers import auth, chat, user

# --- 기본 로깅 레벨 WARNING으로 설정 ---
logging.getLogger().setLevel(logging.WARNING)
logging.getLogger("uvicorn").setLevel(logging.WARNING)
logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

app = FastAPI()

#CORS 미들웨어 설정 수정
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api/v1/users", tags=["User"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

# --- 모든 경로 index.html 반환 ---
@app.get("/{full_path:path}")
def serve_react_app_catch_all(full_path: str):
    return FileResponse("frontend/index.html")

# --- 서버 실행 시 DB 테이블 자동생성 ---
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)