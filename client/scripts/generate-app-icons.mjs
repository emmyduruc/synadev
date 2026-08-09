/**
 * Generates SYNA app / splash icons: white wordmark on primary-500.
 * Run: node scripts/generate-app-icons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, '..');
const imagesDir = path.join(clientDir, 'assets/images');
const fontPath = path.resolve(
  clientDir,
  '../node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf',
);

/** Matches packages/design-tokens primary[500] + SplashScreen bg-primary-500 */
const PRIMARY_500 = '#A55972';

const buildSvg = ({
  size,
  background,
  textColor,
  fontSize,
  letterSpacing = 0.2,
}) => {
  const trackingEm = letterSpacing;
  // Approximate letter-spacing for SVG (em of font size)
  const svgLetterSpacing = fontSize * trackingEm;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : ''}
  <text
    x="50%"
    y="50%"
    fill="${textColor}"
    font-family="Montserrat"
    font-size="${fontSize}"
    font-weight="700"
    letter-spacing="${svgLetterSpacing}"
    text-anchor="middle"
    dominant-baseline="central"
  >SYNA</text>
</svg>`;
};

const renderPng = (svg, size) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: {
      fontFiles: [fontPath],
      loadSystemFonts: false,
      defaultFontFamily: 'Montserrat',
    },
  });
  return resvg.render().asPng();
};

const writeIcon = (filename, png) => {
  const outPath = path.join(imagesDir, filename);
  writeFileSync(outPath, png);
  console.log(`Wrote ${path.relative(clientDir, outPath)} (${png.length} bytes)`);
};

if (!readFileSync(fontPath).length) {
  throw new Error(`Missing Montserrat Bold at ${fontPath}`);
}

// App icon — full-bleed primary + white SYNA (iOS / general)
writeIcon(
  'icon.png',
  renderPng(
    buildSvg({
      size: 1024,
      background: PRIMARY_500,
      textColor: '#FFFFFF',
      fontSize: 168,
      letterSpacing: 0.18,
    }),
    1024,
  ),
);

// Native splash image — transparent so plugin backgroundColor shows through
writeIcon(
  'splash-icon.png',
  renderPng(
    buildSvg({
      size: 1024,
      background: null,
      textColor: '#FFFFFF',
      fontSize: 168,
      letterSpacing: 0.18,
    }),
    1024,
  ),
);

// Android adaptive foreground — transparent, logo inset for safe zone
writeIcon(
  'android-icon-foreground.png',
  renderPng(
    buildSvg({
      size: 1024,
      background: null,
      textColor: '#FFFFFF',
      fontSize: 140,
      letterSpacing: 0.18,
    }),
    1024,
  ),
);

// Android adaptive background — solid primary
writeIcon(
  'android-icon-background.png',
  renderPng(
    `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="${PRIMARY_500}"/>
</svg>`,
    1024,
  ),
);

// Android monochrome — black wordmark on transparent
writeIcon(
  'android-icon-monochrome.png',
  renderPng(
    buildSvg({
      size: 1024,
      background: null,
      textColor: '#000000',
      fontSize: 140,
      letterSpacing: 0.18,
    }),
    1024,
  ),
);

// Favicon
writeIcon(
  'favicon.png',
  renderPng(
    buildSvg({
      size: 48,
      background: PRIMARY_500,
      textColor: '#FFFFFF',
      fontSize: 9,
      letterSpacing: 0.12,
    }),
    48,
  ),
);

console.log(`Primary color: ${PRIMARY_500}`);
