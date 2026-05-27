# backend/app/models/contrato.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Contrato(Base):
    """
    Modelo ORM que representa a tabela 'contratos' no banco de dados.
    Armazena as informações gerais do contrato do cliente.
    """
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Nome do projeto (ex: Mapeamento Igaratinga MG)
    nome_projeto = Column(String(255), nullable=False)
    
    # Nome do cliente (ex: Exbel)
    cliente = Column(String(255), nullable=False)
    
    # Empresa responsável (ex: Aldebaran Consultoria)
    empresa = Column(String(255), default="Aldebaran Consultoria", nullable=False)
    
    # Direitos minerários associados (ex: 831.199/2025)
    direitos_minerarios = Column(String(255), nullable=True)
    
    # Área de atuação (Topografia / Geologia)
    area = Column(String(100), nullable=False)
    
    # Diretor responsável pelo projeto (ex: Robson Ribeiro)
    diretor_projeto = Column(String(255), nullable=False)
    
    # Data de início do contrato
    data_inicio = Column(DateTime, nullable=True)
    
    # Data de entrega final do contrato
    data_entrega_final = Column(DateTime, nullable=True)
    
    # Dias totais previstos para trabalho de campo
    dias_campo_total = Column(Integer, default=0, nullable=False)
    
    # Status do contrato (no_prazo, atencao, atrasado, concluido)
    status = Column(String(50), default="no_prazo", nullable=False)
    
    # Observações adicionais
    observacoes = Column(Text, nullable=True)
    
    # Registros de data e hora de criação e atualização
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relacionamento com as fases do contrato (cascade delete garante remoção das fases filhas)
    fases = relationship("Fase", back_populates="contrato", cascade="all, delete-orphan")
    
    # Relacionamento com o histórico de alterações
    historicos = relationship("HistoricoAlteracao", back_populates="contrato", cascade="all, delete-orphan")
