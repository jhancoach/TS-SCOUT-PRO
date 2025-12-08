import React, { useState } from 'react';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2211') {
      onLoginSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800 mb-4 text-yellow-500">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">Acesso Restrito</h2>
          <p className="text-zinc-500 text-sm mt-2">Área administrativa da Comissão Técnica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase font-bold text-zinc-500 mb-2">Senha de Acesso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 focus:outline-none transition-colors font-rajdhani text-lg tracking-widest text-center"
              placeholder="••••"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-xs font-bold uppercase animate-pulse">
                <AlertCircle size={12} />
                <span>Senha Incorreta</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded uppercase tracking-wider transition-colors font-rajdhani text-lg"
          >
            Acessar Painel
          </button>
        </form>

        <button
          onClick={onCancel}
          className="mt-6 w-full text-center text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} /> Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};