
/**
 * Calculates the luminance of a hex color.
 * @param hex - The hex color string (e.g., "#RRGGBB").
 * @returns A value between 0 (darkest) and 1 (lightest).
 */
function getLuminance(hex: string): number {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return 0;
  }

  const rgb = [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];

  const [r, g, b] = rgb.map(c => {
    if (c <= 0.03928) {
      return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates the contrast ratio between two hex colors.
 * @param hex1 - The first hex color.
 * @param hex2 - The second hex color.
 * @returns The contrast ratio, a value between 1 and 21.
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determines an appropriate text color for a given background color, ensuring minimum contrast.
 * @param backgroundColor - The hex code of the background color.
 * @param preferredTextColor - The theme's preferred text color.
 * @returns The hex code for the text color to use.
 */
export function getReadableTextColor(backgroundColor: string, preferredTextColor: string): string {
  const MIN_CONTRAST_RATIO = 4.5;

  try {
    const contrastWithPreferred = getContrastRatio(backgroundColor, preferredTextColor);
    if (contrastWithPreferred >= MIN_CONTRAST_RATIO) {
      return preferredTextColor;
    }

    const contrastWithWhite = getContrastRatio(backgroundColor, '#FFFFFF');
    const contrastWithBlack = getContrastRatio(backgroundColor, '#000000');
    
    return contrastWithWhite > contrastWithBlack ? '#FFFFFF' : '#000000';
  } catch(e) {
    // Fallback in case of invalid color string
    return '#000000';
  }
}
