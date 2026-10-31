import QRCode from 'qrcode';
import { QRStyleConfig, WifiConfig } from '../types';

/**
 * Escape special characters in Wi-Fi SSID and Password according to ZXing specification.
 * Characters to escape: \, ;, ,, :, "
 */
export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

/**
 * Format WiFi parameters into standard QR WiFi payload string:
 * WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
 */
export function formatWifiPayload(config: WifiConfig): string {
  const enc = config.encryption;
  const ssid = escapeWifiString(config.ssid.trim());
  const pwd = enc === 'nopass' ? '' : escapeWifiString(config.password);
  const hidden = config.hidden ? 'true' : 'false';

  return `WIFI:T:${enc};S:${ssid};P:${pwd};H:${hidden};;`;
}

/**
 * Generates an SVG string representation of the QR code
 */
export async function generateQRSvg(
  payload: string,
  style: QRStyleConfig
): Promise<string> {
  return await QRCode.toString(payload, {
    type: 'svg',
    margin: style.margin,
    errorCorrectionLevel: style.errorCorrectionLevel,
    color: {
      dark: style.fgColor,
      light: style.bgColor,
    },
  });
}

/**
 * Renders QR code onto an HTML5 Canvas with optional center badge/icon
 */
export async function drawQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  style: QRStyleConfig
): Promise<void> {
  const size = style.width || 800;
  canvas.width = size;
  canvas.height = size;

  // Render base QR code to canvas
  await QRCode.toCanvas(canvas, payload, {
    width: size,
    margin: style.margin,
    errorCorrectionLevel: style.centerIcon !== 'none' ? 'H' : style.errorCorrectionLevel,
    color: {
      dark: style.fgColor,
      light: style.bgColor,
    },
  });

  // If a center icon is requested, draw a clean circular badge in the center
  if (style.centerIcon !== 'none') {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const iconSize = Math.floor(size * 0.22);
    const center = size / 2;
    const radius = iconSize / 2;

    // Draw background circle for high contrast against QR pattern
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = style.bgColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = style.fgColor;
    ctx.fill();

    // Draw symbol inside the badge
    ctx.fillStyle = style.bgColor;
    ctx.strokeStyle = style.bgColor;
    ctx.lineWidth = Math.max(2, Math.floor(size * 0.012));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (style.centerIcon === 'wifi') {
      // WiFi dot
      ctx.beginPath();
      ctx.arc(center, center + radius * 0.45, radius * 0.14, 0, Math.PI * 2);
      ctx.fill();

      // WiFi arcs
      ctx.beginPath();
      ctx.arc(center, center + radius * 0.45, radius * 0.42, Math.PI * 1.25, Math.PI * 1.75);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center, center + radius * 0.45, radius * 0.72, Math.PI * 1.22, Math.PI * 1.78);
      ctx.stroke();
    } else if (style.centerIcon === 'link') {
      // Link chain icon
      const linkScale = radius * 0.55;
      ctx.beginPath();
      ctx.arc(center - linkScale * 0.35, center + linkScale * 0.35, linkScale * 0.4, Math.PI * 0.25, Math.PI * 1.25);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(center + linkScale * 0.35, center - linkScale * 0.35, linkScale * 0.4, Math.PI * 1.25, Math.PI * 0.25);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(center - linkScale * 0.25, center - linkScale * 0.25);
      ctx.lineTo(center + linkScale * 0.25, center + linkScale * 0.25);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Downloads the canvas as high-resolution PNG
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/**
 * Downloads SVG as file
 */
export function downloadSvg(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Copies the canvas image directly to clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
