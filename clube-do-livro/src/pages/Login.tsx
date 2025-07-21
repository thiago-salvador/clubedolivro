import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/aluna');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-elegant font-bold text-gray-900 mb-2">
            Bem-vinda de volta
          </h1>
          <p className="text-gray-600">Entre para acessar sua jornada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Link 
                to="/recuperar-senha" 
                className="text-sm text-terracota hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-terracota text-white py-3 rounded-lg font-semibold hover:bg-marrom-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Ainda não é aluna?{' '}
            <Link to="/registro" className="text-terracota hover:underline font-medium">
              Criar conta
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Voltar ao site
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-3">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> Use maria@exemplo.com / senha123
          </p>
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true);
              try {
                await login('maria@exemplo.com', 'senha123');
                navigate('/aluna');
              } catch (error) {
                setError('Erro ao fazer login automático');
              } finally {
                setIsLoading(false);
              }
            }}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            🚀 Pular Login (Desenvolvimento)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;