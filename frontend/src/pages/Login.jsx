// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Shield, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginUser(username.trim(), password);
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aldebaran-dark0 flex items-center justify-center p-4 selection:bg-amber-500/20 selection:text-amber-500">
      <div className="w-full max-w-[420px] bg-[#111317] border border-aldebaran-border p-8 md:p-10 relative overflow-hidden">
        {/* Glow decorativo no fundo */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* LOGO E TÍTULO */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-none mb-3 text-amber-500">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">
            Aldebaran
          </h1>
          <span className="text-[10px] font-bold tracking-[0.25em] text-amber-500 uppercase block mt-1">
            Contratos & Prazos
          </span>
          <p className="text-theme-weak text-xs mt-3">
            Faça login para gerenciar os projetos e prazos
          </p>
        </div>

        {/* FEEDBACK DE ERRO */}
        {error && (
          <div className="mb-6 p-4 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-weak mb-2">
              Usuário
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-theme-weak">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#16191f] border border-aldebaran-border rounded-none py-3 pl-10 pr-4 text-sm text-white placeholder-theme-weak focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="admin"
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-theme-weak mb-2">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-theme-weak">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#16191f] border border-aldebaran-border rounded-none py-3 pl-10 pr-10 text-sm text-white placeholder-theme-weak focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-weak hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-aldebaran-dark0 font-bold text-sm tracking-wider uppercase py-3.5 px-4 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? 'Autenticando...' : 'Acessar Painel'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
