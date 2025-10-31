from pydantic import BaseModel, Field

# 공통 속성을 위한 Base 스키마
class UserBase(BaseModel):
    login_id: str = Field(..., min_length=4, max_length=50, description="로그인 아이디")
    username: str = Field(..., min_length=2, max_length=50, description="사용자 이름")

# 회원가입 시 요청에 사용할 스키마
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="비밀번호")

# DB에서 읽어온 데이터를 위한 스키마
# 내부 로직에서 사용
class UserInDB(UserBase):
    user_id: int
    hashed_pw: str

    class Config:
        from_attributes = True
 
# API 응답으로 클라이언트에게 줄 스키마. 비밀번호제외. 내 정보 조회에 사용됨
class User(UserBase):
    user_id: int

    class Config:
        from_attributes = True