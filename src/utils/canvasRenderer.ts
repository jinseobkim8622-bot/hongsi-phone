import { CardItem, AspectRatio } from '../types/hongsiphone';
import { parseBracketSegments } from './textParser';

export async function renderCardToCanvas(
  card: CardItem,
  aspectRatio: AspectRatio
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = aspectRatio === 'reels_1080_1920' ? 1920 : 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // 1. Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // 2. Background image (if present)
  if (card.photo.hasPhoto && card.photo.url) {
    try {
      const img = await loadImage(card.photo.url);
      ctx.save();

      if (card.photo.isGrayscale) {
        ctx.filter = 'grayscale(100%)';
      }

      const scale = card.photo.scale / 100;
      const offsetX = (card.photo.offsetX / 100) * width;
      const offsetY = (card.photo.offsetY / 100) * height;

      // Draw image centered and scaled
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;

      if (imgAspect > canvasAspect) {
        drawW = height * imgAspect;
      } else {
        drawH = width / imgAspect;
      }

      drawW *= scale;
      drawH *= scale;

      const drawX = (width - drawW) / 2 + offsetX;
      const drawY = (height - drawH) / 2 + offsetY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } catch (e) {
      console.warn('Failed to load card image for canvas export:', e);
    }
  }

  // 3. Linear gradient overlay
  if (card.gradient.enabled) {
    const gradHeight = (height * card.gradient.heightPercent) / 100;
    const startY = height - gradHeight;
    const gradient = ctx.createLinearGradient(0, startY, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${card.gradient.opacity * 0.7})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${card.gradient.opacity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, startY, width, gradHeight);
  }

  // 4. Render Headline Text
  const typo = card.typography;
  const paddingX = 80;
  const bottomMargin = 120;
  const fontSize = (typo.fontSizePx / 430) * 1080; // Scale relative to mobile view
  const lineHeight = fontSize * (typo.lineHeightPercent / 100);

  ctx.font = `900 ${fontSize}px Pretendard, sans-serif`;
  ctx.textBaseline = 'alphabetic';

  const lines = card.titleText.split('\n');
  const totalTextHeight = lines.length * lineHeight;
  let currentY = height - bottomMargin - totalTextHeight + fontSize;

  lines.forEach((line) => {
    const segments = parseBracketSegments(line);

    // Calculate total line width for alignment
    let totalLineWidth = 0;
    segments.forEach((seg) => {
      totalLineWidth += ctx.measureText(seg.text).width;
    });

    let currentX = paddingX;
    if (typo.align === 'center') {
      currentX = (width - totalLineWidth) / 2;
    } else if (typo.align === 'right') {
      currentX = width - paddingX - totalLineWidth;
    }

    segments.forEach((seg) => {
      ctx.fillStyle = seg.isHighlighted ? typo.accentColorHex : typo.baseColorHex;

      if (typo.strokeWidthPx > 0) {
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.lineWidth = (typo.strokeWidthPx / 430) * 1080;
        ctx.strokeText(seg.text, currentX, currentY);
      }

      ctx.fillText(seg.text, currentX, currentY);
      currentX += ctx.measureText(seg.text).width;
    });

    currentY += lineHeight;
  });

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

