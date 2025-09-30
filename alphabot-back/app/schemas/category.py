from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    """카테고리 기본 스키마"""
    title: str = Field(..., max_length=50, description="카테고리 제목")
    description: str = Field(..., max_length=200, description="카테고리 설명")


class CategoryCreate(CategoryBase):
    """카테고리 생성을 위한 요청 스키마"""
    pass


class CategoryUpdate(BaseModel):
    """카테고리 수정을 위한 요청 스키마"""
    title: Optional[str] = Field(None, max_length=50, description="카테고리 제목")
    description: Optional[str] = Field(None, max_length=200, description="카테고리 설명")


class CategoryInDB(CategoryBase):
    """데이터베이스의 카테고리 스키마"""
    category_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Category(CategoryInDB):
    """클라이언트에 카테고리 정보를 반환하기 위한 응답 스키마"""
    pass


class CategoryList(BaseModel):
    """카테고리 목록 응답 스키마"""
    categories: list[Category]
    total: int
    page: int
    page_size: int
    total_pages: int
