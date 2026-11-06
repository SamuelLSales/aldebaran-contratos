// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INPUT =
  'w-full h-11 bg-[#0B0C0E] border border-[#2B2E35] rounded-full px-5 text-[14px] text-[#F2F3F5] placeholder:text-[#6B6F78] hover:border-[#3A3E47] focus:border-[#5B93FF] focus:ring-[3px] focus:ring-[#266DF0]/20 focus:outline-none transition-all';

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
    <div className="auth-dark relative min-h-screen bg-[#0B0C0E] text-[#F2F3F5] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#266DF0] selection:text-white overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(38,109,240,0.14),transparent_60%)]"
      />

      <div className="relative w-full max-w-[420px]">
        {/* Marca */}
        <div className="text-center mb-8">
          <Link to="/projectsight" className="font-display text-3xl font-bold uppercase tracking-[0.08em] text-white">
            Project<span className="text-[#5B93FF]">Sight</span>
          </Link>
          <p className="mt-2 font-display text-[11px] uppercase tracking-[0.28em] text-[#8A8F98]">
            Contratos &amp; prazos
          </p>
        </div>

        <div className="rounded-3xl border border-[#1E2025] bg-[#101114] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
          <h1 className="font-display text-xl font-semibold text-white">Acesse sua conta</h1>
          <p className="text-[13px] text-[#9A9EA6] mt-1">
            Entre com suas credenciais para continuar no painel.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 px-4 py-2.5 rounded-2xl bg-[#F87171]/10 border border-[#F87171]/30 text-[#FCA5A5] text-[13px] font-medium"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="login-username" className="block text-[12px] font-medium uppercase tracking-[0.14em] text-[#9A9EA6] mb-2">
                Usuário
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={INPUT}
                placeholder="Digite seu usuário"
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-[12px] font-medium uppercase tracking-[0.14em] text-[#9A9EA6]">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[12px] font-medium text-[#9A9EA6] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT}
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
                className="font-display w-full h-11 bg-[#266DF0] hover:bg-[#1D5AD1] active:scale-[0.99] text-white font-semibold text-[12px] uppercase tracking-[0.2em] px-4 rounded-full transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Entrando...' : 'Entrar no sistema'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-between px-2 text-[12px] text-[#8A8F98]">
          <span>Gestão de Contratos e Prazos</span>
          <Link to="/projectsight" className="font-medium text-[#C9CCD2] hover:text-[#5B93FF] transition-colors">
            Sobre o sistema →
          </Link>
        </div>
      </div>
    </div>
  );
}
