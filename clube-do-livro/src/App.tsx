import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Landing Page Components
import Hero from './components/layout/Hero';
import AboutSection from './components/layout/AboutSection';
import BenefitsSection from './components/layout/BenefitsSection';
import CommunitySection from './components/layout/CommunitySection';
import AboutManuSection from './components/layout/AboutManuSection';
import TestimonialsSection from './components/layout/TestimonialsSection';
import EnrollSection from './components/layout/EnrollSection';
import ManuPresentationSection from './components/layout/ManuPresentationSection';
import BenefitsAndPartners from './components/layout/BenefitsAndPartners';
import FAQSection from './components/layout/FAQSection';

// Aluna Area Components
import AlunaLayout from './components/aluna/layout/AlunaLayout';
import Dashboard from './pages/aluna/Dashboard';
import Community from './pages/aluna/Community';
import Login from './pages/Login';
import Register from './pages/Register';
import RecuperarSenha from './pages/RecuperarSenha';
import ChapterOverview from './pages/aluna/aulas/ChapterOverview';
import ContentPage from './pages/aluna/aulas/ContentPage';
import ExerciciosPage from './pages/aluna/aulas/ExerciciosPage';
import EncontrosPage from './pages/aluna/aulas/EncontrosPage';
import Indicacoes from './pages/aluna/debates/Indicacoes';
import Relacionamento from './pages/aluna/debates/Relacionamento';
import Trabalho from './pages/aluna/debates/Trabalho';
import Amizade from './pages/aluna/debates/Amizade';
import AvisosImportantes from './pages/aluna/AvisosImportantes';
import LinksUteis from './pages/aluna/LinksUteis';
import Configuracoes from './pages/aluna/Configuracoes';
import Shop from './pages/aluna/Shop';

// Checkout Components
import Checkout from './pages/Checkout';
import CheckoutConfirmation from './pages/CheckoutConfirmation';

// Landing Page Component
const LandingPage = () => (
  <>
    <Hero />
    <AboutSection />
    <BenefitsSection />
    <CommunitySection />
    <AboutManuSection />
    <EnrollSection />
    <TestimonialsSection />
    <BenefitsAndPartners />
    <ManuPresentationSection />
    <FAQSection />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/confirmacao" element={<CheckoutConfirmation />} />
          
          {/* Aluna Area */}
          <Route path="/aluna" element={
            <ProtectedRoute>
              <AlunaLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="comunidade" element={<Community />} />
            {/* Aulas Routes */}
            <Route path="aulas/capitulo/:chapterId" element={<ChapterOverview />} />
            <Route path="aulas/capitulo/:chapterId/video" element={<ContentPage />} />
            <Route path="aulas/capitulo/:chapterId/musica" element={<ContentPage />} />
            <Route path="aulas/capitulo/:chapterId/exercicio" element={<ExerciciosPage />} />
            <Route path="aulas/capitulo/:chapterId/encontros" element={<EncontrosPage />} />
            {/* Debates Routes */}
            <Route path="debates/indicacoes" element={<Indicacoes />} />
            <Route path="debates/relacionamento" element={<Relacionamento />} />
            <Route path="debates/trabalho" element={<Trabalho />} />
            <Route path="debates/amizade" element={<Amizade />} />
            {/* Administrative Routes */}
            <Route path="avisos" element={<AvisosImportantes />} />
            <Route path="links" element={<LinksUteis />} />
            <Route path="shop" element={<Shop />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            {/* Adicionar outras rotas aqui */}
          </Route>
          
          {/* Redirect /alunas to /aluna */}
          <Route path="/alunas" element={<Navigate to="/aluna" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
