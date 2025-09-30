from functools import lru_cache
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # .env파일정의후 주석처리해제필요
    # model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # database_url: PostgresDsn = Field(..., env="DATABASE_URL")


    # +++ SQLite 설정 (env파일 전까지 사용) +++
    # alphabot.db 라는 파일 사용
    database_url: str = "sqlite:///./alphabot.db"
    
    # jwt설정
    SECRET_KEY: str = "secret_key" #나중에 키 수정
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached settings loader."""
    return Settings()  # type: ignore[arg-type]


settings = get_settings()
