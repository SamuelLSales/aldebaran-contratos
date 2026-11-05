// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Informe seu usuário e senha.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginUser(username.trim(), password);
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Usuário ou senha incorretos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4 font-sans selection:bg-primary selection:text-white">
      {/* Container Principal com Moldura Dupla (Layered Bezel) sobre fundo liso */}
      <div className="w-full max-w-[400px]">
        <div className="rounded-[20px] bg-slate-900/[0.03] p-1.5 ring-1 ring-slate-900/[0.07] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.10),0_4px_12px_-2px_rgba(15,23,42,0.04)]">
          
          {/* Card Interno Branco */}
          <div className="rounded-[14px] bg-white p-7 sm:p-8 ring-1 ring-slate-900/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            
            {/* Cabeçalho */}
            <div className="mb-7">
              <div className="mb-5">
                <span className="text-[15px] font-bold tracking-tight text-slate-900">
                  Project<span className="text-primary">Sight</span>
                </span>
              </div>

              <h1 className="text-[19px] font-semibold tracking-tight text-slate-900">
                Acesse sua conta
              </h1>
              <p className="text-[13px] text-slate-500 mt-1">
                Entre com suas credenciais para continuar no painel.
              </p>
            </div>

            {/* Erro */}
            {error && (
              <div
                role="alert"
                className="mb-5 px-3.5 py-2.5 rounded-lg bg-red-50/90 ring-1 ring-red-200 text-red-700 text-[13px] font-medium"
              >
                {error}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-[13px] font-medium text-slate-700 mb-1.5"
                >
                  Usuário
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 bg-white border border-slate-300/90 rounded-lg px-3.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-400/80 focus:border-primary focus:ring-[3px] focus:ring-primary/12 focus:outline-none transition-all"
                  placeholder="Digite seu usuário"
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-medium text-slate-700"
                  >
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 bg-white border border-slate-300/90 rounded-lg px-3.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-400/80 focus:border-primary focus:ring-[3px] focus:ring-primary/12 focus:outline-none transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #144E6A 0%, #0F3E54 100%)',
                    boxShadow:
                      'inset 0 1px 0 0 rgba(255, 255, 255, 0.18), 0 1px 2px 0 rgba(15, 23, 42, 0.2), 0 0 0 1px #0F3E54',
                  }}
                  className="w-full h-10 bg-primary hover:brightness-110 active:brightness-95 text-white font-medium text-[13.5px] px-4 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Entrando...' : 'Entrar no sistema'}
                </button>
              </div>
            </form>
          </div>

          {/* Rodapé Embutido na Moldura (Inset Bezel Footer) */}
          <div className="px-4 py-2.5 flex items-center justify-between text-[12px] text-slate-500">
            <span>Gestão de Contratos e Prazos</span>
            <Link
              to="/projectsight"
              className="font-medium text-slate-700 hover:text-primary transition-colors"
            >
              Sobre o sistema →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
