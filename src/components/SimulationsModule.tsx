import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, CheckCircle2, ChevronRight, Gauge, Sun, Scale, Info } from 'lucide-react';
import { SimpleLineChart } from './SimpleChart';

export const SimulationsModule: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'car' | 'light' | 'lever'>('car');

  return (
    <div className="space-y-6">
      {/* Simulation Header with explicit simulation disclaimer */}
      <div className="bg-gradient-to-r from-cyan-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-cyan-700/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              KHÔNG GIAN MÔ PHỎNG 2D TƯƠNG TÁC
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Thế Giới Vật Lí Ảo – Trực Quan Hóa Quy Luật</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Mô phỏng toán học giúp học sinh quan sát chuyển động, tia sáng và lực tác dụng trước khi hoặc sau khi thực hành đo đạc thực tế.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Lưu ý:</strong> Đây là dữ liệu toán học mô phỏng, phân biệt rõ với số liệu đo đạc thực tế tại phòng thí nghiệm.</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/60">
          <button
            onClick={() => setActiveSim('car')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeSim === 'car'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Gauge className="w-4 h-4" />
            Mô phỏng 1: Xe chuyển động & Đồ thị s - t
          </button>
          <button
            onClick={() => setActiveSim('light')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeSim === 'light'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sun className="w-4 h-4" />
            Mô phỏng 2: Phản xạ ánh sáng & Tia tới / Tia phản xạ
          </button>
          <button
            onClick={() => setActiveSim('lever')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              activeSim === 'lever'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Scale className="w-4 h-4" />
            Mô phỏng 3: Cân bằng Đòn bẩy & Cánh tay đòn
          </button>
        </div>
      </div>

      {/* Render Active Simulation */}
      {activeSim === 'car' && <CarSimulation />}
      {activeSim === 'light' && <LightReflectionSimulation />}
      {activeSim === 'lever' && <LeverBalanceSimulation />}
    </div>
  );
};

// ----------------- 1. CAR MOTION SIMULATION -----------------
const CarSimulation: React.FC = () => {
  const [speed, setSpeed] = useState<number>(2.0); // m/s
  const [targetDistance, setTargetDistance] = useState<number>(10.0); // m
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<{ x: string; y: number }[]>([{ x: '0s', y: 0 }]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const update = (time: number) => {
        if (lastTimeRef.current !== null) {
          const deltaSec = (time - lastTimeRef.current) / 1000;
          setElapsedTime(prevT => {
            const newT = prevT + deltaSec;
            const newS = Math.min(targetDistance, newT * speed);
            setCurrentDistance(newS);

            // Record point every 0.5s approx
            if (Math.floor(newT * 2) > Math.floor(prevT * 2)) {
              setGraphData(prev => [...prev, { x: `${newT.toFixed(1)}s`, y: Number(newS.toFixed(2)) }]);
            }

            if (newS >= targetDistance) {
              setIsRunning(false);
              return targetDistance / speed;
            }
            return newT;
          });
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(update);
      };

      requestRef.current = requestAnimationFrame(update);
    } else {
      lastTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, speed, targetDistance]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentDistance(0);
    setElapsedTime(0);
    setGraphData([{ x: '0s', y: 0 }]);
  };

  const progressPercent = Math.min(100, (currentDistance / targetDistance) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Simulation Screen */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800 text-xs font-bold">MÔ PHỎNG SỐ 1</span>
            <h3 className="font-bold text-slate-900 text-lg">Khảo sát chuyển động thẳng đều của xe</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Thời gian: <strong className="text-cyan-700">{elapsedTime.toFixed(2)} s</strong></span>
            <span>|</span>
            <span>Quãng đường: <strong className="text-emerald-700">{currentDistance.toFixed(2)} m</strong></span>
          </div>
        </div>

        {/* 2D Canvas Track Animation */}
        <div className="relative h-44 bg-gradient-to-b from-sky-50 to-slate-100 rounded-xl border border-slate-300 overflow-hidden flex flex-col justify-end p-4">
          {/* Distance markers */}
          <div className="absolute top-3 left-4 right-4 flex justify-between text-[11px] font-mono text-slate-500 border-b border-dashed border-slate-300 pb-1">
            <span>Vạch xuất phát (0 m)</span>
            <span>{(targetDistance / 2).toFixed(1)} m</span>
            <span className="text-emerald-600 font-bold">Đích ({targetDistance.toFixed(1)} m)</span>
          </div>

          {/* Road */}
          <div className="relative w-full h-12 bg-slate-700 rounded-lg flex items-center px-2 shadow-inner">
            <div className="w-full border-t border-dashed border-yellow-300 h-0"></div>

            {/* The Car */}
            <div
              className="absolute transition-all duration-75 flex flex-col items-center"
              style={{ left: `calc(${progressPercent * 0.88}% + 8px)` }}
            >
              {/* Car body */}
              <div className="relative">
                <div className="w-16 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-t-lg rounded-b shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                  {speed.toFixed(1)} m/s
                </div>
                {/* Wheels */}
                <div className="flex justify-between px-1 -mt-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-400 ${isRunning ? 'animate-spin' : ''}`}></div>
                  <div className={`w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-400 ${isRunning ? 'animate-spin' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Tốc độ xe (v):</span>
              <span className="text-cyan-700 font-mono font-bold">{speed.toFixed(1)} m/s ({ (speed * 3.6).toFixed(1) } km/h)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={speed}
              disabled={isRunning}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Quãng đường cần đi (s):</span>
              <span className="text-emerald-700 font-mono font-bold">{targetDistance.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={targetDistance}
              disabled={isRunning}
              onChange={e => setTargetDistance(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Bắt đầu chạy
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Pause className="w-4 h-4" />
              Tạm dừng
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại ban đầu
          </button>

          <span className="text-xs text-slate-500 ml-auto">
            Công thức toán học áp dụng: <strong>v = s / t ➔ t = s / v</strong>
          </span>
        </div>

        {/* Real-time Graph */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Đồ thị quãng đường - thời gian (s - t)</h4>
          <SimpleLineChart
            data={graphData}
            xLabel="Thời gian (giây)"
            yLabel="Quãng đường (m)"
            color="#0284c7"
          />
        </div>
      </div>

      {/* Interactive Prediction & Theory Quiz */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Câu hỏi dự đoán & Khám phá</span>
          </div>
          <p className="text-sm text-slate-800 font-medium">
            Nếu tăng tốc độ của xe lên gấp đôi mà giữ nguyên quãng đường, thì thời gian xe đi hết quãng đường sẽ thay đổi thế nào?
          </p>

          <div className="space-y-2">
            {[
              { id: 0, text: 'Thời gian tăng lên gấp đôi' },
              { id: 1, text: 'Thời gian giảm đi một nửa (giảm 2 lần)' },
              { id: 2, text: 'Thời gian không đổi' },
              { id: 3, text: 'Thời gian tăng lên 4 lần' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setQuizAnswer(opt.id);
                  setShowExplanation(true);
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                  quizAnswer === opt.id
                    ? opt.id === 1
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className={`p-3.5 rounded-xl text-xs space-y-1.5 ${quizAnswer === 1 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{quizAnswer === 1 ? 'Chính xác!' : 'Chưa đúng, hãy thử lại!'}</span>
              </div>
              <p>
                Từ công thức t = s / v: Khi s không đổi, thời gian t tỉ lệ nghịch với tốc độ v. Do đó khi tốc độ v tăng gấp đôi thì thời gian chuyển động t sẽ giảm đi 2 lần.
              </p>
            </div>
          )}
        </div>

        {/* Practical takeaway */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-100 text-slate-700 text-xs space-y-2">
          <h4 className="font-bold text-cyan-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-600" />
            Liên hệ thực tế: Máy bắn tốc độ giao thông
          </h4>
          <p className="leading-relaxed">
            Các camera phạt nguội trên cao tốc sử dụng 2 vạch cảm biến đặt cách nhau một khoảng s cố định (ví dụ 10m). Khi xe chạy qua vạch 1 và 2, máy ghi nhận thời gian t với độ chính xác một phần triệu giây và tính tốc độ tức thời v = s/t.
          </p>
        </div>
      </div>
    </div>
  );
};

// ----------------- 2. LIGHT REFLECTION SIMULATION -----------------
const LightReflectionSimulation: React.FC = () => {
  const [incidenceAngle, setIncidenceAngle] = useState<number>(40); // 0 to 80 degrees
  const [reflectionAngle, setReflectionAngle] = useState<number>(40);

  useEffect(() => {
    // In ideal physics law: angle of reflection = angle of incidence
    setReflectionAngle(incidenceAngle);
  }, [incidenceAngle]);

  const centerX = 200;
  const centerY = 160;
  const rayLength = 120;

  // Incident ray comes from top-left: angle with normal (vertical)
  const radI = (incidenceAngle * Math.PI) / 180;
  const incidentStartX = centerX - rayLength * Math.sin(radI);
  const incidentStartY = centerY - rayLength * Math.cos(radI);

  // Reflected ray goes to top-right
  const radR = (reflectionAngle * Math.PI) / 180;
  const reflectedEndX = centerX + rayLength * Math.sin(radR);
  const reflectedEndY = centerY - rayLength * Math.cos(radR);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">MÔ PHỎNG SỐ 2</span>
            <h3 className="font-bold text-slate-900 text-lg">Khảo sát định luật phản xạ ánh sáng</h3>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-mono">
            Định luật: <strong>i = i&apos; = {incidenceAngle}°</strong>
          </span>
        </div>

        {/* SVG Optical Bench Diagram */}
        <div className="relative h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            {/* Mirror Surface (horizontal line) */}
            <line x1="40" y1={centerY} x2="360" y2={centerY} stroke="#94a3b8" strokeWidth="4" />
            {/* Mirror Hatching marks beneath */}
            {[...Array(16)].map((_, i) => (
              <line
                key={i}
                x1={60 + i * 18}
                y1={centerY}
                x2={50 + i * 18}
                y2={centerY + 10}
                stroke="#64748b"
                strokeWidth="1.5"
              />
            ))}
            <text x="320" y={centerY + 24} fill="#cbd5e1" fontSize="11" fontWeight="bold">GƯƠNG PHẲNG</text>

            {/* Normal Line (Pháp tuyến NN') */}
            <line
              x1={centerX}
              y1={centerY - 130}
              x2={centerX}
              y2={centerY + 30}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text x={centerX + 6} y={centerY - 115} fill="#38bdf8" fontSize="11" fontFamily="monospace">Pháp tuyến (N)</text>
            <text x={centerX - 14} y={centerY + 20} fill="#f8fafc" fontSize="12" fontWeight="bold">O</text>

            {/* Protractor Arc */}
            <path
              d={`M ${centerX - 70} ${centerY} A 70 70 0 0 1 ${centerX + 70} ${centerY}`}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Incident Ray (Tia tới SI - red laser) */}
            <line
              x1={incidentStartX}
              y1={incidentStartY}
              x2={centerX}
              y2={centerY}
              stroke="#ef4444"
              strokeWidth="3.5"
            />
            {/* Arrow on incident ray */}
            <polygon
              points={`${(incidentStartX + centerX) / 2},${(incidentStartY + centerY) / 2} ${(incidentStartX + centerX) / 2 - 4},${(incidentStartY + centerY) / 2 - 8} ${(incidentStartX + centerX) / 2 + 6},${(incidentStartY + centerY) / 2 - 4}`}
              fill="#ef4444"
            />
            <text x={incidentStartX - 15} y={incidentStartY - 8} fill="#fca5a5" fontSize="12" fontWeight="bold">S (Nguồn sáng)</text>

            {/* Reflected Ray (Tia phản xạ IR - yellow/amber) */}
            <line
              x1={centerX}
              y1={centerY}
              x2={reflectedEndX}
              y2={reflectedEndY}
              stroke="#fbbf24"
              strokeWidth="3.5"
            />
            {/* Arrow on reflected ray */}
            <polygon
              points={`${(centerX + reflectedEndX) / 2},${(centerY + reflectedEndY) / 2} ${(centerX + reflectedEndX) / 2 - 6},${(centerY + reflectedEndY) / 2 + 4} ${(centerX + reflectedEndX) / 2 + 4},${(centerY + reflectedEndY) / 2 + 8}`}
              fill="#fbbf24"
            />
            <text x={reflectedEndX + 8} y={reflectedEndY - 8} fill="#fde68a" fontSize="12" fontWeight="bold">R (Tia phản xạ)</text>

            {/* Angle Arcs and Labels */}
            <text x={centerX - 35} y={centerY - 45} fill="#f87171" fontSize="12" fontWeight="bold">i = {incidenceAngle}°</text>
            <text x={centerX + 15} y={centerY - 45} fill="#fcd34d" fontSize="12" fontWeight="bold">i&apos; = {reflectionAngle}°</text>
          </svg>
        </div>

        {/* Angle Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-800">
            <span>Điều chỉnh góc tới (i):</span>
            <span className="font-mono text-base font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
              {incidenceAngle}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={incidenceAngle}
            onChange={e => setIncidenceAngle(Number(e.target.value))}
            className="w-full accent-rose-500 h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>0° (Chiếu thẳng đứng vuông góc)</span>
            <span>45° (Ứng dụng kính tiềm vọng)</span>
            <span>80° (Chiếu là là mặt gương)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[0, 30, 45, 60, 75].map(deg => (
            <button
              key={deg}
              onClick={() => setIncidenceAngle(deg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                incidenceAngle === deg
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Thử góc {deg}°
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Insights */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Nội dung định luật phản xạ ánh sáng
          </h4>
          <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0"></span>
              <span><strong>Mặt phẳng tới:</strong> Tia phản xạ luôn nằm trong cùng một mặt phẳng chứa tia tới và pháp tuyến của gương ở điểm tới.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0"></span>
              <span><strong>Độ lớn góc:</strong> Góc phản xạ luôn luôn bằng góc tới: <strong className="text-slate-900 font-mono">i&apos; = i</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0"></span>
              <span><strong>Trường hợp đặc biệt:</strong> Khi i = 0° (tia tới trùng pháp tuyến), tia phản xạ sẽ bật ngược trở lại theo phương cũ.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 text-slate-700 text-xs space-y-2">
          <h5 className="font-bold text-amber-900">Câu hỏi kiểm tra nhanh:</h5>
          <p>
            Nếu chiếu tia sáng tới gương hợp với mặt gương một góc 25°, thì góc phản xạ bằng bao nhiêu độ?
          </p>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 font-mono text-[11px] text-amber-950">
            Góc tới i = 90° - 25° = 65°.<br />
            ➔ Theo định luật phản xạ: góc phản xạ i&apos; = i = <strong>65°</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------- 3. LEVER BALANCE SIMULATION -----------------
const LeverBalanceSimulation: React.FC = () => {
  const [f1, setF1] = useState<number>(2.0); // N (left force)
  const [l1, setL1] = useState<number>(10); // cm (left arm)
  const [f2, setF2] = useState<number>(1.0); // N (right force)
  const [l2, setL2] = useState<number>(20); // cm (right arm)

  const torque1 = Number((f1 * l1).toFixed(2));
  const torque2 = Number((f2 * l2).toFixed(2));
  const diff = Number((torque1 - torque2).toFixed(2));
  const isBalanced = Math.abs(diff) < 0.1;

  // Beam tilt angle (capped between -15 and 15 degrees)
  const tiltAngle = isBalanced ? 0 : Math.max(-14, Math.min(14, (torque2 - torque1) * 0.8));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold">MÔ PHỎNG SỐ 3</span>
            <h3 className="font-bold text-slate-900 text-lg">Khảo sát điều kiện cân bằng đòn bẩy</h3>
          </div>
          {isBalanced ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              ĐÒN BẨY ĐANG CÂN BẰNG NẰM NGANG
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200">
              Đang nghiêng về bên {diff > 0 ? 'TRÁI' : 'PHẢI'} ({Math.abs(diff)} N.cm)
            </span>
          )}
        </div>

        {/* 2D Canvas Lever Beam */}
        <div className="relative h-64 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Base Stand */}
            <polygon points="180,180 220,180 205,110 195,110" fill="#475569" />
            <rect x="150" y="180" width="100" height="12" rx="4" fill="#334155" />

            {/* Pivot Triangle (Điểm tựa O) */}
            <polygon points="190,110 210,110 200,90" fill="#0284c7" />
            <circle cx="200" cy="90" r="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <text x="208" y="94" fill="#0369a1" fontSize="11" fontWeight="bold">Điểm tựa (O)</text>

            {/* Rotating Group for Lever Beam */}
            <g transform={`rotate(${tiltAngle}, 200, 90)`} className="transition-transform duration-300">
              {/* Beam */}
              <rect x="50" y="85" width="300" height="10" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
              {/* Distance markings on beam */}
              {[-12, -8, -4, 0, 4, 8, 12].map((mark, i) => (
                <line
                  key={i}
                  x1={200 + mark * 10}
                  y1="82"
                  x2={200 + mark * 10}
                  y2="98"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
              ))}

              {/* Left Load F1 */}
              <g transform={`translate(${200 - l1 * 6.5}, 95)`}>
                <line x1="0" y1="0" x2="0" y2="25" stroke="#ef4444" strokeWidth="2" />
                <rect x="-14" y="25" width="28" height="28" rx="4" fill="#ef4444" />
                <text x="0" y="43" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {f1}N
                </text>
                <text x="0" y="-12" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                  l1 = {l1}cm
                </text>
              </g>

              {/* Right Load F2 */}
              <g transform={`translate(${200 + l2 * 6.5}, 95)`}>
                <line x1="0" y1="0" x2="0" y2="25" stroke="#10b981" strokeWidth="2" />
                <rect x="-14" y="25" width="28" height="28" rx="4" fill="#10b981" />
                <text x="0" y="43" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {f2}N
                </text>
                <text x="0" y="-12" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                  l2 = {l2}cm
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Sliders for Left and Right forces and arms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900">Bên Trái (F1 × l1 = {torque1} N.cm)</h4>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Lực tác dụng F1:</span>
                <span className="text-rose-700 font-mono font-bold">{f1.toFixed(1)} N</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={f1}
                onChange={e => setF1(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Cánh tay đòn l1:</span>
                <span className="text-rose-700 font-mono font-bold">{l1} cm</span>
              </div>
              <input
                type="range"
                min="4"
                max="22"
                step="2"
                value={l1}
                onChange={e => setL1(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">Bên Phải (F2 × l2 = {torque2} N.cm)</h4>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Lực tác dụng F2:</span>
                <span className="text-emerald-700 font-mono font-bold">{f2.toFixed(1)} N</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={f2}
                onChange={e => setF2(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Cánh tay đòn l2:</span>
                <span className="text-emerald-700 font-mono font-bold">{l2} cm</span>
              </div>
              <input
                type="range"
                min="4"
                max="22"
                step="2"
                value={l2}
                onChange={e => setL2(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Quick balance solver presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Gợi ý thiết lập cân bằng mẫu:</span>
          <button
            onClick={() => { setF1(2); setL1(10); setF2(1); setL2(20); }}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            F1=2N, l1=10cm | F2=1N, l2=20cm
          </button>
          <button
            onClick={() => { setF1(1.5); setL1(12); setF2(3); setL2(6); }}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            F1=1.5N, l1=12cm | F2=3N, l2=6cm
          </button>
        </div>
      </div>

      {/* Physics Principle Note */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            Nguyên lí cân bằng đòn bẩy
          </h4>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-mono text-center text-sm font-bold">
            F1 × l1 = F2 × l2
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Muốn nâng một vật nặng F2 lớn bằng một lực F1 nhỏ, người ta phải làm cho cánh tay đòn l1 dài hơn cánh tay đòn l2 tương ứng:
            <br />
            <strong className="text-slate-800">l1 / l2 = F2 / F1</strong> (Lực được lợi bao nhiêu lần thì thiệt về đường đi bấy nhiêu lần).
          </p>
        </div>

        <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100 text-slate-700 text-xs space-y-2">
          <h5 className="font-bold text-cyan-900">Ứng dụng đời sống: Kéo cắt kim loại</h5>
          <p>
            Kéo cắt sắt có tay cầm rất dài (l1 lớn) và lưỡi cắt ngắn (l2 nhỏ), giúp tạo lực F2 rất lớn ở lưỡi để cắt đứt các sợi kim loại cứng mà tay người không thể uốn bằng lực thông thường.
          </p>
        </div>
      </div>
    </div>
  );
};
