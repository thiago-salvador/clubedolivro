import { PostCategory, CategoryConfig } from '../types';

export const categoryConfigs: CategoryConfig[] = [
  {
    id: PostCategory.REFLEXAO,
    label: 'Reflexão',
    icon: '📝',
    color: '#8B5CF6',
    description: 'Pensamentos e sentimentos sobre a leitura'
  },
  {
    id: PostCategory.DUVIDA,
    label: 'Dúvida',
    icon: '❓',
    color: '#EF4444',
    description: 'Perguntas sobre o conteúdo ou exercícios'
  },
  {
    id: PostCategory.INSIGHT,
    label: 'Insight',
    icon: '💡',
    color: '#F59E0B',
    description: 'Descobertas e conexões pessoais'
  },
  {
    id: PostCategory.EXERCICIO,
    label: 'Exercício',
    icon: '✍️',
    color: '#10B981',
    description: 'Compartilhamento de respostas aos exercícios'
  },
  {
    id: PostCategory.DESAFIO,
    label: 'Desafio',
    icon: '🎯',
    color: '#3B82F6',
    description: 'Posts sobre desafios propostos'
  },
  {
    id: PostCategory.GERAL,
    label: 'Geral',
    icon: '💬',
    color: '#6B7280',
    description: 'Outros assuntos relacionados ao clube'
  },
  {
    id: PostCategory.CITACAO,
    label: 'Citação',
    icon: '📚',
    color: '#EC4899',
    description: 'Trechos favoritos do livro'
  },
  {
    id: PostCategory.CELEBRACAO,
    label: 'Celebração',
    icon: '🎉',
    color: '#14B8A6',
    description: 'Conquistas e marcos pessoais'
  }
];

export const getCategoryConfig = (category: PostCategory): CategoryConfig | undefined => {
  return categoryConfigs.find(config => config.id === category);
};