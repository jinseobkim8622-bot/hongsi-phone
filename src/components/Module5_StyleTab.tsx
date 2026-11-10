import React, { useRef } from 'react';
import { useHongsiPhone } from '../context/HongsiPhoneContext';
import { StyleSubTab } from '../types/hongsiphone';
import {
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export const Module5_StyleTab: React.FC = () => {
  const {
    state,
    setActiveStyleSubTab,
    updateCardTitle,
    updateCardTypography,
    updateCardPhoto,
    updateCardGradient,
    removeCardPhoto,
    openColorPicker,
  } = useHongsiPhone();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeCard = state.cards[state.activeCardIndex];

  if (!activeCard) return null;

  const subTabs: { key: StyleSubTab; label: string }[] = [
    { key: 'title', label: '제목' },
    { key: 'photo', label: '사진' },
    { key: 'gradient', label: '그라데이션' },
    { key: 'logo', label: '로고' },
  ];

  const handlePhotoReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCardPhoto({
            hasPhoto: true,
            url: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
      {/* 5.1 Style Top Header & 4-Sub-Tab Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2">
          <span>카드 {state.activeCardIndex + 1}</span>
          <span className="text-slate-400 font-mono">
            {state.aspectRatio === 'reels_1080_1920' ? '1080 × 1920' : '1080 × 1350'}
          </span>
        </div>

        {/* Preset Collapsible Bar */}
        <div className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-3 cursor-pointer">
          <span className="flex items-center space-x-1">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>프리셋</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">인기 디자인 템플릿</span>
        </div>

        {/* 4-Column Sub Tabs (제목 | 사진 | 그라데이션 | 로고) */}
        <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 p-1 rounded-xl grid grid-cols-4 gap-1">
          {subTabs.map((tab) => {
            const isActive = state.activeStyleSubTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveStyleSubTab(tab.key)}
                className={`py-1.5 rounded-lg text-xs font-bold transition text-center ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-tab 1: [사진] */}
      {state.activeStyleSubTab === 'photo' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoReplace}
            accept="image/*"
            className="hidden"
          />

          {/* Photo Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>사진 바꾸기</span>
            </button>

            <button
              onClick={() => removeCardPhoto(state.activeCardIndex)}
              className="w-full py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#EF4444] font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              <span>사진 제거</span>
            </button>
          </div>

          {/* Photo Adjust Sliders */}
          <div className="space-y-3.5 pt-1">
            {/* Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>확대</span>
                <span>{activeCard.photo.scale}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                value={activeCard.photo.scale}
                onChange={(e) => updateCardPhoto({ scale: Number(e.target.value) })}
                className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Horizontal offset */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>가로 위치</span>
                <span>{activeCard.photo.offsetX}px</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={activeCard.photo.offsetX}
                onChange={(e) => updateCardPhoto({ offsetX: Number(e.target.value) })}
                className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Vertical offset */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>세로 위치</span>
                <span>{activeCard.photo.offsetY}px</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={activeCard.photo.offsetY}
                onChange={(e) => updateCardPhoto({ offsetY: Number(e.target.value) })}
                className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Grayscale Checkbox */}
            <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeCard.photo.isGrayscale}
                onChange={(e) => updateCardPhoto({ isGrayscale: e.target.checked })}
                className="w-4 h-4 rounded text-[#EF4444] focus:ring-red-400 accent-[#EF4444]"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                흑백으로
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Sub-tab 2: [제목] */}
      {state.activeStyleSubTab === 'title' && (
        <div className="space-y-4">
          {/* Title Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              제목
            </label>
            <textarea
              value={activeCard.titleText}
              onChange={(e) => updateCardTitle(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold focus:border-[#EF4444] outline-none transition resize-none"
            />
            <p className="text-[11px] text-slate-400">
              [대괄호]로 감싼 구간이 강조 색으로 칠해집니다. 줄바꿈은 엔터로 넣습니다.
            </p>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>크기</span>
              <span>{activeCard.typography.fontSizePx}px</span>
            </div>
            <input
              type="range"
              min={16}
              max={44}
              value={activeCard.typography.fontSizePx}
              onChange={(e) => updateCardTypography({ fontSizePx: Number(e.target.value) })}
              className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Text Alignment (3-grid) */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              정렬
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['left', 'center', 'right'] as const).map((align) => {
                const isSelected = activeCard.typography.align === align;
                const labels = { left: '왼쪽', center: '가운데', right: '오른쪽' };
                return (
                  <button
                    key={align}
                    onClick={() => updateCardTypography({ align })}
                    className={`py-2 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1 transition ${
                      isSelected
                        ? 'border-[#EF4444] bg-[#FFF5F5] text-slate-900 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                    <span>{labels[align]}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">카드의 글자 블록 전체에 적용됩니다.</p>
          </div>

          {/* Font Weight */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              두께
            </label>
            <div className="relative">
              <select
                value={activeCard.typography.fontWeight}
                onChange={(e) => updateCardTypography({ fontWeight: e.target.value as any })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 appearance-none outline-none"
              >
                <option value="extra-bold">아주 굵게 (ExtraBold)</option>
                <option value="bold">굵게 (Bold)</option>
                <option value="normal">보통 (Regular)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>행간</span>
                <span>{activeCard.typography.lineHeightPercent}%</span>
              </div>
              <input
                type="range"
                min={100}
                max={180}
                value={activeCard.typography.lineHeightPercent}
                onChange={(e) =>
                  updateCardTypography({ lineHeightPercent: Number(e.target.value) })
                }
                className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>자간</span>
                <span>{activeCard.typography.letterSpacingPercent}%</span>
              </div>
              <input
                type="range"
                min={-10}
                max={10}
                value={activeCard.typography.letterSpacingPercent}
                onChange={(e) =>
                  updateCardTypography({ letterSpacingPercent: Number(e.target.value) })
                }
                className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Colors: Base Color & Accent Color */}
          <div className="space-y-3 pt-1">
            {/* Base Color */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  기본 색상
                </div>
                <div className="text-[11px] text-slate-400">일반 텍스트 컬러</div>
              </div>
              <button
                onClick={() => openColorPicker('base')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition"
              >
                <div
                  style={{ backgroundColor: activeCard.typography.baseColorHex }}
                  className="w-5 h-5 rounded-md border border-slate-300"
                />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                  {activeCard.typography.baseColorHex}
                </span>
              </button>
            </div>

            {/* Accent Color ([대괄호]) */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                  <span>강조 색상</span>
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1 rounded">
                    [대괄호]
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">제목에서 [대괄호]로 감싼 부분에 쓰입니다.</div>
              </div>
              <button
                onClick={() => openColorPicker('accent')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition ring-2 ring-emerald-400/20"
              >
                <div
                  style={{ backgroundColor: activeCard.typography.accentColorHex }}
                  className="w-5 h-5 rounded-md border border-slate-300"
                />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                  {activeCard.typography.accentColorHex}
                </span>
              </button>
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>글자 테두리</span>
              <span>{activeCard.typography.strokeWidthPx}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              value={activeCard.typography.strokeWidthPx}
              onChange={(e) => updateCardTypography({ strokeWidthPx: Number(e.target.value) })}
              className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              밝은 사진 위에서 흰 글씨가 묻힐 때 씁니다. 0이면 꺼집니다.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab 3: [그라데이션] */}
      {state.activeStyleSubTab === 'gradient' && (
        <div className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeCard.gradient.enabled}
              onChange={(e) => updateCardGradient({ enabled: e.target.checked })}
              className="w-4 h-4 rounded text-[#EF4444] accent-[#EF4444]"
            />
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              하단 블랙 그라데이션 활성화
            </span>
          </label>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>높이 (범위)</span>
              <span>{activeCard.gradient.heightPercent}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={90}
              value={activeCard.gradient.heightPercent}
              onChange={(e) => updateCardGradient({ heightPercent: Number(e.target.value) })}
              className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>투명도 (농도)</span>
              <span>{Math.round(activeCard.gradient.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={Math.round(activeCard.gradient.opacity * 100)}
              onChange={(e) => updateCardGradient({ opacity: Number(e.target.value) / 100 })}
              className="w-full accent-[#EF4444] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Sub-tab 4: [로고] */}
      {state.activeStyleSubTab === 'logo' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            인스타그램 계정명이나 워터마크 아이콘을 카드 상단/하단 모서리에 삽입할 수 있습니다.
          </p>
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-400 font-semibold">
              워터마크 로고 이미지 등록 (선택)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

