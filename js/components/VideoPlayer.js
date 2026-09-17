// Netflix Custom Full-Screen Video Player Component
import { store } from '../store.js';

export function initVideoPlayer() {
  let playerContainer = document.getElementById('netflix-player');
  if (!playerContainer) {
    playerContainer = document.createElement('div');
    playerContainer.id = 'netflix-player';
    playerContainer.className = 'netflix-player-container';
    document.body.appendChild(playerContainer);
  }

  let idleTimer = null;
  let activeMovie = null;

  store.subscribe('playerOpened', (movie) => {
    activeMovie = movie;
    renderPlayer(playerContainer, movie);
    playerContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  store.subscribe('playerClosed', () => {
    const video = playerContainer.querySelector('video');
    if (video) {
      video.pause();
      video.src = '';
    }
    playerContainer.classList.remove('active');
    document.body.style.overflow = '';
    if (idleTimer) clearTimeout(idleTimer);
  });
}

function renderPlayer(container, movie) {
  const episode = movie.currentEpisode;
  const titleDisplay = movie.title;
  const subtitleDisplay = episode ? `S${episode.season} E${episode.number}: ${episode.title}` : (movie.releaseYear || '');

  container.innerHTML = `
    <video class="player-video" id="main-video" src="${movie.videoUrl}" playsinline autoplay preload="auto"></video>

    <div class="player-center-feedback" id="player-feedback">
      <svg class="svg-icon-lg" id="feedback-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    </div>

    <!-- Controls Overlay -->
    <div class="player-controls-overlay" id="player-controls">
      <!-- Top Bar -->
      <div class="player-top-bar">
        <button class="player-back-btn" id="player-back-btn" title="Back to Browse">
          <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div class="player-title-info">
          <h3 class="player-movie-title">${titleDisplay}</h3>
          <span class="player-episode-title">${subtitleDisplay}</span>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="player-bottom-bar">
        <!-- Scrubber -->
        <div class="player-timeline-container" id="player-timeline">
          <div class="player-progress-bar" id="player-progress">
            <span class="player-progress-thumb"></span>
          </div>
          <div class="timeline-tooltip" id="timeline-tooltip">00:00</div>
        </div>

        <!-- Controls Row -->
        <div class="player-controls-row">
          <div class="player-controls-left">
            <button class="player-btn" id="player-play-btn" title="Play (Space)">
              <svg class="svg-icon-lg" id="play-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button class="player-btn" id="player-rewind-btn" title="Rewind 10s (Left Arrow)">
              <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
            </button>
            <button class="player-btn" id="player-forward-btn" title="Forward 10s (Right Arrow)">
              <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
            </button>
            <div class="player-volume-wrapper">
              <button class="player-btn" id="player-mute-btn" title="Mute (m)">
                <svg class="svg-icon-lg" id="player-vol-icon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              </button>
              <input type="range" class="player-volume-slider" id="player-vol-slider" min="0" max="1" step="0.05" value="1" />
            </div>
            <div class="player-time-display" id="player-time">00:00 / 00:00</div>
          </div>

          <div class="player-controls-right">
            <span class="player-speed-badge" id="player-speed-btn" title="Playback Speed">1.0x</span>
            <button class="player-btn" id="player-subs-btn" title="Audio & Subtitles">
              <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>
            </button>
            <button class="player-btn" id="player-fullscreen-btn" title="Full Screen (f)">
              <svg class="svg-icon-lg" id="fullscreen-icon" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  bindPlayerEvents(container);
}

function bindPlayerEvents(container) {
  const video = container.querySelector('#main-video');
  const controls = container.querySelector('#player-controls');
  const backBtn = container.querySelector('#player-back-btn');
  const playBtn = container.querySelector('#player-play-btn');
  const playPauseIcon = container.querySelector('#play-pause-icon');
  const rewindBtn = container.querySelector('#player-rewind-btn');
  const forwardBtn = container.querySelector('#player-forward-btn');
  const muteBtn = container.querySelector('#player-mute-btn');
  const volIcon = container.querySelector('#player-vol-icon');
  const volSlider = container.querySelector('#player-vol-slider');
  const timeDisplay = container.querySelector('#player-time');
  const timeline = container.querySelector('#player-timeline');
  const progress = container.querySelector('#player-progress');
  const tooltip = container.querySelector('#timeline-tooltip');
  const speedBtn = container.querySelector('#player-speed-btn');
  const subsBtn = container.querySelector('#player-subs-btn');
  const fullscreenBtn = container.querySelector('#player-fullscreen-btn');
  const feedback = container.querySelector('#player-feedback');
  const feedbackIcon = container.querySelector('#feedback-icon');

  if (!video) return;

  // Auto-hide controls logic
  let idleTimeout = null;
  const resetIdleTimer = () => {
    controls.classList.remove('idle');
    container.style.cursor = 'default';
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      if (!video.paused) {
        controls.classList.add('idle');
        container.style.cursor = 'none';
      }
    }, 2800);
  };

  container.addEventListener('mousemove', resetIdleTimer);
  resetIdleTimer();

  // Play / Pause toggle
  const togglePlay = () => {
    if (video.paused) {
      video.play();
      playPauseIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      showFeedback('<path d="M8 5v14l11-7z"/>');
    } else {
      video.pause();
      playPauseIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      showFeedback('<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>');
    }
  };

  const showFeedback = (pathD) => {
    if (!feedback || !feedbackIcon) return;
    feedbackIcon.innerHTML = pathD;
    feedback.classList.remove('flash');
    void feedback.offsetWidth; // reflow
    feedback.classList.add('flash');
  };

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Time & progress update
  video.addEventListener('timeupdate', () => {
    const current = video.currentTime;
    const dur = video.duration || 0;
    if (dur > 0) {
      const pct = (current / dur) * 100;
      progress.style.width = `${pct}%`;
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(dur)}`;
    }
  });

  // Timeline scrub
  timeline.addEventListener('click', (e) => {
    const rect = timeline.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * (video.duration || 0);
  });

  timeline.addEventListener('mousemove', (e) => {
    const rect = timeline.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const hoverTime = pos * (video.duration || 0);
    tooltip.textContent = formatTime(hoverTime);
    tooltip.style.left = `${pos * 100}%`;
  });

  // Rewind & Forward
  rewindBtn.addEventListener('click', () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
    showFeedback('<path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>');
  });

  forwardBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    showFeedback('<path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>');
  });

  // Volume
  const updateVolume = () => {
    video.volume = volSlider.value;
    video.muted = video.volume === 0;
    updateVolIcon();
  };

  const updateVolIcon = () => {
    if (video.muted || video.volume === 0) {
      volIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
      volIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  };

  volSlider.addEventListener('input', updateVolume);

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    volSlider.value = video.muted ? 0 : (video.volume || 0.8);
    updateVolIcon();
  });

  // Speed toggle
  const speeds = [1.0, 1.25, 1.5, 0.75];
  let currentSpeedIdx = 0;
  speedBtn.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const speed = speeds[currentSpeedIdx];
    video.playbackRate = speed;
    speedBtn.textContent = `${speed}x`;
    store.showToast(`Speed set to ${speed}x`);
  });

  // Subtitles
  subsBtn.addEventListener('click', () => {
    store.showToast('Subtitles: English [CC] active');
  });

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Back button
  backBtn.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    store.closePlayer();
  });

  // Keyboard controls
  const handleKeydown = (e) => {
    if (!container.classList.contains('active')) return;

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        rewindBtn.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        forwardBtn.click();
        break;
      case 'ArrowUp':
        e.preventDefault();
        volSlider.value = Math.min(1, parseFloat(volSlider.value) + 0.1);
        updateVolume();
        break;
      case 'ArrowDown':
        e.preventDefault();
        volSlider.value = Math.max(0, parseFloat(volSlider.value) - 0.1);
        updateVolume();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        muteBtn.click();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        fullscreenBtn.click();
        break;
      case 'Escape':
        e.preventDefault();
        store.closePlayer();
        break;
    }
  };

  window.addEventListener('keydown', handleKeydown);
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
