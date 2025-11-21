from sqlalchemy.orm import Session
from typing import List, Optional
from app.crud.crud_base import CRUDBase
from app.models.models import Comment
from app.schemas.comment import CommentCreate
from pydantic import BaseModel

# UpdateSchemaType으로 BaseModel을 사용 (스키마 파일에 CommentUpdate가 없으면 기본 모델 사용)
class CRUDComment(CRUDBase[Comment, CommentCreate, BaseModel]):
    
    # 1. 생성 (Create)
    def create_with_user(
        self, db: Session, *, obj_in: CommentCreate, user_id: int
    ) -> Comment:
        """
        사용자 ID를 포함하여 댓글 생성
        """
        db_obj = Comment(
            stock_code=obj_in.stock_code,
            content=obj_in.content,
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # 2. 조회 (Read - Single)
    def get_comment(self, db: Session, *, comment_id: int) -> Optional[Comment]:
        """
        댓글 ID로 단일 댓글 조회
        """
        return db.query(self.model).filter(self.model.comment_id == comment_id).first()

    # 2. 조회 (Read - List by Stock)
    def get_by_stock(
        self, 
        db: Session, 
        *, 
        stock_code: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Comment]:
        """
        특정 종목의 댓글 목록 조회 (최신순 정렬)
        """
        return (
            db.query(self.model)
            .filter(self.model.stock_code == stock_code)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # 2. 조회 (Read - Count)
    def get_count_by_stock(self, db: Session, *, stock_code: str) -> int:
        """특정 종목의 댓글 총 개수"""
        return db.query(self.model).filter(self.model.stock_code == stock_code).count()

    # 3. 수정 (Update)
    def update_with_user(
        self, 
        db: Session, 
        *, 
        comment_id: int, 
        content: str, 
        user_id: int
    ) -> Optional[Comment]:
        """
        댓글 내용 수정 (본인 확인 포함)
        """
        # 수정하려는 댓글이 존재하는지, 그리고 요청한 사용자의 것인지 확인
        db_obj = db.query(self.model).filter(
            self.model.comment_id == comment_id,
            self.model.user_id == user_id
        ).first()

        if db_obj:
            db_obj.content = content
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            
        return db_obj

    # 4. 삭제 (Delete)
    def remove_with_user(
        self, db: Session, *, comment_id: int, user_id: int
    ) -> Optional[Comment]:
        """
        댓글 삭제 (본인 확인 포함)
        """
        # 삭제하려는 댓글이 존재하는지, 그리고 요청한 사용자의 것인지 확인
        db_obj = db.query(self.model).filter(
            self.model.comment_id == comment_id,
            self.model.user_id == user_id
        ).first()

        if db_obj:
            db.delete(db_obj)
            db.commit()
            
        return db_obj

# 인스턴스 생성
comment_crud = CRUDComment(Comment)