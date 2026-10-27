import React from 'react';

interface BarChartProps {
  data: { label: string; value1: number; value2?: number; label1?: string; label2?: string }[];
  height?: number;
  maxVal?: number;
  unit?: string;
  color1?: string;
  color2?: string;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  height = 220,
  maxVal,
  unit = '',
  color1 = '#12B9E8', // Cyan
  color2 = '#28B67A'  // Green
}) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-400 text-sm">Chưa có dữ liệu biểu đồ</div>;
  }

  const computedMax = maxVal || Math.max(...data.flatMap(d => [d.value1, d.value2 || 0]), 10) * 1.15;

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-500">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio, i) => (
            <div key={i} className="flex items-center w-full border-b border-slate-200">
              <span className="w-10 pr-2 text-right font-mono text-[10px] text-slate-500">
                {Math.round(computedMax * ratio)}{unit}
              </span>
              <div className="flex-1 h-0"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 pl-12 pr-4 flex items-end justify-around gap-2 pt-4">
          {data.map((item, idx) => {
            const h1 = Math.min(100, Math.max(0, (item.value1 / computedMax) * 100));
            const h2 = item.value2 !== undefined ? Math.min(100, Math.max(0, (item.value2 / computedMax) * 100)) : null;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full pb-1">
                  {/* Bar 1 */}
                  <div
                    style={{ height: `${h1}%`, backgroundColor: color1 }}
                    className="w-full max-w-[28px] rounded-t transition-all duration-500 hover:brightness-110 relative flex justify-center group-hover:shadow-md"
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-slate-900 text-white text-[11px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {item.label1 ? `${item.label1}: ` : ''}{item.value1}{unit}
                    </span>
                  </div>

                  {/* Optional Bar 2 */}
                  {h2 !== null && (
                    <div
                      style={{ height: `${h2}%`, backgroundColor: color2 }}
                      className="w-full max-w-[28px] rounded-t transition-all duration-500 hover:brightness-110 relative flex justify-center group-hover:shadow-md"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-slate-900 text-white text-[11px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                        {item.label2 ? `${item.label2}: ` : ''}{item.value2}{unit}
                      </span>
                    </div>
                  )}
                </div>
                {/* X Label */}
                <span className="text-[11px] font-medium text-slate-600 truncate max-w-[65px] text-center mt-1.5">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface LineChartProps {
  data: { x: number | string; y: number }[];
  xLabel?: string;
  yLabel?: string;
  color?: string;
  unitY?: string;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  xLabel = '',
  yLabel = '',
  color = '#123A73',
  unitY = ''
}) => {
  if (!data || data.length < 2) {
    return <div className="text-center py-6 text-slate-400 text-xs">Cần ít nhất 2 điểm đo để dựng đồ thị</div>;
  }

  const maxY = Math.max(...data.map(d => d.y), 1) * 1.15;
  const minY = Math.min(...data.map(d => d.y), 0);
  const rangeY = maxY - minY || 1;

  const points = data.map((d, i) => {
    const xPercent = (i / (data.length - 1)) * 100;
    const yPercent = 100 - ((d.y - minY) / rangeY) * 100;
    return `${xPercent},${yPercent}`;
  }).join(' ');

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{yLabel}</span>
        <span>{xLabel}</span>
      </div>
      <div className="relative w-full h-44 bg-slate-50/80 rounded-lg p-3 border border-slate-200">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />

          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={color}
            fillOpacity="0.12"
          />

          {/* Line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />

          {/* Points */}
          {data.map((d, i) => {
            const xPercent = (i / (data.length - 1)) * 100;
            const yPercent = 100 - ((d.y - minY) / rangeY) * 100;
            return (
              <circle
                key={i}
                cx={xPercent}
                cy={yPercent}
                r="3.5"
                fill="#ffffff"
                stroke={color}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* X values beneath */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
          {data.map((d, i) => (
            <span key={i}>{d.x}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
