# backend/app/schemas/auth.py
from pydantic import BaseModel
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    nome: str
    role: str

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    token: str
    user: UserResponse
