import React from 'react';
import { useHongsiPhone } from '../context/HongsiPhoneContext';
import { Check } from 'lucide-react';

export const Module7_ProgressModal: React.FC = () => {
  const {
    isAnalyzingModalOpen,
    analyzingStep,
    isImageGeneratingModalOpen,
    imageGeneratingStep,
  } = useHongsiPhone();

  if (!isAnalyzingModalOpen && !isImageGeneratingModalOpen) return null;

  const analyzingSteps = [
    '원문 정리 중',
    '내용 분석 중',
    '제목 후보 작성 중',
    '카드 구성 중',
  ];

  const imageSteps = [
    '프롬프트 작성 중',
    '이미지 그리는 중',
    '저장 중',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 pt-16 pb-8 overflow-y-auto animate-in fade-in">
      <div className="w-[85%] max-w-[340px] bg-white dark:bg-slate-900 rounded-[20px] p-7 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150 border border-slate-100 dark:border-slate-800 my-auto">
        {/* Red Spinner */}
        <div className="w-11 h-11 border-4 border-red-100 border-t-[#EF4444] rounded-full animate-spin mb-4" />

        {/* Modal Type A: Analysis Stepper */}
        {isAnalyzingModalOpen && (
          <div className="w-full">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">
              원문을 읽고 있습니다
            </h3>

            <div className="space-y-3.5 text-left pl-4">
              {analyzingSteps.map((stepName, idx) => {
                const isFinished = idx < analyzingStep;
                const isCurrent = idx === analyzingStep;

                return (
                  <div key={stepName} className="flex items-center space-x-3 text-xs">
                    {isFinished ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-slate-700" />
                      </div>
                    )}

                    <span
                      className={`font-semibold ${
                        isFinished
                          ? 'text-slate-400 line-through'
                          : isCurrent
                          ? 'text-slate-900 dark:text-white font-extrabold scale-105 transition'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Type B: Image Generation Stepper */}
        {isImageGeneratingModalOpen && (
          <div className="w-full">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">
              이미지를 만들고 있습니다
            </h3>

            <div className="space-y-3.5 text-left pl-6">
              {imageSteps.map((stepName, idx) => {
                const isFinished = idx < imageGeneratingStep;
                const isCurrent = idx === imageGeneratingStep;

                return (
                  <div key={stepName} className="flex items-center space-x-3 text-xs">
                    {isFinished ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-slate-700" />
                      </div>
                    )}

                    <span
                      className={`font-semibold ${
                        isFinished
                          ? 'text-slate-400 line-through'
                          : isCurrent
                          ? 'text-slate-900 dark:text-white font-extrabold'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

