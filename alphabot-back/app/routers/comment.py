from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
import math

from app.db import get_db
from app.core.dependencies import get_current_user
from app.models.models import User
from app.schemas.comment import CommentCreate, CommentRead, CommentList, CommentUpdate
from app.crud.crud_comment import comment_crud

router = APIRouter()


@router.post("/", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(
    *,
    db: Session = Depends(get_db),
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    종목 토론 댓글 작성 (로그인 필요)
    """
    comment = comment_crud.create_with_user(
        db=db, obj_in=comment_in, user_id=current_user.user_id
    )
    return comment

@router.get("/{stock_code}", response_model=CommentList)
def read_comments(
    stock_code: str,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(10, ge=1, le=100, description="페이지 크기")
):
    """
    특정 종목의 댓글 목록 조회 (최신순)
    """
    skip = (page - 1) * page_size
    
    comments = comment_crud.get_by_stock(
        db=db, stock_code=stock_code, skip=skip, limit=page_size
    )
    total = comment_crud.get_count_by_stock(db=db, stock_code=stock_code)
    
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    
    return CommentList(
        comments=comments,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.put("/{comment_id}", response_model=CommentRead)
def update_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    comment_in: CommentUpdate, # 이제 schemas에서 가져온 클래스를 사용합니다.
    current_user: User = Depends(get_current_user)
):
    """
    댓글 수정 (본인 댓글만 가능)
    """
    comment = comment_crud.update_with_user(
        db=db, 
        comment_id=comment_id, 
        content=comment_in.content, 
        user_id=current_user.user_id
    )
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or permission denied"
        )
        
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    *,
    db: Session = Depends(get_db),
    comment_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    댓글 삭제 (본인 댓글만 가능)
    """
    comment = comment_crud.remove_with_user(
        db=db, 
        comment_id=comment_id, 
        user_id=current_user.user_id
    )
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or permission denied"
        )
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)