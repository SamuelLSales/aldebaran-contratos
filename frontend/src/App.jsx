import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DetalheContrato from './pages/DetalheContrato';
import NovoContrato from './pages/NovoContrato';
import Responsaveis from './pages/Responsaveis';
import Contratos from './pages/Contratos';
import Login from './pages/Login';
import Landing from './pages/Landing';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-xs">Carregando ProjectSight...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Rota raiz: se autenticado mostra o MainLayout + Dashboard; se não autenticado, mostra a Landing do ProjectSight
function HomeOrLanding() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-xs">Carregando ProjectSight...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}

// Layout principal do sistema
function MainLayout({ children }) {
  return (
    <div className="flex bg-background min-h-screen text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/projectsight" element={<Landing />} />

            {/* Rota Inicial Inteligente (Landing para visitantes, Dashboard para usuários logados) */}
            <Route path="/" element={<HomeOrLanding />} />

            {/* Rotas Principais (Protegidas) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/contratos/:id" element={<DetalheContrato />} />
              <Route path="/contratos/novo" element={<NovoContrato />} />
              <Route path="/responsaveis" element={<Responsaveis />} />
              <Route path="/area/:area" element={<Contratos />} />
              <Route path="/contratos" element={<Contratos />} />
            </Route>

            {/* Redirecionamento padrão para rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
