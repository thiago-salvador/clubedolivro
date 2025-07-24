import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, MessageSquare, TrendingUp, Mail, DollarSign, BarChart3, Clock, Award, Target, Download, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import PeriodFilter from '../../components/admin/PeriodFilter';
import * as XLSX from 'xlsx';
import { formatDistanceToNow, format, subDays, startOfDay, subWeeks, subMonths, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { studentService, StudentWithTags } from '../../services/student.service';
import { courseService } from '../../services/course.service';
import { Course } from '../../types/admin.types';
import { notificationService } from '../../services/notification.service';
import { hotmartService } from '../../services/hotmart.service';
import { readingProgressService } from '../../services/reading-progress.service';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
}

interface EngagementTrendData {
  date: string;
  engajamento: number;
  posts: number;
  comentarios: number;
  alunas_ativas: number;
}

interface UserActivityData {
  hora: string;
  atividade: number;
}

interface CourseProgressData {
  nome: string;
  concluidas: number;
  em_andamento: number;
  nao_iniciadas: number;
}

interface TagDistributionData {
  name: string;
  value: number;
  color: string;
}

interface ProgressReportData {
  studentProgress: {
    studentId: string;
    studentName: string;
    totalChapters: number;
    completedChapters: number;
    progressPercentage: number;
    lastAccess: Date;
    coursesEnrolled: number;
    averageTimePerChapter: number;
  }[];
  coursePerformance: {
    courseId: string;
    courseName: string;
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    averageProgress: number;
    dropoutRate: number;
  }[];
  weeklyActivity: {
    week: string;
    newStudents: number;
    activeStudents: number;
    completions: number;
    engagementScore: number;
  }[];
  monthlyTrends: {
    month: string;
    enrollments: number;
    completions: number;
    revenue: number;
    retention: number;
  }[];
}

interface ChartData {
  engagementTrend: EngagementTrendData[];
  userActivity: UserActivityData[];
  courseProgress: CourseProgressData[];
  tagDistribution: TagDistributionData[];
}

interface PeriodFilter {
  label: string;
  value: 'last7days' | 'last30days' | 'last3months' | 'last6months' | 'lastyear' | 'custom';
  days?: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="text-terracota">
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    students: { total: 0, active: 0, inactive: 0, newThisMonth: 0 },
    courses: { total: 0, active: 0, draft: 0 },
    community: { postsThisWeek: 0, commentsThisWeek: 0, activeUsers: 0 },
    engagement: { rate: 0, trend: 0 },
    notifications: { pending: 0, sent: 0, total: 0 },
    hotmart: { transactions: 0, revenue: 0, pending: 0 }
  });

  const [chartData, setChartData] = useState<ChartData>({
    engagementTrend: [],
    userActivity: [],
    courseProgress: [],
    tagDistribution: []
  });

  const [progressReports, setProgressReports] = useState<ProgressReportData>({
    studentProgress: [],
    coursePerformance: [],
    weeklyActivity: [],
    monthlyTrends: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'student' | 'course' | 'community' | 'hotmart';
    title: string;
    description: string;
    time: Date;
    icon: React.ReactNode;
  }>>([]);
  
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });

  useEffect(() => {
    loadDashboardMetrics();
  }, [dateRange]);

  const loadDashboardMetrics = async () => {
    try {
      setIsLoading(true);

      // Load student metrics
      const students = studentService.getAllStudents();
      const studentStats = studentService.getStats();
      
      // Load course metrics
      const courses = await courseService.getAllCourses();
      const activeCourses = courses.filter(c => c.status === 'published');
      const draftCourses = courses.filter(c => c.status === 'draft');

      // Load notification metrics
      const notificationStats = notificationService.getQueueStats();

      // Load Hotmart metrics
      const hotmartStats = hotmartService.getStatistics();

      // Calculate engagement rate (mock calculation)
      const totalActiveStudents = studentStats.active;
      const mockEngagementRate = totalActiveStudents > 0 ? 
        Math.round((studentStats.active / studentStats.total) * 100) : 0;

      // Generate recent activity
      const activity = generateRecentActivity(students, courses);

      // Generate chart data
      const charts = generateChartData(students, courses, studentStats, dateRange);

      // Generate progress reports
      const reports = generateProgressReports(students, courses, studentStats, dateRange);

      setMetrics({
        students: {
          total: studentStats.total,
          active: studentStats.active,
          inactive: studentStats.inactive,
          newThisMonth: studentStats.newThisMonth
        },
        courses: {
          total: courses.length,
          active: activeCourses.length,
          draft: draftCourses.length
        },
        community: {
          postsThisWeek: Math.floor(Math.random() * 50) + 10, // Mock data
          commentsThisWeek: Math.floor(Math.random() * 200) + 50, // Mock data
          activeUsers: studentStats.active
        },
        engagement: {
          rate: mockEngagementRate,
          trend: Math.floor(Math.random() * 20) - 10 // Mock trend -10 to +10
        },
        notifications: notificationStats,
        hotmart: {
          transactions: hotmartStats.total,
          revenue: hotmartStats.totalRevenue,
          pending: hotmartStats.needingAttention
        }
      });

      setChartData(charts);
      setProgressReports(reports);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecentActivity = (students: StudentWithTags[], courses: Course[]) => {
    const activities = [];

    // Recent students
    const recentStudents = students
      .sort((a, b) => new Date(b.joinedDate || 0).getTime() - new Date(a.joinedDate || 0).getTime())
      .slice(0, 3);

    recentStudents.forEach(student => {
      activities.push({
        id: `student-${student.id}`,
        type: 'student' as const,
        title: 'Nova aluna cadastrada',
        description: `${student.name} se juntou ao clube`,
        time: new Date(student.joinedDate || Date.now()),
        icon: <Users className="w-4 h-4" />
      });
    });

    // Recent courses
    const recentCourses = courses
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
      .slice(0, 2);

    recentCourses.forEach(course => {
      activities.push({
        id: `course-${course.id}`,
        type: 'course' as const,
        title: 'Curso atualizado',
        description: `"${course.name}" foi modificado`,
        time: new Date(course.updatedAt || Date.now()),
        icon: <BookOpen className="w-4 h-4" />
      });
    });

    // Mock community activity
    activities.push({
      id: 'community-post',
      type: 'community' as const,
      title: 'Nova discussão na comunidade',
      description: 'Tópico sobre autoconhecimento criado',
      time: new Date(Date.now() - Math.random() * 86400000), // Last 24h
      icon: <MessageSquare className="w-4 h-4" />
    });

    // Mock Hotmart activity
    activities.push({
      id: 'hotmart-purchase',
      type: 'hotmart' as const,
      title: 'Nova compra via Hotmart',
      description: 'Produto "Relacionamentos Saudáveis" vendido',
      time: new Date(Date.now() - Math.random() * 86400000), // Last 24h
      icon: <TrendingUp className="w-4 h-4" />
    });

    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 8);
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleExportStudentProgress = (exportFormat: 'csv' | 'excel') => {
    const exportData = progressReports.studentProgress.map(student => ({
      'Nome da Aluna': student.studentName,
      'Capítulos Totais': student.totalChapters,
      'Capítulos Concluídos': student.completedChapters,
      'Percentual de Progresso': `${student.progressPercentage}%`,
      'Último Acesso': format(student.lastAccess, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      'Cursos Inscritos': student.coursesEnrolled,
      'Tempo Médio por Capítulo (min)': student.averageTimePerChapter
    }));

    const filename = `progresso_alunas_${format(new Date(), 'yyyy-MM-dd')}`;
    
    if (exportFormat === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  const handleExportCoursePerformance = (exportFormat: 'csv' | 'excel') => {
    const exportData = progressReports.coursePerformance.map(course => ({
      'Nome do Curso': course.courseName,
      'Total de Estudantes': course.totalStudents,
      'Estudantes Ativos': course.activeStudents,
      'Taxa de Conclusão': `${course.completionRate}%`,
      'Progresso Médio': `${course.averageProgress}%`,
      'Taxa de Abandono': `${course.dropoutRate}%`
    }));

    const filename = `performance_cursos_${format(new Date(), 'yyyy-MM-dd')}`;
    
    if (exportFormat === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  const handleExportEngagementData = (exportFormat: 'csv' | 'excel') => {
    const exportData = chartData.engagementTrend.map(item => ({
      'Data': item.date,
      'Engajamento': item.engajamento,
      'Posts': item.posts,
      'Comentários': item.comentarios,
      'Alunas Ativas': item.alunas_ativas
    }));

    const filename = `engajamento_${format(new Date(), 'yyyy-MM-dd')}`;
    
    if (exportFormat === 'csv') {
      exportToCSV(exportData, filename);
    } else {
      exportToExcel(exportData, filename);
    }
  };

  const handleExportAllData = (exportFormat: 'csv' | 'excel') => {
    if (exportFormat === 'excel') {
      // Create multi-sheet Excel file
      const workbook = XLSX.utils.book_new();
      
      // Student Progress Sheet
      const studentProgressData = progressReports.studentProgress.map(student => ({
        'Nome da Aluna': student.studentName,
        'Capítulos Totais': student.totalChapters,
        'Capítulos Concluídos': student.completedChapters,
        'Percentual de Progresso': `${student.progressPercentage}%`,
        'Último Acesso': format(student.lastAccess, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        'Cursos Inscritos': student.coursesEnrolled,
        'Tempo Médio por Capítulo (min)': student.averageTimePerChapter
      }));
      const ws1 = XLSX.utils.json_to_sheet(studentProgressData);
      XLSX.utils.book_append_sheet(workbook, ws1, 'Progresso Alunas');
      
      // Course Performance Sheet
      const coursePerformanceData = progressReports.coursePerformance.map(course => ({
        'Nome do Curso': course.courseName,
        'Total de Estudantes': course.totalStudents,
        'Estudantes Ativos': course.activeStudents,
        'Taxa de Conclusão': `${course.completionRate}%`,
        'Progresso Médio': `${course.averageProgress}%`,
        'Taxa de Abandono': `${course.dropoutRate}%`
      }));
      const ws2 = XLSX.utils.json_to_sheet(coursePerformanceData);
      XLSX.utils.book_append_sheet(workbook, ws2, 'Performance Cursos');
      
      // Engagement Data Sheet
      const engagementData = chartData.engagementTrend.map(item => ({
        'Data': item.date,
        'Engajamento': item.engajamento,
        'Posts': item.posts,
        'Comentários': item.comentarios,
        'Alunas Ativas': item.alunas_ativas
      }));
      const ws3 = XLSX.utils.json_to_sheet(engagementData);
      XLSX.utils.book_append_sheet(workbook, ws3, 'Engajamento');
      
      // Statistics Summary Sheet
      const statsData = [
        { 'Métrica': 'Total de Alunas', 'Valor': metrics.students.total },
        { 'Métrica': 'Alunas Ativas', 'Valor': metrics.students.active },
        { 'Métrica': 'Total de Cursos', 'Valor': metrics.courses.total },
        { 'Métrica': 'Posts na Comunidade', 'Valor': metrics.community.postsThisWeek },
        { 'Métrica': 'Notificações Enviadas', 'Valor': metrics.notifications.sent },
        { 'Métrica': 'Revenue Hotmart', 'Valor': `R$ ${metrics.hotmart.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }
      ];
      const ws4 = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, ws4, 'Resumo Estatísticas');
      
      const filename = `dashboard_completo_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, filename);
    } else {
      // For CSV, export student progress as the main report
      handleExportStudentProgress('csv');
    }
  };

  const generateChartData = (students: StudentWithTags[], courses: Course[], studentStats: any, dateRange: DateRange): ChartData => {
    // Generate engagement trend data based on date range
    const engagementTrend: EngagementTrendData[] = [];
    const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = daysDiff - 1; i >= 0; i--) {
      const date = subDays(dateRange.endDate, i);
      const dateStr = format(date, 'dd/MM');
      
      // Mock engagement data with some realism
      const baseEngagement = 20 + Math.sin(i * 0.1) * 10;
      const randomVariation = (Math.random() - 0.5) * 10;
      const engagement = Math.max(0, Math.round(baseEngagement + randomVariation));
      
      // Mock community activity
      const posts = Math.floor(Math.random() * 8) + 1;
      const comments = posts * (Math.floor(Math.random() * 5) + 2);
      
      engagementTrend.push({
        date: dateStr,
        engajamento: engagement,
        posts,
        comentarios: comments,
        alunas_ativas: Math.floor(studentStats.active * (0.8 + Math.random() * 0.4))
      });
    }

    // Generate user activity by hour (last 24h mock)
    const userActivity: UserActivityData[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const activity = Math.floor(Math.sin((hour - 6) * Math.PI / 12) * 15 + 20 + Math.random() * 10);
      userActivity.push({
        hora: `${hour.toString().padStart(2, '0')}:00`,
        atividade: Math.max(0, activity)
      });
    }

    // Generate course progress data
    const courseProgress: CourseProgressData[] = courses.slice(0, 5).map(course => ({
      nome: course.name.length > 20 ? course.name.substring(0, 20) + '...' : course.name,
      concluidas: Math.floor(Math.random() * 50) + 10,
      em_andamento: Math.floor(Math.random() * 30) + 5,
      nao_iniciadas: Math.floor(Math.random() * 20) + 3
    }));

    // Generate tag distribution from student stats
    const tagDistribution: TagDistributionData[] = Object.entries(studentStats.byTag || {})
      .slice(0, 6)
      .map(([name, count], index) => ({
        name,
        value: count as number,
        color: ['#B8654B', '#7C9885', '#6B8E23', '#DAA520', '#4D381B', '#8B4513'][index] || '#B8654B'
      }));

    return {
      engagementTrend,
      userActivity,
      courseProgress,
      tagDistribution
    };
  };
  const generateProgressReports = (students: StudentWithTags[], courses: Course[], studentStats: any, dateRange: DateRange): ProgressReportData => {
    // Generate student progress data
    const studentProgress = students.slice(0, 10).map(student => {
      // Mock reading progress data since we don't have user-specific progress
      const totalChapters = 5;
      const completedChapters = Math.floor(Math.random() * totalChapters);
      const progressPercentage = (completedChapters / totalChapters) * 100;
      const averageTimePerChapter = Math.floor(Math.random() * 120) + 30; // 30-150 minutes

      return {
        studentId: student.id,
        studentName: student.name,
        totalChapters,
        completedChapters,
        progressPercentage: Math.round(progressPercentage),
        lastAccess: student.lastActivity || student.joinedDate,
        coursesEnrolled: student.coursesEnrolled || Math.floor(Math.random() * 3) + 1,
        averageTimePerChapter
      };
    });

    // Generate course performance data
    const coursePerformance = courses.slice(0, 6).map(course => {
      const totalStudents = Math.floor(Math.random() * 100) + 20;
      const activeStudents = Math.floor(totalStudents * (0.6 + Math.random() * 0.3));
      const completionRate = Math.floor(Math.random() * 40) + 30; // 30-70%
      const averageProgress = Math.floor(Math.random() * 30) + 50; // 50-80%
      const dropoutRate = Math.floor(Math.random() * 25) + 5; // 5-30%

      return {
        courseId: course.id,
        courseName: course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name,
        totalStudents,
        activeStudents,
        completionRate,
        averageProgress,
        dropoutRate
      };
    });

    // Generate weekly activity data (last 8 weeks)
    const weeklyActivity = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = subDays(new Date(), i * 7);
      const weekStr = format(weekStart, 'dd/MM');
      
      const newStudents = Math.floor(Math.random() * 15) + 5;
      const activeStudents = Math.floor(studentStats.active * (0.7 + Math.random() * 0.6));
      const completions = Math.floor(Math.random() * 12) + 3;
      const engagementScore = Math.floor(Math.random() * 40) + 60; // 60-100
      
      weeklyActivity.push({
        week: weekStr,
        newStudents,
        activeStudents,
        completions,
        engagementScore
      });
    }

    // Generate monthly trends data (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = subDays(new Date(), i * 30);
      const monthStr = format(monthStart, 'MMM/yy');
      
      const enrollments = Math.floor(Math.random() * 50) + 20;
      const completions = Math.floor(Math.random() * 30) + 10;
      const revenue = Math.floor(Math.random() * 15000) + 8000;
      const retention = Math.floor(Math.random() * 20) + 75; // 75-95%
      
      monthlyTrends.push({
        month: monthStr,
        enrollments,
        completions,
        revenue,
        retention
      });
    }

    return {
      studentProgress,
      coursePerformance,
      weeklyActivity,
      monthlyTrends
    };
  };

  const formatTrend = (value: number): string => {
    if (value > 0) return `+${value}%`;
    if (value < 0) return `${value}%`;
    return '0%';
  };

  const getTrendColor = (value: number): string => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-terracota to-terracota/80 rounded-lg p-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-terracota to-terracota/80 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vinda ao Painel Administrativo
        </h1>
        <p className="text-terracota-100">
          Gerencie todos os aspectos do Clube do Livro no Divã de forma centralizada
        </p>
        
        {/* Quick refresh button and period filter */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={loadDashboardMetrics}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors text-sm flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Atualizar Métricas
          </button>
          
          <PeriodFilter
            onPeriodChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
            className="ml-auto"
          />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Alunas"
          value={metrics.students.total}
          icon={<Users className="w-8 h-8" />}
          description={`${metrics.students.active} ativas, ${metrics.students.inactive} inativas`}
          trend={metrics.students.newThisMonth > 0 ? `+${metrics.students.newThisMonth} este mês` : undefined}
        />
        
        <StatCard
          title="Cursos Ativos"
          value={metrics.courses.active}
          icon={<BookOpen className="w-8 h-8" />}
          description={`${metrics.courses.total} total, ${metrics.courses.draft} rascunhos`}
        />
        
        <StatCard
          title="Posts na Comunidade"
          value={metrics.community.postsThisWeek}
          icon={<MessageSquare className="w-8 h-8" />}
          description={`${metrics.community.commentsThisWeek} comentários esta semana`}
          trend={metrics.engagement.trend !== 0 ? `${formatTrend(metrics.engagement.trend)} vs semana anterior` : undefined}
        />
        
        <StatCard
          title="Taxa de Engajamento"
          value={`${metrics.engagement.rate}%`}
          icon={<TrendingUp className="w-8 h-8" />}
          description="Baseado em alunas ativas"
          trend={metrics.engagement.trend !== 0 ? formatTrend(metrics.engagement.trend) : undefined}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h3>
            <Mail className="w-6 h-6 text-terracota" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.notifications.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Enviadas</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.notifications.sent}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-terracota">{metrics.notifications.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hotmart</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Transações</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.hotmart.transactions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Receita</span>
              <span className="font-semibold text-green-600">R$ {metrics.hotmart.revenue.toLocaleString('pt-BR')}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pendentes</span>
                <span className={`font-bold ${metrics.hotmart.pending > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {metrics.hotmart.pending}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comunidade</h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Usuárias Ativas</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.community.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Posts/Semana</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.community.postsThisWeek}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Comentários</span>
                <span className="font-bold text-blue-600">{metrics.community.commentsThisWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-terracota" />
            Tendência de Engajamento (30 dias)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.engagementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="engajamento" 
                stroke="#B8654B" 
                fill="#B8654B" 
                fillOpacity={0.3}
                name="Engajamento %"
              />
              <Area 
                type="monotone" 
                dataKey="alunas_ativas" 
                stroke="#7C9885" 
                fill="#7C9885" 
                fillOpacity={0.2}
                name="Alunas Ativas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity by Hour */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-terracota" />
            Atividade por Hora (24h)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.userActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hora" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="atividade" 
                fill="#B8654B" 
                radius={[4, 4, 0, 0]}
                name="Atividade"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-terracota" />
            Progresso dos Cursos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.courseProgress} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                type="category"
                dataKey="nome" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                width={120}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="concluidas" stackId="a" fill="#7C9885" name="Concluídas" />
              <Bar dataKey="em_andamento" stackId="a" fill="#DAA520" name="Em Andamento" />
              <Bar dataKey="nao_iniciadas" stackId="a" fill="#6B8E23" name="Não Iniciadas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tag Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-terracota" />
            Distribuição por Tags
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.tagDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.tagDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Community Activity Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-terracota" />
            Atividade da Comunidade (30 dias)
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExportEngagementData('csv')}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </button>
            <button
              onClick={() => handleExportEngagementData('excel')}
              className="px-3 py-1 text-sm bg-terracota text-white rounded-md hover:bg-terracota/90 flex items-center"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              Excel
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData.engagementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="posts" 
              stroke="#B8654B" 
              strokeWidth={3}
              dot={{ fill: '#B8654B', strokeWidth: 2, r: 4 }}
              name="Posts Diários"
            />
            <Line 
              type="monotone" 
              dataKey="comentarios" 
              stroke="#7C9885" 
              strokeWidth={3}
              dot={{ fill: '#7C9885', strokeWidth: 2, r: 4 }}
              name="Comentários Diários"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Reports */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-terracota" />
            Relatórios de Progresso
          </h2>
          <div className="flex items-center space-x-2">
            {/* Export Menu */}
            <div className="relative group">
              <button className="flex items-center px-4 py-2 bg-terracota text-white rounded-md hover:bg-terracota/90 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExportAllData('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Todos os Dados (Excel)
                  </button>
                  <button
                    onClick={() => handleExportStudentProgress('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Progress Alunas (Excel)
                  </button>
                  <button
                    onClick={() => handleExportCoursePerformance('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Performance Cursos (Excel)
                  </button>
                  <button
                    onClick={() => handleExportEngagementData('excel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Dados Engajamento (Excel)
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={() => handleExportStudentProgress('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Progress Alunas (CSV)
                  </button>
                  <button
                    onClick={() => handleExportCoursePerformance('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Performance Cursos (CSV)
                  </button>
                  <button
                    onClick={() => handleExportEngagementData('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Dados Engajamento (CSV)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Report */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-terracota" />
              Progresso Individual das Alunas
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportStudentProgress('csv')}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
              <button
                onClick={() => handleExportStudentProgress('excel')}
                className="px-3 py-1 text-sm bg-terracota text-white rounded-md hover:bg-terracota/90 flex items-center"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aluna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Capítulos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tempo Médio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {progressReports.studentProgress.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.coursesEnrolled} curso{student.coursesEnrolled !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div 
                            className="bg-terracota h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${student.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-0">
                          {student.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.completedChapters}/{student.totalChapters}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(student.lastAccess, { addSuffix: true, locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.averageTimePerChapter}min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Performance & Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-terracota" />
                Performance dos Cursos
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportCoursePerformance('csv')}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </button>
                <button
                  onClick={() => handleExportCoursePerformance('excel')}
                  className="px-3 py-1 text-sm bg-terracota text-white rounded-md hover:bg-terracota/90 flex items-center"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  Excel
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {progressReports.coursePerformance.map((course) => (
                <div key={course.courseId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{course.courseName}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{course.totalStudents} alunas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Conclusão:</span>
                      <span className="ml-2 font-medium text-green-600">{course.completionRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Ativas:</span>
                      <span className="ml-2 font-medium text-blue-600">{course.activeStudents}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Progresso Médio:</span>
                      <span className="ml-2 font-medium text-terracota">{course.averageProgress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Desistência:</span>
                      <span className="ml-2 font-medium text-red-600">{course.dropoutRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-terracota" />
              Atividade Semanal (8 semanas)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressReports.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="newStudents" 
                  stroke="#B8654B" 
                  strokeWidth={2}
                  dot={{ fill: '#B8654B', strokeWidth: 2, r: 4 }}
                  name="Novas Alunas"
                />
                <Line 
                  type="monotone" 
                  dataKey="activeStudents" 
                  stroke="#7C9885" 
                  strokeWidth={2}
                  dot={{ fill: '#7C9885', strokeWidth: 2, r: 4 }}
                  name="Alunas Ativas"
                />
                <Line 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="#DAA520" 
                  strokeWidth={2}
                  dot={{ fill: '#DAA520', strokeWidth: 2, r: 4 }}
                  name="Conclusões"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-terracota" />
            Tendências Mensais (6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={progressReports.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  if (name === 'Receita') return [`R$ ${value.toLocaleString('pt-BR')}`, name];
                  if (name === 'Retenção') return [`${value}%`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="enrollments" fill="#B8654B" name="Matrículas" />
              <Bar yAxisId="left" dataKey="completions" fill="#7C9885" name="Conclusões" />
              <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#DAA520" strokeWidth={3} name="Retenção %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/courses/create"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracota transition-colors text-left group"
          >
            <BookOpen className="w-6 h-6 text-terracota mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900 dark:text-white">Criar Novo Curso</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Adicione um curso ao catálogo</p>
          </Link>
          
          <Link
            to="/admin/students"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracota transition-colors text-left group"
          >
            <Users className="w-6 h-6 text-terracota mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900 dark:text-white">Gerenciar Alunas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ver todas as alunas cadastradas</p>
          </Link>
          
          <Link
            to="/admin/notifications"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracota transition-colors text-left group"
          >
            <Mail className="w-6 h-6 text-terracota mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900 dark:text-white">Enviar Notificação</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Comunicar com as alunas</p>
          </Link>

          <Link
            to="/admin/hotmart"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-terracota transition-colors text-left group"
          >
            <TrendingUp className="w-6 h-6 text-terracota mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-900 dark:text-white">Hotmart Integration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monitorar vendas e integrações</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Atividade Recente
        </h2>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhuma atividade recente encontrada.
            </p>
          ) : (
            recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-full bg-terracota/10 text-terracota">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDistanceToNow(activity.time, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;