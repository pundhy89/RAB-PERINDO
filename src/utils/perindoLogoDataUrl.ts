/**
 * Generates a crisp high-resolution Data URL PNG of the Partai Perindo emblem.
 * Runs 100% in-memory using standard HTML5 Canvas 2D API.
 * Never fails, has 0 network dependencies, and embeds seamlessly into jsPDF.
 */
export function getPerindoLogoDataUrl(): string {
  const size = 300;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const scale = size / 100;
  ctx.scale(scale, scale);

  // Outer border circle
  ctx.beginPath();
  ctx.arc(50, 50, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#0f2766';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#2563eb';
  ctx.stroke();

  // Inner dark shield circle
  ctx.beginPath();
  ctx.arc(50, 50, 44, 0, Math.PI * 2);
  ctx.fillStyle = '#08183d';
  ctx.fill();

  // Left Wing (Patriotic Crimson Red)
  ctx.beginPath();
  ctx.moveTo(50, 24);
  ctx.bezierCurveTo(44, 24, 32, 30, 24, 39);
  ctx.bezierCurveTo(21, 42, 20, 46, 22, 49);
  ctx.bezierCurveTo(23, 51, 26, 51, 29, 49);
  ctx.bezierCurveTo(35, 45, 42, 41, 48, 39);
  ctx.lineTo(46, 51);
  ctx.bezierCurveTo(42, 53, 36, 57, 32, 62);
  ctx.bezierCurveTo(30, 64, 30, 67, 32, 69);
  ctx.bezierCurveTo(34, 70, 37, 69, 40, 67);
  ctx.bezierCurveTo(44, 64, 48, 60, 50, 56);
  ctx.closePath();
  ctx.fillStyle = '#dc2626';
  ctx.fill();

  // Right Wing (Perindo Royal Blue)
  ctx.beginPath();
  ctx.moveTo(50, 24);
  ctx.bezierCurveTo(56, 24, 68, 30, 76, 39);
  ctx.bezierCurveTo(79, 42, 80, 46, 78, 49);
  ctx.bezierCurveTo(77, 51, 74, 51, 71, 49);
  ctx.bezierCurveTo(65, 45, 58, 41, 52, 39);
  ctx.lineTo(54, 51);
  ctx.bezierCurveTo(58, 53, 64, 57, 68, 62);
  ctx.bezierCurveTo(70, 64, 70, 67, 68, 69);
  ctx.bezierCurveTo(66, 70, 63, 69, 60, 67);
  ctx.bezierCurveTo(56, 64, 52, 60, 50, 56);
  ctx.closePath();
  ctx.fillStyle = '#2563eb';
  ctx.fill();

  // Center Quill / Torso (Crisp White)
  ctx.beginPath();
  ctx.moveTo(50, 22);
  ctx.lineTo(53, 34);
  ctx.lineTo(50, 48);
  ctx.lineTo(47, 34);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Golden Crest Star
  drawStar(ctx, 50, 21, 5, 5.5, 2.5, '#f59e0b');

  // Lower Tail Feathers
  ctx.beginPath();
  ctx.moveTo(50, 56);
  ctx.lineTo(54, 74);
  ctx.quadraticCurveTo(50, 76, 46, 74);
  ctx.closePath();
  ctx.fillStyle = '#f8fafc';
  ctx.fill();

  // Golden Base Arc
  ctx.beginPath();
  ctx.arc(50, 50, 36, 0.28 * Math.PI, 0.72 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
