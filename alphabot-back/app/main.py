from fastapi import FastAPI
import logging
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.engine import Engine

from app.db import engine, get_db, Base
from app.routers import auth, chat, user

<<<<<<< HEAD
from app.db import engine, get_db
from app.models import Base, role_enum, trash_enum
from app.routers import auth, chat,user

=======
>>>>>>> develop
app = FastAPI()

# 기본 로깅 레벨 WARNING으로 설정
logging.getLogger().setLevel(logging.WARNING)
logging.getLogger("uvicorn").setLevel(logging.WARNING)
logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


# CORS 설정: 프론트엔드 개발 서버 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ensure_stock_code_column(sql_engine: Engine) -> None:
    """
    SQLite에서 chat.stock_code 컬럼이 없으면 추가한다.
    (간단한 런타임 마이그레이션; 개발 편의를 위한 것으로 운영에서는 정식 마이그레이션 사용 권장)
    """
    with sql_engine.begin() as conn:
        if sql_engine.dialect.name != "sqlite":
            return
        rows = conn.exec_driver_sql("PRAGMA table_info(chat);").fetchall()
        col_names = {row[1] for row in rows}  # row[1] = column name
        if "stock_code" not in col_names:
            conn.exec_driver_sql("ALTER TABLE chat ADD COLUMN stock_code VARCHAR(20);")
            conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_chat_stock_code ON chat(stock_code);")
            conn.exec_driver_sql(
                "CREATE INDEX IF NOT EXISTS idx_chat_user_stock ON chat(user_id, stock_code);"
            )


@app.on_event("startup")
def on_startup() -> None:
    # 테이블 생성 (없으면)
    Base.metadata.create_all(bind=engine)
    # 간단 마이그레이션
    _ensure_stock_code_column(engine)


# chat, auth 라우터 등록
app.include_router(user.router, prefix="/api", tags=["User"])
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(category.router, prefix="/api/categories", tags=["Categories"])
app.include_router(bookmark.router, prefix="/api/bookmarks", tags=["Bookmarks"])

# 모든 경로 index.html 반환
@app.get("/{full_path:path}")
def serve_react_app_catch_all(full_path: str):
    return FileResponse("frontend/index.html")
