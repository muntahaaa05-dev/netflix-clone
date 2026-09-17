// Reliable Image Fallback Utility using high-definition SVG data URIs
export function getFallbackImage(title = 'Netflix Original', type = 'FILM') {
  const cleanTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const isSeries = type.toUpperCase().includes('SERIES') || type.toUpperCase().includes('SHOW');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a0808"/>
        <stop offset="35%" stop-color="#141414"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
      <radialGradient id="glow" cx="80%" cy="20%" r="70%">
        <stop offset="0%" stop-color="#e50914" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
      </filter>
    </defs>
    
    <!-- Background Canvas -->
    <rect width="800" height="450" fill="url(#bg-gradient)"/>
    <rect width="800" height="450" fill="url(#glow)"/>
    
    <!-- Subtle Grid Lines -->
    <path d="M0 150h800M0 300h800M266 0v450M533 0v450" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    
    <!-- Netflix N Brand Icon -->
    <g transform="translate(48, 44) scale(1.1)">
      <path d="M0 0h5l10 24V0h5v32c-2-.4-4-.8-6-1.2L4 7v23c-1.5-.3-3-.6-4-.9V0z" fill="#e50914" filter="url(#shadow)"/>
    </g>
    
    <!-- Series / Film Badge -->
    <rect x="85" y="48" width="${isSeries ? 70 : 54}" height="20" rx="3" fill="#e50914"/>
    <text x="${isSeries ? 91 : 92}" y="63" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1.5">
      ${isSeries ? 'SERIES' : 'FILM'}
    </text>

    <!-- Title & Quality Tags -->
    <g transform="translate(48, 330)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="0.5" filter="url(#shadow)">
        ${cleanTitle.toUpperCase()}
      </text>
      <g transform="translate(0, 20)">
        <rect x="0" y="0" width="56" height="18" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <text x="8" y="13" font-family="sans-serif" font-weight="700" font-size="10" fill="#dedede">4K UHD</text>

        <rect x="64" y="0" width="46" height="18" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <text x="73" y="13" font-family="sans-serif" font-weight="700" font-size="10" fill="#46d369">98%</text>

        <text x="122" y="14" font-family="sans-serif" font-weight="600" font-size="12" fill="#a3a3a3">Netflix Original</text>
      </g>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function handleImageError(img, title, type = 'FILM') {
  if (!img || img.dataset.hasFallback) return;
  img.dataset.hasFallback = 'true';
  img.src = getFallbackImage(title, type);
}
