import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RecuperarSenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (error: any) {
      setError('Erro ao solicitar recuperação de senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-5xl">🔐</span>
          </div>
          <h1 className="text-3xl font-elegant font-bold text-gray-900 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-gray-600">
            Digite seu email e enviaremos instruções para redefinir sua senha
          </p>
        </div>

        {message ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium mb-1">✅ Solicitação enviada!</p>
              <p>{message}</p>
            </div>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-terracota hover:underline font-medium"
              >
                ← Voltar ao login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail cadastrado
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-terracota text-white py-3 rounded-lg font-semibold hover:bg-marrom-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar instruções'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Lembrou a senha?{' '}
                <Link to="/login" className="text-terracota hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Não tem conta?{' '}
                <Link to="/registro" className="text-terracota hover:underline font-medium">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            💡 Dica de segurança
          </h3>
          <p className="text-xs text-yellow-700">
            Por segurança, não informamos se o email existe em nossa base. 
            Se você tiver uma conta conosco, receberá um email com as instruções.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;