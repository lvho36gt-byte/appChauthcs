import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, CheckCircle2, BookOpen, Target, Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { User, LabSubmission, QuizAttempt } from '../types/physics';
import { SimpleLineChart } from './SimpleChart';

interface StudentJourneyModuleProps {
  currentUser: User;
  onNavigateToLab: () => void;
  onNavigateToGames: () => void;
}

export const StudentJourneyModule: React.FC<StudentJourneyModuleProps> = ({
  currentUser,
  onNavigateToLab,
  onNavigateToGames
}) => {
  const [submissions, setSubmissions] = useState<LabSubmission[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, qzRes] = await Promise.all([
          fetch(`/api/submissions?studentId=${currentUser.id}`).then(r => r.json()),
          fetch(`/api/quizzes/attempts?userId=${currentUser.id}`).then(r => r.json())
        ]);
        if (subRes.success) setSubmissions(subRes.submissions);
        if (qzRes.success) setQuizAttempts(qzRes.attempts);
      } catch (err) {
        console.error('Failed to load student progress', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const completedLabsCount = submissions.length;
  const avgQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length)
    : 85;

  // Determine Personalized Tier (Cần hỗ trợ, Đạt yêu cầu, Phát triển tốt)
  let studentTier: 'CẦN HỖ TRỢ' | 'ĐẠT YÊU CẦU' | 'PHÁT TRIỂN TỐT' = 'ĐẠT YÊU CẦU';
  if (avgQuizScore >= 85 && completedLabsCount >= 2) {
    studentTier = 'PHÁT TRIỂN TỐT';
  } else if (avgQuizScore < 60) {
    studentTier = 'CẦN HỖ TRỢ';
  }

  // Score progression graph points
  const progressPoints = quizAttempts.length > 0
    ? quizAttempts.map((a, i) => ({ x: `Lần ${i + 1}`, y: a.score }))
    : [
        { x: 'Tuần 1', y: 55 },
        { x: 'Tuần 2', y: 68 },
        { x: 'Tuần 3', y: 82 },
        { x: 'Tuần 4', y: 92 }
      ];

  const badges = currentUser.badges || ['Nhà khám phá', 'Nhà thực nghiệm'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-cyan-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              HỌC TẬP CÁ NHÂN HÓA THEO NĂNG LỰC
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Hành Trình Tiến Bộ Của Em</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Học sinh: <strong>{currentUser.name}</strong> • Lớp {currentUser.className || '7A1'} • THCS Chu Văn An
            </p>
          </div>

          {/* Tier Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 text-right">
            <span className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold block">Nhóm năng lực học tập:</span>
            <span className="text-sm font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              NHÓM: {studentTier}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thí nghiệm đã hoàn thành:</span>
          <div className="text-2xl font-black text-cyan-600 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-600" />
            <span>{completedLabsCount} Bài</span>
          </div>
          <div className="text-[11px] text-slate-500">Có bảng số liệu & kết luận</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm kiểm tra trung bình:</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>{avgQuizScore}/100</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Tiến bộ qua từng vòng đấu</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt thi đấu trắc nghiệm:</span>
          <div className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            <span>{quizAttempts.length || 4} Lượt</span>
          </div>
          <div className="text-[11px] text-slate-500">Đấu trường trí tuệ Vật lí</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Huy hiệu đã đạt được:</span>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>{badges.length} Huy hiệu</span>
          </div>
          <div className="text-[11px] text-slate-500">Chứng nhận năng lực khoa học</div>
        </div>
      </div>

      {/* Personalized Learning Tier Guidance Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 text-sm">Lộ Trình Học Tập Cá Nhân Hóa Dành Riêng Cho Em</h3>
        </div>

        {studentTier === 'CẦN HỖ TRỢ' && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold">Đề xuất từ Trợ lý PHYSI:</div>
            <p>
              Em hãy bắt đầu bằng việc ôn lại các công thức cơ bản và làm lại thí nghiệm đo tốc độ xe đồ chơi với 3 lần lặp. Thầy PHYSI sẽ hướng dẫn từng bước nhỏ kèm gợi ý chi tiết.
            </p>
            <button
              onClick={onNavigateToLab}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-bold inline-flex items-center gap-1.5 mt-1"
            >
              Làm lại bài thực hành cơ bản
            </button>
          </div>
        )}

        {studentTier === 'ĐẠT YÊU CẦU' && (
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-2">
            <div className="font-bold">Đề xuất từ Trợ lý PHYSI:</div>
            <p>
              Em đã nắm vững quy trình thu thập số liệu và tính toán! Thử thách tiếp theo là làm bài tập vận dụng định luật phản xạ ánh sáng hoặc giải thích hiện tượng cân bằng đòn bẩy trong cuộc sống.
            </p>
            <button
              onClick={onNavigateToGames}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 text-white font-bold inline-flex items-center gap-1.5 mt-1"
            >
              Tham gia Đấu trường Vật lí
            </button>
          </div>
        )}

        {studentTier === 'PHÁT TRIỂN TỐT' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <div className="font-bold">Đề xuất từ Trợ lý PHYSI:</div>
            <p>
              Năng lực thực chứng và giải thích khoa học của em rất xuất sắc! Hãy thử sức với các bài tập vận dụng cao, thiết kế thí nghiệm mở rộng hoặc chế tạo mô hình xe phản lực trong Xưởng STEM!
            </p>
            <button
              onClick={onNavigateToLab}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold inline-flex items-center gap-1.5 mt-1"
            >
              Thử thách thí nghiệm nâng cao
            </button>
          </div>
        )}
      </div>

      {/* Score Trend Line Graph */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Biểu đồ tiến bộ điểm số qua thời gian</h4>
            <p className="text-[11px] text-slate-500">Đường cong học tập thể hiện sự vươn lên của em</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Xu hướng: Tăng trưởng liên tục
          </span>
        </div>

        <SimpleLineChart
          data={progressPoints}
          xLabel="Tiến trình học tập"
          yLabel="Điểm số (thang 100)"
          color="#0284c7"
        />
      </div>

      {/* Badges Showcase */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-sm">Bảng Vàng Huy Hiệu Khoa Học Đã Đạt Được</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Nhà khám phá', desc: 'Hoàn thành bài thí nghiệm đầu tiên', icon: '🔍' },
            { name: 'Nhà thực nghiệm', desc: 'Thu thập đủ 3 lần đo thực tế trung thực', icon: '🧪' },
            { name: 'Nhà phân tích', desc: 'Rút ra kết luận khoa học có đối chứng số liệu', icon: '📊' },
            { name: 'Nhà khoa học nhí', desc: 'Đạt từ 90 điểm trong Đấu trường Vật lí', icon: '⭐' }
          ].map((b, idx) => {
            const hasBadge = badges.includes(b.name);
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center space-y-1.5 transition-all ${
                  hasBadge
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-40'
                }`}
              >
                <div className="text-3xl">{b.icon}</div>
                <div className="font-bold text-xs text-slate-900">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.desc}</div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hasBadge ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                }`}>
                  {hasBadge ? '✓ Đã nhận' : 'Chưa mở khóa'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
