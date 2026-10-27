import React, { useState, useEffect } from 'react';
import {
  Trophy, Award, Zap, HelpCircle, CheckCircle2, XCircle, RotateCcw,
  Sparkles, Clock, ChevronRight, Lock, Unlock, ArrowRight, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, User } from '../types/physics';

interface GamesModuleProps {
  currentUser: User;
}

export const GamesModule: React.FC<GamesModuleProps> = ({ currentUser }) => {
  const [activeGame, setActiveGame] = useState<'scientist_quiz' | 'mystery_doors' | 'wise_physicist' | 'experiment_challenge'>('scientist_quiz');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-700/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              ĐẤU TRƯỜNG VẬT LÍ TƯƠNG TÁC
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Học Vật Lí Qua Trò Chơi – Rèn Tư Duy Khoa Học</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Hệ thống 4 trò chơi tương tác kiểm tra kiến thức, ghép nối định luật và thử thách dự đoán thực nghiệm. Tích lũy huy hiệu Nhà khoa học nhí!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-indigo-500/30">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-xs">
              <div className="text-slate-400">Huy hiệu của em:</div>
              <div className="font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                {currentUser.badges?.join(' • ') || 'Chưa có huy hiệu'}
              </div>
            </div>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-700/60">
          <button
            onClick={() => setActiveGame('scientist_quiz')}
            className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              activeGame === 'scientist_quiz'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            1. AI Nhà Khoa Học Nhí
          </button>
          <button
            onClick={() => setActiveGame('mystery_doors')}
            className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              activeGame === 'mystery_doors'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lock className="w-4 h-4" />
            2. Ô Cửa Bí Mật Vật Lí
          </button>
          <button
            onClick={() => setActiveGame('wise_physicist')}
            className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              activeGame === 'wise_physicist'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            3. Nhà Vật Lí Thông Thái
          </button>
          <button
            onClick={() => setActiveGame('experiment_challenge')}
            className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              activeGame === 'experiment_challenge'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Star className="w-4 h-4" />
            4. Thử Thách Thí Nghiệm
          </button>
        </div>
      </div>

      {/* Game Content */}
      {activeGame === 'scientist_quiz' && <ScientistQuizGame currentUser={currentUser} />}
      {activeGame === 'mystery_doors' && <MysteryDoorsGame currentUser={currentUser} />}
      {activeGame === 'wise_physicist' && <WisePhysicistGame currentUser={currentUser} />}
      {activeGame === 'experiment_challenge' && <ExperimentChallengeGame currentUser={currentUser} />}
    </div>
  );
};

// ----------------- GAME 1: AI NHÀ KHOA HỌC NHÍ (10-QUESTION QUIZ) -----------------
const ScientistQuizGame: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30s per question
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/quizzes/questions?limit=10');
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setShowExplanation(false);
        setIsFinished(false);
        setTimeLeft(30);
      }
    } catch (err) {
      console.error('Failed to load quiz questions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isFinished || showExplanation || isLoading) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setShowExplanation(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, showExplanation, isFinished, isLoading]);

  const handleSelectOption = (optIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    let correctCount = 0;
    const answerPayload = questions.map((q, idx) => {
      const ans = selectedAnswers[idx];
      const isCorrect = ans === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { questionId: q.id, selectedAnswer: ans !== undefined ? ans : -1 };
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);

    if (calculatedScore >= 80) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    try {
      await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          gameType: 'scientist_quiz',
          answers: answerPayload,
          timeSpentSeconds: (questions.length * 30) - timeLeft
        })
      });
    } catch (err) {
      console.error('Failed to submit quiz attempt', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500 text-xs">Đang nạp bộ 10 câu hỏi thi đấu từ ngân hàng...</div>;
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Hoàn Thành Đấu Trường 10 Câu Hỏi!</h3>
          <p className="text-xs text-slate-500 mt-1">Kết quả đã được ghi nhận vào hồ sơ tiến bộ học tập cá nhân.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500">Điểm số đạt được:</div>
            <div className="text-3xl font-black text-cyan-600 mt-1">{score}/100</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Số câu đúng:</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {Math.round((score / 100) * questions.length)}/{questions.length}
            </div>
          </div>
        </div>

        <button
          onClick={fetchQuestions}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Thử thách lượt mới với 10 câu khác
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const currentSelected = selectedAnswers[currentIndex];
  const isCorrect = currentSelected === currentQ.correctAnswer;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
      {/* Progress & Timer */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-cyan-100 text-cyan-800 font-bold">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-slate-400 font-medium">• Lớp {currentQ.grade} • {currentQ.level}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold ${
          timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, oIdx) => {
            const isThisSelected = currentSelected === oIdx;
            const isThisCorrect = oIdx === currentQ.correctAnswer;

            let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800';
            if (showExplanation) {
              if (isThisCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
              } else if (isThisSelected) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={showExplanation}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {showExplanation && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {showExplanation && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      {showExplanation && (
        <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
          isCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-rose-50 text-rose-950 border border-rose-200'
        }`}>
          <div className="flex items-center gap-1.5 font-bold">
            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
            <span>{isCorrect ? 'Xuất sắc! Câu trả lời chính xác.' : 'Chưa chính xác!'}</span>
          </div>
          <p className="leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      {/* Footer Next Button */}
      {showExplanation && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ----------------- GAME 2: Ô CỬA BÍ MẬT VẬT LÍ (MYSTERY DOORS) -----------------
const MysteryDoorsGame: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  interface Door {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    isOpened: boolean;
  }

  const [doors, setDoors] = useState<Door[]>([
    {
      id: 1,
      question: 'Khi góc tới i = 30° thì góc phản xạ i\' bằng bao nhiêu?',
      options: ['30°', '60°', '90°'],
      correct: 0,
      explanation: 'Theo định luật phản xạ ánh sáng: i\' = i = 30°.',
      isOpened: false
    },
    {
      id: 2,
      question: 'Vận tốc v = 10 m/s tương đương với bao nhiêu km/h?',
      options: ['36 km/h', '10 km/h', '3.6 km/h'],
      correct: 0,
      explanation: '10 m/s × 3.6 = 36 km/h.',
      isOpened: false
    },
    {
      id: 3,
      question: 'Đòn bẩy cân bằng khi điều kiện nào thỏa mãn?',
      options: ['F1 × l1 = F2 × l2', 'F1 + l1 = F2 + l2', 'F1 / l1 = F2 / l2'],
      correct: 0,
      explanation: 'Quy tắc mômen lực: F1 × l1 = F2 × l2.',
      isOpened: false
    },
    {
      id: 4,
      question: 'Vật liệu nào sau đây dẫn nhiệt tốt nhất?',
      options: ['Đồng kim loại', 'Thủy tinh', 'Gỗ khô'],
      correct: 0,
      explanation: 'Kim loại (đồng, nhôm) dẫn nhiệt rất tốt so với phi kim.',
      isOpened: false
    },
    {
      id: 5,
      question: 'Chân dài của đèn LED cần nối vào cực nào của pin?',
      options: ['Cực dương (+)', 'Cực âm (-)', 'Cực nào cũng được'],
      correct: 0,
      explanation: 'Chân dài là cực dương anot của đèn LED.',
      isOpened: false
    },
    {
      id: 6,
      question: 'Thời gian thực hiện 1 dao động toàn phần gọi là gì?',
      options: ['Chu kì (T)', 'Tần số (f)', 'Biên độ (A)'],
      correct: 0,
      explanation: 'Chu kì T là thời gian vật làm xong đúng 1 dao động.',
      isOpened: false
    }
  ]);

  const [activeDoor, setActiveDoor] = useState<Door | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const openedCount = doors.filter(d => d.isOpened).length;
  const isAllOpened = openedCount === doors.length;

  const handleOpenDoor = (d: Door) => {
    if (d.isOpened) return;
    setActiveDoor(d);
    setSelectedOption(null);
    setFeedback(null);
  };

  const checkAnswer = (optIndex: number) => {
    if (!activeDoor) return;
    setSelectedOption(optIndex);
    if (optIndex === activeDoor.correct) {
      setFeedback('Chính xác! Ô cửa đã được mở khóa.');
      setDoors(prev => prev.map(d => d.id === activeDoor.id ? { ...d, isOpened: true } : d));
      setTimeout(() => {
        setActiveDoor(null);
      }, 1500);
    } else {
      setFeedback('Chưa đúng! Hãy thử lại suy luận của em.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h3 className="font-extrabold text-slate-900 text-lg">Ô Cửa Bí Mật – Giải Mã Khoa Học</h3>
        <p className="text-xs text-slate-500">
          Mở khóa tất cả 6 ô cửa bằng cách trả lời đúng câu hỏi để hé lộ bức thông điệp khoa học ẩn giấu!
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-semibold px-2">
        <span>Tiến độ mở cửa:</span>
        <span className="font-bold text-cyan-700">{openedCount} / 6 ô đã mở</span>
      </div>

      {/* 6 Grid Doors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {doors.map(d => (
          <button
            key={d.id}
            onClick={() => handleOpenDoor(d)}
            disabled={d.isOpened}
            className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 transition-all ${
              d.isOpened
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white hover:scale-102 shadow-sm'
            }`}
          >
            {d.isOpened ? (
              <>
                <Unlock className="w-6 h-6 text-emerald-600" />
                <span className="text-[11px] font-bold">ĐÃ MỞ KHÓA</span>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold">Ô Cửa #{d.id}</span>
                <span className="text-[10px] text-slate-400">Bấm để giải đố</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Final Secret Revealed */}
      {isAllOpened && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center space-y-2 shadow-lg animate-fade-in">
          <Trophy className="w-10 h-10 mx-auto text-amber-200" />
          <h4 className="text-base font-extrabold">CHÚC MỪNG EM ĐÃ MỞ KHÓA BỨC THÔNG ĐIỆP BÍ MẬT!</h4>
          <p className="text-xs text-amber-100 max-w-md mx-auto italic">
            &quot;Mọi định luật tự nhiên vĩ đại đều bắt đầu từ một thí nghiệm nhỏ được đo đạc cẩn trọng và trung thực.&quot; – Galileo Galilei
          </p>
        </div>
      )}

      {/* Active Door Question Modal */}
      {activeDoor && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Câu hỏi mở Ô Cửa #{activeDoor.id}:</span>
            <button onClick={() => setActiveDoor(null)} className="text-slate-400 hover:text-slate-600">Đóng</button>
          </div>
          <p className="text-xs font-bold text-slate-900">{activeDoor.question}</p>
          <div className="space-y-2">
            {activeDoor.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => checkAnswer(i)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  selectedOption === i
                    ? i === activeDoor.correct
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`p-2 rounded text-xs font-bold ${feedback.includes('Chính xác') ? 'text-emerald-700' : 'text-rose-700'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ----------------- GAME 3: NHÀ VẬT LÍ THÔNG THÁI (MATCHING GAME) -----------------
const WisePhysicistGame: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  interface PairItem {
    id: string;
    text: string;
    pairKey: string;
    side: 'left' | 'right';
  }

  const ALL_PAIRS = [
    { key: 'p1', left: 'Tốc độ (v)', right: 'v = s / t (m/s)' },
    { key: 'p2', left: 'Phản xạ ánh sáng', right: 'Góc tới bằng góc phản xạ (i = i\')' },
    { key: 'p3', left: 'Cân bằng đòn bẩy', right: 'F1 × l1 = F2 × l2' },
    { key: 'p4', left: 'Chu kì con lắc (T)', right: 'T = t / N (giây)' },
    { key: 'p5', left: 'Cường độ dòng điện', right: 'Đo bằng Ampe kế (A)' }
  ];

  const [leftItems, setLeftItems] = useState<PairItem[]>([]);
  const [rightItems, setRightItems] = useState<PairItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const l = ALL_PAIRS.map(p => ({ id: `l-${p.key}`, text: p.left, pairKey: p.key, side: 'left' as const })).sort(() => Math.random() - 0.5);
    const r = ALL_PAIRS.map(p => ({ id: `r-${p.key}`, text: p.right, pairKey: p.key, side: 'right' as const })).sort(() => Math.random() - 0.5);
    setLeftItems(l);
    setRightItems(r);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedKeys([]);
  };

  const handleSelect = (item: PairItem) => {
    if (matchedKeys.includes(item.pairKey)) return;

    if (item.side === 'left') {
      setSelectedLeft(item.pairKey);
      if (selectedRight) {
        checkMatch(item.pairKey, selectedRight);
      }
    } else {
      setSelectedRight(item.pairKey);
      if (selectedLeft) {
        checkMatch(selectedLeft, item.pairKey);
      }
    }
  };

  const checkMatch = (k1: string, k2: string) => {
    if (k1 === k2) {
      setMatchedKeys(prev => [...prev, k1]);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (matchedKeys.length + 1 === ALL_PAIRS.length) {
        confetti({ particleCount: 80, spread: 60 });
      }
    } else {
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h3 className="font-extrabold text-slate-900 text-lg">Nhà Vật Lí Thông Thái – Ghép Cặp Khái Niệm</h3>
        <p className="text-xs text-slate-500">
          Chạm vào 1 ô bên trái và 1 ô bên phải tương ứng để ghép đúng khái niệm với định luật / công thức!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Khái niệm</h4>
          {leftItems.map(item => {
            const isMatched = matchedKeys.includes(item.pairKey);
            const isSelected = selectedLeft === item.pairKey;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                    : isSelected
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Công thức / Định luật</h4>
          {rightItems.map(item => {
            const isMatched = matchedKeys.includes(item.pairKey);
            const isSelected = selectedRight === item.pairKey;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                    : isSelected
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      {matchedKeys.length === ALL_PAIRS.length && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-center space-y-2">
          <div className="font-bold text-sm">🎉 Tuyệt vời! Em đã ghép đúng 100% các cặp định luật!</div>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Chơi lại lượt mới
          </button>
        </div>
      )}
    </div>
  );
};

// ----------------- GAME 4: THỬ THÁCH THÍ NGHIỆM (PREDICT & OBSERVE) -----------------
const ExperimentChallengeGame: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [prediction, setPrediction] = useState<string>('');
  const [tested, setTested] = useState<boolean>(false);
  const [observation, setObservation] = useState<string>('');

  const scenario = {
    title: 'Tình huống: Nước nóng và nước lạnh nguội đi',
    context: 'Ta có 2 cốc nước: Cốc A ở 80°C và Cốc B ở 45°C được đặt trong phòng máy lạnh 25°C.',
    question: 'Trong 5 phút đầu tiên, độ giảm nhiệt độ của Cốc A sẽ lớn hơn, nhỏ hơn hay bằng Cốc B?',
    correctFact: 'Cốc A (80°C) sẽ giảm nhiệt độ nhanh hơn nhiều so với Cốc B (45°C) vì độ chênh lệch nhiệt độ giữa cốc A và môi trường lớn hơn (80 - 25 = 55°C so với 45 - 25 = 20°C).'
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase">
          Tư duy thực nghiệm
        </span>
        <h3 className="font-extrabold text-slate-900 text-lg">{scenario.title}</h3>
        <p className="text-xs text-slate-600">{scenario.context}</p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold text-slate-900">Câu hỏi thử thách:</h4>
        <p className="text-xs text-slate-700">{scenario.question}</p>

        <div className="space-y-2 pt-2">
          {[
            'Cốc A giảm nhanh hơn Cốc B',
            'Cốc B giảm nhanh hơn Cốc A',
            'Cả hai cốc giảm một lượng nhiệt độ như nhau'
          ].map((opt, i) => (
            <button
              key={i}
              onClick={() => setPrediction(opt)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                prediction === opt
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {prediction && !tested && (
        <button
          onClick={() => setTested(true)}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Mở kết quả đối chứng thực tế
        </button>
      )}

      {tested && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 text-xs text-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-cyan-900">
            <CheckCircle2 className="w-4 h-4 text-cyan-600" />
            <span>Kết luận thực nghiệm khoa học:</span>
          </div>
          <p className="leading-relaxed">{scenario.correctFact}</p>
          <div className="pt-2 text-[11px] text-slate-500">
            Giả thuyết ban đầu của em: <strong>&quot;{prediction}&quot;</strong> {prediction.includes('A giảm nhanh hơn') ? '➔ Hoàn toàn chuẩn xác!' : '➔ Hãy ghi nhớ quy luật truyền nhiệt nhé!'}
          </div>
        </div>
      )}
    </div>
  );
};
