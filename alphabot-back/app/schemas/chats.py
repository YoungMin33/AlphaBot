from pydantic import BaseModel
from datetime import datetime

# 메시지 생성을 위한 요청 스키마
# POST /api/rooms/{room_id}/messages
class MessageCreate(BaseModel):
    content: str


# 클라이언트에 메시지를 반환하기 위한 응답 스키마
# GET /api/rooms/{room_id}/messages
class MessageRead(BaseModel):
    messages_id: int
    content: str
    user_id: int
    chat_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# 채팅방 정보 조회를 응답 위한 스키마
# GET /api/rooms
class ChatRead(BaseModel):
    chat_id: int
    title: str

    class Config:
        from_attributes = True