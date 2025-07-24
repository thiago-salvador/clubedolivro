// Middleware de validação de requisições
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  body?: ValidationRule[];
  params?: ValidationRule[];
  query?: ValidationRule[];
}

export const validateRequest = async (req: any): Promise<void> => {
  // Por enquanto, validação básica
  // Em produção, usaríamos uma biblioteca como Joi ou Yup
  
  if (req.body) {
    // Validar campos obrigatórios básicos
    const method = req.method;
    
    if (method === 'POST' || method === 'PUT') {
      // Verificar se tem body
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Corpo da requisição vazio');
      }
    }
  }
  
  // Validações específicas por rota podem ser adicionadas aqui
  const path = req.path;
  
  // Exemplo: validar criação de usuário
  if (path?.includes('/students') && req.method === 'POST') {
    validateStudentCreation(req.body);
  }
  
  // Exemplo: validar criação de curso
  if (path?.includes('/courses') && req.method === 'POST') {
    validateCourseCreation(req.body);
  }
};

// Validações específicas
function validateStudentCreation(body: any) {
  if (!body.name || body.name.trim().length < 3) {
    throw new Error('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!body.email || !isValidEmail(body.email)) {
    throw new Error('Email inválido');
  }
  
  if (body.phoneNumber && !isValidPhone(body.phoneNumber)) {
    throw new Error('Telefone inválido');
  }
}

function validateCourseCreation(body: any) {
  if (!body.name || body.name.trim().length < 3) {
    throw new Error('Nome do curso deve ter pelo menos 3 caracteres');
  }
  
  if (!body.description || body.description.trim().length < 10) {
    throw new Error('Descrição deve ter pelo menos 10 caracteres');
  }
  
  if (body.price && body.price < 0) {
    throw new Error('Preço não pode ser negativo');
  }
}

// Funções auxiliares de validação
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  // Verifica se tem 10 ou 11 dígitos
  return cleaned.length === 10 || cleaned.length === 11;
}

// Criar validador customizado
export function createValidator(schema: ValidationSchema) {
  return async (req: any): Promise<void> => {
    // Validar body
    if (schema.body && req.body) {
      validateFields(req.body, schema.body, 'body');
    }
    
    // Validar params
    if (schema.params && req.params) {
      validateFields(req.params, schema.params, 'params');
    }
    
    // Validar query
    if (schema.query && req.query) {
      validateFields(req.query, schema.query, 'query');
    }
  };
}

function validateFields(data: any, rules: ValidationRule[], location: string) {
  for (const rule of rules) {
    const value = data[rule.field];
    
    // Verificar obrigatório
    if (rule.required && (value === undefined || value === null || value === '')) {
      throw new Error(`Campo ${rule.field} é obrigatório em ${location}`);
    }
    
    // Se não for obrigatório e não tiver valor, pular outras validações
    if (!rule.required && (value === undefined || value === null)) {
      continue;
    }
    
    // Verificar tipo
    if (rule.type && typeof value !== rule.type) {
      throw new Error(`Campo ${rule.field} deve ser do tipo ${rule.type}`);
    }
    
    // Validações específicas por tipo
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        throw new Error(`Campo ${rule.field} deve ter pelo menos ${rule.minLength} caracteres`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        throw new Error(`Campo ${rule.field} deve ter no máximo ${rule.maxLength} caracteres`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        throw new Error(`Campo ${rule.field} tem formato inválido`);
      }
    }
    
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        throw new Error(`Campo ${rule.field} deve ser maior ou igual a ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        throw new Error(`Campo ${rule.field} deve ser menor ou igual a ${rule.max}`);
      }
    }
    
    // Validação customizada
    if (rule.custom) {
      const result = rule.custom(value);
      if (typeof result === 'string') {
        throw new Error(result);
      } else if (!result) {
        throw new Error(`Campo ${rule.field} é inválido`);
      }
    }
  }
}