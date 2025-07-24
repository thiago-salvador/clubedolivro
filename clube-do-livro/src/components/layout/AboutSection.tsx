import React from 'react';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-column-left">
          <h2>O que é o Clube do Livro no Divã?</h2>
        </div>
        <div className="about-column-right">
          <p>
            Já pensou na possibilidade do livro te ler, ao invés de você ler o livro? Essa é a proposta do Clube do Livro no Divã. Mais do que um clube, somos uma comunidade onde a leitura e a interação com outras mulheres proporcionam um verdadeiro mergulho interno nas questões que você achava que apenas você sentia.
          </p>
          <p>
            Tudo isso sob a mediação de Manuela Xavier, que traz o olhar da psicanálise para interpretar não só os livros, mas também para estar atenta a como cada obra atravessa a vida prática de cada mulher participante.
          </p>
          <p>
            Além de ser um espaço de desenvolvimento do seu autoconhecimento, o Clube do Livro no Divã é um terreno fértil para conexões genuínas e conversas enriquecedoras entre mulheres comprometidas em se tornarem autoras e protagonistas de suas próprias vidas.
          </p>
          <p>
            Como comunidade, você também tem acesso a benefícios exclusivos, como descontos e condições especiais nas marcas parceiras apoiadoras do nosso clube.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;