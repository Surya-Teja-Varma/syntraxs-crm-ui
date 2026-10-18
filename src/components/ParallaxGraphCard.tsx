import React, { useState, useRef } from 'react';

export function ParallaxGraphCard() {
  const [activeTab, setActiveTab] = useState<'6M' | 'Q' | 'M'>('6M');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const tabData = {
    '6M': { revenue: '₹42.6L', path: 'M 10 70 Q 80 55, 140 60 T 280 40 T 400 15', dotX: 400, dotY: 15 },
    'Q': { revenue: '₹28.4L', path: 'M 10 75 Q 90 65, 150 50 T 290 35 T 400 22', dotX: 400, dotY: 22 },
    'M': { revenue: '₹12.8L', path: 'M 10 80 Q 100 70, 160 55 T 300 45 T 400 30', dotX: 400, dotY: 30 },
  };

  const currentData = tabData[activeTab];

  // Calculated 3D transforms for parallax depth layers
  const mainCardTransform = isHovered
    ? `perspective(1200px) rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg) scale3d(1.02, 1.02, 1.02)`
    : 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';

  const floatCard1Transform = isHovered
    ? `perspective(1200px) translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 55px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`
    : 'perspective(1200px) translate3d(0px, 0px, 30px)';

  const floatCard2Transform = isHovered
    ? `perspective(1200px) translate3d(${mousePos.x * 32}px, ${mousePos.y * 32}px, 75px) rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg)`
    : 'perspective(1200px) translate3d(0px, 0px, 40px)';

  const glareStyle = isHovered
    ? {
        background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
      }
    : { background: 'none' };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[560px] mx-auto p-4 select-none cursor-pointer group"
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic Grid Background Layer with Parallax */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none transition-transform duration-300 ease-out opacity-70"
        style={{
          transform: isHovered
            ? `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, -30px)`
            : 'translate3d(0, 0, -30px)',
        }}
      >
        {/* Fine grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl" />
        {/* Diagonal Ray Lines */}
        <div className="absolute top-1/4 -left-10 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent -rotate-12" />
        <div className="absolute top-2/3 -left-10 w-[140%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -rotate-12" />
      </div>

      {/* Outer Wrapper for floating animation + mouse parallax */}
      <div className="relative z-10 animate-parallax-float">
        {/* Main Graph Card */}
        <div
          className="relative bg-[#0D1222]/90 backdrop-blur-xl border border-[#1E2640] rounded-2xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-transform duration-200 ease-out overflow-hidden"
          style={{ transform: mainCardTransform, transformStyle: 'preserve-3d' }}
        >
          {/* Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={glareStyle}
          />

          {/* Card Top Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Won Revenue · Q4
            </span>
            <div className="flex items-center bg-[#151C33] p-1 rounded-lg border border-slate-800/80">
              {(['6M', 'Q', 'M'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab);
                  }}
                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                    activeTab === tab
                      ? 'bg-[#2A3454] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Amount */}
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {currentData.revenue}
          </div>

          {/* SVG Line Graph */}
          <div className="relative w-full h-28 mb-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 410 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0088FF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0088FF" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Dashed Baseline */}
              <path
                d="M 10 75 Q 120 70, 240 55 T 400 35"
                fill="none"
                stroke="#2A3554"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Gradient Area under curve */}
              <path
                d={`${currentData.path} L 400 90 L 10 90 Z`}
                fill="url(#areaGradient)"
              />

              {/* Main Glowing Curve */}
              <path
                d={currentData.path}
                fill="none"
                stroke="#2589FE"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                className="transition-all duration-500 ease-in-out"
              />

              {/* End Dot with Glow */}
              <circle
                cx={currentData.dotX}
                cy={currentData.dotY}
                r="4.5"
                fill="#38BDF8"
                className="animate-pulse"
              />
              <circle
                cx={currentData.dotX}
                cy={currentData.dotY}
                r="8"
                fill="#38BDF8"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          {/* Funnel Stage Horizontal Progress Bars */}
          <div className="space-y-2.5 pt-1">
            {[
              { label: 'New', width: '92%', color: 'bg-[#0070F3]' },
              { label: 'Interested', width: '74%', color: 'bg-[#0070F3]' },
              { label: 'Follow up', width: '52%', color: 'bg-[#0070F3]' },
              { label: 'Quotation', width: '34%', color: 'bg-[#0070F3]' },
              { label: 'Won', width: '22%', color: 'bg-[#10B981]', count: '19' },
            ].map((stage) => (
              <div key={stage.label} className="flex items-center text-xs">
                <span className="w-20 text-slate-400 font-medium text-[11px] truncate">
                  {stage.label}
                </span>
                <div className="flex-1 h-3 bg-[#151B2E] rounded-full overflow-hidden relative mr-2">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: stage.width }}
                  />
                </div>
                {stage.count && (
                  <span className="text-[11px] font-bold text-slate-300 w-4 text-right">
                    {stage.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Card 1: Win Conversion (Top Right) */}
        <div
          className="absolute -top-3 -right-3 sm:-right-6 w-48 sm:w-52 bg-[#12182B]/95 backdrop-blur-xl border border-[#242F50] rounded-xl p-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out z-20"
          style={{ transform: floatCard1Transform, transformStyle: 'preserve-3d' }}
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Win Conversion
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-black text-white">31.8%</span>
            <span className="text-xs font-bold text-emerald-400">+4.2</span>
          </div>

          {/* Pill Bar Chart */}
          <div className="flex items-end gap-1.5 h-7 pt-1">
            {[35, 55, 30, 80, 50, 90, 70, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#0070F3] rounded-sm transition-all duration-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Floating Card 2: Recent Deal Activity (Bottom Left) */}
        <div
          className="absolute -bottom-6 -left-3 sm:-left-6 w-60 sm:w-64 bg-[#12182B]/95 backdrop-blur-xl border border-[#242F50] rounded-xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out z-30"
          style={{ transform: floatCard2Transform, transformStyle: 'preserve-3d' }}
        >
          <div className="space-y-2">
            {/* Freshworks */}
            <div className="flex items-center justify-between text-xs p-1 rounded hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-[11px]">Freshworks</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#1B243B] text-slate-300">
                won
              </span>
              <span className="font-semibold text-slate-200 text-[11px]">₹6.4L</span>
            </div>

            {/* Tata Elxsi */}
            <div className="flex items-center justify-between text-xs p-1 rounded hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="font-bold text-white text-[11px]">Tata Elxsi</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#1B243B] text-slate-300">
                quotation_sent
              </span>
              <span className="font-semibold text-slate-200 text-[11px]">₹12.5L</span>
            </div>

            {/* Ather Energy */}
            <div className="flex items-center justify-between text-xs p-1 rounded hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-bold text-white text-[11px]">Ather Energy</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#1B243B] text-slate-300">
                follow_up
              </span>
              <span className="font-semibold text-slate-200 text-[11px]">14:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
