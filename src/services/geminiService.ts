import { AIRecommendedTitle, CardItem } from '../types/hongsiphone';
import {
  DEFAULT_SOURCE_TEXT,
  DEFAULT_RECOMMENDED_TITLES,
  DEFAULT_SUMMARY,
  DEFAULT_CAPTION,
  DEMO_GAMING_CHAIR_IMAGE,
  BACKUP_CHAIR_IMAGE,
} from './mockAiService';

export interface AnalysisResult {
  projectTitle: string;
  recommendedTitles: AIRecommendedTitle[];
  articleSummary: string;
  cards: CardItem[];
  caption: string;
}

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

async function callGeminiApiWithFallback(apiKey: string, bodyPayload: any): Promise<any> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (response.status === 404) {
        // Try next fallback model
        lastError = new Error(`Model ${model} not found (404)`);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API Error (${response.status})`);
      }

      return await response.json();
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes('404')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All Gemini candidate models failed');
}

export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; message: string; modelUsed?: string }> {
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with OK' }] }],
          }),
        }
      );

      if (response.status === 404) {
        continue;
      }

      if (response.ok) {
        return {
          success: true,
          message: `연결 성공! (${model} 모델 정상 연동됨)`,
          modelUsed: model,
        };
      } else {
        const err = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `인증 실패 (${response.status}): ${err?.error?.message || 'API 키를 확인하세요.'}`,
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: `네트워크 오류: ${e.message}`,
      };
    }
  }

  return {
    success: false,
    message: '사용 가능한 Gemini 모델을 찾을 수 없습니다. API 키 권한을 확인해 주세요.',
  };
}

/**
 * Analyzes article text or URL using Gemini API if key is present,
 * or falls back to realistic mock demo data.
 */
export async function analyzeContentWithAI(
  apiKey: string | null,
  rawText: string,
  targetCardCount: number,
  guideline: string = ''
): Promise<AnalysisResult> {
  if (!apiKey || !apiKey.trim()) {
    // Mock simulation
    return {
      projectTitle: '우주하마 엉덩이 건강',
      recommendedTitles: DEFAULT_RECOMMENDED_TITLES,
      articleSummary: DEFAULT_SUMMARY,
      cards: [
        {
          cardId: 1,
          role: '표지',
          titleText: '220만 유튜버 우주하마\n[방송 중단하게 만든 질병]',
          photo: {
            hasPhoto: true,
            url: DEMO_GAMING_CHAIR_IMAGE,
            promptMode: 'auto',
            styleHint: '',
            scale: 100,
            offsetX: 0,
            offsetY: 0,
            isGrayscale: false,
          },
          typography: {
            fontSizePx: 26,
            align: 'left',
            fontWeight: 'extra-bold',
            lineHeightPercent: 134,
            letterSpacingPercent: -2,
            baseColorHex: '#FFFFFF',
            accentColorHex: '#1CF28D',
            strokeWidthPx: 0,
          },
          gradient: {
            enabled: true,
            heightPercent: 55,
            opacity: 0.9,
          },
        },
        ...Array.from({ length: Math.max(1, targetCardCount - 1) }, (_, i) => ({
          cardId: i + 2,
          role: '본문' as const,
          titleText: `의자에 오래 앉아 있다면\n[엉덩이 근육이 잠든다] (${i + 2}편)`,
          photo: {
            hasPhoto: false,
            url: '',
            promptMode: 'auto' as const,
            styleHint: '',
            scale: 100,
            offsetX: 0,
            offsetY: 0,
            isGrayscale: false,
          },
          typography: {
            fontSizePx: 24,
            align: 'left' as const,
            fontWeight: 'extra-bold' as const,
            lineHeightPercent: 134,
            letterSpacingPercent: -2,
            baseColorHex: '#FFFFFF',
            accentColorHex: '#1CF28D',
            strokeWidthPx: 0,
          },
          gradient: {
            enabled: true,
            heightPercent: 55,
            opacity: 0.9,
          },
        })),
      ],
      caption: DEFAULT_CAPTION,
    };
  }

  // Call real Gemini API with gemini-3.8-flash and fallbacks
  try {
    const prompt = `
당신은 인스타그램 카드뉴스 및 바이럴 콘텐츠 전문 AI 에디터입니다.
다음 원문 기사/글을 바탕으로 카드뉴스를 기획해 주세요.

[지침]
${guideline || '제목에 숫자를 넣어주세요 / 본문은 존댓말로 / 인용문은 있는 그대로 살려주세요'}

[원문]
${rawText}

[요청 사항]
1. 3어절 내외의 프로젝트 핵심 주제어(projectTitle)
2. 가장 바이럴 가능성이 높은 AI 추천 제목 5개:
   - 각 제목은 2줄로 줄바꿈(\\n)을 포함해야 하며, 가장 핵심이 되는 강조 단어/구절은 반드시 [대괄호]로 감싸야 합니다. 예: "220만 유튜버 우주하마\\n[방송 중단하게 만든 질병]"
   - 10점 만점 바이럴 점수(score, 예: "9.5/10")와 선정 이유(reason) 포함
3. 원문 핵심 요약 3~4문장(articleSummary)
4. 총 ${targetCardCount}장의 카드 문구(cards):
   - 1번 카드는 표지(role: "표지"), 나머지는 본문(role: "본문")
   - 각 카드의 titleText는 2줄 줄바꿈(\\n)과 핵심 강조구간 [대괄호] 포함
5. 인스타그램 업로드용 상세 캡션 및 해시태그(caption)

반드시 아래 JSON 형식으로만 응답해 주세요:
{
  "projectTitle": "프로젝트 주제어",
  "recommendedTitles": [
    {
      "id": "rec_1",
      "rawTitle": "줄바꿈\\n[강조]",
      "score": "9.5/10",
      "reason": "선정 이유",
      "isSelected": true
    }
  ],
  "articleSummary": "원문 요약...",
  "cards": [
    {
      "role": "표지",
      "titleText": "1번 카드 제목\\n[강조]"
    }
  ],
  "caption": "인스타그램 업로드용 캡션..."
}
`;

    const data = await callGeminiApiWithFallback(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);

    const generatedCards: CardItem[] = (parsed.cards || []).map((c: any, idx: number) => ({
      cardId: idx + 1,
      role: c.role || (idx === 0 ? '표지' : '본문'),
      titleText: c.titleText || `카드 ${idx + 1}\\n[핵심 내용]`,
      photo: {
        hasPhoto: idx === 0,
        url: idx === 0 ? DEMO_GAMING_CHAIR_IMAGE : '',
        promptMode: 'auto',
        styleHint: '',
        scale: 100,
        offsetX: 0,
        offsetY: 0,
        isGrayscale: false,
      },
      typography: {
        fontSizePx: 26,
        align: 'left',
        fontWeight: 'extra-bold',
        lineHeightPercent: 134,
        letterSpacingPercent: -2,
        baseColorHex: '#FFFFFF',
        accentColorHex: '#1CF28D',
        strokeWidthPx: 0,
      },
      gradient: {
        enabled: true,
        heightPercent: 55,
        opacity: 0.9,
      },
    }));

    return {
      projectTitle: parsed.projectTitle || 'AI 생성 카드뉴스',
      recommendedTitles: (parsed.recommendedTitles || []).map((t: any, i: number) => ({
        id: `rec_${i + 1}`,
        rawTitle: t.rawTitle,
        displayWithNewlineSymbol: t.rawTitle.replace('\n', '\\n'),
        score: t.score || '9.0/10',
        reason: t.reason || '',
        isSelected: i === 0,
      })),
      articleSummary: parsed.articleSummary || '',
      cards: generatedCards.length > 0 ? generatedCards : DEFAULT_RECOMMENDED_TITLES as any,
      caption: parsed.caption || DEFAULT_CAPTION,
    };
  } catch (err) {
    console.error('Failed to call Gemini API, falling back to simulation:', err);
    throw err;
  }
}

/**
 * Generates AI Image using Pollinations AI or AI image generator
 */
export async function generateCardImageAI(
  keyword: string,
  styleHint: string = ''
): Promise<string> {
  const query = encodeURIComponent(`${keyword} ${styleHint} dark cinematic high quality aesthetic photography 8k`);
  return `https://image.pollinations.ai/prompt/${query}?width=1080&height=1350&nologo=true&seed=${Math.floor(
    Math.random() * 1000000
  )}`;
}
