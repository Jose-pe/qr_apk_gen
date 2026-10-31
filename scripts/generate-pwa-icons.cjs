const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="108" fill="#2563eb" />
  <rect x="72" y="72" width="144" height="144" rx="28" fill="#ffffff" />
  <rect x="104" y="104" width="80" height="80" rx="16" fill="#2563eb" />
  
  <rect x="296" y="72" width="144" height="144" rx="28" fill="#ffffff" />
  <rect x="328" y="104" width="80" height="80" rx="16" fill="#2563eb" />
  
  <rect x="72" y="296" width="144" height="144" rx="28" fill="#ffffff" />
  <rect x="104" y="328" width="80" height="80" rx="16" fill="#2563eb" />
  
  <!-- WiFi Arcs & Dot inside QR Center/Bottom-Right -->
  <circle cx="368" cy="380" r="22" fill="#ffffff" />
  <path d="M328 340 A60 60 0 0 1 408 340" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" />
  <path d="M296 308 A104 104 0 0 1 440 308" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" />
  
  <!-- Center decorative data dots -->
  <rect x="236" y="112" width="40" height="40" rx="10" fill="#ffffff" />
  <rect x="112" y="236" width="40" height="40" rx="10" fill="#ffffff" />
  <rect x="236" y="236" width="40" height="40" rx="10" fill="#ffffff" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

async function generatePngs() {
  const qrData = 'WIFI:S:QR-Pro;T:WPA;P:AwesomeQR;;';
  
  // 192x192
  await QRCode.toFile(path.join(publicDir, 'pwa-192x192.png'), qrData, {
    width: 192,
    margin: 2,
    color: { dark: '#1d4ed8', light: '#ffffff' }
  });

  // 512x512
  await QRCode.toFile(path.join(publicDir, 'pwa-512x512.png'), qrData, {
    width: 512,
    margin: 3,
    color: { dark: '#1d4ed8', light: '#ffffff' }
  });

  // Maskable 512x512 (extra padding for safe-zone)
  await QRCode.toFile(path.join(publicDir, 'pwa-maskable-512x512.png'), qrData, {
    width: 512,
    margin: 6,
    color: { dark: '#1d4ed8', light: '#ffffff' }
  });

  // Apple touch icon 180x180
  await QRCode.toFile(path.join(publicDir, 'apple-touch-icon.png'), qrData, {
    width: 180,
    margin: 2,
    color: { dark: '#1d4ed8', light: '#ffffff' }
  });

  console.log('Icons generated successfully');
}

generatePngs();
