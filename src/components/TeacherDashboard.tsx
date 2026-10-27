import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, CheckSquare, TrendingUp, Award, Clock,
  Plus, Edit3, Trash2, Search, Filter, CheckCircle2, MessageSquare,
  AlertTriangle, Save, Eye, Shield, FileText, ChevronRight
} from 'lucide-react';
import { ClassGroup, LabSubmission, User } from '../types/physics';

interface TeacherDashboardProps {
  currentUser: User;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser }) => {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [submissions, setSubmissions] = useState<LabSubmission[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Class creation modal state
  const [showNewClassModal, setShowNewClassModal] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassGrade, setNewClassGrade] = useState<number>(7);
  const [newClassDesc, setNewClassDesc] = useState<string>('');

  // Grading modal state
  const [gradingSubmission, setGradingSubmission] = useState<LabSubmission | null>(null);
  const [rubricSafety, setRubricSafety] = useState<number>(18);
  const [rubricData, setRubricData] = useState<number>(23);
  const [rubricAnalysis, setRubricAnalysis] = useState<number>(22);
  const [rubricCharts, setRubricCharts] = useState<number>(13);
  const [rubricConclusions, setRubricConclusions] = useState<number>(13);
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState<boolean>(false);

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');

  const loadData = async () => {
    try {
      const [clsRes, subRes, usrRes, logRes] = await Promise.all([
        fetch('/api/classes').then(r => r.json()),
        fetch('/api/submissions').then(r => r.json()),
        fetch('/api/auth/users').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json())
      ]);

      if (clsRes.success) setClasses(clsRes.classes);
      if (subRes.success) setSubmissions(subRes.submissions);
      if (usrRes.success) setStudents(usrRes.users.filter((u: User) => u.role === 'student'));
      if (logRes.success) setAuditLogs(logRes.logs);
    } catch (err) {
      console.error('Failed to load teacher dashboard data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName.trim(),
          grade: newClassGrade,
          description: newClassDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowNewClassModal(false);
        setNewClassName('');
        setNewClassDesc('');
        loadData();
      }
    } catch (err) {
      console.error('Failed to create class', err);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Thầy/Cô có chắc chắn muốn xóa lớp học này không?')) return;
    try {
      const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to delete class', err);
    }
  };

  const openGradingModal = (sub: LabSubmission) => {
    setGradingSubmission(sub);
    if (sub.teacherRubric) {
      setRubricSafety(sub.teacherRubric.safetyAndProcedure);
      setRubricData(sub.teacherRubric.dataCollection);
      setRubricAnalysis(sub.teacherRubric.scientificAnalysis);
      setRubricCharts(sub.teacherRubric.tablesAndGraphs);
      setRubricConclusions(sub.teacherRubric.conclusionsAndImprovements);
    } else {
      setRubricSafety(18);
      setRubricData(23);
      setRubricAnalysis(22);
      setRubricCharts(13);
      setRubricConclusions(13);
    }
    setTeacherComment(sub.teacherComment || 'Em đã thực hiện thí nghiệm cẩn thận, số liệu đo trung thực và rút ra kết luận tốt.');
  };

  const handleSaveGrade = async (status: 'reviewed' | 'redo_requested') => {
    if (!gradingSubmission) return;
    setIsSavingGrade(true);

    try {
      const res = await fetch(`/api/submissions/${gradingSubmission.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherRubric: {
            safetyAndProcedure: rubricSafety,
            dataCollection: rubricData,
            scientificAnalysis: rubricAnalysis,
            tablesAndGraphs: rubricCharts,
            conclusionsAndImprovements: rubricConclusions
          },
          teacherComment,
          status
        })
      });

      const data = await res.json();
      if (data.success) {
        setGradingSubmission(null);
        loadData();
      }
    } catch (err) {
      console.error('Failed to grade submission', err);
    } finally {
      setIsSavingGrade(false);
    }
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const matchStudent = s.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
                         s.studentCode.toLowerCase().includes(searchStudent.toLowerCase());
    return matchClass && matchStudent;
  });

  const totalScore = rubricSafety + rubricData + rubricAnalysis + rubricCharts + rubricConclusions;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              BẢNG ĐIỀU KHIỂN SƯ PHẠM
            </span>
            <span className="text-xs text-slate-500 font-medium">Cô Đỗ Thị Giáng Châu • THCS Chu Văn An</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản Lý Dạy Học & Đánh Giá Thực Nghiệm</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Theo dõi tiến độ nộp bài, xem số liệu thực tế, duyệt nhận xét AI và chấm điểm bài thực hành của học sinh.
          </p>
        </div>

        <button
          onClick={() => setShowNewClassModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Tạo lớp học mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số lớp:</span>
          <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            <span>{classes.length} Lớp</span>
          </div>
          <div className="text-[11px] text-slate-500">Khối 6, 7, 8, 9 Chu Văn An</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bài thí nghiệm đã nộp:</span>
          <div className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            <span>{submissions.length} Bài</span>
          </div>
          <div className="text-[11px] text-slate-500">Đã qua phân tích số liệu</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm thực hành trung bình:</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>
              {submissions.length > 0
                ? (submissions.reduce((acc, s) => acc + (s.teacherScore || 85), 0) / submissions.length).toFixed(1)
                : '88.5'}/100
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">Thang đo 100 điểm Rubric</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỉ lệ hoàn thành nhiệm vụ:</span>
          <div className="text-2xl font-black text-cyan-600 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            <span>94.5%</span>
          </div>
          <div className="text-[11px] text-slate-500">Học sinh tích cực tham gia</div>
        </div>
      </div>

      {/* Class Management List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Danh Sách Lớp Học Quản Lý</h3>
          <span className="text-xs text-slate-500">Mã tham gia do giáo viên cấp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase">
                    Khối {cls.grade}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{cls.name}</h4>
                </div>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  title="Xóa lớp"
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Mã lớp:</span>
                  <span className="font-mono font-bold text-indigo-700">{cls.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sĩ số:</span>
                  <span className="font-bold text-slate-800">{cls.studentCount} HS</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{cls.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Lab Submissions Review & Grading */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Danh Sách Bài Thực Hành Cần Chấm & Phê Duyệt</h3>
            <p className="text-xs text-slate-500">Giáo viên trực tiếp đánh giá dựa trên minh chứng và gợi ý từ AI</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedClassFilter}
              onChange={e => setSelectedClassFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">Tất cả các lớp</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tìm theo tên / mã HS..."
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Chưa có bài nộp nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mã HS</th>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3">Bài thí nghiệm</th>
                  <th className="py-2.5 px-3 text-center">Gợi ý AI</th>
                  <th className="py-2.5 px-3 text-center">Điểm giáo viên</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono font-medium">{sub.studentCode}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="py-2 px-3 text-slate-600">{sub.className}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{sub.experimentTitle}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">
                      {sub.aiFeedback?.scoreSuggestion ? `${sub.aiFeedback.scoreSuggestion}/100` : '—'}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-extrabold text-emerald-700">
                      {sub.teacherScore !== undefined ? `${sub.teacherScore}/100` : <span className="text-amber-600">Chưa chấm</span>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'reviewed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub.status === 'redo_requested'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status === 'reviewed' ? 'Đã duyệt' : sub.status === 'redo_requested' ? 'Yêu cầu làm lại' : 'Chờ chấm'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => openGradingModal(sub)}
                        className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-2xs"
                      >
                        Chấm bài
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-600" />
            Nhật Ký Hoạt Động & Kiểm Soát Quyền Riêng Tư (Audit Log)
          </h4>
          <span className="text-[11px] text-slate-500">Bảo đảm minh bạch, an toàn dữ liệu trẻ em</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between text-xs gap-3">
              <div>
                <span className="font-bold text-slate-800">{log.user}:</span>{' '}
                <span className="text-slate-600">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Create Class */}
      {showNewClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Tạo Lớp Học Mới</h3>
            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tên lớp:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 7A2, 8A2, 9A2..."
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Khối lớp:</label>
                <select
                  value={newClassGrade}
                  onChange={e => setNewClassGrade(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value={6}>Khối 6</option>
                  <option value={7}>Khối 7</option>
                  <option value={8}>Khối 8</option>
                  <option value={9}>Khối 9</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mô tả / Chủ đề:</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về lớp hoặc bộ sách đang áp dụng..."
                  value={newClassDesc}
                  onChange={e => setNewClassDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewClassModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                >
                  Lưu lớp học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Rubric Grading & Teacher Feedback */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                  {gradingSubmission.className} • {gradingSubmission.studentCode}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">{gradingSubmission.studentName}</h3>
                <p className="text-xs text-slate-500">{gradingSubmission.experimentTitle}</p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Student Measurements Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800">Số liệu học sinh đã đo:</div>
              <div className="font-mono text-[11px] text-slate-600 overflow-x-auto">
                {gradingSubmission.measurements?.map((m, i) => (
                  <span key={i} className="mr-3">
                    Lần {m.trial}: {Object.entries(m).filter(([k]) => k !== 'trial').map(([k, v]) => `${k}=${v}`).join(', ')}
                  </span>
                ))}
              </div>
              <div className="pt-1">
                <strong>Kết luận của em:</strong> &quot;{gradingSubmission.studentConclusion || 'Chưa ghi kết luận'}&quot;
              </div>
            </div>

            {/* Rubric Sliders 100-pt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Thang điểm Rubric chuẩn (Tổng: {totalScore}/100 điểm)
                </h4>
                <span className={`text-base font-black font-mono ${totalScore >= 80 ? 'text-emerald-600' : 'text-cyan-700'}`}>
                  {totalScore}/100 điểm
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="w-64 truncate">1. Quy trình và an toàn (Max 20đ):</span>
                  <input
                    type="range" min="0" max="20" step="1"
                    value={rubricSafety} onChange={e => setRubricSafety(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold w-10 text-right">{rubricSafety}đ</span>
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="w-64 truncate">2. Thu thập và ghi dữ liệu (Max 25đ):</span>
                  <input
                    type="range" min="0" max="25" step="1"
                    value={rubricData} onChange={e => setRubricData(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold w-10 text-right">{rubricData}đ</span>
                </div>

                {/* 3 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="w-64 truncate">3. Phân tích & giải thích (Max 25đ):</span>
                  <input
                    type="range" min="0" max="25" step="1"
                    value={rubricAnalysis} onChange={e => setRubricAnalysis(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold w-10 text-right">{rubricAnalysis}đ</span>
                </div>

                {/* 4 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="w-64 truncate">4. Bảng số liệu & biểu đồ (Max 15đ):</span>
                  <input
                    type="range" min="0" max="15" step="1"
                    value={rubricCharts} onChange={e => setRubricCharts(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold w-10 text-right">{rubricCharts}đ</span>
                </div>

                {/* 5 */}
                <div className="flex items-center justify-between gap-4">
                  <span className="w-64 truncate">5. Kết luận & đề xuất cải tiến (Max 15đ):</span>
                  <input
                    type="range" min="0" max="15" step="1"
                    value={rubricConclusions} onChange={e => setRubricConclusions(Number(e.target.value))}
                    className="flex-1 accent-cyan-600"
                  />
                  <span className="font-mono font-bold w-10 text-right">{rubricConclusions}đ</span>
                </div>
              </div>
            </div>

            {/* Teacher Direct Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Lời phê và nhận xét sư phạm của giáo viên:
              </label>
              <textarea
                rows={3}
                value={teacherComment}
                onChange={e => setTeacherComment(e.target.value)}
                placeholder="Nhận xét cụ thể về phép đo của học sinh..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => handleSaveGrade('redo_requested')}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200"
              >
                Yêu cầu làm lại thí nghiệm
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={isSavingGrade}
                  onClick={() => handleSaveGrade('reviewed')}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Phê duyệt & Công bố điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
