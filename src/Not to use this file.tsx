import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, MessageCircle, TrendingUp, Home, Volume2, RotateCcw, Check, X, Play, Eye, EyeOff, Award, Calendar, Target, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

// Sample data
const SAMPLE_VOCABULARY = [
  { id: 1, english: 'Hello', spanish: 'Hola', pronunciation: 'OH-lah', category: 'greetings' },
  { id: 2, english: 'Goodbye', spanish: 'Adiós', pronunciation: 'ah-DYOHS', category: 'greetings' },
  { id: 3, english: 'Please', spanish: 'Por favor', pronunciation: 'por fah-VOR', category: 'basics' },
  { id: 4, english: 'Thank you', spanish: 'Gracias', pronunciation: 'GRAH-thyahs', category: 'basics' },
  { id: 5, english: 'Yes', spanish: 'Sí', pronunciation: 'see', category: 'basics' },
  { id: 6, english: 'No', spanish: 'No', pronunciation: 'noh', category: 'basics' },
  { id: 7, english: 'Water', spanish: 'Agua', pronunciation: 'AH-gwah', category: 'food' },
  { id: 8, english: 'Bread', spanish: 'Pan', pronunciation: 'pahn', category: 'food' },
  { id: 9, english: 'House', spanish: 'Casa', pronunciation: 'KAH-sah', category: 'home' },
  { id: 10, english: 'Family', spanish: 'Familia', pronunciation: 'fah-MEE-lyah', category: 'family' },
  { id: 11, english: 'Friend', spanish: 'Amigo', pronunciation: 'ah-MEE-goh', category: 'people' },
  { id: 12, english: 'Good morning', spanish: 'Buenos días', pronunciation: 'BWAY-nohs DEE-ahs', category: 'greetings' },
  { id: 13, english: 'Good night', spanish: 'Buenas noches', pronunciation: 'BWAY-nahs NOH-chehs', category: 'greetings' },
  { id: 14, english: 'How are you?', spanish: '¿Cómo estás?', pronunciation: 'KOH-moh ehs-TAHS', category: 'greetings' },
  { id: 15, english: 'I am fine', spanish: 'Estoy bien', pronunciation: 'ehs-TOY byen', category: 'feelings' },
];

const SAMPLE_DIALOGUES = [
  {
    id: 1,
    title: 'First Meeting',
    scene: 'Meeting someone new',
    dialogue: [
      { speaker: 'María', spanish: '¡Hola! ¿Cómo te llamas?', english: 'Hello! What\'s your name?' },
      { speaker: 'Juan', spanish: 'Me llamo Juan. ¿Y tú?', english: 'My name is Juan. And you?' },
      { speaker: 'María', spanish: 'Soy María. Mucho gusto.', english: 'I\'m María. Nice to meet you.' },
      { speaker: 'Juan', spanish: 'El gusto es mío.', english: 'The pleasure is mine.' },
    ]
  },
  {
    id: 2,
    title: 'At the Restaurant',
    scene: 'Ordering food',
    dialogue: [
      { speaker: 'Waiter', spanish: '¿Qué desea ordenar?', english: 'What would you like to order?' },
      { speaker: 'Customer', spanish: 'Quiero una pizza, por favor.', english: 'I want a pizza, please.' },
      { speaker: 'Waiter', spanish: '¿Y para beber?', english: 'And to drink?' },
      { speaker: 'Customer', spanish: 'Una agua, gracias.', english: 'A water, thank you.' },
    ]
  },
  {
    id: 3,
    title: 'Asking for Directions',
    scene: 'Getting around town',
    dialogue: [
      { speaker: 'Tourist', spanish: 'Disculpe, ¿dónde está el banco?', english: 'Excuse me, where is the bank?' },
      { speaker: 'Local', spanish: 'Está a dos cuadras de aquí.', english: 'It\'s two blocks from here.' },
      { speaker: 'Tourist', spanish: '¿A la derecha o a la izquierda?', english: 'To the right or to the left?' },
      { speaker: 'Local', spanish: 'A la derecha. No puede perderse.', english: 'To the right. You can\'t miss it.' },
    ]
  }
];

const CULTURAL_FACTS = [
  {
    id: 1,
    title: 'Siesta Time',
    content: 'In Spain, many businesses close from 2-5 PM for siesta - a traditional afternoon rest period!',
    emoji: '😴'
  },
  {
    id: 2,
    title: 'Spanish Pronunciation',
    content: 'Spanish is one of the most phonetic languages - it\'s pronounced almost exactly as it\'s written!',
    emoji: '🗣️'
  },
  {
    id: 3,
    title: 'Family Meals',
    content: 'In Spanish-speaking countries, lunch is often the largest meal of the day, eaten around 2-3 PM.',
    emoji: '🥘'
  }
];

const SpanishLearningApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState(0);
  const [lastPracticeDate, setLastPracticeDate] = useState(null);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('spanishProgress');
    const savedStreak = localStorage.getItem('spanishStreak');
    const savedLastDate = localStorage.getItem('lastPracticeDate');
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    if (savedLastDate) {
      setLastPracticeDate(savedLastDate);
    }
    
    updateStreak();
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    const last = localStorage.getItem('lastPracticeDate');
    
    if (last !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (last === yesterday.toDateString()) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('spanishStreak', newStreak.toString());
      } else if (last !== today) {
        setStreak(1);
        localStorage.setItem('spanishStreak', '1');
      }
      
      localStorage.setItem('lastPracticeDate', today);
      setLastPracticeDate(today);
    }
  };

  const markWordProgress = (wordId, remembered) => {
    const newProgress = { ...progress };
    if (!newProgress[wordId]) {
      newProgress[wordId] = { correct: 0, total: 0, lastReviewed: null };
    }
    
    newProgress[wordId].total += 1;
    if (remembered) {
      newProgress[wordId].correct += 1;
    }
    newProgress[wordId].lastReviewed = new Date().toISOString();
    
    setProgress(newProgress);
    localStorage.setItem('spanishProgress', JSON.stringify(newProgress));
    updateStreak();
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            ¡Hola Familia! 👨‍👩‍👧‍👦
          </h1>
          <p className="text-xl text-white drop-shadow-md">Let's learn Spanish together!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setCurrentPage('flashcards')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Flashcards</h2>
            <p className="text-gray-600">Practice vocabulary with interactive cards</p>
          </button>
          
          <button
            onClick={() => setCurrentPage('quizzes')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <Brain className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quizzes</h2>
            <p className="text-gray-600">Test your knowledge with fun quizzes</p>
          </button>
          
          <button
            onClick={() => setCurrentPage('dialogues')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dialogues</h2>
            <p className="text-gray-600">Learn with real conversations</p>
          </button>
          
          <button
            onClick={() => setCurrentPage('progress')}
            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <TrendingUp className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Progress</h2>
            <p className="text-gray-600">Track your learning journey</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">🌮 Cultural Corner</h3>
          <CulturalFact />
        </div>
      </div>
    </div>
  );

  const CulturalFact = () => {
    const [currentFact] = useState(CULTURAL_FACTS[Math.floor(Math.random() * CULTURAL_FACTS.length)]);
    
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">{currentFact.emoji}</div>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">{currentFact.title}</h4>
        <p className="text-gray-600">{currentFact.content}</p>
      </div>
    );
  };

  const FlashcardsPage = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showPronunciation, setShowPronunciation] = useState(false);

    const currentCard = SAMPLE_VOCABULARY[currentCardIndex];

    const nextCard = () => {
      setCurrentCardIndex((prev) => (prev + 1) % SAMPLE_VOCABULARY.length);
      setIsFlipped(false);
      setShowPronunciation(false);
    };

    const prevCard = () => {
      setCurrentCardIndex((prev) => (prev - 1 + SAMPLE_VOCABULARY.length) % SAMPLE_VOCABULARY.length);
      setIsFlipped(false);
      setShowPronunciation(false);
    };

    const skipCard = () => {
      nextCard(); // Just move to next without recording progress
    };

    const handleRemembered = (remembered) => {
      markWordProgress(currentCard.id, remembered);
      nextCard();
    };

    const speakWord = (text) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-white text-blue-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Flashcards</h1>
            <div className="bg-white px-4 py-2 rounded-full text-blue-500 font-semibold">
              {currentCardIndex + 1} / {SAMPLE_VOCABULARY.length}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 min-h-96 flex flex-col justify-center items-center">
            <div className="text-center">
              {!isFlipped ? (
                <div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentCard.english}</h2>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Show Spanish
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-4xl font-bold text-blue-600 mb-2">{currentCard.spanish}</h2>
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <button
                      onClick={() => speakWord(currentCard.spanish)}
                      className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowPronunciation(!showPronunciation)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      {showPronunciation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      Pronunciation
                    </button>
                  </div>
                  {showPronunciation && (
                    <p className="text-lg text-gray-600 mb-4 font-mono">[{currentCard.pronunciation}]</p>
                  )}
                  <p className="text-xl text-gray-700 mb-6">"{currentCard.english}"</p>
                  
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => handleRemembered(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Review Again
                    </button>
                    <button
                      onClick={skipCard}
                      className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <SkipForward className="w-5 h-5" />
                      Skip
                    </button>
                    <button
                      onClick={() => handleRemembered(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Remembered!
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="hidden sm:block">Previous</span>
            </button>
            
            <div className="text-center">
              <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                <p className="text-sm text-gray-600 mb-1">Category: <span className="capitalize font-semibold">{currentCard.category}</span></p>
                <div className="flex justify-center gap-1">
                  {SAMPLE_VOCABULARY.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentCardIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={nextCard}
              className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const QuizzesPage = () => {
    const [quizWords, setQuizWords] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizType, setQuizType] = useState('multiple');

    useEffect(() => {
      startNewQuiz();
    }, []);

    const startNewQuiz = () => {
      const shuffled = [...SAMPLE_VOCABULARY].sort(() => Math.random() - 0.5).slice(0, 5);
      setQuizWords(shuffled);
      setCurrentQuestion(0);
      setUserAnswer('');
      setShowResult(false);
      setScore(0);
    };

    const checkAnswer = () => {
      const correct = userAnswer.toLowerCase().trim() === quizWords[currentQuestion].spanish.toLowerCase();
      if (correct) {
        setScore(score + 1);
        markWordProgress(quizWords[currentQuestion].id, true);
      } else {
        markWordProgress(quizWords[currentQuestion].id, false);
      }
      setShowResult(true);
    };

    const nextQuestion = () => {
      if (currentQuestion < quizWords.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        setCurrentQuestion(-1);
      }
    };

    const MultipleChoiceQuestion = () => {
      const currentWord = quizWords[currentQuestion];
      const wrongAnswers = SAMPLE_VOCABULARY
        .filter(w => w.id !== currentWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.spanish);
      
      const allAnswers = [...wrongAnswers, currentWord.spanish].sort(() => Math.random() - 0.5);

      return (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">What is "{currentWord.english}" in Spanish?</h3>
          <div className="grid grid-cols-1 gap-4">
            {allAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserAnswer(answer);
                  setTimeout(checkAnswer, 100);
                }}
                className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 transition-colors text-lg"
                disabled={showResult}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      );
    };

    if (quizWords.length === 0) return <div>Loading...</div>;

    if (currentQuestion === -1) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-6">You scored {score} out of {quizWords.length}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startNewQuiz}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-white text-green-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Quiz</h1>
            <div className="bg-white px-4 py-2 rounded-full text-green-500 font-semibold">
              {currentQuestion + 1} / {quizWords.length}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {quizType === 'multiple' ? (
              <MultipleChoiceQuestion />
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Type "{quizWords[currentQuestion].english}" in Spanish
                </h3>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-4 text-xl border-2 border-gray-200 rounded-lg mb-4 focus:border-blue-500 outline-none"
                  placeholder="Type your answer..."
                  disabled={showResult}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
                {!showResult && (
                  <button
                    onClick={checkAnswer}
                    className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors text-xl"
                  >
                    Check Answer
                  </button>
                )}
              </div>
            )}

            {showResult && (
              <div className="mt-6 text-center">
                {userAnswer.toLowerCase() === quizWords[currentQuestion].spanish.toLowerCase() ? (
                  <div className="text-green-500">
                    <Check className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-xl font-bold">Correct!</p>
                  </div>
                ) : (
                  <div className="text-red-500">
                    <X className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-xl font-bold">
                      Incorrect. The answer was: {quizWords[currentQuestion].spanish}
                    </p>
                  </div>
                )}
                <button
                  onClick={nextQuestion}
                  className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                >
                  {currentQuestion < quizWords.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DialoguesPage = () => {
    const [selectedDialogue, setSelectedDialogue] = useState(null);
    const [showTranslations, setShowTranslations] = useState(false);

    const speakLine = (text) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
      }
    };

    if (selectedDialogue) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setSelectedDialogue(null)}
                className="bg-white text-purple-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Home className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">{selectedDialogue.title}</h1>
              <button
                onClick={() => setShowTranslations(!showTranslations)}
                className="bg-white text-purple-500 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showTranslations ? 'Hide' : 'Show'} English
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6">
              <p className="text-lg text-gray-600 text-center mb-6">{selectedDialogue.scene}</p>
              <div className="space-y-4">
                {selectedDialogue.dialogue.map((line, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      index % 2 === 0 ? 'bg-blue-50 ml-0 mr-8' : 'bg-green-50 ml-8 mr-0'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{line.speaker}</h4>
                      <button
                        onClick={() => speakLine(line.spanish)}
                        className="text-purple-500 hover:text-purple-700 transition-colors"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-lg text-gray-800 mb-1">{line.spanish}</p>
                    {showTranslations && (
                      <p className="text-sm text-gray-600 italic">{line.english}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  selectedDialogue.dialogue.forEach((line, index) => {
                    setTimeout(() => speakLine(line.spanish), index * 3000);
                  });
                }}
                className="bg-white text-purple-500 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Play Entire Dialogue
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-white text-purple-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Dialogues</h1>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_DIALOGUES.map((dialogue) => (
              <button
                key={dialogue.id}
                onClick={() => setSelectedDialogue(dialogue)}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{dialogue.title}</h3>
                <p className="text-gray-600 mb-4">{dialogue.scene}</p>
                <div className="flex items-center text-purple-500">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>{dialogue.dialogue.length} lines</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ProgressPage = () => {
    const totalWords = SAMPLE_VOCABULARY.length;
    const studiedWords = Object.keys(progress).length;
    const masteredWords = Object.values(progress).filter(
      p => p.correct / p.total >= 0.8 && p.total >= 3
    ).length;

    const progressPercentage = (studiedWords / totalWords) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-yellow-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-white text-red-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Your Progress</h1>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Words Studied</h3>
              <p className="text-3xl font-bold text-blue-500">{studiedWords}</p>
              <p className="text-gray-600">out of {totalWords}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Mastered</h3>
              <p className="text-3xl font-bold text-green-500">{masteredWords}</p>
              <p className="text-gray-600">words mastered</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-orange-500">{streak}</p>
              <p className="text-gray-600">days in a row</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Learning Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Recent Activity</h3>
            <div className="space-y-3">
              {Object.entries(progress)
                .sort(([,a], [,b]) => new Date(b.lastReviewed) - new Date(a.lastReviewed))
                .slice(0, 5)
                .map(([wordId, wordProgress]) => {
                  const word = SAMPLE_VOCABULARY.find(w => w.id === parseInt(wordId));
                  const accuracy = Math.round((wordProgress.correct / wordProgress.total) * 100);
                  return (
                    <div key={wordId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold">{word?.english}</span>
                        <span className="text-gray-500 ml-2">→</span>
                        <span className="text-blue-600 ml-2">{word?.spanish}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${accuracy >= 80 ? 'text-green-500' : accuracy >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {accuracy}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {wordProgress.correct}/{wordProgress.total} correct
                        </div>
                      </div>
                    </div>
                  );
                })}
              {Object.keys(progress).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Start practicing to see your progress here! 🎯
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'quizzes':
        return <QuizzesPage />;
      case 'dialogues':
        return <DialoguesPage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <HomePage />;
    }
  };

  return <div className="font-sans">{renderCurrentPage()}</div>;
};

export default SpanishLearningApp;