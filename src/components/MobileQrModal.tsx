import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Smartphone, X, Copy, Check } from 'lucide-react';

interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobileUrl: string;
  onOpenInstall?: () => void;
}

export const MobileQrModal: React.FC<MobileQrModalProps> = ({ isOpen, onClose, mobileUrl, onOpenInstall }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    mobileUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-extrabold text-sm">
            <Smartphone className="w-4 h-4 text-[#EF4444]" />
            <span>스마트폰으로 바로 열기</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Frame */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-inner mb-4 flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt="Mobile Access QR Code"
            className="w-48 h-48 rounded-lg"
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
          스마트폰 카메라로 위 <strong>QR 코드</strong>를 비추면<br />
          홍시폰 V2 앱이 즉시 열립니다!
        </p>

        {/* URL Pill + Copy */}
        <div className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs mb-3">
          <span className="font-mono text-slate-700 dark:text-slate-200 truncate mr-2">
            {mobileUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold shadow-2xs hover:bg-slate-50 shrink-0 flex items-center space-x-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>복사</span>
              </>
            )}
          </button>
        </div>

        {onOpenInstall && (
          <button
            onClick={() => {
              onClose();
              onOpenInstall();
            }}
            className="w-full py-2.5 mb-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-98 transition"
          >
            <span>📲 스마트폰 앱으로 다운로드/설치 방법</span>
          </button>
        )}

        <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
          💡 모바일 LTE/5G 및 모든 Wi-Fi에서 바로 열립니다.
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
