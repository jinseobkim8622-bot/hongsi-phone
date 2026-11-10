import React from 'react';

export interface TextSegment {
  text: string;
  isHighlighted: boolean;
}

/**
 * Splits text into normal text segments and [bracketed] segments.
 */
export function parseBracketSegments(text: string): TextSegment[] {
  if (!text) return [];
  const segments: TextSegment[] = [];
  const regex = /\[(.*?)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isHighlighted: false,
      });
    }
    segments.push({
      text: match[1],
      isHighlighted: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isHighlighted: false,
    });
  }

  return segments;
}

/**
 * Renders bracket-highlighted text in JSX.
 * Normalizes \n into <br /> or block breaks.
 */
export function renderBracketText(
  text: string,
  baseColor: string,
  accentColor: string,
  strokeWidth: number = 0
): React.ReactNode {
  if (!text) return null;

  // Split lines first
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const segments = parseBracketSegments(line);
    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {segments.map((seg, segIdx) => (
          <span
            key={segIdx}
            style={{
              color: seg.isHighlighted ? accentColor : baseColor,
              WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px rgba(0,0,0,0.8)` : undefined,
            }}
          >
            {seg.text}
          </span>
        ))}
      </React.Fragment>
    );
  });
}

