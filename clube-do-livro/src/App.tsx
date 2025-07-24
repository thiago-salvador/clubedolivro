import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import PageLoader from './components/ui/PageLoader';

// Landing Page Components (keep these eager loaded for SEO)
import Navigation from './components/layout/Navigation';
import Hero from './components/layout/Hero';
import AboutSection from './components/layout/AboutSection';
import BenefitsSection from './components/layout/BenefitsSection';
import CommunitySection from './components/layout/CommunitySection';
import AboutManuSection from './components/layout/AboutManuSection';
import TestimonialsSection from './components/layout/TestimonialsSection';
import EnrollSection from './components/layout/EnrollSection';
// import ManuPresentationSection from './components/layout/ManuPresentationSection'; // Removido conforme ajustes2.md
import PartnersSection from './components/layout/PartnersSection';
import QuemEManuelaSection from './components/layout/QuemEManuelaSection';
import FAQSection from './components/layout/FAQSection';

// Layout Components
import AlunaLayout from './components/aluna/layout/AlunaLayout';
import AdminLayout from './components/layout/AdminLayout';

// Other Components
import RecuperarSenha from './pages/RecuperarSenha';
import ContentPage from './pages/aluna/aulas/ContentPage';
import ExerciciosPage from './pages/aluna/aulas/ExerciciosPage';
import EncontrosPage from './pages/aluna/aulas/EncontrosPage';
import BoasVindas from './pages/aluna/comece/BoasVindas';
import CheckoutConfirmation from './pages/CheckoutConfirmation';

// Lazy loaded pages
import {
  Login,
  Register,
  Checkout,
  Dashboard,
  Community,
  Configuracoes,
  AvisosImportantes,
  LinksUteis,
  Shop,
  ChapterOverview,
  Acordos,
  Apresentacao,
  Agenda,
  Indicacoes,
  Relacionamento,
  Trabalho,
  Amizade,
  AdminDashboard,
  AdminStudentList,
  StudentDetail,
  CourseList,
  CourseEditor,
  TagManager,
  HotmartIntegration,
  Notifications
} from './utils/lazyImports';

// Landing Page Component
const LandingPage = () => (
  <>
    <Navigation />
    <Hero />
    <AboutSection />
    <BenefitsSection />
    <CommunitySection />
    <AboutManuSection />
    <EnrollSection />
    <TestimonialsSection />
    <PartnersSection />
    <QuemEManuelaSection />
    {/* <ManuPresentationSection /> Removido conforme ajustes2.md */}
    <FAQSection />
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } />
          <Route path="/registro" element={
            <Suspense fallback={<PageLoader />}>
              <Register />
            </Suspense>
          } />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          
          {/* Checkout */}
          <Route path="/checkout" element={
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/checkout/confirmacao" element={<CheckoutConfirmation />} />
          
          {/* Aluna Area */}
          <Route path="/aluna" element={
            <ProtectedRoute>
              <AlunaLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="comunidade" element={
              <Suspense fallback={<PageLoader />}>
                <Community />
              </Suspense>
            } />
            {/* Comece por Aqui Routes */}
            <Route path="comece/boas-vindas" element={<BoasVindas />} />
            <Route path="comece/acordos" element={
              <Suspense fallback={<PageLoader />}>
                <Acordos />
              </Suspense>
            } />
            <Route path="comece/apresentacao" element={
              <Suspense fallback={<PageLoader />}>
                <Apresentacao />
              </Suspense>
            } />
            <Route path="comece/agenda" element={
              <Suspense fallback={<PageLoader />}>
                <Agenda />
              </Suspense>
            } />
            {/* Aulas Routes */}
            <Route path="aulas/capitulo/:chapterId" element={
              <Suspense fallback={<PageLoader />}>
                <ChapterOverview />
              </Suspense>
            } />
            <Route path="aulas/capitulo/:chapterId/video" element={<ContentPage />} />
            <Route path="aulas/capitulo/:chapterId/musica" element={<ContentPage />} />
            <Route path="aulas/capitulo/:chapterId/exercicio" element={<ExerciciosPage />} />
            <Route path="aulas/capitulo/:chapterId/encontros" element={<EncontrosPage />} />
            {/* Debates Routes */}
            <Route path="debates/indicacoes" element={
              <Suspense fallback={<PageLoader />}>
                <Indicacoes />
              </Suspense>
            } />
            <Route path="debates/relacionamento" element={
              <Suspense fallback={<PageLoader />}>
                <Relacionamento />
              </Suspense>
            } />
            <Route path="debates/trabalho" element={
              <Suspense fallback={<PageLoader />}>
                <Trabalho />
              </Suspense>
            } />
            <Route path="debates/amizade" element={
              <Suspense fallback={<PageLoader />}>
                <Amizade />
              </Suspense>
            } />
            {/* Administrative Routes */}
            <Route path="avisos" element={
              <Suspense fallback={<PageLoader />}>
                <AvisosImportantes />
              </Suspense>
            } />
            <Route path="links" element={
              <Suspense fallback={<PageLoader />}>
                <LinksUteis />
              </Suspense>
            } />
            <Route path="shop" element={
              <Suspense fallback={<PageLoader />}>
                <Shop />
              </Suspense>
            } />
            <Route path="configuracoes" element={
              <Suspense fallback={<PageLoader />}>
                <Configuracoes />
              </Suspense>
            } />
            {/* Adicionar outras rotas aqui */}
          </Route>
          
          {/* Admin Area */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="courses" element={
              <Suspense fallback={<PageLoader />}>
                <CourseList />
              </Suspense>
            } />
            <Route path="students" element={
              <Suspense fallback={<PageLoader />}>
                <AdminStudentList />
              </Suspense>
            } />
            <Route path="students/:id" element={
              <Suspense fallback={<PageLoader />}>
                <StudentDetail />
              </Suspense>
            } />
            <Route path="courses/:id" element={
              <Suspense fallback={<PageLoader />}>
                <CourseEditor />
              </Suspense>
            } />
            <Route path="tags" element={
              <Suspense fallback={<PageLoader />}>
                <TagManager />
              </Suspense>
            } />
            <Route path="hotmart" element={
              <Suspense fallback={<PageLoader />}>
                <HotmartIntegration />
              </Suspense>
            } />
            <Route path="notifications" element={
              <Suspense fallback={<PageLoader />}>
                <Notifications />
              </Suspense>
            } />
            {/* Future admin routes will go here */}
          </Route>
          
          {/* Redirect /alunas to /aluna */}
          <Route path="/alunas" element={<Navigate to="/aluna" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
