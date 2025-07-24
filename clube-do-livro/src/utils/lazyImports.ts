import { lazy } from 'react';

// Lazy load pages for code splitting
export const Login = lazy(() => import('../pages/Login'));
export const Register = lazy(() => import('../pages/Register'));
export const Checkout = lazy(() => import('../pages/Checkout'));
// export const PaymentConfirmation = lazy(() => import('../pages/PaymentConfirmation'));

// Aluna pages
export const Dashboard = lazy(() => import('../pages/aluna/Dashboard'));
export const Community = lazy(() => import('../pages/aluna/Community'));
export const Configuracoes = lazy(() => import('../pages/aluna/Configuracoes'));
export const AvisosImportantes = lazy(() => import('../pages/aluna/AvisosImportantes'));
export const LinksUteis = lazy(() => import('../pages/aluna/LinksUteis'));
export const Shop = lazy(() => import('../pages/aluna/Shop'));

// Chapter pages
export const ChapterOverview = lazy(() => import('../pages/aluna/aulas/ChapterOverview'));
// export const VideoAula = lazy(() => import('../pages/aluna/aulas/VideoAula'));
// export const MusicaAula = lazy(() => import('../pages/aluna/aulas/MusicaAula'));
// export const ExerciciosTerapeuticos = lazy(() => import('../pages/aluna/aulas/ExerciciosTerapeuticos'));
// export const EncontrosParticipativos = lazy(() => import('../pages/aluna/aulas/EncontrosParticipativos'));

// Comece pages
// export const Welcome = lazy(() => import('../pages/aluna/comece/Welcome'));
export const Acordos = lazy(() => import('../pages/aluna/comece/Acordos'));
export const Apresentacao = lazy(() => import('../pages/aluna/comece/Apresentacao'));
// export const Funciona = lazy(() => import('../pages/aluna/comece/Funciona'));
export const Agenda = lazy(() => import('../pages/aluna/comece/Agenda'));

// Debates pages
export const Indicacoes = lazy(() => import('../pages/aluna/debates/Indicacoes'));
export const Relacionamento = lazy(() => import('../pages/aluna/debates/Relacionamento'));
export const Trabalho = lazy(() => import('../pages/aluna/debates/Trabalho'));
export const Amizade = lazy(() => import('../pages/aluna/debates/Amizade'));

// Admin pages
export const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
export const AdminStudentList = lazy(() => import('../pages/admin/StudentList'));
export const StudentDetail = lazy(() => import('../pages/admin/StudentDetail'));
export const TagManager = lazy(() => import('../pages/admin/TagManager'));
export const CourseList = lazy(() => import('../pages/admin/CourseList'));
export const CourseEditor = lazy(() => import('../pages/admin/CourseEditor'));
export const HotmartIntegration = lazy(() => import('../pages/admin/HotmartIntegration'));
export const Notifications = lazy(() => import('../pages/admin/Notifications'));
