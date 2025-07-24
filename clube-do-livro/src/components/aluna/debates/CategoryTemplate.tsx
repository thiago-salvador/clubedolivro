import React, { useState } from 'react';
import { ChevronRightIcon, HomeIcon } from '../../Icons';
import { Post, PostCategory } from '../../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCategoryConfig } from '../../../utils/categories';
import NewPostModal from '../community/NewPostModal';

interface CategoryTemplateProps {
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  posts: Post[];
  onNewPost?: () => void;
  breadcrumbPath: { label: string; path?: string }[];
  categoryType?: 'trabalho' | 'relacionamento' | 'amizade' | 'indicacoes';
  currentWeek?: number;
}

type SortOption = 'recent' | 'popular' | 'noResponse';

const CategoryTemplate: React.FC<CategoryTemplateProps> = ({
  categoryName,
  categoryDescription,
  categoryIcon,
  posts,
  onNewPost,
  breadcrumbPath,
  categoryType,
  currentWeek = 5
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // Mapear categoryType para PostCategory
  const getPreselectedCategory = (): PostCategory | undefined => {
    switch (categoryType) {
      case 'trabalho':
        return PostCategory.REFLEXAO; // Categoria padrão para trabalho
      case 'relacionamento':
        return PostCategory.REFLEXAO; // Categoria padrão para relacionamento
      case 'amizade':
        return PostCategory.REFLEXAO; // Categoria padrão para amizade
      case 'indicacoes':
        return PostCategory.GERAL; // Categoria padrão para indicações
      default:
        return undefined;
    }
  };

  // Função para ordenar posts baseado no critério selecionado
  const getSortedPosts = () => {
    let sortedPosts = [...posts];
    
    switch (sortBy) {
      case 'recent':
        sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        sortedPosts.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
        break;
      case 'noResponse':
        sortedPosts = sortedPosts.filter(post => post.comments.length === 0);
        sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    return sortedPosts;
  };

  const sortedPosts = getSortedPosts();

  const handleNewPost = () => {
    if (onNewPost) {
      onNewPost(); // Chamar callback customizado se fornecido
    } else {
      setIsNewPostModalOpen(true); // Usar modal interno por padrão
    }
  };

  const handleSubmitPost = (newPost: { category: PostCategory; weekNumber: number; content: string; title?: string }) => {
    console.log('Nova postagem:', newPost);
    setIsNewPostModalOpen(false);
    // Em produção, adicionar à lista de posts
  };

  const preselectedCategory = getPreselectedCategory();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600">
        <HomeIcon className="mr-1" size={16} />
        {breadcrumbPath.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRightIcon className="mx-2" size={16} />}
            {item.path ? (
              <a href={item.path} className="hover:text-terracota transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-terracota to-marrom-escuro rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {categoryIcon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
            <p className="text-lg opacity-90">{categoryDescription}</p>
          </div>
        </div>
      </div>

      {/* Filters and New Post Button */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent text-sm"
            >
              <option value="recent">Mais Recente</option>
              <option value="popular">Mais Popular</option>
              <option value="noResponse">Sem Resposta</option>
            </select>
          </div>
          
          {(onNewPost || categoryType) && (
            <button
              onClick={handleNewPost}
              className="px-4 py-2 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Nova Postagem
            </button>
          )}
        </div>

        {/* Filter Results Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
          <span>
            {sortedPosts.length} {sortedPosts.length === 1 ? 'postagem encontrada' : 'postagens encontradas'}
            {sortBy === 'noResponse' && ' sem resposta'}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {sortBy === 'recent' && '🕒 Recentes'}
            {sortBy === 'popular' && '🔥 Populares'}
            {sortBy === 'noResponse' && '❓ Sem Resposta'}
          </span>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {sortBy === 'noResponse' ? 'Nenhuma postagem sem resposta' : 'Nenhuma postagem ainda'}
            </h3>
            <p className="text-gray-600 mb-4">
              {sortBy === 'noResponse' 
                ? 'Todas as postagens já foram respondidas pela comunidade!'
                : 'Seja a primeira a compartilhar algo nesta categoria.'
              }
            </p>
            {(onNewPost || categoryType) && (
              <button
                onClick={handleNewPost}
                className="px-6 py-3 bg-terracota text-white rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
              >
                Criar primeira postagem
              </button>
            )}
          </div>
        ) : (
          sortedPosts.map((post) => {
            const categoryConfig = getCategoryConfig(post.category);
            
            return (
              <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracota to-marrom-escuro flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{post.author.name}</span>
                      <span className="text-gray-500">•</span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${categoryConfig?.color}20`,
                          color: categoryConfig?.color 
                        }}
                      >
                        {categoryConfig?.icon} {categoryConfig?.label}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {format(post.createdAt, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">"{post.content}"</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                        <span>❤️</span>
                        <span>{post.likes} curtidas</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                        <span>💬</span>
                        <span>{post.comments.length} comentários</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-terracota transition-colors">
                        <span>🔄</span>
                        <span>{post.shares} compartilhamentos</span>
                      </button>
                      {post.comments.length === 0 && sortBy === 'recent' && (
                        <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          Aguardando resposta
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Nova Postagem - apenas se não há callback customizado */}
      {!onNewPost && (
        <NewPostModal
          isOpen={isNewPostModalOpen}
          onClose={() => setIsNewPostModalOpen(false)}
          onSubmit={handleSubmitPost}
          currentWeek={currentWeek}
          preselectedCategory={preselectedCategory}
          disableCategoryEdit={!!preselectedCategory}
        />
      )}
    </div>
  );
};

export default CategoryTemplate;