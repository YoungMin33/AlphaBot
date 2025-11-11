from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db import get_db
from app.schemas.chats import MessageCreate, MessageRead, ChatRead, ChatByStockResponse
from app.models import User, Chat, Message
from app.services.chat_service import (
    normalize_stock_code,
    upsert_chat_by_stock,
)

router = APIRouter(tags=["chat"])


@router.post("/api/rooms/{room_id}/messages", response_model=MessageRead)
def create_message(
    room_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """특정 채팅방에 메시지를 전송하고 DB에 저장"""
    db_message = Message(
        chat_id=room_id, user_id=current_user.user_id, content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/api/rooms/{room_id}/messages", response_model=List[MessageRead])
def get_messages(
    room_id: int,
    last_message_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """특정 채팅방의 메시지 내역을 조회"""
    chat = db.query(Chat).filter(Chat.chat_id == room_id, Chat.user_id == current_user.user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat room not found or permission denied")

    query = db.query(Message).filter(Message.chat_id == room_id)
    if last_message_id:
        query = query.filter(Message.messages_id > last_message_id)

    messages = query.order_by(Message.created_at.asc()).all()
    return messages


@router.get("/api/rooms", response_model=List[ChatRead])
def get_chat_rooms(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """현재 사용자가 참여 중인 모든 채팅방 목록을 조회"""
    chat_rooms = db.query(Chat).filter(Chat.user_id == current_user.user_id).all()
    return chat_rooms


@router.put("/v1/chats/by-stock/{stock_code}", response_model=ChatByStockResponse)
def enter_chat_by_stock(
    stock_code: str,
    title: str | None = Query(default=None, max_length=100, description="신규 생성 시 사용할 제목"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """사용자/종목 조합으로 채팅방을 조회하거나 생성 후 chat_id를 반환"""
    try:
        normalized_code = normalize_stock_code(stock_code)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if title:
        normalized_title = title.strip()
    else:
        normalized_title = None
    chat, existed = upsert_chat_by_stock(
        db,
        user=current_user,
        stock_code=normalized_code,
        title=normalized_title,
    )

    return ChatByStockResponse(
        chat_id=chat.chat_id,
        title=chat.title,
        stock_code=chat.stock_code or normalized_code,
        existed=existed,
    )
