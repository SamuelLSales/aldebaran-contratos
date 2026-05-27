# backend/app/models/usuario.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Usuario(Base):
    """
    Modelo ORM que representa a tabela 'usuarios'.
    Armazena credenciais de acesso seguras para login.
    """
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    salt = Column(String(100), nullable=False)
    nome = Column(String(255), nullable=False)
    role = Column(String(50), default="viewer", nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)
