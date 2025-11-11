from typing import List
<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, Query
=======
from fastapi import APIRouter, Depends, HTTPException, status
>>>>>>> develop
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.dependencies import get_current_user
from app.db import get_db
<<<<<<< HEAD
from app.schemas.chats import MessageCreate, MessageRead, ChatRead, ChatByStockResponse
=======
from app.schemas.chats import MessageCreate, MessageRead, ChatRead, ChatCreate
>>>>>>> develop
from app.models import User, Chat, Message
from app.services.chat_service import (
    normalize_stock_code,
    upsert_chat_by_stock,
)

router = APIRouter(tags=["chat"])


@router.post("/rooms/{room_id}/messages", response_model=MessageRead)
def create_message(
    room_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """특정 채팅방에 메시지를 전송하고 DB에 저장"""
    # 소유권 확인
    chat = (
        db.query(Chat)
        .filter(Chat.chat_id == room_id, Chat.user_id == current_user.user_id)
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat room not found or permission denied")

    db_message = Message(chat_id=room_id, user_id=current_user.user_id, content=message.content)
    db.add(db_message)
    # 채팅방 최근 대화 시각 갱신
    chat.lastchat_at = func.now()
    db.add(chat)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/rooms/{room_id}/messages", response_model=List[MessageRead])
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


@router.get("/rooms", response_model=List[ChatRead])
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
@router.post("/rooms", response_model=ChatRead, status_code=status.HTTP_201_CREATED)
def create_chat_room(
    chat_in: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    새 채팅방 생성 (종목별 채팅방)
    - stock_code가 전달되면 동일 사용자/종목의 활성 방이 있으면 그 방을 반환
    """
    existing_chat = None
    if chat_in.stock_code:
        existing_chat = (
            db.query(Chat)
            .filter(
                Chat.user_id == current_user.user_id,
                Chat.stock_code == chat_in.stock_code,
                Chat.trash_can == "in",
            )
            .first()
        )
    if existing_chat:
        return existing_chat

    new_chat = Chat(
        user_id=current_user.user_id,
        title=chat_in.title,
        stock_code=chat_in.stock_code,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat


@router.get("/rooms/by-stock/{stock_code}", response_model=ChatRead)
def get_chat_room_by_stock(
    stock_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """현재 사용자의 특정 종목 채팅방 조회"""
    chat = (
        db.query(Chat)
        .filter(
            Chat.user_id == current_user.user_id,
            Chat.stock_code == stock_code,
            Chat.trash_can == "in",
        )
        .first()
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat room for stock not found")
    return chat
