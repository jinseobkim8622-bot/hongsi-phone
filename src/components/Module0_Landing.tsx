import React, { useState } from 'react';
import { useHongsiPhone } from '../context/HongsiPhoneContext';
import { Sparkles, ArrowRight, Zap, Image as ImageIcon, Smartphone } from 'lucide-react';
import { MobileQrModal } from './MobileQrModal';
import { InstallAppModal } from './InstallAppModal';
import hongsiAvatar from '../assets/hongsi_avatar.png';

export const Module0_Landing: React.FC = () => {
  const { startStudio } = useHongsiPhone();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const mobileUrl = typeof window !== 'undefined' && window.location.origin.startsWith('http')
    ? window.location.origin
    : 'https://racks-thriller-atlas-player.trycloudflare.com';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-5 max-w-[430px] mx-auto shadow-2xl relative">
      {/* Top Navigation */}
      <header className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-[#FFF8F1] border border-orange-200 p-0.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden ring-1 ring-orange-300/60">
            <img
              src={hongsiAvatar}
              alt="홍시"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">홍시폰</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsInstallOpen(true)}
            className="px-2.5 py-1 rounded-full border border-orange-300 bg-orange-50 text-orange-600 font-bold text-xs flex items-center space-x-1 shadow-2xs hover:bg-orange-100 transition"
          >
            <span>📲 앱 설치</span>
          </button>
          <button
            onClick={() => setIsQrOpen(true)}
            className="px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-[#EF4444] font-bold text-xs flex items-center space-x-1 shadow-2xs hover:bg-red-100 transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>폰으로</span>
          </button>
          <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 font-bold text-xs flex items-center space-x-1 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>2.0 PRO</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center my-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#EF4444] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>초고속 AI 카드뉴스 스튜디오</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.25] mb-4">
          사진 한 장이면<br />
          <span className="text-[#EF4444]">카드뉴스가 끝납니다</span>
        </h1>

        <p className="text-slate-500 text-sm leading-relaxed max-w-[320px] mb-8">
          긴 기사나 원문 링크만 넣으세요.<br />
          AI가 제목, 핵심 구성, 고화질 배경 사진,<br />
          인스타그램 캡션까지 한 번에 완성합니다.
        </p>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px] mb-10 text-left">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-red-50 text-[#EF4444]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">바이럴 제목 AI</div>
              <div className="text-[11px] text-slate-400">10점 만점 5종 추천</div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">초고화질 사진</div>
              <div className="text-[11px] text-slate-400">자동 프롬프트 생성</div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <button
          onClick={startStudio}
          className="w-full max-w-[340px] py-4 rounded-2xl bg-[#EF4444] text-white font-extrabold text-base tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-red-500/25 active:scale-[0.98] transition hover:bg-[#E12D2D]"
        >
          <span>스튜디오 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-400 py-3">
        © 2026 HongsiPhone V2. All rights reserved.
      </footer>

      <MobileQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        mobileUrl={mobileUrl}
      />

      <InstallAppModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
};

