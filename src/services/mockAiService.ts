import { AIRecommendedTitle, CardItem } from '../types/hongsiphone';

// High-quality dark gaming chair SVG/Data URL matching the YouTube demo exactly
export const DEMO_GAMING_CHAIR_IMAGE =
  'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1080&q=80';

export const BACKUP_CHAIR_IMAGE =
  'https://images.unsplash.com/photo-1580481077197-0331f8ce1c9e?auto=format&fit=crop&w=1080&q=80';

export const DEFAULT_SOURCE_TEXT =
  "구독자 220만명을 보유한 게임 유튜버 우주하마가 '엉덩이 기억상실증' 탓에 극심한 통증을 겪고 방송을 중단한다고 밝혔습니다. 오랜 시간 의자에 앉아 게임 방송을 진행하면서 대둔근 근육이 약화되고 척추와 골반에 무리가 간 것으로 알려졌습니다. 전문가들은 50분마다 일어나 스트레칭을 하고 엉덩이 근육 강화 운동을 해야 한다고 경고하고 있습니다.";

export const DEFAULT_RECOMMENDED_TITLES: AIRecommendedTitle[] = [
  {
    id: 'rec_1',
    rawTitle: '220만 유튜버 우주하마\n[방송 중단하게 만든 질병]',
    displayWithNewlineSymbol: '220만 유튜버 우주하마\\n방송 중단하게 만든 질병',
    score: '9.5/10',
    reason: '유명인의 충격적인 근황을 통해 클릭을 유도하고 질병에 대한 궁금증을 자극함',
    isSelected: true,
  },
  {
    id: 'rec_2',
    rawTitle: '의자에 오래 앉아 있다면\n[엉덩이가 기억력을 잃는다?]',
    displayWithNewlineSymbol: '의자에 오래 앉아 있다면\\n엉덩이가 기억력을 잃는다?',
    score: '8.8/10',
    reason: "'기억상실증'이라는 단어와 엉덩이를 결합해 호기심을 유발함",
    isSelected: false,
  },
  {
    id: 'rec_3',
    rawTitle: '"앉아 있을 수가 없어요"\n[우주하마를 덮친 통증의 정체]',
    displayWithNewlineSymbol: '"앉아 있을 수가 없어요"\\n우주하마를 덮친 통증의 정체',
    score: '9/10',
    reason: '생생한 인용구로 극적인 위기감을 조성하여 본문 확인을 유도함',
    isSelected: false,
  },
  {
    id: 'rec_4',
    rawTitle: '당신의 엉덩이가\n[납작해지고 있다면 필독]',
    displayWithNewlineSymbol: '당신의 엉덩이가\\n납작해지고 있다면 필독',
    score: '8.5/10',
    reason: '타겟 독자의 체형 변화 불안 심리를 자극하는 직접적 화법',
    isSelected: false,
  },
  {
    id: 'rec_5',
    rawTitle: '직장인 90%가 위험한\n[엉덩이 기억상실증 자가진단]',
    displayWithNewlineSymbol: '직장인 90%가 위험한\\n엉덩이 기억상실증 자가진단',
    score: '9.2/10',
    reason: '높은 통계 수치와 자가진단 키워드로 대중적 호기심과 실용성 어필',
    isSelected: false,
  },
];

export const DEFAULT_SUMMARY =
  "220만 게임 유튜버 우주하마가 '엉덩이 기억상실증'으로 인한 통증 때문에 방송 중단을 선언했습니다. 장시간 착석으로 대둔근 사용 빈도가 줄어들어 근육이 힘을 쓰는 법을 잊는 질환으로, 바른 자세와 틈틈이 스트레칭을 해주는 습관이 중요합니다.";

export const DEFAULT_CAPTION =
  "220만 유튜버 우주하마가 갑자기 방송을 중단한 충격적인 이유, 알고 계신가요?\n\n원인은 바로 현대인의 고질병이라 불리는 '엉덩이 기억상실증'입니다.\n장시간 의자에 앉아 있으면 엉덩이 근육의 힘이 빠지고 허리와 골반이 무너지게 됩니다.\n\n지금 당장 일어나서 가벼운 스트레칭과 스쿼트 한 번 해보는 건 어떨까요?\n\n#우주하마 #엉덩이기억상실증 #직장인건강 #자세교정 #헬스정보 #카드뉴스";

export function generateBlankCards(count: number = 2): CardItem[] {
  const cards: CardItem[] = [];

  for (let i = 0; i < count; i++) {
    cards.push({
      cardId: i + 1,
      role: i === 0 ? '표지' : '본문',
      titleText: i === 0 ? '새 카드뉴스\n[제목을 입력해 주세요]' : `카드 ${i + 1} 본문\n[내용을 입력해 주세요]`,
      photo: {
        hasPhoto: false,
        url: '',
        promptMode: 'auto',
        styleHint: '',
        scale: 100,
        offsetX: 0,
        offsetY: 0,
        isGrayscale: false,
      },
      typography: {
        fontSizePx: i === 0 ? 26 : 24,
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
    });
  }

  return cards;
}

export function generateInitialCards(count: number = 2): CardItem[] {
  const cards: CardItem[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      cards.push({
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
      });
    } else {
      cards.push({
        cardId: i + 1,
        role: '본문',
        titleText: `의자에 오래 앉아 있다면\n[엉덩이 근육이 잠든다] (${i + 1}편)`,
        photo: {
          hasPhoto: false,
          url: '',
          promptMode: 'auto',
          styleHint: '',
          scale: 100,
          offsetX: 0,
          offsetY: 0,
          isGrayscale: false,
        },
        typography: {
          fontSizePx: 24,
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
      });
    }
  }

  return cards;
}

