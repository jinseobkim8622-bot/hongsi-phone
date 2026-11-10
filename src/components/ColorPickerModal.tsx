import React, { useState, useEffect } from 'react';
import { useHongsiPhone } from '../context/HongsiPhoneContext';
import { Pipette, X } from 'lucide-react';

export const ColorPickerModal: React.FC = () => {
  const {
    isColorPickerOpen,
    colorPickerTarget,
    closeColorPicker,
    setColorPickerColor,
    state,
  } = useHongsiPhone();

  const [activePickerTab, setActivePickerTab] = useState<'grid' | 'spectrum' | 'slider'>('slider');

  const activeCard = state.cards[state.activeCardIndex];
  const initialHex =
    colorPickerTarget === 'accent'
      ? activeCard?.typography.accentColorHex || '#1CF28D'
      : activeCard?.typography.baseColorHex || '#FFFFFF';

  // RGB components
  const [r, setR] = useState(28);
  const [g, setG] = useState(242);
  const [b, setB] = useState(141);

  // Parse initial HEX to RGB
  useEffect(() => {
    if (initialHex) {
      const hex = initialHex.replace('#', '');
      if (hex.length === 6) {
        setR(parseInt(hex.substring(0, 2), 16) || 0);
        setG(parseInt(hex.substring(2, 4), 16) || 0);
        setB(parseInt(hex.substring(4, 6), 16) || 0);
      }
    }
  }, [initialHex, isColorPickerOpen]);

  if (!isColorPickerOpen) return null;

  const currentHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

  const handleRgbChange = (newR: number, newG: number, newB: number) => {
    setR(newR);
    setG(newG);
    setB(newB);
    const hex = `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1).toUpperCase()}`;
    setColorPickerColor(hex);
  };

  const handleSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Simple HSV to RGB mapping across spectrum
    const hue = x * 360;
    const sat = 1 - y * 0.5;
    const val = 1 - y * 0.5;

    // Convert HSV to RGB
    const c = val * sat;
    const xVal = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = val - c;
    let r1 = 0, g1 = 0, b1 = 0;

    if (hue < 60) { r1 = c; g1 = xVal; b1 = 0; }
    else if (hue < 120) { r1 = xVal; g1 = c; b1 = 0; }
    else if (hue < 180) { r1 = 0; g1 = c; b1 = xVal; }
    else if (hue < 240) { r1 = 0; g1 = xVal; b1 = c; }
    else if (hue < 300) { r1 = xVal; g1 = 0; b1 = c; }
    else { r1 = c; g1 = 0; b1 = xVal; }

    const finalR = Math.round((r1 + m) * 255);
    const finalG = Math.round((g1 + m) * 255);
    const finalB = Math.round((b1 + m) * 255);

    handleRgbChange(finalR, finalG, finalB);
  };

  const presetColors = [
    '#1CF28D', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
    '#FFFFFF', '#000000', '#F97316', '#10B981', '#06B6D4', '#6366F1'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-[430px] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <button className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <Pipette className="w-4 h-4" />
          </button>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
            {colorPickerTarget === 'accent' ? '강조 색상' : '기본 글자 색상'}
          </h3>
          <button
            onClick={closeColorPicker}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Tab Mode Bar */}
        <div className="bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-xl grid grid-cols-3 gap-1 mb-4">
          <button
            onClick={() => setActivePickerTab('grid')}
            className={`py-1 rounded-lg text-xs font-bold transition ${
              activePickerTab === 'grid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            격자
          </button>
          <button
            onClick={() => setActivePickerTab('spectrum')}
            className={`py-1 rounded-lg text-xs font-bold transition ${
              activePickerTab === 'spectrum'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            스펙트럼
          </button>
          <button
            onClick={() => setActivePickerTab('slider')}
            className={`py-1 rounded-lg text-xs font-bold transition ${
              activePickerTab === 'slider'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            슬라이더
          </button>
        </div>

        {/* Mode: Sliders */}
        {activePickerTab === 'slider' && (
          <div className="space-y-3 mb-4">
            {/* Red Slider */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-red-500 w-4">R</span>
              <input
                type="range"
                min={0}
                max={255}
                value={r}
                onChange={(e) => handleRgbChange(Number(e.target.value), g, b)}
                className="flex-1 accent-red-500 h-2 bg-gradient-to-r from-black to-red-500 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                {r}
              </span>
            </div>

            {/* Green Slider */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-emerald-500 w-4">G</span>
              <input
                type="range"
                min={0}
                max={255}
                value={g}
                onChange={(e) => handleRgbChange(r, Number(e.target.value), b)}
                className="flex-1 accent-emerald-500 h-2 bg-gradient-to-r from-black to-emerald-500 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                {g}
              </span>
            </div>

            {/* Blue Slider */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-blue-500 w-4">B</span>
              <input
                type="range"
                min={0}
                max={255}
                value={b}
                onChange={(e) => handleRgbChange(r, g, Number(e.target.value))}
                className="flex-1 accent-blue-500 h-2 bg-gradient-to-r from-black to-blue-500 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                {b}
              </span>
            </div>
          </div>
        )}

        {/* Mode: Spectrum */}
        {activePickerTab === 'spectrum' && (
          <div
            onClick={handleSpectrumClick}
            className="w-full h-36 rounded-xl mb-4 cursor-crosshair relative shadow-inner overflow-hidden"
            style={{
              background: `
                linear-gradient(to bottom, transparent, #000),
                linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)
              `,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <span className="text-[11px] font-bold text-white drop-shadow">터치하여 색상 선택</span>
            </div>
          </div>
        )}

        {/* Mode: Grid */}
        {activePickerTab === 'grid' && (
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  const hex = color.replace('#', '');
                  setR(parseInt(hex.substring(0, 2), 16) || 0);
                  setG(parseInt(hex.substring(2, 4), 16) || 0);
                  setB(parseInt(hex.substring(4, 6), 16) || 0);
                  setColorPickerColor(color);
                }}
                style={{ backgroundColor: color }}
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs hover:scale-105 active:scale-95 transition"
              />
            ))}
          </div>
        )}

        {/* Bottom Preview Box & HEX Code */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: currentHex }}
              className="w-11 h-11 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm"
            />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Color Code</div>
              <div className="text-sm font-mono font-extrabold text-slate-800 dark:text-white">
                {currentHex}
              </div>
            </div>
          </div>

          <button
            onClick={closeColorPicker}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow hover:bg-slate-800 transition"
          >
            적용 완료
          </button>
        </div>
      </div>
    </div>
  );
};

