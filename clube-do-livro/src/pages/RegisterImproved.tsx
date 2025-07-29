import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, PhoneIcon, CreditCardIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { announceToScreenReader } from '../utils/accessibility-utils';

const RegisterImproved: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Progress steps
  const steps = [
    { 
      id: 'personal', 
      title: 'Dados Pessoais', 
      status: (step === 1 ? 'current' : step > 1 ? 'completed' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      id: 'security', 
      title: 'Segurança', 
      status: (step === 2 ? 'current' : step > 2 ? 'completed' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    },
    { 
      id: 'confirm', 
      title: 'Confirmação', 
      status: (step === 3 ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming'
    }
  ];

  // Validation functions
  const validateName = (value: string): boolean => {
    if (!value || value.length < 3) {
      setErrors(prev => ({ ...prev, name: 'Nome deve ter pelo menos 3 caracteres' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    setValidFields(prev => ({ ...prev, name: true }));
    return true;
  };

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
    setValidFields(prev => ({ ...prev, email: true }));
    return true;
  };

  const validateCPF = (value: string): boolean => {
    const cleanCPF = value.replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      setErrors(prev => ({ ...prev, cpf: 'CPF deve ter 11 dígitos' }));
      return false;
    }
    setErrors(prev => ({ ...prev, cpf: '' }));
    setValidFields(prev => ({ ...prev, cpf: true }));
    return true;
  };

  const validatePhone = (value: string): boolean => {
    const cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Telefone inválido' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: '' }));
    setValidFields(prev => ({ ...prev, phone: true }));
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value || value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Senha deve ter pelo menos 8 caracteres' }));
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      setErrors(prev => ({ ...prev, password: 'Senha deve conter letras maiúsculas, minúsculas e números' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    setValidFields(prev => ({ ...prev, password: true }));
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem' }));
      return false;
    }
    setErrors(prev => ({ ...prev, confirmPassword: '' }));
    setValidFields(prev => ({ ...prev, confirmPassword: true }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apply masks
    if (name === 'cpf') {
      const maskedValue = value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
      setFormData(prev => ({ ...prev, cpf: maskedValue }));
    } else if (name === 'phone') {
      const maskedValue = value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
      setFormData(prev => ({ ...prev, phone: maskedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const canProceedToNextStep = (): boolean => {
    if (step === 1) {
      return validateName(formData.name) && 
             validateEmail(formData.email) && 
             validateCPF(formData.cpf) && 
             validatePhone(formData.phone);
    }
    if (step === 2) {
      return validatePassword(formData.password) && 
             validateConfirmPassword(formData.confirmPassword);
    }
    return true;
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setStep(prev => prev + 1);
      announceToScreenReader(`Avançando para ${steps[step].title}`);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
    announceToScreenReader(`Voltando para ${steps[step - 2].title}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canProceedToNextStep()) {
      announceToScreenReader('Por favor, corrija os erros antes de continuar.', 'assertive');
      return;
    }
    
    setIsLoading(true);
    announceToScreenReader('Criando sua conta...');
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        phone: formData.phone
      });
      announceToScreenReader('Conta criada com sucesso! Redirecionando...');
      navigate('/aluna');
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
      setErrors({ form: errorMessage });
      announceToScreenReader(errorMessage, 'assertive');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    announceToScreenReader(`Página de registro carregada. ${steps[step - 1].title}`);
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Back link */}
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
              Junte-se ao Clube
            </h1>
            <p className="text-gray-600">Comece sua jornada de transformação</p>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator 
            steps={steps} 
            size="md" 
            className="mb-8"
          />

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

            {/* Step 1: Personal Data */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <FormField
                  label="Nome completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => validateName(formData.name)}
                  error={errors.name}
                  success={validFields.name}
                  required
                  disabled={isLoading}
                  placeholder="Maria Silva"
                  autoComplete="name"
                  icon={<UserIcon size={20} />}
                />

                <FormField
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateEmail(formData.email)}
                  error={errors.email}
                  success={validFields.email}
                  required
                  disabled={isLoading}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  icon={<MailIcon size={20} />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    onBlur={() => validateCPF(formData.cpf)}
                    error={errors.cpf}
                    success={validFields.cpf}
                    required
                    disabled={isLoading}
                    placeholder="000.000.000-00"
                    icon={<CreditCardIcon size={20} />}
                  />

                  <FormField
                    label="WhatsApp"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => validatePhone(formData.phone)}
                    error={errors.phone}
                    success={validFields.phone}
                    required
                    disabled={isLoading}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                    icon={<PhoneIcon size={20} />}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <FormField
                  label="Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => validatePassword(formData.password)}
                  error={errors.password}
                  success={validFields.password}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  helpText="Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números"
                  autoComplete="new-password"
                  icon={<LockIcon size={20} />}
                />

                <FormField
                  label="Confirmar senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => validateConfirmPassword(formData.confirmPassword)}
                  error={errors.confirmPassword}
                  success={validFields.confirmPassword}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  icon={<LockIcon size={20} />}
                />
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Confirme seus dados:</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Nome:</dt>
                      <dd className="font-medium">{formData.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">E-mail:</dt>
                      <dd className="font-medium">{formData.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">CPF:</dt>
                      <dd className="font-medium">{formData.cpf}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">WhatsApp:</dt>
                      <dd className="font-medium">{formData.phone}</dd>
                    </div>
                  </dl>
                </div>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-terracota border-gray-300 rounded focus:ring-2 focus:ring-terracota"
                    aria-label="Aceitar termos e condições"
                  />
                  <span className="text-sm text-gray-600">
                    Li e aceito os{' '}
                    <a href="/termos" className="text-terracota hover:underline">termos de uso</a> e a{' '}
                    <a href="/privacidade" className="text-terracota hover:underline">política de privacidade</a>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handlePreviousStep}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth={step === 1}
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Criar conta
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-terracota hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 rounded"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterImproved;