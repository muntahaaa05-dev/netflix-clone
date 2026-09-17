// Netflix Billboard / Hero Component
import { store } from '../store.js';
import { heroFeaturedItem } from '../data.js';
import { initBillboard3dParallax } from './TiltEffect.js';
import { getFallbackImage } from '../utils/imageFallback.js';

export function renderBillboard(item = heroFeaturedItem) {
  const container = document.getElementById('hero-billboard-container');
  if (!container || !item) return;

  const inMyList = store.isInMyList(item.id);
  const fallbackSrc = getFallbackImage(item.title, item.type);

  container.innerHTML = `
    <section class="hero-billboard" id="hero-billboard">
      <div class="billboard-bg-container">
        <img class="billboard-bg-img" id="billboard-img" src="${item.backdrop}" alt="${item.title}" onerror="this.onerror=null; this.src='${fallbackSrc}';" />
        <video class="billboard-video" id="billboard-video" src="${item.videoUrl}" loop muted playsinline></video>
      </div>

      <div class="billboard-vignette"></div>

      <div class="billboard-content">
        <div class="billboard-series-badge">
          <span class="billboard-n-logo">N</span>
          <span>${item.type === 'series' ? 'SERIES' : 'FILM'}</span>
        </div>

        <h1 class="billboard-title">${item.logoTitle || item.title}</h1>

        <div class="billboard-top10">
          <span class="top10-badge-icon">TOP 10</span>
          <span class="top10-text">Top 10 in TV Shows Today</span>
        </div>

        <p class="billboard-overview">${item.overview}</p>

        <div class="billboard-actions">
          <button class="btn-play" id="billboard-play-btn" aria-label="Play title">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <span>Play</span>
          </button>
          <button class="btn-more-info" id="billboard-info-btn" aria-label="More information">
            <svg class="svg-icon" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            <span>More Info</span>
          </button>
          <button class="btn-billboard-list ${inMyList ? 'active' : ''}" id="billboard-list-btn" data-id="${item.id}" aria-label="Add to My List">
            ${inMyList ? 
              '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg><span>In My List</span>' : 
              '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><span>My List</span>'
            }
          </button>
        </div>
      </div>

      <div class="billboard-side-controls">
        <button class="billboard-sound-btn" id="billboard-sound-btn" aria-label="Toggle sound" title="Mute/Unmute">
          <svg class="svg-icon" id="sound-icon-muted" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          <svg class="svg-icon" id="sound-icon-unmuted" viewBox="0 0 24 24" style="display: none;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </button>
        <div class="billboard-maturity-badge">${item.rating}</div>
      </div>
    </section>
  `;

  bindBillboardEvents(item);
  initBillboard3dParallax();
}

function bindBillboardEvents(item) {
  const playBtn = document.getElementById('billboard-play-btn');
  const infoBtn = document.getElementById('billboard-info-btn');
  const listBtn = document.getElementById('billboard-list-btn');
  const soundBtn = document.getElementById('billboard-sound-btn');
  const video = document.getElementById('billboard-video');
  const mutedIcon = document.getElementById('sound-icon-muted');
  const unmutedIcon = document.getElementById('sound-icon-unmuted');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (video) video.pause();
      store.openPlayer(item);
    });
  }

  if (infoBtn) {
    infoBtn.addEventListener('click', () => {
      store.openModal(item);
    });
  }

  if (listBtn) {
    listBtn.addEventListener('click', () => {
      store.toggleMyList(item.id);
    });
  }

  // Auto-play preview video after slight delay
  let playTimeout = setTimeout(() => {
    if (video) {
      video.play().then(() => {
        video.classList.add('playing');
      }).catch(() => {
        // Autoplay policy prevented playback, keep poster
      });
    }
  }, 1200);

  if (soundBtn && video) {
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        mutedIcon.style.display = 'block';
        unmutedIcon.style.display = 'none';
        store.showToast('Audio Muted');
      } else {
        mutedIcon.style.display = 'none';
        unmutedIcon.style.display = 'block';
        store.showToast('Audio Unmuted');
      }
    });
  }

  // Pause billboard video when window is scrolled down
  window.addEventListener('scroll', () => {
    if (video) {
      if (window.scrollY > 400 && !video.paused) {
        video.pause();
      } else if (window.scrollY <= 400 && video.paused && video.classList.contains('playing')) {
        video.play().catch(() => {});
      }
    }
  }, { passive: true });
}

// Global synchronization for billboard My List button
store.subscribe('myListChanged', ({ movieId, added }) => {
  const listBtn = document.getElementById('billboard-list-btn');
  if (listBtn && listBtn.getAttribute('data-id') === movieId) {
    listBtn.classList.toggle('active', added);
    listBtn.innerHTML = added ? 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg><span>In My List</span>' : 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><span>My List</span>';
  }
});
