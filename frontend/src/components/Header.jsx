import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronDown, LogOut } from 'lucide-react';

const titulos = (path) => {
  if (path === '/') return ['Painel', 'Visão executiva'];
  if (path === '/area/topografia') return ['Contratos', 'Topografia'];
  if (path === '/area/geologia') return ['Contratos', 'Geologia'];
  if (path === '/area/meio-ambiente') return ['Contratos', 'Meio Ambiente'];
  if (path === '/responsaveis') return ['Gestão', 'Equipe técnica'];
  if (path === '/contratos/novo') return ['Contratos', 'Novo contrato'];
  if (path.startsWith('/contratos/')) return ['Contratos', 'Detalhes do contrato'];
  return ['Sistema', 'ProjectSight'];
};

const iniciais = (nome) => {
  if (!nome) return 'PS';
  const partes = nome.trim().split(/\s+/);
  return (partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : nome.slice(0, 2)).toUpperCase();
};

const Header = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  const [secao, titulo] = titulos(location.pathname);

  useEffect(() => setMenuAberto(false), [location.pathname]);

  useEffect(() => {
    if (!menuAberto) return undefined;
    const onClick = (e) => !menuRef.current?.contains(e.target) && setMenuAberto(false);
    const onKey = (e) => e.key === 'Escape' && setMenuAberto(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuAberto]);

  const nome = user?.nome || 'Administrador';
  const perfil = user?.role === 'admin' ? 'Administrador' : 'Visualizador';

  return (
    <header className="bg-card/95 backdrop-blur-xs border-b border-slate-200 h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      <nav aria-label="Localização" className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
          ProjectSight
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
        <span className="text-slate-500">{secao}</span>
        <ChevronRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
        <span className="font-medium text-slate-900" aria-current="page">
          {titulo}
        </span>
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuAberto}
          className="flex items-center gap-2.5 h-10 pl-1.5 pr-2.5 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <span className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#266DF0] border border-[#D4E2FF] flex items-center justify-center text-xs font-semibold">
            {iniciais(nome)}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-slate-900">{nome}</span>
            <span className="text-xs text-slate-500">{perfil}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
        </button>

        {menuAberto && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-56 bg-card border border-slate-200 rounded-lg shadow-dropdown py-1 animate-fade-in"
          >
            <div className="px-3 py-2.5 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900 truncate">{nome}</p>
              <p className="text-xs text-slate-500">{perfil}</p>
            </div>
            <Link
              to="/projectsight"
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-muted transition-colors"
            >
              Sobre o ProjectSight
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logoutUser}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Sair do sistema
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
