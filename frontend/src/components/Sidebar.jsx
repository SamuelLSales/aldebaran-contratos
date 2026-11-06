import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  Compass,
  TreePine,
} from 'lucide-react';

const STORAGE_KEY = 'projectsight_sidebar_expanded';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/area/topografia', label: 'Topografia', icon: Compass },
  { to: '/area/geologia', label: 'Geologia', icon: Layers },
  { to: '/area/meio-ambiente', label: 'Meio Ambiente', icon: TreePine },
  { to: '/responsaveis', label: 'Equipe Técnica', icon: Users },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(() => localStorage.getItem(STORAGE_KEY) !== 'false');

  const toggle = () => {
    setIsExpanded((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  return (
    <aside
      className={`bg-card border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200 z-30 ${
        isExpanded ? 'w-60' : 'w-[68px]'
      }`}
    >
      {/* MARCA (Tipográfica pura, sem logo e sem ícone) */}
      <div
        className={`h-16 border-b border-slate-200 flex items-center shrink-0 ${
          isExpanded ? 'px-5' : 'justify-center'
        }`}
      >
        {isExpanded ? (
          <Link to="/" className="flex flex-col min-w-0 focus-visible:outline-none">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              Project<span className="text-accent">Sight</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wide">
              Contratos e prazos
            </span>
          </Link>
        ) : (
          <Link
            to="/"
            className="text-sm font-bold tracking-tight text-slate-900 focus-visible:outline-none"
            title="ProjectSight"
          >
            P<span className="text-accent">S</span>
          </Link>
        )}
      </div>

      {/* AÇÃO PRINCIPAL */}
      <div className={`pt-4 ${isExpanded ? 'px-3' : 'px-3.5'}`}>
        <Link
          to="/contratos/novo"
          title={!isExpanded ? 'Novo contrato' : undefined}
          aria-label="Novo contrato"
          className="flex items-center justify-center gap-2 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-xs hover:bg-primary-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          {isExpanded && <span>Novo contrato</span>}
        </Link>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden" aria-label="Navegação principal">
        {isExpanded && (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Gestão</p>
        )}

        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={!isExpanded ? label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 h-10 rounded-md text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                isExpanded ? 'px-3' : 'justify-center'
              } ${
                isActive
                  ? 'bg-[#F4F5F6] text-[#1C1D1F] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r before:bg-[#266DF0]'
                  : 'text-slate-600 font-medium hover:bg-muted hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
            {isExpanded ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* RECOLHER */}
      <div className="p-3 border-t border-slate-200">
        <button
          type="button"
          onClick={toggle}
          aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          title={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          className="w-full h-9 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-muted rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {isExpanded ? (
            <>
              <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
              <span>Recolher</span>
            </>
          ) : (
            <ChevronsRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
