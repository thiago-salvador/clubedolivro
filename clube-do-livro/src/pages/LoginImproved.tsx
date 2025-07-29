import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MailIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import { announceToScreenReader } from '../utils/accessibility-utils';

const LoginImproved: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email validation
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setErrors(prev => ({ ...prev, email: 'E-mail é obrigatório' }));
      return false;
    }
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  // Password validation
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, password: 'Senha é obrigatória' }));
      return false;
    }
    if (value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Senha deve ter pelo menos 6 caracteres' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      announceToScreenReader('Formulário contém erros. Por favor, verifique os campos.', 'assertive');
      return;
    }
    
    setIsLoading(true);
    announceToScreenReader('Processando login...');
    
    try {
      await login(email, password);
      announceToScreenReader('Login realizado com sucesso!');
      navigate('/aluna');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
      setErrors({ form: errorMessage });
      announceToScreenReader(errorMessage, 'assertive');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    announceToScreenReader('Página de login carregada. Preencha seu e-mail e senha para continuar.');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to home link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeftIcon size={20} />
          <span>Voltar ao site</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-elegant font-bold text-gray-900 mb-2">
              Bem-vinda de volta
            </h1>
            <p className="text-gray-600">Entre para acessar sua jornada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errors.form && (
              <div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="assertive"
              >
                {errors.form}
              </div>
            )}

            <FormField
              label="E-mail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="seu@email.com"
              autoComplete="email"
              icon={<MailIcon size={20} />}
            />

            <FormField
              label="Senha"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
              error={errors.password}
              required
              disabled={isLoading}
              placeholder="••••••••"
              autoComplete="current-password"
              icon={<LockIcon size={20} />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-terracota border-gray-300 rounded focus:ring-2 focus:ring-terracota"
                  aria-label="Lembrar de mim"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
              </label>
              
              <Link 
                to="/recuperar-senha" 
                className="text-sm text-terracota hover:underline focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 rounded"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ainda não é aluna?{' '}
              <Link 
                to="/registro" 
                className="text-terracota hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 rounded"
              >
                Criar conta
              </Link>
            </p>
          </div>

          {/* Development quick login */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-3">
              <p className="text-xs text-gray-600 text-center">
                <strong>Demo:</strong> Use maria@exemplo.com / senha123
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                fullWidth
                onClick={async () => {
                  setEmail('maria@exemplo.com');
                  setPassword('senha123');
                  setIsLoading(true);
                  try {
                    await login('maria@exemplo.com', 'senha123');
                    navigate('/aluna');
                  } catch (error) {
                    setErrors({ form: 'Erro ao fazer login automático' });
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                🚀 Pular Login (Desenvolvimento)
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-white/60 mt-6">
          Ao fazer login, você concorda com nossos{' '}
          <a href="/termos" className="underline hover:text-white">termos de uso</a> e{' '}
          <a href="/privacidade" className="underline hover:text-white">política de privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginImproved;