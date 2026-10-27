import React from 'react';
import { Atom, UserCheck, GraduationCap, Compass, Sparkles, School } from 'lucide-react';
import { UserRole } from '../types/physics';

interface WelcomeModalProps {
  onSelectRole: (role: UserRole | 'trial', name?: string, studentCode?: string, classCode?: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole | 'trial' | null>(null);
  const [studentName, setStudentName] = React.useState<string>('Nguyễn Văn An');
  const [studentCode, setStudentCode] = React.useState<string>('HS-7A1-01');
  const [classCode, setClassCode] = React.useState<string>('KHTN7A1');

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 text-center space-y-3 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
            <Atom className="w-9 h-9 text-white animate-spin-slow" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
              PHYSICS EVIDENCE LAB AI 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
              VẬT LÍ THỰC CHỨNG AI
            </h1>
            <p className="text-amber-300 font-bold text-xs sm:text-sm mt-1">
              &quot;Thí nghiệm thật – Dữ liệu thật – Khám phá cùng AI&quot;
            </p>
          </div>

          <div className="text-xs text-slate-300 font-medium pt-1 border-t border-slate-700/60 max-w-md mx-auto">
            Cô Đỗ Thị Giáng Châu • Trường THCS Chu Văn An • Đồng Nai
          </div>
        </div>

        {/* Content & Options */}
        <div className="p-6 sm:p-8 space-y-5">
          {!selectedRole ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                Vui lòng chọn vai trò để tiếp tục:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Option 1: Teacher */}
                <button
                  onClick={() => onSelectRole('teacher')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center justify-center text-center gap-2 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-cyan-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Tôi là giáo viên</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cô Đỗ Thị Giáng Châu</p>
                  </div>
                </button>

                {/* Option 2: Student */}
                <button
                  onClick={() => setSelectedRole('student')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center justify-center text-center gap-2 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Tôi là học sinh</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Lớp 6, 7, 8, 9</p>
                  </div>
                </button>

                {/* Option 3: Trial */}
                <button
                  onClick={() => onSelectRole('trial')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center justify-center text-center gap-2 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Bản dùng thử</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Trải nghiệm tự do</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Student Quick Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Thông Tin Đăng Nhập Học Sinh</h4>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-xs text-cyan-600 hover:underline"
                >
                  Quay lại chọn vai trò
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên học sinh:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mã học sinh:</label>
                    <input
                      type="text"
                      value={studentCode}
                      onChange={e => setStudentCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      placeholder="HS-7A1-01"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mã lớp học:</label>
                    <input
                      type="text"
                      value={classCode}
                      onChange={e => setClassCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono uppercase"
                      placeholder="KHTN7A1"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectRole('student', studentName, studentCode, classCode)}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-all mt-2"
              >
                Vào Phòng Thí Nghiệm Học Tập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
