# 🏛️ Design System — Aldebaran Contratos

Este documento estabelece o **Design System corporativo** do sistema de gestão de contratos e processos da **Aldebaran Consultoria** (Belo Horizonte - MG).

O objetivo é substituir o visual anterior (escuro, pesado e com aspecto genérico de protótipo de IA) por uma **interface corporativa de alto padrão, limpa, arejada e profissional**, inspirada nos melhores softwares corporativos de engenharia e gestão de projetos (Procore, Linear, Notion Enterprise, Monday).

---

## 1. Princípios de Design

1. **Clareza e Sóbriedade (Light & Airy)**: Fundo predominantemente branco e cinza suave neutro, reservando cores vivas apenas para indicadores de status, progresso e ações primárias.
2. **Identidade Corporativa de Engenharia**: Paleta baseada em Azul-Petróleo / Azul-Ardósia profundo (`#0F3E54` e `#0284C7`), transmitindo precisão técnica, confiança e solidez.
3. **Escaneabilidade e Densidade Correta**: Informações técnicas organizadas com hierarquia tipográfica precisa, tabelas elegantes e cards com elevação sutil.
4. **Sem Elementos Artificiais de IA**: Substituição de gradientes neon, bordas pretas duras (`rounded-none`) e alertas exagerados por componentes polidos com microtransições (`150ms ease-out`), cantos equilibrados (`rounded-lg`, `rounded-md`) e sombras suaves.

---

## 2. Paleta de Cores e Tokens CSS

As variáveis abaixo devem compor o arquivo `frontend/src/styles/variables.css` ou ser inseridas no `:root` do `index.css`:

```css
:root {
  /* =====================================================================
     1. CORES DA MARCA & PRIMÁRIAS (Engenharia & Consultoria)
     ===================================================================== */
  --brand-primary: #0F3E54;        /* Azul-Petróleo Corporativo (Identidade Aldebaran) */
  --brand-primary-hover: #0A2D3E;  /* Versão escurecida para hover */
  --brand-primary-light: #EBF3F7;  /* Fundo de destaque sutil */
  
  --brand-accent: #0284C7;         /* Azul Ação / Links / Foco (Sky 600) */
  --brand-accent-hover: #0369A1;   /* Hover da ação primária */
  --brand-accent-light: #E0F2FE;   /* Fundo de badges e chips informativos */

  /* =====================================================================
     2. ESCALA DE NEUTROS (Ambiente Claro, Limpo e Arejado)
     ===================================================================== */
  --bg-app: #F8FAFC;               /* Fundo principal da página (Slate 50) */
  --bg-surface: #FFFFFF;           /* Fundo de cards, tabelas e modais */
  --bg-subtle: #F1F5F9;            /* Fundo de cabeçalhos de tabela e inputs (Slate 100) */
  --bg-muted: #E2E8F0;             /* Fundo de divisórias e hover leve (Slate 200) */

  --border-subtle: #E2E8F0;        /* Bordas padrão de cartões e inputs (Slate 200) */
  --border-hover: #CBD5E1;         /* Bordas em hover (Slate 300) */
  --border-focus: #0284C7;         /* Borda de campos ativos */

  --text-primary: #0F172A;         /* Texto principal de alto contraste (Slate 900) */
  --text-secondary: #475569;       /* Texto secundário, descrições (Slate 600) */
  --text-muted: #94A3B8;           /* Placeholders, labels auxiliares (Slate 400) */
  --text-inverse: #FFFFFF;         /* Texto sobre fundos escuros */

  /* =====================================================================
     3. CORES SEMÂNTICAS & STATUS DE PRAZO
     ===================================================================== */
  /* No Prazo / Sucesso */
  --status-success-bg: #DCFCE7;    /* Fundo pastel (Emerald 100) */
  --status-success-text: #166534;  /* Texto escuro (Emerald 800) */
  --status-success-border: #86EFAC;/* Borda (Emerald 300) */
  --status-success-dot: #22C55E;   /* Indicador pontual (Emerald 500) */

  /* Atenção / Próximo do Vencimento (≤ 7 dias) */
  --status-warning-bg: #FEF3C7;    /* Fundo pastel (Amber 100) */
  --status-warning-text: #92400E;  /* Texto escuro (Amber 800) */
  --status-warning-border: #FCD34D;/* Borda (Amber 300) */
  --status-warning-dot: #F59E0B;   /* Indicador pontual (Amber 500) */

  /* Atrasado / Crítico */
  --status-danger-bg: #FEE2E2;     /* Fundo pastel (Rose 100) */
  --status-danger-text: #991B1B;   /* Texto escuro (Rose 800) */
  --status-danger-border: #FCA5A5; /* Borda (Rose 300) */
  --status-danger-dot: #EF4444;    /* Indicador pontual (Rose 500) */

  /* Concluído / Finalizado */
  --status-done-bg: #F1F5F9;       /* Fundo neutro (Slate 100) */
  --status-done-text: #334155;     /* Texto (Slate 700) */
  --status-done-border: #CBD5E1;   /* Borda (Slate 300) */
  --status-done-dot: #64748B;      /* Indicador (Slate 500) */

  /* Áreas de Negócio */
  --area-topografia-bg: #E0F2FE;   --area-topografia-text: #0369A1;
  --area-geologia-bg: #FEF9C3;     --area-geologia-text: #854D0E;
  --area-ambiental-bg: #ECFDF5;    --area-ambiental-text: #065F46;

  /* =====================================================================
     4. SOMBRAS & ELEVAÇÃO (Box-Shadow suave e moderno)
     ===================================================================== */
  --shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
  --shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
  --shadow-card-hover: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  --shadow-dropdown: 0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05);
  --shadow-modal: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06);

  /* =====================================================================
     5. BORDER RADIUS
     ===================================================================== */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-pill: 9999px;

  /* =====================================================================
     6. TRANSIÇÕES E EFEITOS
     ===================================================================== */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 3. Tipografia

- **Família Tipográfica Principal**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`.
  *(Excelente legibilidade para dados numéricos, datas e tabelas de engenharia)*.
- **Tipografia Numérica/Códigos**: `JetBrains Mono`, `ui-monospace`, `monospace` (para códigos de contratos, ART, coordenadas e datas).

| Elemento | Tamanho | Peso | Line Height | Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | 24px (1.5rem) | 700 (Bold) | 1.25 | Título da página principal |
| **H2 / Seção** | 18px (1.125rem) | 600 (Semibold) | 1.35 | Títulos de seções e modais |
| **H3 / Card** | 15px (0.9375rem) | 600 (Semibold) | 1.4 | Nome de contratos e tarefas |
| **Body (Normal)** | 14px (0.875rem) | 400 (Regular) | 1.5 | Texto corrido, células de tabela |
| **Body Medium** | 14px (0.875rem) | 500 (Medium) | 1.5 | Nomes de clientes e responsáveis |
| **Caption / Label** | 12px (0.75rem) | 500 / 600 | 1.4 | Rótulos de formulário, metadados |
| **Micro / Badge** | 11px (0.6875rem) | 600 (Semibold) | 1.3 | Badges, tags e contadores |

---

## 4. Grid, Layout e Espaçamento

- **Grid Base**: Sistema baseado em múltiplos de 4px (4px, 8px, 12px, 16px, 24px, 32px, 48px).
- **Largura Máxima do Conteúdo**: `1440px` (centralizado na tela grande, permitindo visão panorâmica sem esticar em demasia).
- **Estrutura de Layout**:
  - **Sidebar Fixa**: `240px` de largura (recolhível para `68px`).
  - **Topbar / Header**: `64px` de altura, fixa com `backdrop-filter: blur(8px)`.
  - **Main Area**: Fundo `--bg-app` com espaçamento padrão de `p-6` ou `p-8`.

---

## 5. Especificação dos Componentes

### 5.1. Sidebar (Menu Lateral)
- **Fundo**: Branco (`#FFFFFF`) com borda direita sutil (`1px solid var(--border-subtle)`).
- **Logo**: Logotipo institucional da Aldebaran posicionado no topo com padding confortável.
- **Itens de Navegação**:
  - Altura: `40px`, margem interna suave (`px-3 py-2`).
  - Raio de curvatura: `rounded-md` (6px).
  - Ícone de 18px (`Lucide React`) alinhado com o texto.
  - **Estado Normal**: Texto cinza-médio (`--text-secondary`), sem fundo.
  - **Hover**: Fundo cinza suave (`--bg-subtle`), texto `--text-primary`.
  - **Ativo**: Fundo azul suave (`--brand-primary-light`), texto `--brand-primary`, borda esquerda ou indicador com `--brand-primary` de 3px.
- **Rodapé do Menu**: Perfil do usuário com nome, cargo e botão de logout elegante.

### 5.2. Header / Topbar
- **Fundo**: Branco (`#FFFFFF`) com `box-shadow: var(--shadow-sm)` e borda inferior sutil.
- **Estrutura**:
  - Esquerda: Breadcrumb corporativo com hierarquia clara (ex: `Aldebaran > Contratos > CT-2024/012`).
  - Centro: Barra de busca rápida global de contratos e clientes (`Ctrl + K`).
  - Direita: Indicador de área selecionada, atalho para "+ Novo Contrato" e badge de status do sistema.

### 5.3. Cards de Contrato
- **Container**: Fundo branco, `border: 1px solid var(--border-subtle)`, `border-radius: 8px`, `box-shadow: var(--shadow-card)`.
- **Comportamento em Hover**: Elevação suave (`box-shadow: var(--shadow-card-hover)`), borda sutilmente realçada (`--border-hover`).
- **Hierarquia Interna**:
  1. Topo: Badge de Área (Topografia/Geologia) + Badge de Status (No Prazo / Atenção / Atrasado).
  2. Título: Nome do projeto em `font-semibold text-slate-900`.
  3. Subtítulo: Cliente em `text-slate-600`.
  4. Indicadores: Data de entrega com ícone de calendário + Dias restantes com cor contextual.
  5. Barra de progresso discreta (6px) com porcentagem alinhada à direita.

### 5.4. Tabelas Corporativas
- **Cabeçalho (`<thead>`)**: Fundo cinza claro (`--bg-subtle`), texto em caixa alta discreta (`text-xs font-semibold text-slate-500 tracking-wider`), borda inferior sólida.
- **Linhas (`<tbody> tr`)**:
  - Fundo branco com altura confortável (`py-3.5`).
  - Linhas com borda inferior sutil de 1px (`border-slate-100`).
  - Hover: Destaque suave em `bg-slate-50/80` com transição rápida de 150ms.
- **Células de Ações**: Botões de ação em formato de ícones discretos (Visualizar, Editar, Excluir) que só ganham destaque ao passar o mouse.

### 5.5. Botões
- **Primário (Ação Principal)**:
  - Fundo `--brand-primary` (#0F3E54), texto branco, `border-radius: 6px`.
  - Hover: `#0A2D3E` com elevação sutil.
  - Active: Leve redução de escala (`transform: scale(0.98)`).
- **Secundário (Outline)**:
  - Fundo transparente ou branco, borda `1px solid var(--border-subtle)`, texto `--text-secondary`.
  - Hover: Fundo `--bg-subtle`, borda `--border-hover`.
- **Destaque / Acento (Novo Contrato / Exportar)**:
  - Fundo `--brand-accent` (#0284C7), texto branco, ícone de `+`.
- **Destrutivo**:
  - Fundo branco ou pastel suave (`--status-danger-bg`), texto e borda vermelhos (`#DC2626`).
  - Hover: Fundo vermelho sólido com texto branco.

### 5.6. Badges de Status (Pill)
Pílulas compactas com cantos totalmente arredondados (`rounded-full`), padding `px-2.5 py-0.5`, texto em 11px font-semibold:
- **No Prazo**: Fundo `#DCFCE7`, texto `#166534`, dot verde `#22C55E`.
- **Atenção (≤ 7 dias)**: Fundo `#FEF3C7`, texto `#92400E`, dot âmbar `#F59E0B`.
- **Atrasado**: Fundo `#FEE2E2`, texto `#991B1B`, dot vermelho `#EF4444`.
- **Concluído**: Fundo `#F1F5F9`, texto `#475569`, dot azul/cinza `#64748B`.

### 5.7. Barra de Progresso
- Altura fina: `6px` ou `8px`, cantos arredondados (`rounded-full`).
- Fundo do trilho: `#E2E8F0` (Slate 200).
- Cor da barra:
  - 100%: Verde esmeralda (`#10B981`)
  - 50% - 99%: Azul corporativo (`#0284C7`)
  - < 50% em atraso: Âmbar/Vermelho contextual.

### 5.8. Alertas e Notificações (Sem Alerts Nativos)
- Proibição de `window.alert()` ou `window.confirm()`.
- Substituição por **Toasts corporativos** no canto superior direito e **Modais de Confirmação** com backdrop escurecido suave e foco automático no botão de cancelar.

---

## 6. Sugestão de Estrutura de Arquivos Frontend

Para eliminar arquivos monolíticos de mais de 1.000 linhas e organizar o projeto como um software profissional:

```text
frontend/src/
├── assets/                  # Logos e imagens da Aldebaran
├── components/              # Componentes visuais reutilizáveis
│   ├── common/              # Elementos atômicos
│   │   ├── Button.jsx       # Botão unificado (primary, secondary, danger)
│   │   ├── StatusBadge.jsx  # Pílula de status
│   │   ├── ProgressBar.jsx  # Barra de progresso com transição
│   │   ├── Modal.jsx        # Componente de modal com backdrop
│   │   └── ConfirmDialog.jsx# Substitui window.confirm
│   ├── layout/
│   │   ├── Sidebar.jsx      # Menu lateral corporativo
│   │   └── Header.jsx       # Topbar corporativa com breadcrumbs
│   └── contracts/           # Componentes específicos de contratos
│       ├── ContractCard.jsx # Card individual de contrato
│       ├── ContractTable.jsx# Tabela de contratos
│       ├── PhaseAccordion.jsx# Acordeão de fases e etapas
│       └── TaskRow.jsx      # Linha de tarefa com progresso inline
├── pages/
│   ├── Dashboard/           # Dashboard decomposto em abas menores
│   ├── Contratos/           # Listagem e filtros
│   ├── DetalheContrato/     # Página de detalhes com sub-componentes
│   └── NovoContrato/        # Formulário com passos ou seções
├── styles/
│   ├── variables.css        # Tokens de cores e espaçamentos
│   └── index.css            # Diretivas do Tailwind e estilos base
└── services/
    └── api.js               # Integração REST com FastAPI
```

---

## 7. Status e Próximos Passos
- [x] Elaboração das especificações e paleta corporativa.
- [ ] Revisão e validação com o gestor do projeto.
- [ ] Aplicação dos tokens no arquivo CSS e Tailwind Config.
- [ ] Refatoração das telas sem impacto nos dados do backend.
