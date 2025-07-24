import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface StudyGoal {
  id: string;
  type: 'daily' | 'weekly' | 'chapter';
  description: string;
  targetAmount: number;
  currentAmount: number;
  unit: string;
  completed: boolean;
  createdAt: Date;
}

interface ScheduleItem {
  id: string;
  type: 'study' | 'meeting' | 'reflection' | 'exercise';
  title: string;
  day: string;
  time: string;
  duration: number;
  reminder: boolean;
  recurring: boolean;
}

const Agenda: React.FC = () => {
  const { user } = useAuth();
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  const [goalForm, setGoalForm] = useState({
    type: 'daily',
    description: '',
    targetAmount: 30,
    unit: 'minutos'
  });

  const [scheduleForm, setScheduleForm] = useState({
    type: 'study',
    title: '',
    day: 'monday',
    time: '19:00',
    duration: 30,
    reminder: true,
    recurring: true
  });

  const goalTypes = [
    { value: 'daily', label: 'Meta Diária', icon: '📅' },
    { value: 'weekly', label: 'Meta Semanal', icon: '📆' },
    { value: 'chapter', label: 'Por Capítulo', icon: '📖' }
  ];

  const scheduleTypes = [
    { value: 'study', label: 'Leitura/Estudo', icon: '📚' },
    { value: 'meeting', label: 'Encontros', icon: '👥' },
    { value: 'reflection', label: 'Reflexão', icon: '🧘‍♀️' },
    { value: 'exercise', label: 'Exercícios', icon: '✍️' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  useEffect(() => {
    // Carregar metas e agenda do localStorage
    const savedGoals = localStorage.getItem('study_goals');
    if (savedGoals) {
      setStudyGoals(JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt)
      })));
    }

    const savedSchedule = localStorage.getItem('schedule_items');
    if (savedSchedule) {
      setScheduleItems(JSON.parse(savedSchedule));
    }
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: StudyGoal = {
      id: Date.now().toString(),
      type: goalForm.type as 'daily' | 'weekly' | 'chapter',
      description: goalForm.description,
      targetAmount: goalForm.targetAmount,
      currentAmount: 0,
      unit: goalForm.unit,
      completed: false,
      createdAt: new Date()
    };

    const updatedGoals = [...studyGoals, newGoal];
    setStudyGoals(updatedGoals);
    localStorage.setItem('study_goals', JSON.stringify(updatedGoals));
    
    setGoalForm({
      type: 'daily',
      description: '',
      targetAmount: 30,
      unit: 'minutos'
    });
    setShowGoalForm(false);
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      type: scheduleForm.type as 'study' | 'meeting' | 'reflection' | 'exercise',
      title: scheduleForm.title,
      day: scheduleForm.day,
      time: scheduleForm.time,
      duration: scheduleForm.duration,
      reminder: scheduleForm.reminder,
      recurring: scheduleForm.recurring
    };

    const updatedSchedule = [...scheduleItems, newItem];
    setScheduleItems(updatedSchedule);
    localStorage.setItem('schedule_items', JSON.stringify(updatedSchedule));
    
    setScheduleForm({
      type: 'study',
      title: '',
      day: 'monday',
      time: '19:00',
      duration: 30,
      reminder: true,
      recurring: true
    });
    setShowScheduleForm(false);
  };

  const updateGoalProgress = (goalId: string, newAmount: number) => {
    const updatedGoals = studyGoals.map(goal =>
      goal.id === goalId
        ? { 
            ...goal, 
            currentAmount: newAmount,
            completed: newAmount >= goal.targetAmount 
          }
        : goal
    );
    setStudyGoals(updatedGoals);
    localStorage.setItem('study_goals', JSON.stringify(updatedGoals));
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = studyGoals.filter(goal => goal.id !== goalId);
    setStudyGoals(updatedGoals);
    localStorage.setItem('study_goals', JSON.stringify(updatedGoals));
  };

  const deleteScheduleItem = (itemId: string) => {
    const updatedSchedule = scheduleItems.filter(item => item.id !== itemId);
    setScheduleItems(updatedSchedule);
    localStorage.setItem('schedule_items', JSON.stringify(updatedSchedule));
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = scheduleTypes.find(t => t.value === type);
    return typeConfig?.icon || '📅';
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = scheduleTypes.find(t => t.value === type);
    return typeConfig?.label || 'Atividade';
  };

  const getDayLabel = (day: string) => {
    const dayConfig = weekDays.find(d => d.value === day);
    return dayConfig?.label || day;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📅</span>
          Agenda Pessoal
        </h1>
        <p className="text-gray-700">
          Organize seu tempo de estudo e crie uma rotina que funcione para você. 
          Defina metas realistas e acompanhe seu progresso na jornada.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Metas de Estudo */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span>🎯</span>
              Metas de Estudo
            </h3>
            <button
              onClick={() => setShowGoalForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              + Adicionar Meta
            </button>
          </div>

          {/* Goal Form */}
          {showGoalForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Meta
                  </label>
                  <select
                    value={goalForm.type}
                    onChange={(e) => setGoalForm({...goalForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    {goalTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                    placeholder="Ex: Ler pelo menos 30 minutos por dia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      value={goalForm.targetAmount}
                      onChange={(e) => setGoalForm({...goalForm, targetAmount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade
                    </label>
                    <select
                      value={goalForm.unit}
                      onChange={(e) => setGoalForm({...goalForm, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    >
                      <option value="minutos">Minutos</option>
                      <option value="páginas">Páginas</option>
                      <option value="capítulos">Capítulos</option>
                      <option value="exercícios">Exercícios</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Criar Meta
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {studyGoals.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-3 block">🎯</span>
                <p className="text-gray-500">
                  Defina suas primeiras metas de estudo!
                </p>
              </div>
            ) : (
              studyGoals.map((goal) => (
                <div key={goal.id} className={`p-4 rounded-lg border-2 transition-colors ${
                  goal.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {goal.description}
                      </h4>
                      <div className="text-sm text-gray-600">
                        Meta: {goal.targetAmount} {goal.unit}
                        {goal.type === 'daily' && ' por dia'}
                        {goal.type === 'weekly' && ' por semana'}
                        {goal.type === 'chapter' && ' por capítulo'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progresso</span>
                      <span className={goal.completed ? 'text-green-600' : 'text-gray-900'}>
                        {goal.currentAmount} / {goal.targetAmount} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          goal.completed ? 'bg-green-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      min="0"
                      max={goal.targetAmount}
                    />
                    <span className="text-sm text-gray-600">{goal.unit}</span>
                    {goal.completed && (
                      <span className="text-green-600 text-sm font-medium">
                        ✅ Concluída!
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agenda Semanal */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span>📅</span>
              Agenda Semanal
            </h3>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Agendar
            </button>
          </div>

          {/* Schedule Form */}
          {showScheduleForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <form onSubmit={handleAddScheduleItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Atividade
                  </label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({...scheduleForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    {scheduleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                    placeholder="Ex: Leitura do Capítulo 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia da Semana
                    </label>
                    <select
                      value={scheduleForm.day}
                      onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      {weekDays.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm({...scheduleForm, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    min="15"
                    step="15"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleForm.reminder}
                      onChange={(e) => setScheduleForm({...scheduleForm, reminder: e.target.checked})}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700">Ativar lembrete</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleForm.recurring}
                      onChange={(e) => setScheduleForm({...scheduleForm, recurring: e.target.checked})}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700">Repetir semanalmente</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Agendar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Schedule List */}
          <div className="space-y-3">
            {scheduleItems.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-3 block">📅</span>
                <p className="text-gray-500">
                  Organize sua agenda de estudos!
                </p>
              </div>
            ) : (
              weekDays.map(day => {
                const dayItems = scheduleItems.filter(item => item.day === day.value);
                if (dayItems.length === 0) return null;

                return (
                  <div key={day.value}>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      {day.label}
                    </h4>
                    <div className="space-y-2 mb-4">
                      {dayItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-600">
                              {item.time} • {item.duration} min • {getTypeLabel(item.type)}
                              {item.reminder && ' • 🔔 Lembrete'}
                              {item.recurring && ' • 🔁 Semanal'}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteScheduleItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Dicas para uma Agenda Eficaz
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Seja realista:</strong> Comece com metas pequenas e vá aumentando gradualmente</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Consistência:</strong> É melhor 15 minutos todo dia do que 2 horas uma vez na semana</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Horário fixo:</strong> Escolha um horário que funcione para sua rotina</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Ambiente:</strong> Crie um espaço dedicado para seus estudos</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Flexibilidade:</strong> Ajuste sua agenda conforme necessário</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span><strong>Celebre:</strong> Reconheça seus progressos, mesmo os pequenos</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;