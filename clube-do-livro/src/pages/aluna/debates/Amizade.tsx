import React from 'react';
import { Post, PostCategory, UserRole } from '../../../types';
import CategoryTemplate from '../../../components/aluna/debates/CategoryTemplate';

const Amizade: React.FC = () => {
  
  // Dados convertidos para formato Post padrão
  const posts: Post[] = [
    {
      id: '1',
      author: { 
        id: '1', 
        name: 'Anônima', 
        email: 'anonima@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.REFLEXAO,
      weekNumber: 5,
      content: 'Depois de ler sobre a "amiga demais" no livro, percebi que minha amiga de infância sempre diminuía minhas conquistas. Foi doloroso, mas necessário me afastar. Alguém mais passou por isso? #toxicidade #limites',
      likes: 42,
      comments: [
        {
          id: '1-1',
          author: {
            id: '2',
            name: 'Marina L.',
            email: 'marina@email.com',
            role: UserRole.ALUNA,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Passei exatamente por isso! O livro me ajudou a entender que não era egoísmo me proteger. Força para você! 💜',
          createdAt: new Date('2024-03-20T14:30:00')
        },
        {
          id: '1-2',
          author: {
            id: '3',
            name: 'Manu Xavier (Facilitadora)',
            email: 'manu@email.com',
            role: UserRole.ADMIN,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Reconhecer padrões tóxicos em amizades antigas é um ato de coragem e amor próprio. Vocês estão no caminho certo ao priorizar seu bem-estar emocional.',
          createdAt: new Date('2024-03-20T15:00:00')
        }
      ],
      shares: 8,
      isPinned: false,
      createdAt: new Date('2024-03-20T10:00:00')
    },
    {
      id: '2',
      author: { 
        id: '4', 
        name: 'Claudia Santos', 
        email: 'claudia@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.CELEBRACAO,
      weekNumber: 4,
      content: 'Sempre me senti deslocada até encontrar um grupo de mulheres que também estão lendo o livro. Finalmente tenho amigas que me entendem e com quem posso ser vulnerável. Nunca é tarde para encontrar sua tribo! #tribo #conexão #vulnerabilidade',
      likes: 78,
      comments: [
        {
          id: '2-1',
          author: {
            id: '5',
            name: 'Renata M.',
            email: 'renata@email.com',
            role: UserRole.ALUNA,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Que lindo! Também encontrei minha tribo através do livro. É transformador ter amigas que vibram com nosso crescimento! 🌟',
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
        id: '6', 
        name: 'Beatriz Oliveira', 
        email: 'beatriz@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.DUVIDA,
      weekNumber: 3,
      content: 'Tenho uma amiga que sempre pede favores e eu sempre digo sim, mesmo quando não posso. Estou aprendendo sobre limites, mas tenho medo de perdê-la se começar a dizer não. Dicas? #limites #assertividade',
      likes: 34,
      comments: [
        {
          id: '3-1',
          author: {
            id: '7',
            name: 'Anônima',
            email: 'anonima2@email.com',
            role: UserRole.ALUNA,
            badges: [],
            joinedDate: new Date()
          },
          content: 'Uma amizade verdadeira sobrevive aos seus "nãos". Se ela se afastar por isso, talvez não fosse tão amiga assim. 💪',
          createdAt: new Date('2024-03-18T11:30:00')
        }
      ],
      shares: 6,
      isPinned: false,
      createdAt: new Date('2024-03-18T09:00:00')
    },
    {
      id: '4',
      author: { 
        id: '8', 
        name: 'Patricia Lima', 
        email: 'patricia@email.com', 
        role: UserRole.ALUNA,
        badges: [], 
        joinedDate: new Date() 
      },
      category: PostCategory.REFLEXAO,
      weekNumber: 2,
      content: 'Me mudei de cidade por causa do trabalho e sinto falta das minhas amigas. Como manter a conexão à distância? O capítulo sobre a mulher que corre com os lobos me fez valorizar ainda mais essas conexões. #distância #saudade',
      likes: 26,
      comments: [],
      shares: 4,
      isPinned: false,
      createdAt: new Date('2024-03-17T15:00:00')
    }
  ];

  const breadcrumbPath = [
    { label: 'Início', path: '/aluna' },
    { label: 'Debates', path: '/aluna/debates' },
    { label: 'Amizade' }
  ];

  return (
    <CategoryTemplate
      categoryName="Discussões sobre Amizade"
      categoryDescription="Compartilhe experiências sobre amizades femininas, conexões verdadeiras, desafios e aprendizados. Um espaço acolhedor onde toda história importa e toda experiência é valorizada."
      categoryIcon="👭"
      posts={posts}
      breadcrumbPath={breadcrumbPath}
      categoryType="amizade"
      currentWeek={5}
    />
  );
};

export default Amizade;