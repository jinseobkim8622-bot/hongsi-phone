import React, { useState } from 'react';
import { useHongsiPhone } from '../context/HongsiPhoneContext';
import {
  ChevronDown,
  ChevronUp,
  Languages,
  Sparkles,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Module6_ExportSection: React.FC = () => {
  const {
    state,
    translateLanguage,
    generateCaption,
    exportZip,
  } = useHongsiPhone();

  const [isOpen, setIsOpen] = useState(true);
  const [selectedLang, setSelectedLang] = useState('日本語');
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(state.exportAndTranslate.captionText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleZipDownload = async () => {
    try {
      setIsExporting(true);
      await exportZip();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error('Export failed:', e);
      alert('ZIP 파일 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-4 my-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100/80 transition"
      >
        <div className="flex items-center space-x-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
          <span>번역 & 내보내기</span>
        </div>
        <span className="text-xs text-slate-400 font-medium">인스타 캡션 · 다국어 · ZIP</span>
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
          {/* 6.1 Multi-language Translator */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              언어
            </label>

            <div className="relative">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 appearance-none outline-none"
              >
                <option value="日本語">日本語 (일본어)</option>
                <option value="English">English (영어)</option>
                <option value="繁體中文">繁體中文 (번체 중국어)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            <p className="text-[11px] text-slate-400">
              카드의 모든 글자를 옮깁니다. 강조 표시와 줄바꿈도 그 언어에 맞게 다시 잡힙니다.
            </p>

            <button
              type="button"
              onClick={() => translateLanguage(selectedLang)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition"
            >
              <span className="flex items-center space-x-1.5">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                <span>이 언어로 번역</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E2E8F0] dark:bg-slate-700 text-[#475569] dark:text-slate-300 font-bold text-[11px]">
                무료
              </span>
            </button>
          </div>

          {/* 6.2 Instagram Upload Caption Generator */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              업로드용 캡션
            </label>

            <textarea
              rows={4}
              value={state.exportAndTranslate.captionText}
              placeholder="캡션을 직접 쓰거나, 아래 버튼으로 만들어 보세요."
              readOnly
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs leading-relaxed focus:border-[#F87171] outline-none resize-none"
            />

            {/* 2-tier buttons: Create Caption & Copy */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={generateCaption}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>캡션 만들기</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#E2E8F0] dark:bg-slate-700 text-[#475569] dark:text-slate-300 font-bold text-[10px]">
                  무료
                </span>
              </button>

              <button
                type="button"
                onClick={handleCopyCaption}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 6.3 Main Package Download Button: ↓ 전체 내려받기 (ZIP) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleZipDownload}
              disabled={isExporting}
              className="w-full h-13 py-3.5 rounded-xl bg-[#E12D2D] hover:bg-[#EF4444] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 active:scale-[0.98] transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExporting ? '고화질 ZIP 압축 생성 중...' : '전체 내려받기 (ZIP)'}
              </span>
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-2">
              카드 {state.cards.length}장과 캡션이 한 폴더로 묶입니다. 파일 이름에 순서가 붙어 있어 그대로 올리면 됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

