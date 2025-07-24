import React from 'react';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-column-left">
          <h2>O que é o Clube do livro?</h2>
        </div>
        <div className="about-column-right">
          <p>
            Best-seller na Amazon em 'Estudos sobre a Mulher', Mulheres que Correm com os Lobos é mais que uma leitura, é um portal. Ele conecta você à sua força instintiva, criatividade e potência, ajudando a transformar dores em sabedoria e a criar estratégias para viver com mais prazer, verdade e consciência.
          </p>
          <p>
            Se a escrita de Clarissa Pinkola Estés já é transformadora, imagine atravessar essa jornada com a condução terapêutica de Manu Xavier, psicanalista que já guiou mais de 10 mil mulheres nessa leitura. Agora, essa experiência profunda está de volta: interativa, terapêutica e guiada.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;