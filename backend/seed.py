# backend/seed.py
import sys
import os
from datetime import datetime, timedelta

# Garante que a pasta backend seja visível para o import do Python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, "app"))

from database import Base, engine, SessionLocal
from app.models.contrato import Contrato
from app.models.fase import Fase
from app.models.etapa import Etapa
from app.models.responsavel import Responsavel
from app.models.historico import HistoricoAlteracao
from app.models.usuario import Usuario
from app.models.sessao import Sessao
from app.services.auth import gerar_hash_senha

def seed_database():
    print("======================================================")
    print("Inicializando e Semeando o Banco de Dados Aldebaran...")
    print("======================================================")
    
    # 1. Cria todas as tabelas no arquivo SQLite se elas não existirem
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Trava de segurança para produção: nunca apaga contratos já existentes sem a flag explícita --force
        forcar_reset = "--force" in sys.argv
        if not forcar_reset and db.query(Contrato).count() > 0:
            print("O banco de dados já possui contratos cadastrados. Pulando seed para preservar os dados existentes.")
            print("(Use 'python seed.py --force' apenas em ambiente de teste caso queira recriar os dados de demonstração).")
            return

        if forcar_reset:
            print("Modo --force ativado: limpando contratos anteriores de teste...")
            db.query(HistoricoAlteracao).delete()
            db.query(Etapa).delete()
            db.query(Fase).delete()
            db.query(Contrato).delete()
            db.commit()

        # 1.5 Usuários (Admin e Viewer)
        if db.query(Usuario).first() is None:
            print("Semeando Usuários...")
            hash_admin, salt_admin = gerar_hash_senha("admin")
            admin = Usuario(username="admin", password_hash=hash_admin, salt=salt_admin, nome="Administrador", role="admin")
            
            hash_visita, salt_visita = gerar_hash_senha("visita")
            visita = Usuario(username="visita", password_hash=hash_visita, salt=salt_visita, nome="Visitante", role="viewer")
            
            db.add_all([admin, visita])
            db.commit()

        # 2. Responsáveis Padrão da Aldebaran Consultoria
        if db.query(Responsavel).count() == 0:
            print("Semeando Responsáveis Técnicos...")
            responsaveis_iniciais = [
                Responsavel(nome="Robson Ribeiro", cargo="Diretor", area="Todas"),
                Responsavel(nome="Nadia Souza", cargo="Coordenadora", area="Administrativo"),
                Responsavel(nome="Humberto Silva", cargo="Campo", area="Topografia"),
                Responsavel(nome="Mariana Lopes", cargo="Geóloga Sênior", area="Geologia"),
                Responsavel(nome="Carlos Eduardo", cargo="Técnico de Campo", area="Topografia"),
                Responsavel(nome="Letícia Fontes", cargo="Engenheira Ambiental", area="Meio Ambiente")
            ]
            db.add_all(responsaveis_iniciais)
            db.commit()

        hoje = datetime.utcnow()

        # =====================================================================
        # CONTRATO 1: Topografia (No Prazo - Em Andamento)
        # =====================================================================
        print("Semeando Contrato 1: Mapeamento Igaratinga MG...")
        c1 = Contrato(
            nome_projeto="Mapeamento Topográfico e Georreferenciamento Igaratinga MG",
            cliente="Exbel Mineração S.A.",
            empresa="Aldebaran Consultoria",
            direitos_minerarios="831.199/2025 e 830.067/2025",
            area="Topografia",
            diretor_projeto="Robson Ribeiro",
            data_inicio=hoje - timedelta(days=20),
            data_entrega_final=hoje + timedelta(days=22),
            dias_campo_total=12,
            status="no_prazo",
            observacoes="Levantamento planialtimétrico cadastral com GNSS RTK e apoio geodésico para licenciamento mineral."
        )
        db.add(c1)
        db.commit()

        f1_c1 = Fase(contrato_id=c1.id, nome_fase="Fase 1 – Planejamento e ART", ordem=1)
        f2_c1 = Fase(contrato_id=c1.id, nome_fase="Fase 2 – Levantamento de Campo GNSS", ordem=2)
        f3_c1 = Fase(contrato_id=c1.id, nome_fase="Fase 3 – Processamento e Planta Final", ordem=3)
        db.add_all([f1_c1, f2_c1, f3_c1])
        db.commit()

        e1_c1 = [
            Etapa(fase_id=f1_c1.id, nome_tarefa="Abertura de ART no CREA-MG", responsavel="Robson Ribeiro", progresso=1.0, data_inicio=hoje - timedelta(days=20), data_termino=hoje - timedelta(days=18), dias_previstos=2, observacoes="ART emitida com sucesso."),
            Etapa(fase_id=f1_c1.id, nome_tarefa="Alinhamento técnico e Termo de Referência", responsavel="Nadia Souza", progresso=1.0, data_inicio=hoje - timedelta(days=18), data_termino=hoje - timedelta(days=15), dias_previstos=3, observacoes="Termo aprovado pelo cliente."),
            Etapa(fase_id=f2_c1.id, nome_tarefa="Implantação de marcos geodésicos", responsavel="Humberto Silva", progresso=1.0, data_inicio=hoje - timedelta(days=14), data_termino=hoje - timedelta(days=10), dias_previstos=4, observacoes="4 marcos homologados IBGE."),
            Etapa(fase_id=f2_c1.id, nome_tarefa="Rastreio e levantamento da cava mineral", responsavel="Humberto Silva", progresso=0.8, data_inicio=hoje - timedelta(days=10), data_termino=hoje + timedelta(days=2), dias_previstos=8, observacoes="80% da área de cava coberta."),
            Etapa(fase_id=f3_c1.id, nome_tarefa="Cálculo e ajustamento das poligonais", responsavel="Carlos Eduardo", progresso=0.2, data_inicio=hoje - timedelta(days=2), data_termino=hoje + timedelta(days=10), dias_previstos=8, observacoes="Processamento no software topográfico."),
            Etapa(fase_id=f3_c1.id, nome_tarefa="Emissão da planta final e memorial descritivo", responsavel="Robson Ribeiro", progresso=0.0, data_inicio=hoje + timedelta(days=10), data_termino=hoje + timedelta(days=22), dias_previstos=12, observacoes="Aguardando fechamento do campo.")
        ]
        db.add_all(e1_c1)
        db.commit()

        # =====================================================================
        # CONTRATO 2: Geologia (Atenção - Vence em 4 dias!)
        # =====================================================================
        print("Semeando Contrato 2: Modelagem Geológica Serra Azul...")
        c2 = Contrato(
            nome_projeto="Sondagem e Modelagem Geológica 3D Serra Azul",
            cliente="Mineração Morro do Ipê",
            empresa="Aldebaran Consultoria",
            direitos_minerarios="830.067/2024",
            area="Geologia",
            diretor_projeto="Robson Ribeiro",
            data_inicio=hoje - timedelta(days=35),
            data_entrega_final=hoje + timedelta(days=4), # ≤ 7 dias -> status ATENÇÃO!
            dias_campo_total=16,
            status="atencao",
            observacoes="Campanha de sondagem rotativa e modelagem litológica em software 3D para estimativa de reservas."
        )
        db.add(c2)
        db.commit()

        f1_c2 = Fase(contrato_id=c2.id, nome_fase="Fase 1 – Locação e Sondagem de Campo", ordem=1)
        f2_c2 = Fase(contrato_id=c2.id, nome_fase="Fase 2 – Descrição Litológica e Amostragem", ordem=2)
        f3_c2 = Fase(contrato_id=c2.id, nome_fase="Fase 3 – Relatório e Modelagem Geológica", ordem=3)
        db.add_all([f1_c2, f2_c2, f3_c2])
        db.commit()

        e2_c2 = [
            Etapa(fase_id=f1_c2.id, nome_tarefa="Locação dos furos de sondagem", responsavel="Mariana Lopes", progresso=1.0, data_inicio=hoje - timedelta(days=35), data_termino=hoje - timedelta(days=30), dias_previstos=5),
            Etapa(fase_id=f1_c2.id, nome_tarefa="Perfuração rotativa (12 furos)", responsavel="Humberto Silva", progresso=1.0, data_inicio=hoje - timedelta(days=30), data_termino=hoje - timedelta(days=15), dias_previstos=15),
            Etapa(fase_id=f2_c2.id, nome_tarefa="Classificação de testemunhos de sondagem", responsavel="Mariana Lopes", progresso=0.9, data_inicio=hoje - timedelta(days=15), data_termino=hoje + timedelta(days=1), dias_previstos=8, observacoes="Falta apenas o furo SR-12."),
            Etapa(fase_id=f3_c2.id, nome_tarefa="Modelagem 3D do corpo de minério", responsavel="Mariana Lopes", progresso=0.6, data_inicio=hoje - timedelta(days=8), data_termino=hoje + timedelta(days=4), dias_previstos=6, observacoes="Fase crítica para entrega no prazo."),
            Etapa(fase_id=f3_c2.id, nome_tarefa="Revisão final do parecer técnico com diretor", responsavel="Robson Ribeiro", progresso=0.0, data_inicio=hoje + timedelta(days=2), data_termino=hoje + timedelta(days=4), dias_previstos=2)
        ]
        db.add_all(e2_c2)
        db.commit()

        # =====================================================================
        # CONTRATO 3: Topografia (Atrasado - Venceu há 6 dias)
        # =====================================================================
        print("Semeando Contrato 3: Georreferenciamento Nova Lima...")
        c3 = Contrato(
            nome_projeto="Levantamento Planialtimétrico Cadastral Nova Lima",
            cliente="Construtora Caparaó",
            empresa="Aldebaran Consultoria",
            direitos_minerarios="N/A (Imóvel Urbano)",
            area="Topografia",
            diretor_projeto="Robson Ribeiro",
            data_inicio=hoje - timedelta(days=40),
            data_entrega_final=hoje - timedelta(days=6), # Passou do prazo -> ATRASADO!
            dias_campo_total=8,
            status="atrasado",
            observacoes="Cadastro de interferências de rede e limites de propriedade para empreendimento residencial."
        )
        db.add(c3)
        db.commit()

        f1_c3 = Fase(contrato_id=c3.id, nome_fase="Fase 1 – Poligonal Básica", ordem=1)
        f2_c3 = Fase(contrato_id=c3.id, nome_fase="Fase 2 – Levantamento Cadastral", ordem=2)
        f3_c3 = Fase(contrato_id=c3.id, nome_fase="Fase 3 – Memorial e Plantas", ordem=3)
        db.add_all([f1_c3, f2_c3, f3_c3])
        db.commit()

        e3_c3 = [
            Etapa(fase_id=f1_c3.id, nome_tarefa="Implantação de rede de apoio", responsavel="Carlos Eduardo", progresso=1.0, data_inicio=hoje - timedelta(days=40), data_termino=hoje - timedelta(days=35), dias_previstos=5),
            Etapa(fase_id=f2_c3.id, nome_tarefa="Levantamento de limites confrontantes", responsavel="Humberto Silva", progresso=0.6, data_inicio=hoje - timedelta(days=35), data_termino=hoje - timedelta(days=10), dias_previstos=12, observacoes="Atraso devido à dificuldade de acesso à divisa sul."),
            Etapa(fase_id=f3_c3.id, nome_tarefa="Elaboração do memorial para cartório", responsavel="Nadia Souza", progresso=0.2, data_inicio=hoje - timedelta(days=10), data_termino=hoje - timedelta(days=6), dias_previstos=4, observacoes="Aguardando liberação dos dados pendentes de campo.")
        ]
        db.add_all(e3_c3)
        db.commit()

        # =====================================================================
        # CONTRATO 4: Meio Ambiente (No Prazo - Em Andamento)
        # =====================================================================
        print("Semeando Contrato 4: Licenciamento PCA/RCA...")
        c4 = Contrato(
            nome_projeto="Plano de Controle Ambiental (PCA) e Caracterização Florística",
            cliente="Votorantim Cimentos S.A.",
            empresa="Aldebaran Consultoria",
            direitos_minerarios="832.410/2023",
            area="Meio Ambiente",
            diretor_projeto="Robson Ribeiro",
            data_inicio=hoje - timedelta(days=15),
            data_entrega_final=hoje + timedelta(days=35),
            dias_campo_total=6,
            status="no_prazo",
            observacoes="Estudo ambiental para obtenção de Licença de Instalação (LI) de nova frente de lavra."
        )
        db.add(c4)
        db.commit()

        f1_c4 = Fase(contrato_id=c4.id, nome_fase="Fase 1 – Diagnóstico Ambiental", ordem=1)
        f2_c4 = Fase(contrato_id=c4.id, nome_fase="Fase 2 – Redação Técnica e Protocolo", ordem=2)
        db.add_all([f1_c4, f2_c4])
        db.commit()

        e4_c4 = [
            Etapa(fase_id=f1_c4.id, nome_tarefa="Inventário florestal e censo arbóreo", responsavel="Letícia Fontes", progresso=1.0, data_inicio=hoje - timedelta(days=15), data_termino=hoje - timedelta(days=8), dias_previstos=7),
            Etapa(fase_id=f1_c4.id, nome_tarefa="Levantamento de recursos hídricos e APPs", responsavel="Letícia Fontes", progresso=0.7, data_inicio=hoje - timedelta(days=8), data_termino=hoje + timedelta(days=10), dias_previstos=10),
            Etapa(fase_id=f2_c4.id, nome_tarefa="Elaboração dos programas ambientais do PCA", responsavel="Letícia Fontes", progresso=0.2, data_inicio=hoje + timedelta(days=10), data_termino=hoje + timedelta(days=35), dias_previstos=15)
        ]
        db.add_all(e4_c4)
        db.commit()

        # =====================================================================
        # CONTRATO 5: Geologia (Concluído)
        # =====================================================================
        print("Semeando Contrato 5: Laudo de Estabilidade...")
        c5 = Contrato(
            nome_projeto="Laudo de Estabilidade Geotécnica de Taludes e Encostas",
            cliente="Vale S.A.",
            empresa="Aldebaran Consultoria",
            direitos_minerarios="830.112/2020",
            area="Geologia",
            diretor_projeto="Robson Ribeiro",
            data_inicio=hoje - timedelta(days=60),
            data_entrega_final=hoje - timedelta(days=10),
            dias_campo_total=10,
            status="concluido",
            observacoes="Inspeção e análise cinemática de descontinuidades com entrega de parecer ART homologado."
        )
        db.add(c5)
        db.commit()

        f1_c5 = Fase(contrato_id=c5.id, nome_fase="Fase Única – Vistoria e Laudo", ordem=1)
        db.add(f1_c5)
        db.commit()

        e5_c5 = [
            Etapa(fase_id=f1_c5.id, nome_tarefa="Inspeção técnica de campo e drone", responsavel="Mariana Lopes", progresso=1.0, data_inicio=hoje - timedelta(days=60), data_termino=hoje - timedelta(days=45), dias_previstos=15),
            Etapa(fase_id=f1_c5.id, nome_tarefa="Cálculo do Fator de Segurança (FS)", responsavel="Mariana Lopes", progresso=1.0, data_inicio=hoje - timedelta(days=45), data_termino=hoje - timedelta(days=20), dias_previstos=15),
            Etapa(fase_id=f1_c5.id, nome_tarefa="Emissão do Relatório e entrega ao cliente", responsavel="Robson Ribeiro", progresso=1.0, data_inicio=hoje - timedelta(days=20), data_termino=hoje - timedelta(days=10), dias_previstos=10)
        ]
        db.add_all(e5_c5)
        db.commit()

        print("======================================================")
        print("Banco de dados semeado com 5 contratos realistas!")
        print(" - 2 Contratos No Prazo")
        print(" - 1 Contrato em Atenção (vence em breve)")
        print(" - 1 Contrato Atrasado")
        print(" - 1 Contrato Concluído")
        print("======================================================")

    except Exception as e:
        db.rollback()
        print(f"[ERRO NO SEED]: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
