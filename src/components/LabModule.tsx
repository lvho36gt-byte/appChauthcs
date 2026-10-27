import React, { useState, useEffect } from 'react';
import {
  Gauge, Sun, Scale, Thermometer, Zap, Activity,
  CheckCircle2, AlertTriangle, ArrowRight, Save, Bot,
  Printer, Plus, Copy, Trash2, Edit3, Image as ImageIcon,
  HelpCircle, RefreshCw, Sparkles, BookOpen, ChevronRight, Eye
} from 'lucide-react';
import { Experiment, LabSubmission, MeasurementRow, User } from '../types/physics';
import { SimpleBarChart, SimpleLineChart } from './SimpleChart';

interface LabModuleProps {
  currentUser: User;
  onOpenPhysiChat?: (topic: string) => void;
}

export const LabModule: React.FC<LabModuleProps> = ({ currentUser, onOpenPhysiChat }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'data_entry' | 'ai_analysis' | 'report'>('guide');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');

  // Student Input State for Active Experiment
  const [hypothesis, setHypothesis] = useState<string>('');
  const [rows, setRows] = useState<MeasurementRow[]>([]);
  const [studentConclusion, setStudentConclusion] = useState<string>('');
  const [evidenceNotes, setEvidenceNotes] = useState<string>('');
  const [evidenceImageUrl, setEvidenceImageUrl] = useState<string>('');
  const [applicationAnswers, setApplicationAnswers] = useState<Record<number, string>>({});

  // AI & Submission State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string>('');
  const [previousSubmissions, setPreviousSubmissions] = useState<LabSubmission[]>([]);

  // Teacher Create/Edit Experiment Modal
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [editingExp, setEditingExp] = useState<Partial<Experiment> | null>(null);

  // Load Experiments from Backend API
  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/experiments');
      const data = await res.json();
      if (data.success) {
        setExperiments(data.experiments);
        if (!selectedExp && data.experiments.length > 0) {
          selectExperiment(data.experiments[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load experiments', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      let url = '/api/submissions';
      if (currentUser.role === 'student') {
        url += `?studentId=${currentUser.id}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPreviousSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Failed to load submissions', err);
    }
  };

  useEffect(() => {
    fetchExperiments();
    fetchSubmissions();
  }, [currentUser]);

  const selectExperiment = (exp: Experiment) => {
    setSelectedExp(exp);
    setActiveTab('guide');
    setAiFeedback(null);
    setSavedSuccessMessage('');

    // Check if student has previous submission for this experiment
    const existing = previousSubmissions.find(s => s.experimentId === exp.id && (currentUser.role === 'teacher' || s.studentId === currentUser.id));
    if (existing) {
      setHypothesis(existing.hypothesis || '');
      setRows(existing.measurements && existing.measurements.length > 0 ? existing.measurements : initBlankRows(exp));
      setStudentConclusion(existing.studentConclusion || '');
      setEvidenceNotes(existing.evidenceNotes || '');
      setEvidenceImageUrl(existing.evidenceImageUrl || '');
      setApplicationAnswers(existing.applicationAnswers || {});
      setAiFeedback(existing.aiFeedback || null);
    } else {
      setHypothesis('');
      setRows(initBlankRows(exp));
      setStudentConclusion('');
      setEvidenceNotes('');
      setEvidenceImageUrl('');
      setApplicationAnswers({});
    }
  };

  const initBlankRows = (exp: Experiment): MeasurementRow[] => {
    return [
      { trial: 1, ...exp.measurementFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}) },
      { trial: 2, ...exp.measurementFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}) },
      { trial: 3, ...exp.measurementFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}) }
    ];
  };

  const handleCellChange = (rowIndex: number, key: string, value: string | number) => {
    const updated = [...rows];
    updated[rowIndex] = { ...updated[rowIndex], [key]: value };
    setRows(updated);
  };

  const addRow = () => {
    if (!selectedExp) return;
    const newTrialNum = rows.length + 1;
    setRows([
      ...rows,
      { trial: newTrialNum, ...selectedExp.measurementFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}) }
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    const updated = rows.filter((_, i) => i !== index).map((r, i) => ({ ...r, trial: i + 1 }));
    setRows(updated);
  };

  const loadSampleData = () => {
    if (selectedExp && selectedExp.sampleData) {
      setRows(JSON.parse(JSON.stringify(selectedExp.sampleData)));
    }
  };

  // Run AI Analysis via Gemini Server API
  const handleRunAiAnalysis = async () => {
    if (!selectedExp) return;
    setIsAnalyzing(true);
    setAiFeedback(null);

    try {
      const res = await fetch('/api/ai/analyze-experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentTitle: selectedExp.title,
          hypothesis,
          measurements: rows,
          studentConclusion,
          formulaDesc: selectedExp.calculatedFormula.formulaDesc
        })
      });

      const data = await res.json();
      if (data.success && data.aiFeedback) {
        setAiFeedback(data.aiFeedback);
        setActiveTab('ai_analysis');
      }
    } catch (err) {
      console.error('Error analyzing lab data:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit and Save Lab Report
  const handleSaveSubmission = async () => {
    if (!selectedExp) return;
    setIsSaving(true);
    setSavedSuccessMessage('');

    // Compute calculations map
    const calculationsSummary: Record<string, number | null> = {};
    rows.forEach(r => {
      const numRow: Record<string, number> = {};
      Object.keys(r).forEach(k => {
        numRow[k] = Number(r[k]) || 0;
      });
      calculationsSummary[`trial_${r.trial}`] = selectedExp.calculatedFormula.calculate(numRow);
    });

    const payload: LabSubmission = {
      id: `sub-${selectedExp.id}-${currentUser.id}`,
      experimentId: selectedExp.id,
      experimentTitle: selectedExp.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentCode: currentUser.studentCode || 'HS-7A1-01',
      classId: currentUser.classId || 'class-7a1',
      className: currentUser.className || '7A1',
      hypothesis,
      measurements: rows,
      calculations: calculationsSummary,
      evidenceNotes,
      evidenceImageUrl,
      studentConclusion,
      applicationAnswers,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      aiFeedback: aiFeedback || undefined
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccessMessage('Đã lưu và gửi báo cáo thực hành thành công lên hệ thống!');
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Failed to save submission:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered experiments
  const filteredExperiments = experiments.filter(exp => {
    const matchQuery = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       exp.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filterGrade === 'all' || exp.grade === filterGrade;
    return matchQuery && matchGrade;
  });

  const getExpIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gauge': return <Gauge className="w-5 h-5 text-cyan-600" />;
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Scale': return <Scale className="w-5 h-5 text-emerald-600" />;
      case 'Thermometer': return <Thermometer className="w-5 h-5 text-rose-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-indigo-500" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Teacher Quick-Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              MODULE 1 – TRỌNG TÂM
            </span>
            <span className="text-xs text-slate-500 font-medium">Quy trình nghiên cứu khoa học thực chứng</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Phòng Thí Nghiệm Vật Lí AI</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Đặt vấn đề ➔ Dự đoán giả thuyết ➔ Thực hành đo đạc ➔ Thu thập số liệu ➔ Phân tích AI ➔ Kết luận & Vận dụng.
          </p>
        </div>

        {currentUser.role === 'teacher' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingExp({
                  title: 'Thí nghiệm mới',
                  grade: 7,
                  topic: 'Khoa học tự nhiên',
                  difficulty: 'Cơ bản',
                  curriculumRef: 'KHTN THCS Chu Văn An',
                  icon: 'Gauge',
                  objectives: ['Mục tiêu 1'],
                  backgroundKnowledge: '',
                  equipment: ['Dụng cụ 1'],
                  safetyNotes: ['Tuân thủ quy định an toàn phòng thí nghiệm.'],
                  drivingQuestion: 'Câu hỏi đặt vấn đề là gì?',
                  hypothesisPrompt: 'Hãy nêu giả thuyết của em:',
                  steps: [{ step: 1, title: 'Bước 1', description: 'Thao tác...' }],
                  measurementFields: [{ key: 'value_1', label: 'Số đo 1', unit: 'm', type: 'number' }],
                  calculatedFormula: {
                    targetKey: 'result',
                    label: 'Kết quả',
                    unit: '',
                    formulaDesc: 'Công thức tính toán',
                    calculate: () => 0
                  },
                  applicationQuestions: ['Câu hỏi vận dụng 1'],
                  allowMediaUpload: true
                });
                setShowEditorModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Thêm thí nghiệm mới
            </button>
          </div>
        )}
      </div>

      {/* Main Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiment Library List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Thư viện thí nghiệm THCS</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                {filteredExperiments.length} bài
              </span>
            </div>

            {/* Search & Grade Filter */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Tìm tên thí nghiệm, chủ đề..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
              />
              <div className="flex gap-1 overflow-x-auto pb-1">
                {(['all', 6, 7, 8, 9] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setFilterGrade(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                      filterGrade === g
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredExperiments.map(exp => {
                const isSelected = selectedExp?.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => selectExperiment(exp)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-50/80 border-cyan-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                        {getExpIcon(exp.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            Lớp {exp.grade}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-medium">
                            {exp.difficulty}
                          </span>
                          {exp.isCustom && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                              Tự tạo
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug line-clamp-2">
                          {exp.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {exp.topic}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Experiment Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {selectedExp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header Bar */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800 font-bold text-xs">
                      KHTN LỚP {selectedExp.grade}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{selectedExp.curriculumRef}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      In phiếu thực hành
                    </button>
                    {onOpenPhysiChat && (
                      <button
                        onClick={() => onOpenPhysiChat(selectedExp.topic)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        Hỏi PHYSI về bài này
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedExp.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{selectedExp.drivingQuestion}</p>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'guide'
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    1. Hướng dẫn & Dụng cụ
                  </button>
                  <button
                    onClick={() => setActiveTab('data_entry')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'data_entry'
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    2. Bảng số liệu & Đồ thị thực tế
                  </button>
                  <button
                    onClick={() => setActiveTab('ai_analysis')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'ai_analysis'
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    3. Phân tích AI & Nhận xét
                  </button>
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'report'
                        ? 'bg-cyan-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    4. Kết luận & Nộp bài
                  </button>
                </div>
              </div>

              {/* TAB 1: GUIDE, BACKGROUND, OBJECTIVES */}
              {activeTab === 'guide' && (
                <div className="p-6 space-y-6">
                  {/* Objectives & Background */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Mục tiêu học tập
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1.5">
                        {selectedExp.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-cyan-600 font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-cyan-600" />
                        Kiến thức nền tảng
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedExp.backgroundKnowledge}
                      </p>
                    </div>
                  </div>

                  {/* Equipment & Safety */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Dụng cụ & Vật liệu thực tế
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {selectedExp.equipment.map((eq, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400">✓</span>
                            <span>{eq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Lưu ý an toàn thực nghiệm
                      </h4>
                      <ul className="text-xs text-amber-900 space-y-1">
                        {selectedExp.safetyNotes.map((note, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span>⚠️</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step-by-Step Procedure */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Các bước tiến hành thí nghiệm
                    </h4>
                    <div className="space-y-3">
                      {selectedExp.steps.map((st) => (
                        <div key={st.step} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {st.step}
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-900">{st.title}</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                            {st.tip && (
                              <p className="text-[11px] text-cyan-800 bg-cyan-50/80 px-2 py-0.5 rounded border border-cyan-100 inline-block font-medium">
                                💡 Mẹo: {st.tip}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActiveTab('data_entry')}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      Tiếp theo: Nhập số liệu đo đạc
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DATA ENTRY & MEASUREMENT TABLE */}
              {activeTab === 'data_entry' && (
                <div className="p-6 space-y-6">
                  {/* Student Hypothesis */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      Giả thuyết khoa học của em trước khi đo:
                    </label>
                    <p className="text-xs text-slate-500">{selectedExp.hypothesisPrompt}</p>
                    <textarea
                      rows={2}
                      value={hypothesis}
                      onChange={e => setHypothesis(e.target.value)}
                      placeholder="Nhập dự đoán của em (Ví dụ: Em dự đoán khi tăng quãng đường thì thời gian tăng tỉ lệ thuận...)"
                      className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                    />
                  </div>

                  {/* Measurement Table */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Bảng thu thập số liệu thực tế (Phép đo lặp)
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Thực hiện tối thiểu 3 lần đo để loại trừ sai số ngẫu nhiên.
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={loadSampleData}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-100 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Nạp dữ liệu mẫu
                        </button>
                        <button
                          onClick={addRow}
                          className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-800 text-xs font-bold hover:bg-cyan-200 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Thêm lần đo
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3 w-16 text-center">Lần đo</th>
                            {selectedExp.measurementFields.map(f => (
                              <th key={f.key} className="py-2.5 px-3">
                                {f.label} ({f.unit})
                              </th>
                            ))}
                            <th className="py-2.5 px-3 bg-cyan-50 text-cyan-900">
                              {selectedExp.calculatedFormula.label} ({selectedExp.calculatedFormula.unit})
                            </th>
                            <th className="py-2.5 px-2 w-12 text-center">Xóa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {rows.map((row, rIdx) => {
                            // Calculate formula result for this row
                            const numRow: Record<string, number> = {};
                            Object.keys(row).forEach(k => {
                              numRow[k] = Number(row[k]) || 0;
                            });
                            const computed = selectedExp.calculatedFormula.calculate(numRow);

                            return (
                              <tr key={rIdx} className="hover:bg-slate-50/70">
                                <td className="py-2 px-3 text-center font-bold text-slate-600">
                                  #{row.trial}
                                </td>
                                {selectedExp.measurementFields.map(f => (
                                  <td key={f.key} className="py-2 px-3">
                                    <input
                                      type="number"
                                      step={f.step || 0.1}
                                      min={f.min || 0}
                                      value={row[f.key] ?? ''}
                                      onChange={e => handleCellChange(rIdx, f.key, e.target.value)}
                                      placeholder={`0.0`}
                                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-xs bg-slate-50/50"
                                    />
                                  </td>
                                ))}
                                <td className="py-2 px-3 bg-cyan-50/50 font-mono font-bold text-cyan-800">
                                  {computed !== null ? computed : <span className="text-slate-400 font-normal italic">Đang chờ nhập</span>}
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <button
                                    onClick={() => removeRow(rIdx)}
                                    disabled={rows.length <= 1}
                                    className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-100 flex items-center justify-between text-xs text-cyan-900">
                      <span><strong>Công thức chuẩn toán học:</strong> {selectedExp.calculatedFormula.formulaDesc}</span>
                      <span className="font-mono">Tự động tính bởi thuật toán</span>
                    </div>
                  </div>

                  {/* Evidence Media Upload */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-cyan-600" />
                      Minh chứng thí nghiệm (Ảnh hoặc Ghi chú quan sát)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Ghi chú mô tả hiện tượng quan sát được:
                        </label>
                        <textarea
                          rows={3}
                          value={evidenceNotes}
                          onChange={e => setEvidenceNotes(e.target.value)}
                          placeholder="Mô tả hiện tượng: xe chuyển động mượt, vệt laser rõ nét trên mặt đĩa, đòn bẩy thăng bằng..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Đính kèm ảnh minh chứng (URL hoặc Tải tệp an toàn):
                        </label>
                        <input
                          type="text"
                          value={evidenceImageUrl}
                          onChange={e => setEvidenceImageUrl(e.target.value)}
                          placeholder="Dán liên kết ảnh thí nghiệm..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white mb-2"
                        />
                        <span className="text-[10px] text-slate-500 block">
                          * Lưu ý bảo mật: Không tải lên ảnh lộ khuôn mặt cá nhân của học sinh.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Chart of Measurements */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Biểu đồ số liệu các lần đo
                    </h4>
                    <SimpleBarChart
                      data={rows.map(r => {
                        const numRow: Record<string, number> = {};
                        Object.keys(r).forEach(k => { numRow[k] = Number(r[k]) || 0; });
                        const computed = selectedExp.calculatedFormula.calculate(numRow) || 0;
                        return {
                          label: `Lần ${r.trial}`,
                          value1: computed,
                          label1: selectedExp.calculatedFormula.label
                        };
                      })}
                      unit={` ${selectedExp.calculatedFormula.unit}`}
                      color1="#12B9E8"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setActiveTab('guide')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Quay lại hướng dẫn
                    </button>
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={isAnalyzing}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          PHYSI AI đang phân tích dữ liệu...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4" />
                          Gửi dữ liệu cho PHYSI AI phân tích
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: AI ANALYSIS & FEEDBACK */}
              {activeTab === 'ai_analysis' && (
                <div className="p-6 space-y-6">
                  {!aiFeedback ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">Chưa có kết quả phân tích AI</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Hãy nhập số liệu các lần đo ở bước 2 và bấm nút &quot;Gửi dữ liệu cho PHYSI AI phân tích&quot;.
                      </p>
                      <button
                        onClick={handleRunAiAnalysis}
                        disabled={isAnalyzing}
                        className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold inline-flex items-center gap-2"
                      >
                        {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Phân tích ngay
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Summary Banner */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                            <Bot className="w-4 h-4 text-cyan-600" />
                            Đánh giá từ Trợ lý PHYSI AI
                          </span>
                          {aiFeedback.scoreSuggestion && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Điểm tham khảo: {aiFeedback.scoreSuggestion}/100
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {aiFeedback.summary}
                        </p>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                          <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Điểm em thực hiện tốt
                          </h5>
                          <ul className="text-xs text-emerald-950 space-y-1.5">
                            {aiFeedback.strengths?.map((st: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600">✓</span>
                                <span>{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                          <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Gợi ý hoàn thiện & Sai số cần lưu ý
                          </h5>
                          <ul className="text-xs text-amber-950 space-y-1.5">
                            {aiFeedback.improvements?.map((imp: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-600">•</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Guiding Questions */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-cyan-600" />
                          Câu hỏi gợi mở tư duy khoa học của PHYSI
                        </h5>
                        <ul className="text-xs text-slate-700 space-y-2">
                          {aiFeedback.guidingQuestions?.map((q: string, idx: number) => (
                            <li key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                              <span className="font-bold text-cyan-600">Q{idx + 1}:</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Next Step */}
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                        <div>
                          <strong>Bước thử thách tiếp theo:</strong> {aiFeedback.nextStep}
                        </div>
                        <button
                          onClick={() => setActiveTab('report')}
                          className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-bold shrink-0 ml-4 shadow-2xs"
                        >
                          Chuyển sang bước kết luận
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CONCLUSION, APPLICATION & FINAL SUBMISSION */}
              {activeTab === 'report' && (
                <div className="p-6 space-y-6">
                  {/* Student Conclusion */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      Kết luận của học sinh sau khi đối chiếu số liệu với giả thuyết:
                    </label>
                    <textarea
                      rows={3}
                      value={studentConclusion}
                      onChange={e => setStudentConclusion(e.target.value)}
                      placeholder="Dựa vào số liệu các lần đo ở bảng trên, em rút ra kết luận gì về quy luật vật lí? Giả thuyết ban đầu của em có đúng không?"
                      className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                    />
                  </div>

                  {/* Application Questions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Câu hỏi vận dụng kiến thức vào thực tiễn
                    </h4>
                    {selectedExp.applicationQuestions.map((q, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                        <p className="text-xs font-bold text-slate-800">
                          Câu {idx + 1}: {q}
                        </p>
                        <textarea
                          rows={2}
                          value={applicationAnswers[idx] || ''}
                          onChange={e => setApplicationAnswers({ ...applicationAnswers, [idx]: e.target.value })}
                          placeholder="Nhập câu trả lời của em..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-slate-50/50"
                        />
                      </div>
                    ))}
                  </div>

                  {/* 100-Point Rubric Reference */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wider">
                      Thang điểm đánh giá bài thực hành (Thang 100 điểm)
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <div className="font-bold text-cyan-700">20 điểm</div>
                        <div className="text-slate-500 mt-0.5">Quy trình & An toàn</div>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <div className="font-bold text-cyan-700">25 điểm</div>
                        <div className="text-slate-500 mt-0.5">Thu thập số liệu thật</div>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <div className="font-bold text-cyan-700">25 điểm</div>
                        <div className="text-slate-500 mt-0.5">Phân tích khoa học</div>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <div className="font-bold text-cyan-700">15 điểm</div>
                        <div className="text-slate-500 mt-0.5">Bảng & Biểu đồ</div>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <div className="font-bold text-cyan-700">15 điểm</div>
                        <div className="text-slate-500 mt-0.5">Kết luận & Cải tiến</div>
                      </div>
                    </div>
                  </div>

                  {savedSuccessMessage && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{savedSuccessMessage}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('data_entry')}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Quay lại bảng số liệu
                    </button>
                    <button
                      onClick={handleSaveSubmission}
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Đang lưu hồ sơ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Nộp báo cáo thí nghiệm lên hệ thống
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              Chọn một thí nghiệm ở danh sách bên trái để bắt đầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
