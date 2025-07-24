import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Meeting {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  date: Date;
  duration: string;
  facilitator: string;
  meetingUrl?: string;
  recordingUrl?: string;
  maxParticipants: number;
  enrolledCount: number;
  status: 'upcoming' | 'live' | 'finished';
  topics: string[];
}

interface Recording {
  id: string;
  meetingId: string;
  title: string;
  date: Date;
  duration: string;
  thumbnail: string;
  url: string;
  views: number;
}

interface Comment {
  id: string;
  meetingId: string;
  author: string;
  content: string;
  createdAt: Date;
  likes: number;
}

interface Question {
  id: string;
  meetingId: string;
  author: string;
  question: string;
  createdAt: Date;
  answered: boolean;
}

const EncontrosParticipativos: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [isEnrolled, setIsEnrolled] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recordings'>('upcoming');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showQuestions, setShowQuestions] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');

  // Dados simulados dos encontros
  const meetings: Meeting[] = [
    {
      id: '1',
      chapterId: '1',
      title: 'Despertando a Mulher Selvagem Interior',
      description: 'Vamos explorar juntas os conceitos iniciais do livro e compartilhar nossas primeiras impressões sobre o despertar da mulher selvagem.',
      date: new Date('2024-03-25T19:00:00'),
      duration: '90 min',
      facilitator: 'Manu Xavier',
      meetingUrl: 'https://zoom.us/j/123456789',
      maxParticipants: 30,
      enrolledCount: 24,
      status: 'upcoming',
      topics: ['Introdução ao arquétipo', 'Primeiras impressões', 'Compartilhamento de experiências']
    },
    {
      id: '2',
      chapterId: '2',
      title: 'La Loba: Coletando os Ossos',
      description: 'Discussão profunda sobre o arquétipo de La Loba e como podemos aplicar seus ensinamentos em nossa jornada de reconstrução pessoal.',
      date: new Date('2024-04-01T19:00:00'),
      duration: '90 min',
      facilitator: 'Carolina Luz',
      maxParticipants: 30,
      enrolledCount: 18,
      status: 'upcoming',
      topics: ['O arquétipo de La Loba', 'Processo de coleta', 'Rituais pessoais']
    },
    {
      id: '3',
      chapterId: '1',
      title: 'Encontro de Abertura - Capítulo 1',
      description: 'Nosso primeiro encontro para discutir as descobertas iniciais e criar conexões.',
      date: new Date('2024-03-10T19:00:00'),
      duration: '90 min',
      facilitator: 'Manu Xavier',
      recordingUrl: 'https://vimeo.com/123456789',
      maxParticipants: 30,
      enrolledCount: 28,
      status: 'finished',
      topics: ['Apresentações', 'Expectativas', 'Primeiras reflexões']
    }
  ];

  const recordings: Recording[] = [
    {
      id: 'rec1',
      meetingId: '3',
      title: 'Encontro de Abertura - Capítulo 1',
      date: new Date('2024-03-10T19:00:00'),
      duration: '1h 28min',
      thumbnail: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=225&fit=crop',
      url: 'https://vimeo.com/123456789',
      views: 156
    },
    {
      id: 'rec2',
      meetingId: '4',
      title: 'Explorando Nossa Natureza Instintiva',
      date: new Date('2024-03-03T19:00:00'),
      duration: '1h 35min',
      thumbnail: 'https://images.unsplash.com/photo-1609234656388-0ff363383899?w=400&h=225&fit=crop',
      url: 'https://vimeo.com/987654321',
      views: 203
    }
  ];

  const comments: Comment[] = [
    {
      id: 'c1',
      meetingId: '3',
      author: 'Ana Silva',
      content: 'Encontro maravilhoso! A troca foi muito rica e me senti muito acolhida.',
      createdAt: new Date('2024-03-10T21:00:00'),
      likes: 12
    },
    {
      id: 'c2',
      meetingId: '3',
      author: 'Beatriz Costa',
      content: 'Adorei as reflexões sobre o primeiro capítulo. Já estou ansiosa pelo próximo encontro!',
      createdAt: new Date('2024-03-10T21:30:00'),
      likes: 8
    }
  ];

  const questions: Question[] = [
    {
      id: 'q1',
      meetingId: '1',
      author: 'Maria Santos',
      question: 'Como podemos identificar quando estamos reprimindo nossa natureza selvagem no dia a dia?',
      createdAt: new Date('2024-03-20T10:30:00'),
      answered: false
    },
    {
      id: 'q2',
      meetingId: '1',
      author: 'Julia Oliveira',
      question: 'Existe alguma diferença entre intuição feminina e masculina segundo o livro?',
      createdAt: new Date('2024-03-21T14:20:00'),
      answered: false
    }
  ];

  // Filtrar encontros e gravações do capítulo atual
  const chapterMeetings = meetings.filter(m => m.chapterId === chapterId);
  const upcomingMeetings = chapterMeetings.filter(m => m.status === 'upcoming' || m.status === 'live');
  const pastMeetings = chapterMeetings.filter(m => m.status === 'finished');

  // Carregar estado de inscrição do localStorage
  useEffect(() => {
    const enrollments = localStorage.getItem('meeting_enrollments');
    if (enrollments) {
      setIsEnrolled(JSON.parse(enrollments));
    }
  }, []);

  const handleEnroll = (meetingId: string) => {
    const newEnrollments = { ...isEnrolled, [meetingId]: !isEnrolled[meetingId] };
    setIsEnrolled(newEnrollments);
    localStorage.setItem('meeting_enrollments', JSON.stringify(newEnrollments));
  };

  const handleAddComment = (meetingId: string) => {
    if (newComment.trim()) {
      console.log('Novo comentário:', { meetingId, content: newComment });
      setNewComment('');
    }
  };

  const handleAddQuestion = (meetingId: string) => {
    if (newQuestion.trim()) {
      console.log('Nova pergunta:', { meetingId, question: newQuestion });
      setNewQuestion('');
      setShowQuestions(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMeetingStatus = (meeting: Meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.date);
    const endTime = new Date(meetingDate.getTime() + 90 * 60000); // 90 minutos

    if (now >= meetingDate && now <= endTime) return 'live';
    if (now > endTime) return 'finished';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          💬 Encontros Participativos
        </h1>
        <p className="text-gray-700">
          Momentos de conexão ao vivo para aprofundar as reflexões do capítulo e 
          compartilhar experiências com outras participantes da jornada.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-terracota border-b-2 border-terracota'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Próximos Encontros
              {upcomingMeetings.length > 0 && (
                <span className="ml-2 bg-terracota text-white text-xs px-2 py-1 rounded-full">
                  {upcomingMeetings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'recordings'
                  ? 'text-terracota border-b-2 border-terracota'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎥 Gravações Anteriores
              {recordings.length > 0 && (
                <span className="ml-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                  {recordings.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upcoming' ? (
            <div className="space-y-6">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => {
                  const status = getMeetingStatus(meeting);
                  const isLive = status === 'live';
                  const enrolled = isEnrolled[meeting.id];

                  return (
                    <div key={meeting.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Meeting Header */}
                      <div className={`p-6 ${isLive ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {meeting.title}
                              </h3>
                              {isLive && (
                                <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                                  🔴 AO VIVO
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-4">
                              {meeting.description}
                            </p>
                            
                            {/* Meeting Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                📅 {formatDate(meeting.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                ⏱️ {meeting.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                👩‍🏫 {meeting.facilitator}
                              </span>
                              <span className="flex items-center gap-1">
                                👥 {meeting.enrolledCount}/{meeting.maxParticipants} inscritas
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Tópicos do encontro:</h4>
                          <div className="flex flex-wrap gap-2">
                            {meeting.topics.map((topic, index) => (
                              <span key={index} className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                          {isLive && enrolled ? (
                            <a
                              href={meeting.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-red-600 text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                              🎥 Entrar na Sala
                            </a>
                          ) : (
                            <button
                              onClick={() => handleEnroll(meeting.id)}
                              disabled={meeting.enrolledCount >= meeting.maxParticipants && !enrolled}
                              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                                enrolled
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : meeting.enrolledCount >= meeting.maxParticipants
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-terracota text-white hover:bg-marrom-escuro'
                              }`}
                            >
                              {enrolled ? '✅ Inscrita' : 
                               meeting.enrolledCount >= meeting.maxParticipants ? '❌ Lotado' : 
                               '📝 Inscrever-se'}
                            </button>
                          )}
                          
                          {enrolled && !isLive && meeting.meetingUrl && (
                            <button
                              onClick={() => navigator.clipboard.writeText(meeting.meetingUrl!)}
                              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Copiar link da reunião"
                            >
                              📋
                            </button>
                          )}
                          
                          {enrolled && !isLive && (
                            <button
                              onClick={() => setShowQuestions(meeting.id)}
                              className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                              title="Enviar pergunta para o encontro"
                            >
                              ❓
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Enrolled Badge */}
                      {enrolled && (
                        <div className="bg-green-50 px-6 py-3 border-t border-gray-200">
                          <p className="text-sm text-green-700">
                            ✅ Você está inscrita! {!isLive && 'Adicionamos um lembrete no seu calendário.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum encontro agendado para este capítulo no momento.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {recordings.length > 0 ? (
                recordings.map((recording) => (
                  <div key={recording.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="md:w-1/3 aspect-video bg-gray-200">
                        <img
                          src={recording.thumbnail}
                          alt={recording.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Recording Info */}
                      <div className="flex-1 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {recording.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span>📅 {recording.date.toLocaleDateString('pt-BR')}</span>
                          <span>⏱️ {recording.duration}</span>
                          <span>👁️ {recording.views} visualizações</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <a
                            href={recording.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-terracota text-white px-6 py-2 rounded-lg font-medium hover:bg-marrom-escuro transition-colors"
                          >
                            ▶️ Assistir Gravação
                          </a>
                          <button
                            onClick={() => setSelectedMeeting(recording.meetingId)}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                          >
                            💬 Ver Comentários
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma gravação disponível para este capítulo ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {selectedMeeting && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              💬 Comentários do Encontro
            </h3>
            <button
              onClick={() => setSelectedMeeting(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Comment Form */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Compartilhe suas reflexões sobre o encontro..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
            />
            <button
              onClick={() => handleAddComment(selectedMeeting)}
              disabled={!newComment.trim()}
              className="mt-3 bg-terracota text-white px-6 py-2 rounded-lg font-medium hover:bg-marrom-escuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publicar Comentário
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments
              .filter(c => c.meetingId === selectedMeeting)
              .map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {comment.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <button className="text-gray-500 hover:text-terracota text-sm">
                      ❤️ {comment.likes}
                    </button>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pre-meeting Questions Section */}
      {showQuestions && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              ❓ Perguntas para o Encontro
            </h3>
            <button
              onClick={() => setShowQuestions(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Envie suas perguntas antecipadamente para que possamos abordar durante o encontro.
            </p>
            
            {/* Question Form */}
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Qual sua pergunta sobre o capítulo ou tema do encontro?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <button
              onClick={() => handleAddQuestion(showQuestions)}
              disabled={!newQuestion.trim()}
              className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Pergunta
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <span>📝</span>
              Perguntas já enviadas:
            </h4>
            {questions
              .filter(q => q.meetingId === showQuestions)
              .map((question) => (
                <div key={question.id} className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{question.author}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {question.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      question.answered 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {question.answered ? '✅ Respondida' : '⏳ Pendente'}
                    </span>
                  </div>
                  <p className="text-gray-700">{question.question}</p>
                </div>
              ))}
            
            {questions.filter(q => q.meetingId === showQuestions).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhuma pergunta enviada ainda. Seja a primeira!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-yellow-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          Dicas para aproveitar os encontros:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Prepare-se lendo o capítulo e fazendo os exercícios antes</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Tenha seu livro e anotações por perto durante o encontro</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Participe ativamente - sua voz é importante!</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Respeite as experiências e o tempo de fala das outras participantes</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Use o botão ❓ para enviar perguntas antecipadamente</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EncontrosParticipativos;