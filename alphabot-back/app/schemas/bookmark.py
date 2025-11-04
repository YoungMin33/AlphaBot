from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class BookmarkCreate(BaseModel):
    """북마크(메시지 저장) 생성 요청 스키마"""
    messages_id: int = Field(..., description="저장할 메시지 ID")
    category_id: Optional[int] = Field(None, description="카테고리 ID (없으면 미분류)")


class BookmarkRead(BaseModel):
    """북마크 응답 스키마"""
    bookmark_id: int
    user_id: int
    messages_id: int
    category_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkList(BaseModel):
    """북마크 목록 응답 스키마 (페이지네이션)"""
    bookmarks: list[BookmarkRead]
    total: int
    page: int
    page_size: int
    total_pages: int


