import React from 'react';

// Import logos
import bocaRosaLogo from '../../assets/logos/logo_preto.webp';
import auraLogo from '../../assets/logos/324747_bfef99dc1f90417fb2e31783b7a5e40e~mv2.avif';
import lelaBrandaoLogo from '../../assets/logos/logo_lela-brandao-co_LKFuh3.png';
import mishaLogo from '../../assets/logos/logo-misha.svg';
import downloadLogo from '../../assets/logos/download.png';

const PartnersSection: React.FC = () => {
  const partners = [
    { id: 1, name: 'Boca Rosa', logo: bocaRosaLogo },
    { id: 2, name: 'Aura Beauty', logo: auraLogo },
    { id: 3, name: 'Lela Brandão', logo: lelaBrandaoLogo },
    { id: 4, name: 'Misha', logo: mishaLogo },
    { id: 5, name: 'Partner 5', logo: downloadLogo }
  ];

  return (
    <section className="relative w-full py-16 lg:py-24 px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-elegant font-light text-gray-900 text-center mb-12 leading-tight">
          MARCAS PARCEIRAS QUE APOIAM O CLUBE
        </h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {partners.map((partner) => (
            <div 
              key={partner.id}
              className="flex items-center justify-center p-6 lg:p-8"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-h-16 lg:max-h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;