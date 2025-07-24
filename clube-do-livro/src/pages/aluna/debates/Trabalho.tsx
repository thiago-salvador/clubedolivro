import React from 'react';
import { Post, PostCategory, UserRole } from '../../../types';
import CategoryTemplate from '../../../components/aluna/debates/CategoryTemplate';

const Trabalho: React.FC = () => {

  // Dados mockados convertidos para o formato Post padrão
  const posts: Post[] = [
    {
      id: '1',
      author: { 
        id: '1', 
        name: 'Fernanda Lima', 
        email: 'fernanda@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.DUVIDA,
      weekNumber: 5,
      content: 'Depois de 15 anos na mesma empresa, sinto que perdi minha essência. O livro tem me ajudado a reconectar com meus verdadeiros talentos. Alguém mais está repensando sua carreira depois de ler sobre os arquétipos? #carreira #mudança #propósito #arquétipos',
      likes: 34,
      comments: [
        {
          id: '1-1',
          author: {
            id: '2',
            name: 'Patricia Souza',
            email: 'patricia@email.com',
            role: UserRole.ALUNA,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Estou exatamente na mesma situação! Descobri que meu arquétipo principal é a Criadora e agora entendo porque me sinto tão sufocada em um trabalho puramente administrativo.',
          createdAt: new Date('2024-03-20T14:30:00')
        }
      ],
      shares: 8,
      isPinned: false,
      createdAt: new Date('2024-03-20T10:00:00')
    },
    {
      id: '2',
      author: { 
        id: '2', 
        name: 'Carolina Mendes', 
        email: 'carolina@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.REFLEXAO,
      weekNumber: 4,
      content: 'Como liderar sendo autêntica em um ambiente corporativo dominado por homens? Sinto que preciso ser "dura" para ser respeitada, mas isso vai contra minha natureza. O capítulo sobre a Mulher Selvagem me fez questionar tudo.',
      likes: 45,
      comments: [
        {
          id: '2-1',
          author: {
            id: '3',
            name: 'Beatriz Oliveira',
            email: 'beatriz@email.com',
            role: UserRole.ALUNA,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Eu aprendi que ser forte não significa ser dura. Lidero com empatia e intuição, e isso tem sido meu diferencial.',
          createdAt: new Date('2024-03-19T16:30:00')
        }
      ],
      shares: 12,
      isPinned: false,
      createdAt: new Date('2024-03-19T14:00:00')
    },
    {
      id: '3',
      author: { 
        id: '3', 
        name: 'Juliana Ramos', 
        email: 'juliana@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.CELEBRACAO,
      weekNumber: 3,
      content: 'Larguei um cargo de diretoria para abrir meu próprio negócio focado em bem-estar feminino. Foi assustador, mas o livro me deu coragem para seguir minha intuição. Alguém mais deu esse salto?',
      likes: 67,
      comments: [],
      shares: 15,
      isPinned: false,
      createdAt: new Date('2024-03-18T11:00:00')
    }
  ];

  const breadcrumbPath = [
    { label: 'Início', path: '/aluna' },
    { label: 'Debates', path: '/aluna/debates' },
    { label: 'Trabalho' }
  ];

  return (
    <CategoryTemplate
      categoryName="Discussões sobre Trabalho"
      categoryDescription="Compartilhe sua jornada profissional! Um espaço para discutir carreira, propósito, liderança feminina e os desafios de ser mulher no mercado de trabalho."
      categoryIcon="💼"
      posts={posts}
      breadcrumbPath={breadcrumbPath}
      categoryType="trabalho"
      currentWeek={5}
    />
  );
};

export default Trabalho;