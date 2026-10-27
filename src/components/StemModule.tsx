import React, { useState } from 'react';
import { Hammer, Sparkles, CheckCircle2, Award, ArrowRight, Upload, AlertCircle, FileText } from 'lucide-react';
import { StemProject, User } from '../types/physics';
import { INITIAL_STEM_PROJECTS } from '../data/seedData';

interface StemModuleProps {
  currentUser: User;
}

export const StemModule: React.FC<StemModuleProps> = ({ currentUser }) => {
  const [projects] = useState<StemProject[]>(INITIAL_STEM_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<StemProject>(INITIAL_STEM_PROJECTS[0]);

  // Submission state
  const [conceptDesign, setConceptDesign] = useState<string>('');
  const [trialResults, setTrialResults] = useState<string>('');
  const [conclusion, setConclusion] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-700/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            XƯỞNG SÁNG TẠO STEM VẬT LÍ
          </span>
          <span className="text-xs text-slate-300">Vận dụng quy luật vào thực tiễn cuộc sống</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Thiết Kế & Chế Tạo Mô Hình Khoa Học</h2>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Từ nguyên lí tốc độ, phản xạ ánh sáng và mạch điện – Hãy cùng bạn bè sáng tạo những sản phẩm khoa học hữu ích từ vật liệu tái chế!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Danh sách thử thách STEM</h3>
          <div className="space-y-2.5">
            {projects.map(proj => {
              const isSelected = selectedProject.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProject(proj);
                    setSubmitted(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    Khối {proj.grade}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{proj.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{proj.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Details & Submission */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                THỬ THÁCH STEM KHỐI {selectedProject.grade}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">{selectedProject.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{selectedProject.description}</p>
            </div>

            {/* Materials & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-emerald-600" />
                  Vật liệu chuẩn bị
                </h4>
                <ul className="text-xs text-slate-700 space-y-1">
                  {selectedProject.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 space-y-2">
                <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-600" />
                  Mục tiêu thử thách
                </h4>
                <p className="text-xs text-cyan-950 leading-relaxed font-medium">
                  {selectedProject.challengeGoal}
                </p>
              </div>
            </div>

            {/* Rubric Criteria */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tiêu chí chấm điểm sản phẩm STEM (Thang 100 điểm)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedProject.criteria.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700">{c.criterion}</span>
                    <span className="font-bold text-emerald-700 font-mono ml-2 shrink-0">{c.points}đ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hồ sơ nộp sản phẩm của học sinh:
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  1. Bản vẽ / Mô tả ý tưởng thiết kế mô hình:
                </label>
                <textarea
                  rows={2}
                  value={conceptDesign}
                  onChange={e => setConceptDesign(e.target.value)}
                  placeholder="Mô tả cấu tạo: kích thước, cách ghép nối vật liệu, giải pháp giảm ma sát..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  2. Kết quả thử nghiệm thực tế (Số liệu đo được):
                </label>
                <textarea
                  rows={2}
                  value={trialResults}
                  onChange={e => setTrialResults(e.target.value)}
                  placeholder="Ghi số liệu thử nghiệm: xe chạy được bao xa? mất bao nhiêu giây? góc phản xạ có khớp không?..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  3. Đề xuất cải tiến sản phẩm:
                </label>
                <textarea
                  rows={2}
                  value={conclusion}
                  onChange={e => setConclusion(e.target.value)}
                  placeholder="Nếu được làm lại, em sẽ thay đổi chi tiết nào để mô hình hoạt động tốt hơn?..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              {submitted && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã nộp hồ sơ sản phẩm STEM thành công! Giáo viên sẽ xem và chấm theo tiêu chí.</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Nộp sản phẩm STEM
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
