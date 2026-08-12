import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function drawPolylineIcon(ctx, size, isMaskable = false) {
  const scale = size / 512;
  const center = size / 2;

  // Background
  ctx.fillStyle = '#131313';
  ctx.fillRect(0, 0, size, size);

  if (!isMaskable) {
    // Outer glow / gradient squircle container
    const margin = 48 * scale;
    const cardSize = size - margin * 2;
    const cornerRadius = 96 * scale;

    // Gradient outline
    const grad = ctx.createLinearGradient(margin, margin, margin + cardSize, margin + cardSize);
    grad.addColorStop(0, '#a078ff');
    grad.addColorStop(1, '#4edea3');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardSize, cardSize, cornerRadius);
    ctx.fill();

    // Inner dark container
    const borderWidth = 6 * scale;
    const innerMargin = margin + borderWidth;
    const innerSize = cardSize - borderWidth * 2;
    const innerRadius = cornerRadius - borderWidth;

    ctx.fillStyle = '#1a1a1e';
    ctx.beginPath();
    ctx.roundRect(innerMargin, innerMargin, innerSize, innerSize, innerRadius);
    ctx.fill();
  }

  // Draw Hisaba Polyline Logo
  ctx.strokeStyle = '#d0bcff';
  ctx.lineWidth = 28 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  // Polyline nodes: point 1 (180, 320), point 2 (240, 200), point 3 (300, 280), point 4 (360, 160)
  const points = [
    [175, 325],
    [235, 205],
    [295, 275],
    [355, 165],
  ];

  points.forEach(([x, y], idx) => {
    const px = center + (x - 256) * scale * (isMaskable ? 0.75 : 0.85);
    const py = center + (y - 256) * scale * (isMaskable ? 0.75 : 0.85);
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Draw node circles on the polyline
  points.forEach(([x, y]) => {
    const px = center + (x - 256) * scale * (isMaskable ? 0.75 : 0.85);
    const py = center + (y - 256) * scale * (isMaskable ? 0.75 : 0.85);
    
    ctx.fillStyle = '#4edea3';
    ctx.beginPath();
    ctx.arc(px, py, 18 * scale * (isMaskable ? 0.75 : 0.85), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d0bcff';
    ctx.beginPath();
    ctx.arc(px, py, 10 * scale * (isMaskable ? 0.75 : 0.85), 0, Math.PI * 2);
    ctx.fill();
  });
}

function generateIcon(filename, size, isMaskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawPolylineIcon(ctx, size, isMaskable);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Generated ${filename} (${size}x${size})`);
}

generateIcon('pwa-192x192.png', 192);
generateIcon('pwa-512x512.png', 512);
generateIcon('maskable-icon-512x512.png', 512, true);
generateIcon('apple-touch-icon.png', 180);
generateIcon('favicon.png', 32);

// Generate SVG favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="128" fill="#131313"/>
  <rect x="48" y="48" width="416" height="416" rx="96" fill="url(#grad)" />
  <rect x="54" y="54" width="404" height="404" rx="90" fill="#1a1a1e" />
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a078ff" />
      <stop offset="100%" stop-color="#4edea3" />
    </linearGradient>
  </defs>
  <polyline points="150,330 220,200 290,280 370,160" fill="none" stroke="#d0bcff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="150" cy="330" r="16" fill="#4edea3" />
  <circle cx="220" cy="200" r="16" fill="#4edea3" />
  <circle cx="290" cy="280" r="16" fill="#4edea3" />
  <circle cx="370" cy="160" r="16" fill="#4edea3" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
console.log('Generated favicon.svg');
