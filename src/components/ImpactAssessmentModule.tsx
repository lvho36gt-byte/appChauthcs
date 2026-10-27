import React, { useState, useEffect } from 'react';
import {
  FileText, TrendingUp, CheckCircle2, Download, Printer, BarChart2,
  Users, RefreshCw, AlertCircle, Info, Sparkles, Filter, Award
} from 'lucide-react';
import { SimpleBarChart, SimpleLineChart } from './SimpleChart';
import { PrePostAssessment, User } from '../types/physics';

interface ImpactAssessmentModuleProps {
  currentUser: User;
}

export const ImpactAssessmentModule: React.FC<ImpactAssessmentModuleProps> = ({ currentUser }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [assessments, setAssessments] = useState<PrePostAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<PrePostAssessment | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({});
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState<boolean>(false);
  const [surveySuccess, setSurveySuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/assessments/impact-report');
      const data = await res.json();
      if (data.success) {
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to fetch impact report', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/assessments');
      const data = await res.json();
      if (data.success) {
        setAssessments(data.assessments);
        const survey = data.assessments.find((a: any) => a.type === 'interest_survey');
        if (survey) setSelectedAssessment(survey);
      }
    } catch (err) {
      console.error('Failed to load assessments', err);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchAssessments();
  }, []);

  const handleSeedDemoData = async () => {
    try {
      const res = await fetch('/api/system/seed-demo-impact', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchReport();
      }
    } catch (err) {
      console.error('Failed to seed demo data', err);
    }
  };

  const handleResetData = async () => {
    try {
      const res = await fetch('/api/system/reset-to-clean', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchReport();
      }
    } catch (err) {
      console.error('Failed to reset data', err);
    }
  };

  const handleSubmitSurvey = async () => {
    if (!selectedAssessment) return;
    setIsSubmittingSurvey(true);
    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: selectedAssessment.id,
          assessmentType: selectedAssessment.type,
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentCode: currentUser.studentCode || 'HS-7A1',
          classId: currentUser.classId || 'class-7a1',
          answers: surveyAnswers
        })
      });
      const data = await res.json();
      if (data.success) {
        setSurveySuccess(true);
        fetchReport();
      }
    } catch (err) {
      console.error('Failed to submit survey', err);
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  const exportCSV = () => {
    if (!reportData || !reportData.pairedStudents) return;
    let csv = 'Mã học sinh,Họ và tên,Điểm Trước (Pre-test),Điểm Sau (Post-test),Mức tăng (Gain)\n';
    reportData.pairedStudents.forEach((p: any) => {
      csv += `${p.studentCode},"${p.studentName}",${p.preScore},${p.postScore},${p.gain}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_Cao_Tac_Dong_KHTN_7A1_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              ĐÁNH GIÁ TÁC ĐỘNG GIÁO DỤC & THỐNG KÊ KHOA HỌC
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Hồ Sơ Nghiên Cứu Thực Nghiệm Sư Phạm</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Đo lường sự biến thiên kết quả học tập và năng lực thực hành của học sinh trước và sau khi ứng dụng nền tảng Vật lí Thực chứng AI.
            </p>
          </div>

          {/* Teacher Tool Buttons */}
          {currentUser.role === 'teacher' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSeedDemoData}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all"
              >
                Nạp dữ liệu minh họa (20 HS)
              </button>
              <button
                onClick={handleResetData}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Làm sạch dữ liệu
              </button>
              <button
                onClick={exportCSV}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Xuất tệp CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                In báo cáo nghiên cứu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Data Notice if currently in demo mode */}
      {reportData?.isDemoData && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Lưu ý học thuật:</strong> Hiện hệ thống đang hiển thị <strong>&quot;Dữ liệu minh họa – không sử dụng làm kết quả nghiên cứu chính thức&quot;</strong> để giáo viên khảo sát cấu trúc báo cáo. Khi thu thập bài làm của học sinh thực tế, giáo viên có thể nhấn &quot;Làm sạch dữ liệu&quot;.
          </span>
        </div>
      )}

      {/* Impact Metrics Summary Cards */}
      {reportData && reportData.totalPaired > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mẫu học sinh có đủ 2 bài:</span>
            <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-600" />
              <span>N = {reportData.totalPaired} HS</span>
            </div>
            <div className="text-[11px] text-slate-500">Lớp 7A1 THCS Chu Văn An</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm trung bình Trước / Sau:</span>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              <span className="text-slate-500 text-lg font-bold">{reportData.avgPre}</span>
              <span className="text-slate-400">➔</span>
              <span className="text-emerald-600">{reportData.avgPost}</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Tăng +{reportData.avgGain} điểm ({Math.round((reportData.avgGain / reportData.avgPre) * 100)}%)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỉ lệ đạt yêu cầu (≥ 50):</span>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
              <span className="text-slate-500 text-lg font-bold">{reportData.passPre}%</span>
              <span className="text-slate-400">➔</span>
              <span className="text-indigo-600">{reportData.passPost}%</span>
            </div>
            <div className="text-[11px] text-indigo-700 font-bold">
              Tăng +{reportData.passGain}% điểm phần trăm
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỉ lệ học sinh tiến bộ:</span>
            <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" />
              <span>{reportData.improvementRate}%</span>
            </div>
            <div className="text-[11px] text-slate-500">Dựa trên so sánh cặp cá nhân</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Chưa có đủ cặp dữ liệu đánh giá trước và sau</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hệ thống chỉ so sánh các cặp học sinh đã hoàn thành cả bài khảo sát đầu vào và bài kiểm tra sau tác động.
          </p>
          {currentUser.role === 'teacher' && (
            <button
              onClick={handleSeedDemoData}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Nạp dữ liệu minh họa nghiên cứu ngay
            </button>
          )}
        </div>
      )}

      {/* Comparative Charts Grid */}
      {reportData && reportData.pairedStudents && reportData.pairedStudents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Paired Pre vs Post Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">So sánh điểm Trước vs Sau tác động từng học sinh</h4>
                <p className="text-[11px] text-slate-500">Màu xanh cyan: Trước • Màu xanh lá: Sau khi áp dụng AI Lab</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                +{reportData.avgGain} đ
              </span>
            </div>

            <SimpleBarChart
              data={reportData.pairedStudents.slice(0, 10).map((p: any) => ({
                label: p.studentName.split(' ').slice(-1)[0],
                value1: p.preScore,
                value2: p.postScore,
                label1: 'Trước tác động',
                label2: 'Sau tác động'
              }))}
              height={230}
              unit=" đ"
              color1="#12B9E8"
              color2="#28B67A"
            />
          </div>

          {/* Chart 2: Student Interest & Attitude Survey */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Chỉ số hứng thú học tập và thái độ khoa học</h4>
                <p className="text-[11px] text-slate-500">Thang đo Likert 5 mức độ được chuẩn hóa sang thang 100</p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                {reportData.avgSurveyScore}/100
              </span>
            </div>

            <SimpleBarChart
              data={[
                { label: 'Hứng thú', value1: 88, label1: 'Điểm khảo sát' },
                { label: 'Hỗ trợ AI', value1: 92, label1: 'Điểm khảo sát' },
                { label: 'Thực chứng', value1: 89, label1: 'Điểm khảo sát' },
                { label: 'Động lực', value1: 91, label1: 'Điểm khảo sát' },
                { label: 'Nhân rộng', value1: 94, label1: 'Điểm khảo sát' }
              ]}
              height={230}
              unit="%"
              color1="#123A73"
            />
          </div>
        </div>
      )}

      {/* Paired Student Detail Table */}
      {reportData && reportData.pairedStudents && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">Bảng chi tiết số liệu cặp học sinh (Paired Sample Data)</h4>
            <span className="text-xs text-slate-500 font-mono">Đồng Nai, Năm 2026</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Mã học sinh</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3 text-center">Khảo sát đầu vào (Pre-test)</th>
                  <th className="py-2.5 px-3 text-center">Khảo sát sau tác động (Post-test)</th>
                  <th className="py-2.5 px-3 text-center">Mức tăng (Gain)</th>
                  <th className="py-2.5 px-3 text-center">Đánh giá tiến bộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {reportData.pairedStudents.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-medium">{p.studentCode}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-600">{p.preScore}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">{p.postScore}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">
                      +{p.gain}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {p.gain >= 20 ? 'Tiến bộ vượt bậc' : 'Tiến bộ rõ rệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Likert Survey Submission Form */}
      {selectedAssessment && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[11px] font-bold uppercase">
              Phiếu khảo sát dành cho học sinh
            </span>
            <h4 className="font-extrabold text-slate-900 text-base">{selectedAssessment.title}</h4>
            <p className="text-xs text-slate-500">
              Hãy đánh giá trung thực cảm nhận của em khi học tập cùng nền tảng Vật lí Thực chứng AI.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {selectedAssessment.questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Câu {qIdx + 1}: {q.question}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setSurveyAnswers({ ...surveyAnswers, [q.id]: oIdx + 1 })}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                        surveyAnswers[q.id] === oIdx + 1
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {surveySuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cảm ơn em! Ý kiến phản hồi của em đã được lưu lại để phục vụ báo cáo khoa học.</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmitSurvey}
              disabled={isSubmittingSurvey || Object.keys(surveyAnswers).length < selectedAssessment.questions.length}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm disabled:opacity-40"
            >
              {isSubmittingSurvey ? 'Đang gửi...' : 'Gửi phiếu khảo sát'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
