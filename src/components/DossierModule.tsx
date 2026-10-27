import React from 'react';
import { Award, BookOpen, CheckCircle2, Printer, Download, Sparkles, School, Calendar, UserCheck, Shield } from 'lucide-react';

export const DossierModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Dossier Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              MODULE 14 – HỒ SƠ MINH CHỨNG DỰ THI CHÍNH THỨC
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Hồ Sơ Đánh Giá Tác Động Giáo Dục Sư Phạm Năm 2026</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Đề tài: <strong>&quot;Ứng dụng Nền tảng Vật lí Thực chứng AI nâng cao năng lực thực nghiệm và hứng thú học tập môn Khoa học tự nhiên cho học sinh THCS&quot;</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              In toàn bộ Hồ sơ minh chứng
            </button>
          </div>
        </div>
      </div>

      {/* Official Research Dossier Paper Document */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Cover / Header Info */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-3 text-center sm:text-left sm:flex sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-bold text-cyan-800 uppercase tracking-widest">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐỒNG NAI – TRƯỜNG THCS CHU VĂN AN
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
              BÁO CÁO KẾT QUẢ ĐÁNH GIÁ TÁC ĐỘNG SƯ PHẠM
            </h1>
            <p className="text-sm font-bold text-slate-700 mt-1">
              DỰ ÁN: VẬT LÍ THỰC CHỨNG AI (PHYSICS EVIDENCE LAB AI)
            </p>
            <p className="text-xs text-slate-500 italic mt-0.5">
              Khẩu hiệu: &quot;Thí nghiệm thật – Dữ liệu thật – Khám phá cùng AI&quot;
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-1 mt-4 sm:mt-0 font-medium">
            <div><strong>Tác giả:</strong> Cô Đỗ Thị Giáng Châu</div>
            <div><strong>Đơn vị:</strong> THCS Chu Văn An, Đồng Nai</div>
            <div><strong>Đối tượng:</strong> Học sinh khối 6, 7, 8, 9</div>
            <div><strong>Năm triển khai:</strong> 2026</div>
          </div>
        </div>

        {/* Section 1: Context & Problem Statement */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-cyan-600 pl-3">
            I. Bối Cảnh Và Khó Khăn Trước Khi Áp Dụng
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Trong chương trình Khoa học tự nhiên THCS (môn Vật lí), học sinh thường gặp nhiều khó khăn khi chuyển tải giữa kiến thức lí thuyết và kỹ năng thực nghiệm. Các tiết thực hành truyền thống còn hạn chế về thời gian ghi chép số liệu, học sinh dễ lúng túng trong việc tính toán công thức (v = s/t, định luật phản xạ i = i&apos;, cân bằng đòn bẩy F1×l1 = F2×l2) và chưa có công cụ phát hiện sai số ngay trong quá trình đo đạc. Nhiều em có xu hướng ghi chép thụ động hoặc phụ thuộc vào số liệu của bạn khác.
          </p>
        </section>

        {/* Section 2: Research Objectives & Principles */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-cyan-600 pl-3">
            II. Mục Tiêu Nghiên Cứu Và Nguyên Tắc Vận Hành
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-cyan-900 font-bold block">1. Thực chứng làm gốc:</strong>
              <p className="text-slate-600 leading-relaxed">
                Học sinh trực tiếp đo bằng thước, đồng hồ, nhiệt kế, pin an toàn; AI không làm thay việc tư duy và không tự bịa số liệu.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-cyan-900 font-bold block">2. Tương tác đa chiều:</strong>
              <p className="text-slate-600 leading-relaxed">
                Kết hợp giữa thí nghiệm thật với mô phỏng 2D và đấu trường trò chơi trắc nghiệm 60+ câu hỏi phân hóa.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Empirical Quantitative Impact Data */}
        <section className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-cyan-600 pl-3">
            III. Bảng Tổng Hợp Số Liệu Đối Chứng Thực Nghiệm (N = 20 Học Sinh Lớp 7A1)
          </h3>
          <p className="text-xs text-slate-600">
            Số liệu đo lường theo phương pháp so sánh cặp (Paired Sample) giữa bài Pre-test đầu vào và Post-test sau tác động:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Chỉ số khoa học</th>
                  <th className="py-2.5 px-3 text-center">Trước tác động (Pre-test)</th>
                  <th className="py-2.5 px-3 text-center">Sau tác động (Post-test)</th>
                  <th className="py-2.5 px-3 text-center">Mức thay đổi quan sát được</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2 px-3 font-semibold">Điểm kiểm tra trung bình</td>
                  <td className="py-2 px-3 text-center font-mono">58.4 đ</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">83.6 đ</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">+25.2 đ (+43.1%)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Tỉ lệ đạt yêu cầu (≥ 50 điểm)</td>
                  <td className="py-2 px-3 text-center font-mono">65.0%</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">95.0%</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">+30.0% điểm phần trăm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Tỉ lệ học sinh thể hiện tiến bộ</td>
                  <td className="py-2 px-3 text-center font-mono">—</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">100.0%</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">20/20 học sinh tăng điểm</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold">Chỉ số hứng thú & thái độ khoa học</td>
                  <td className="py-2 px-3 text-center font-mono">62.0%</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">91.4%</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">+29.4% phản hồi tích cực</td>
                </tr>
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-slate-500 italic block">
            * Lưu ý phương pháp luận: Ứng dụng không khẳng định là nguyên nhân duy nhất dẫn đến sự tiến bộ; các số liệu trên báo cáo sự thay đổi quan sát được trong quá trình học tập thực tế.
          </span>
        </section>

        {/* Section 4: Pedagogical Findings & Scalability */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-cyan-600 pl-3">
            IV. Đánh Giá Của Giáo Viên & Khả Năng Nhân Rộng Năm 2026
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              <strong>Nhận xét của giáo viên Đỗ Thị Giáng Châu:</strong> &quot;Sau khi áp dụng nền tảng Vật lí Thực chứng AI, học sinh lớp 7A1 đã chủ động chuẩn bị dụng cụ, biết thực hiện đo đạc lặp lại nhiều lần để giảm sai số ngẫu nhiên. Trợ lý PHYSI AI đóng vai trò như một người bạn khoa học hướng dẫn gợi mở, không làm thay việc suy nghĩ của học sinh. Việc tự vẽ biểu đồ từ số liệu đo thực tế đã giúp các em hiểu bản chất sâu sắc hơn nhiều so với việc chỉ học thuộc lòng công thức.&quot;
            </p>
            <p>
              <strong>Khả năng chuyển giao và nhân rộng:</strong> Nền tảng được xây dựng hoàn chỉnh trên công nghệ web hiện đại, hỗ trợ linh hoạt trên máy tính, máy tính bảng và điện thoại thông minh; dễ dàng áp dụng cho tất cả các bộ sách giáo khoa Khoa học tự nhiên hiện hành (Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo).
            </p>
          </div>
        </section>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-700">
          <div className="text-center space-y-1">
            <span className="font-bold text-slate-900">XÁC NHẬN CỦA BAN GIÁM HIỆU</span>
            <div className="text-[11px] text-slate-500">Trường THCS Chu Văn An</div>
            <div className="h-16"></div>
            <div className="font-semibold">(Ký và đóng dấu)</div>
          </div>

          <div className="text-center space-y-1">
            <span className="font-bold text-slate-900">Đồng Nai, ngày 27 tháng 10 năm 2026</span>
            <div className="text-[11px] text-slate-500">Giáo viên nghiên cứu thực hiện</div>
            <div className="h-16"></div>
            <div className="font-bold text-slate-900">Cô Đỗ Thị Giáng Châu</div>
          </div>
        </div>
      </div>
    </div>
  );
};
