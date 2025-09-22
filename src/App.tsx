import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Brain, MessageCircle, Volume2, RotateCcw, 
  Check, X, Eye, EyeOff, Target, ChevronLeft, 
  ChevronRight, Star, Lock, Unlock, Mic, MicOff, 
  Globe, Flame, Trophy
} from 'lucide-react';

// TypeScript Interfaces
interface Vocabulary {
  id: number;
  english: string;
  spanish: string;
  pronunciation: string;
  example: string;
  translation: string;
}

interface GrammarRule {
  concept: string;
  usage: string;
  example: string;
}

interface Grammar {
  title: string;
  explanation: string;
  rules: GrammarRule[];
}

interface DialogueLine {
  speaker: string;
  spanish: string;
  english: string;
  blank: string;
  options: string[];
}

interface Dialogue {
  title: string;
  scenario: string;
  lines: DialogueLine[];
}

interface Lesson {
  id: number;
  title: string;
  vocabulary: Vocabulary[];
  grammar: Grammar;
  dialogue: Dialogue;
}

interface Level {
  title: string;
  color: string;
  lessons: Lesson[];
}

interface UserProgress {
  completedLessons: number[];
  vocabularyMastered: number[];
  grammarCompleted: number[];
  xpPoints: number;
  currentStreak: number;
  lastPracticeDate: string | null;
  spokenWords: string[];
  dialoguesCompleted: string[];
}

interface FlashcardState {
  currentIndex: number;
  isFlipped: boolean;
  showPronunciation: boolean;
}

interface DialogueState {
  currentLineIndex: number;
  userAnswers: Record<number, string>;
  showTranslations: boolean;
  completedBlanks: Record<number, { answer: string; isCorrect: boolean }>;
}

// Enhanced Data Structure
const LESSON_STRUCTURE: Record<string, Level> = {
  beginner: {
    title: "Beginner",
    color: "from-green-400 to-blue-500",
    lessons: [
      {
        id: 1,
        title: "Greetings & Introductions",
        vocabulary: [
          { id: 1, english: 'Hello', spanish: 'Hola', pronunciation: 'OH-lah', example: 'Hola, ¿cómo estás?', translation: 'Hello, how are you?' },
          { id: 2, english: 'Goodbye', spanish: 'Adiós', pronunciation: 'ah-DYOHS', example: 'Adiós, hasta mañana', translation: 'Goodbye, see you tomorrow' },
          { id: 3, english: 'Please', spanish: 'Por favor', pronunciation: 'por fah-VOR', example: 'Una mesa, por favor', translation: 'A table, please' },
          { id: 4, english: 'Thank you', spanish: 'Gracias', pronunciation: 'GRAH-thyahs', example: 'Muchas gracias', translation: 'Thank you very much' },
          { id: 5, english: 'My name is', spanish: 'Me llamo', pronunciation: 'meh YAH-mo', example: 'Me llamo María', translation: 'My name is María' },
        ],
        grammar: {
          title: "Present Tense: Ser vs Estar",
          explanation: "Both 'ser' and 'estar' mean 'to be', but they're used differently.",
          rules: [
            { concept: "Ser", usage: "Permanent characteristics", example: "Soy doctora (I am a doctor)" },
            { concept: "Estar", usage: "Temporary states/locations", example: "Estoy cansado (I am tired)" }
          ]
        },
        dialogue: {
          title: "Meeting Someone New",
          scenario: "At a coffee shop",
          lines: [
            { speaker: "Ana", spanish: "¡Hola! _____ Ana. ¿Cómo te llamas?", english: "Hello! I'm Ana. What's your name?", blank: "Soy", options: ["Soy", "Estoy", "Tengo"] },
            { speaker: "Carlos", spanish: "Mucho gusto, Ana. Me _____ Carlos.", english: "Nice to meet you, Ana. My name is Carlos.", blank: "llamo", options: ["llamo", "digo", "hablo"] },
            { speaker: "Ana", spanish: "¿De dónde _____ tú?", english: "Where are you from?", blank: "eres", options: ["eres", "estás", "tienes"] },
            { speaker: "Carlos", spanish: "_____ de México. ¿Y tú?", english: "I'm from Mexico. And you?", blank: "Soy", options: ["Soy", "Estoy", "Voy"] },
          ]
        }
      },
      {
        id: 2,
        title: "Numbers & Time",
        vocabulary: [
          { id: 6, english: 'One', spanish: 'Uno', pronunciation: 'OO-no', example: 'Un café, por favor', translation: 'One coffee, please' },
          { id: 7, english: 'Two', spanish: 'Dos', pronunciation: 'dohs', example: 'Dos personas', translation: 'Two people' },
          { id: 8, english: 'What time is it?', spanish: '¿Qué hora es?', pronunciation: 'keh OH-rah ehs', example: '¿Qué hora es? Son las tres', translation: 'What time is it? It\'s three o\'clock' },
          { id: 9, english: 'Morning', spanish: 'Mañana', pronunciation: 'mah-NYAH-nah', example: 'Buenos días, buenas mañana', translation: 'Good morning' },
          { id: 10, english: 'Night', spanish: 'Noche', pronunciation: 'NOH-cheh', example: 'Buenas noches', translation: 'Good night' },
        ],
        grammar: {
          title: "Numbers 1-20",
          explanation: "Learn to count and tell time in Spanish",
          rules: [
            { concept: "1-10", usage: "uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez", example: "Tengo cinco libros" },
            { concept: "Time", usage: "Es la una (1:00) / Son las dos (2:00+)", example: "Son las tres y media (3:30)" }
          ]
        },
        dialogue: {
          title: "Making Plans",
          scenario: "Arranging to meet",
          lines: [
            { speaker: "Luis", spanish: "¿A qué _____ nos vemos?", english: "What time shall we meet?", blank: "hora", options: ["hora", "tiempo", "día"] },
            { speaker: "Carmen", spanish: "¿Qué te parece a las _____?", english: "How about at seven?", blank: "siete", options: ["siete", "seis", "ocho"] },
            { speaker: "Luis", spanish: "Perfecto. _____ las siete en el café.", english: "Perfect. At seven at the café.", blank: "A", options: ["A", "En", "Por"] },
          ]
        }
      }
    ]
  },
  intermediate: {
    title: "Intermediate",
    color: "from-yellow-400 to-orange-500",
    lessons: [
      {
        id: 3,
        title: "Restaurant & Food",
        vocabulary: [
          { id: 11, english: 'Menu', spanish: 'Menú', pronunciation: 'meh-NOO', example: '¿Puedo ver el menú?', translation: 'May I see the menu?' },
          { id: 12, english: 'Water', spanish: 'Agua', pronunciation: 'AH-gwah', example: 'Un vaso de agua, por favor', translation: 'A glass of water, please' },
          { id: 13, english: 'Bill/Check', spanish: 'Cuenta', pronunciation: 'KWEN-tah', example: 'La cuenta, por favor', translation: 'The check, please' },
          { id: 14, english: 'Delicious', spanish: 'Delicioso', pronunciation: 'deh-lee-SYOH-so', example: 'La comida está deliciosa', translation: 'The food is delicious' },
          { id: 15, english: 'I would like', spanish: 'Me gustaría', pronunciation: 'meh goos-tah-REE-ah', example: 'Me gustaría una pizza', translation: 'I would like a pizza' },
        ],
        grammar: {
          title: "Conditional Tense - Polite Requests",
          explanation: "Use 'gustaría' and 'podría' to make polite requests",
          rules: [
            { concept: "Me gustaría", usage: "I would like (polite)", example: "Me gustaría un café" },
            { concept: "¿Podría...?", usage: "Could you...? (very polite)", example: "¿Podría traer la cuenta?" }
          ]
        },
        dialogue: {
          title: "At the Restaurant",
          scenario: "Ordering dinner",
          lines: [
            { speaker: "Waiter", spanish: "Buenas noches. ¿Qué _____ ordenar?", english: "Good evening. What would you like to order?", blank: "desean", options: ["desean", "quieren", "necesitan"] },
            { speaker: "Customer", spanish: "_____ una paella para dos, por favor.", english: "We would like a paella for two, please.", blank: "Queremos", options: ["Queremos", "Tenemos", "Somos"] },
            { speaker: "Waiter", spanish: "Excelente elección. ¿Y para _____?", english: "Excellent choice. And to drink?", blank: "beber", options: ["beber", "comer", "pagar"] },
          ]
        }
      }
    ]
  }
};

const CULTURAL_FACTS = [
  {
    id: 1,
    title: 'La Siesta',
    content: 'In Spain, many businesses close from 2-5 PM for siesta - a traditional afternoon rest period that helps people recharge!',
    emoji: '😴',
    country: 'Spain'
  },
  {
    id: 2,
    title: 'Día de los Muertos',
    content: 'Day of the Dead in Mexico is a joyful celebration honoring deceased loved ones with colorful altars, marigolds, and special foods.',
    emoji: '💀',
    country: 'Mexico'
  },
  {
    id: 3,
    title: 'Tapas Culture',
    content: 'In Spain, tapas are small dishes shared with friends. It\'s about socializing and enjoying food together, not just eating!',
    emoji: '🍤',
    country: 'Spain'
  }
];

const EnhancedSpanishLearningApp = () => {
  // Core State
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentActivity, setCurrentActivity] = useState<string>('overview');
  
  // User Progress State  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    vocabularyMastered: [],
    grammarCompleted: [],
    xpPoints: 0,
    currentStreak: 0,
    lastPracticeDate: null,
    spokenWords: [],
    dialoguesCompleted: []
  });
  
  // Activity States
  const [flashcardState, setFlashcardState] = useState<FlashcardState>({
    currentIndex: 0,
    isFlipped: false,
    showPronunciation: false
  });
  
  const [dialogueState, setDialogueState] = useState<DialogueState>({
    currentLineIndex: 0,
    userAnswers: {},
    showTranslations: false,
    completedBlanks: {}
  });

  // Audio & Recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load user progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('spanishLearningProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    updateStreak();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('spanishLearningProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastDate = userProgress.lastPracticeDate;
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        setUserProgress(prev => ({
          ...prev,
          currentStreak: prev.currentStreak + 1,
          lastPracticeDate: today
        }));
      } else if (lastDate !== today) {
        setUserProgress(prev => ({
          ...prev,
          currentStreak: 1,
          lastPracticeDate: today
        }));
      }
    }
  };

  const addXP = (amount: number) => {
    setUserProgress(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + amount
    }));
  };

  const markVocabularyMastered = (wordId: number) => {
    setUserProgress(prev => ({
      ...prev,
      vocabularyMastered: [...new Set([...prev.vocabularyMastered, wordId])]
    }));
    addXP(10);
  };

  // Text-to-Speech
  const speakText = (text: string, lang: string = 'es-ES') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
  };

  // Dashboard Component
  const Dashboard = () => {
    const totalLessons = Object.values(LESSON_STRUCTURE).reduce((acc, level) => acc + level.lessons.length, 0);
    const completedPercentage = (userProgress.completedLessons.length / totalLessons) * 100;
    const totalVocabulary = Object.values(LESSON_STRUCTURE).reduce((acc, level) => 
      acc + level.lessons.reduce((vocabAcc, lesson) => vocabAcc + lesson.vocabulary.length, 0), 0
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl">
              <span className="text-4xl">🇪🇸</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              ¡Bienvenido!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2">Your Spanish Learning Journey</p>
            <p className="text-lg text-gray-400">Master Spanish with interactive lessons, cultural insights, and AI-powered practice</p>
          </div>

          {/* Stats Overview - Enhanced Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{userProgress.xpPoints}</span>
              </div>
              <p className="text-gray-300 font-medium text-lg">XP Points</p>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{userProgress.currentStreak}</span>
              </div>
              <p className="text-gray-300 font-medium text-lg">Day Streak</p>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{userProgress.completedLessons.length}</span>
              </div>
              <p className="text-gray-300 font-medium text-lg">Lessons Done</p>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">{userProgress.vocabularyMastered.length}</span>
              </div>
              <p className="text-gray-300 font-medium text-lg">Words Mastered</p>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Overall Progress - Enhanced */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Star className="w-6 h-6 text-white" />
                </div>
                Overall Progress
              </h3>
              <span className="text-2xl font-bold text-white">{Math.round(completedPercentage)}%</span>
            </div>
            
            <div className="relative w-full bg-gray-700/50 rounded-full h-6 mb-6 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${completedPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{userProgress.vocabularyMastered.length}/{totalVocabulary}</p>
                <p className="text-gray-300">Words Learned</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{userProgress.completedLessons.length}/{totalLessons}</p>
                <p className="text-gray-300">Lessons Completed</p>
              </div>
            </div>
          </div>

          {/* Lesson Levels - Enhanced Design */}
          {Object.entries(LESSON_STRUCTURE).map(([level, levelData]) => (
            <div key={level} className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-4 bg-gradient-to-r ${levelData.color} rounded-2xl shadow-lg`}>
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-4xl font-bold bg-gradient-to-r ${levelData.color} bg-clip-text text-transparent`}>
                  {levelData.title} Level
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {levelData.lessons.map((lesson, index) => {
                  const isCompleted = userProgress.completedLessons.includes(lesson.id);
                  const isLocked = index > 0 && !userProgress.completedLessons.includes(levelData.lessons[index - 1].id);
                  
                  return (
                    <div
                      key={lesson.id}
                      className={`group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/20'}
                        ${isCompleted ? 'ring-2 ring-green-400 bg-green-500/10' : ''}`}
                      onClick={() => !isLocked && setCurrentLesson(lesson)}
                    >
                      {/* Status Badge */}
                      <div className="absolute -top-3 -right-3">
                        {isLocked ? (
                          <div className="p-2 bg-gray-600 rounded-full shadow-lg">
                            <Lock className="w-6 h-6 text-white" />
                          </div>
                        ) : isCompleted ? (
                          <div className="p-2 bg-green-500 rounded-full shadow-lg">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <div className="p-2 bg-blue-500 rounded-full shadow-lg">
                            <Unlock className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${levelData.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
                        {lesson.title}
                      </h3>
                      
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-blue-500/20 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="font-medium">{lesson.vocabulary.length} new words</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-green-500/20 rounded-lg">
                            <Brain className="w-5 h-5 text-green-400" />
                          </div>
                          <span className="font-medium">{lesson.grammar.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-purple-500/20 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="font-medium">{lesson.dialogue.title}</span>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-2 shadow-lg">
                          <Star className="w-5 h-5" />
                        </div>
                      )}

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Cultural Corner - Enhanced */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Cultural Corner</h3>
              <p className="text-gray-300">Discover the rich culture behind the Spanish language</p>
            </div>
            <CulturalFactCard />
          </div>
        </div>
      </div>
    );
  };

  // Cultural Fact Card
  const CulturalFactCard = () => {
    const [currentFact] = useState(CULTURAL_FACTS[Math.floor(Math.random() * CULTURAL_FACTS.length)]);
    
    return (
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-8xl mb-6 drop-shadow-lg">{currentFact.emoji}</div>
        <h4 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
          {currentFact.title}
        </h4>
        <p className="text-xl text-gray-300 mb-6 leading-relaxed">{currentFact.content}</p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 text-purple-200 px-6 py-3 rounded-full font-medium text-lg">
          <Globe className="w-5 h-5" />
          {currentFact.country}
        </div>
      </div>
    );
  };

  // Vocabulary Flashcards Component
  const VocabularyFlashcards = ({ lesson }: { lesson: Lesson }) => {
    const currentWord = lesson.vocabulary[flashcardState.currentIndex];

    const nextCard = () => {
      setFlashcardState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % lesson.vocabulary.length,
        isFlipped: false,
        showPronunciation: false
      }));
    };

    const prevCard = () => {
      setFlashcardState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex - 1 + lesson.vocabulary.length) % lesson.vocabulary.length,
        isFlipped: false,
        showPronunciation: false
      }));
    };

    const handleMastered = (mastered: boolean) => {
      if (mastered) {
        markVocabularyMastered(currentWord.id);
      }
      nextCard();
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentActivity('overview')}
              className="bg-white text-blue-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Vocabulary Practice</h1>
            <div className="bg-white px-4 py-2 rounded-full text-blue-500 font-semibold">
              {flashcardState.currentIndex + 1} / {lesson.vocabulary.length}
            </div>
          </div>

          {/* Flashcard */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 min-h-96 flex flex-col justify-center items-center">
            <div className="text-center w-full">
              {!flashcardState.isFlipped ? (
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentWord.english}</h2>
                  <button
                    onClick={() => setFlashcardState(prev => ({ ...prev, isFlipped: true }))}
                    className="bg-blue-500 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-colors text-lg"
                  >
                    Show Spanish
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-4xl font-bold text-blue-600 mb-2">{currentWord.spanish}</h2>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <button
                      onClick={() => speakText(currentWord.spanish)}
                      className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setFlashcardState(prev => ({ ...prev, showPronunciation: !prev.showPronunciation }))}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      {flashcardState.showPronunciation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      Pronunciation
                    </button>
                  </div>
                  {flashcardState.showPronunciation && (
                    <p className="text-lg text-gray-600 mb-4 font-mono">[{currentWord.pronunciation}]</p>
                  )}
                  
                  {/* Example Sentence */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-lg text-blue-800 mb-2 font-semibold">{currentWord.example}</p>
                    <p className="text-gray-600 italic">{currentWord.translation}</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => handleMastered(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Need Practice
                    </button>
                    <button
                      onClick={() => handleMastered(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Mastered!
                    </button>
                  </div>

                  {/* Recording Practice */}
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Practice Speaking</h4>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isRecording ? 'Stop Recording' : 'Record Yourself'}
                      </button>
                      <audio ref={audioRef} controls className="hidden" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-1">
              {lesson.vocabulary.map((_: Vocabulary, index: number) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === flashcardState.currentIndex ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Interactive Dialogue Component
  const InteractiveDialogue = ({ lesson }: { lesson: Lesson }) => {
    const handleAnswerSelect = (lineIndex: number, answer: string) => {
      const isCorrect = answer === lesson.dialogue.lines[lineIndex].blank;
      
      setDialogueState(prev => ({
        ...prev,
        completedBlanks: {
          ...prev.completedBlanks,
          [lineIndex]: { answer, isCorrect }
        }
      }));

      if (isCorrect) {
        addXP(5);
      }

      // Auto-advance after a delay
      setTimeout(() => {
        if (lineIndex < lesson.dialogue.lines.length - 1) {
          setDialogueState(prev => ({
            ...prev,
            currentLineIndex: lineIndex + 1
          }));
        }
      }, 1500);
    };

    const resetDialogue = () => {
      setDialogueState({
        currentLineIndex: 0,
        userAnswers: {},
        showTranslations: false,
        completedBlanks: {}
      });
    };

    const allCompleted = Object.keys(dialogueState.completedBlanks).length === lesson.dialogue.lines.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentActivity('overview')}
              className="bg-white text-green-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{lesson.dialogue.title}</h1>
              <p className="text-green-100">{lesson.dialogue.scenario}</p>
            </div>
            <button
              onClick={() => setDialogueState(prev => ({ ...prev, showTranslations: !prev.showTranslations }))}
              className="bg-white text-green-500 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
            >
              {dialogueState.showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {dialogueState.showTranslations ? 'Hide' : 'Show'} English
            </button>
          </div>

          {/* Dialogue */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
            <div className="space-y-6">
              {lesson.dialogue.lines.map((line: DialogueLine, index: number) => {
                const isCompleted = dialogueState.completedBlanks[index];
                const isCurrent = index === dialogueState.currentLineIndex && !isCompleted;
                
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-blue-50 ml-0 mr-8' : 'bg-green-50 ml-8 mr-0'
                    } ${isCurrent ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-800 text-lg">{line.speaker}</h4>
                      <button
                        onClick={() => speakText(line.spanish.replace('_____', line.blank))}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Spanish Line with Blank */}
                    <div className="mb-3">
                      {line.spanish.split('_____').map((part: string, partIndex: number) => (
                        <span key={partIndex}>
                          {part}
                          {partIndex < line.spanish.split('_____').length - 1 && (
                            <span className="inline-block">
                              {isCompleted ? (
                                <span className={`px-3 py-1 rounded font-bold ${
                                  isCompleted.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}>
                                  {isCompleted.answer}
                                </span>
                              ) : isCurrent ? (
                                <span className="inline-block bg-yellow-200 px-3 py-1 rounded animate-pulse">
                                  _____
                                </span>
                              ) : (
                                <span className="inline-block bg-gray-200 px-3 py-1 rounded">
                                  _____
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Answer Options */}
                    {isCurrent && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {line.options.map((option: string, optionIndex: number) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(index, option)}
                            className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* English Translation */}
                    {dialogueState.showTranslations && (
                      <p className="text-gray-600 italic text-sm mt-2">{line.english}</p>
                    )}

                    {/* Feedback */}
                    {isCompleted && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                        isCompleted.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCompleted.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        <span className="font-medium">
                          {isCompleted.isCorrect ? '¡Correcto!' : `Incorrect. The answer was: ${line.blank}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {allCompleted && (
              <div className="text-center mt-8 p-6 bg-green-50 rounded-xl">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Excelente!</h3>
                <p className="text-gray-600 mb-4">You've completed the dialogue!</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetDialogue}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Practice Again
                  </button>
                  <button
                    onClick={() => {
                      setUserProgress(prev => ({
                        ...prev,
                        dialoguesCompleted: [...new Set([...prev.dialoguesCompleted, lesson.dialogue.title])]
                      }));
                      setCurrentActivity('overview');
                    }}
                    className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Grammar Component
  const GrammarLesson = ({ lesson }: { lesson: Lesson }) => {

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentActivity('overview')}
              className="bg-white text-purple-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">{lesson.grammar.title}</h1>
            <div className="bg-white px-4 py-2 rounded-full text-purple-500 font-semibold">
              Grammar
            </div>
          </div>

          {/* Grammar Content */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{lesson.grammar.title}</h2>
              <p className="text-xl text-gray-600">{lesson.grammar.explanation}</p>
            </div>

            {/* Grammar Rules */}
            <div className="space-y-6 mb-8">
              {lesson.grammar.rules.map((rule: GrammarRule, index: number) => (
                <div key={index} className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">{rule.concept}</h3>
                  <p className="text-gray-700 mb-3">{rule.usage}</p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-lg font-medium text-gray-800 italic">"{rule.example}"</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button
                onClick={() => {
                  setUserProgress(prev => ({
                    ...prev,
                    grammarCompleted: [...new Set([...prev.grammarCompleted, lesson.id])]
                  }));
                  addXP(25);
                  setCurrentActivity('overview');
                }}
                className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-colors text-lg font-medium"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Lesson Overview Component
  const LessonOverview = ({ lesson }: { lesson: Lesson }) => {
    const lessonProgress = {
      vocabulary: lesson.vocabulary.filter((word: Vocabulary) => 
        userProgress.vocabularyMastered.includes(word.id)
      ).length,
      dialogue: userProgress.dialoguesCompleted.includes(lesson.dialogue.title) ? 1 : 0,
      grammar: userProgress.grammarCompleted.includes(lesson.id) ? 1 : 0
    };
    
    const totalProgress = lessonProgress.vocabulary + lessonProgress.dialogue + lessonProgress.grammar;
    const maxProgress = lesson.vocabulary.length + 2;
    const progressPercentage = (totalProgress / maxProgress) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => setCurrentLesson(null)}
              className="group bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors" />
            </button>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-300 text-lg">Master this lesson step by step</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/20">
              <span className="text-lg font-bold text-white">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
          </div>

          {/* Progress Bar - Enhanced */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-12 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Lesson Progress
              </h3>
              <span className="text-xl font-bold text-white">{Math.round(progressPercentage)}%</span>
            </div>
            
            <div className="relative w-full bg-gray-700/50 rounded-full h-6 mb-8 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{lessonProgress.vocabulary}/{lesson.vocabulary.length}</p>
                </div>
                <p className="text-gray-300 font-medium">Vocabulary</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{lessonProgress.grammar}/1</p>
                </div>
                <p className="text-gray-300 font-medium">Grammar</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{lessonProgress.dialogue}/1</p>
                </div>
                <p className="text-gray-300 font-medium">Dialogue</p>
              </div>
            </div>
          </div>

          {/* Activity Cards - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => setCurrentActivity('vocabulary')}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">Vocabulary</h3>
                <p className="text-gray-300 mb-6 text-lg">Learn {lesson.vocabulary.length} new words with interactive flashcards</p>
                <div className="bg-blue-500/20 rounded-2xl px-6 py-3 border border-blue-400/30">
                  <span className="text-blue-200 font-medium text-lg">
                    {lessonProgress.vocabulary} mastered
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('grammar')}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">Grammar</h3>
                <p className="text-gray-300 mb-6 text-lg">{lesson.grammar.title}</p>
                <div className={`rounded-2xl px-6 py-3 border ${
                  lessonProgress.grammar 
                    ? 'bg-green-500/20 border-green-400/30' 
                    : 'bg-yellow-500/20 border-yellow-400/30'
                }`}>
                  <span className={`font-medium text-lg ${
                    lessonProgress.grammar ? 'text-green-200' : 'text-yellow-200'
                  }`}>
                    {lessonProgress.grammar ? 'Completed' : 'Start Learning'}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => setCurrentActivity('dialogue')}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">Dialogue</h3>
                <p className="text-gray-300 mb-6 text-lg">{lesson.dialogue.title}</p>
                <div className={`rounded-2xl px-6 py-3 border ${
                  lessonProgress.dialogue 
                    ? 'bg-purple-500/20 border-purple-400/30' 
                    : 'bg-pink-500/20 border-pink-400/30'
                }`}>
                  <span className={`font-medium text-lg ${
                    lessonProgress.dialogue ? 'text-purple-200' : 'text-pink-200'
                  }`}>
                    {lessonProgress.dialogue ? 'Completed' : 'Practice Now'}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  const renderContent = () => {
    if (currentLesson) {
      switch (currentActivity) {
        case 'vocabulary':
          return <VocabularyFlashcards lesson={currentLesson} />;
        case 'grammar':
          return <GrammarLesson lesson={currentLesson} />;
        case 'dialogue':
          return <InteractiveDialogue lesson={currentLesson} />;
        default:
          return <LessonOverview lesson={currentLesson} />;
      }
    }
    
    return <Dashboard />;
  };

  return (
    <div className="font-sans">
      {renderContent()}
    </div>
  );
};

export default EnhancedSpanishLearningApp;