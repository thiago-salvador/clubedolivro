import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracota border-t-transparent"></div>
        </div>
        <p className="text-gray-600 font-medium">Carregando...</p>
      </div>
    </div>
  );
};

export default PageLoader;