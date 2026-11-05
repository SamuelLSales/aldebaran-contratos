# backend/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Nome do arquivo do banco de dados SQLite local
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = "aldebaran.db"
# Caminho absoluto do banco de dados SQLite
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, DATABASE_NAME)}"

# Criação do engine de conexão com o banco SQLite.
# 'connect_args={"check_same_thread": False}' é necessário apenas para o SQLite,
# permitindo que múltiplas requisições acessem o banco simultaneamente em threads diferentes.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Criação do gerador de sessões (SessionLocal). Cada instância do SessionLocal
# representará uma sessão de conversação com o banco de dados.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base declarativa que todos os nossos modelos ORM irão herdar
Base = declarative_base()

def get_db():
    """
    Função utilitária (Dependency Injection) para obter uma sessão do banco de dados.
    Garante que a sessão seja aberta e devidamente fechada após a conclusão da requisição.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
