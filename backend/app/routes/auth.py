# backend/app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from app.models.usuario import Usuario
from app.models.sessao import Sessao
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse
from app.services.auth import verificar_senha, gerar_hash_senha, criar_sessao, get_usuario_atual

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.username == request.username).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )
    
    if not verificar_senha(request.password, usuario.password_hash, usuario.salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos."
        )
    
    token = criar_sessao(db, usuario.id)
    return {
        "token": token,
        "user": usuario
    }

@router.post("/logout")
def logout(usuario: Usuario = Depends(get_usuario_atual), db: Session = Depends(get_db)):
    # Deleta todas as sessões do usuário atual (ou podemos deletar apenas o token específico se repassado)
    # Por simplicidade, deleta todas as sessões deste usuário
    db.query(Sessao).filter(Sessao.usuario_id == usuario.id).delete()
    db.commit()
    return {"message": "Sessão encerrada com sucesso."}

@router.get("/me", response_model=UserResponse)
def me(usuario: Usuario = Depends(get_usuario_atual)):
    return usuario
