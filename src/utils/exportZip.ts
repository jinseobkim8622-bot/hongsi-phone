import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CardItem, AspectRatio } from '../types/hongsiphone';
import { renderCardToCanvas } from './canvasRenderer';

export async function exportCardsAsZip(
  cards: CardItem[],
  aspectRatio: AspectRatio,
  captionText: string,
  projectTitle: string = '홍시폰_카드뉴스'
): Promise<void> {
  const zip = new JSZip();

  // 1. Render all cards
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const canvas = await renderCardToCanvas(card, aspectRatio);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );

    if (blob) {
      const fileName = `${String(i + 1).padStart(2, '0')}_card.png`;
      zip.file(fileName, blob);
    }
  }

  // 2. Add caption text file
  if (captionText) {
    zip.file('caption.txt', captionText);
  }

  // 3. Generate zip and trigger save
  const zipContent = await zip.generateAsync({ type: 'blob' });
  const sanitizedTitle = projectTitle.replace(/[/\\?%*:|"<>]/g, '_');
  saveAs(zipContent, `${sanitizedTitle}.zip`);
}

