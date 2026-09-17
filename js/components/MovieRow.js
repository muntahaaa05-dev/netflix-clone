// Netflix Movie Row Carousel Component
import { store } from '../store.js';
import { apply3dTilt } from './TiltEffect.js';
import { getFallbackImage } from '../utils/imageFallback.js';

export function createMovieRow(rowTitle, items, rowId = '', { isTop10 = false } = {}) {
  const section = document.createElement('section');
  section.className = 'movie-row-section';
  if (rowId) section.id = rowId;

  if (!items || items.length === 0) return section;

  section.innerHTML = `
    <div class="movie-row-header">
      <h2 class="movie-row-title">
        <span>${rowTitle}</span>
        <span class="row-explore-all">
          Explore All
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </span>
      </h2>
    </div>

    <div class="row-slider-container">
      <button class="slider-arrow left" aria-label="Previous titles">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>

      <div class="row-slider-track">
        ${items.map(item => renderMovieCard(item, { isTop10 })).join('')}
      </div>

      <button class="slider-arrow right" aria-label="Next titles">
        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    </div>
  `;

  bindRowEvents(section);
  return section;
}

export function renderMovieCard(item, { isTop10 = false } = {}) {
  const inMyList = store.isInMyList(item.id);
  const isLiked = store.isLiked(item.id);
  const durationText = item.type === 'series' ? `${item.seasons} ${item.seasons > 1 ? 'Seasons' : 'Season'}` : item.duration;
  const fallbackSrc = getFallbackImage(item.title, item.type);

  const topBadgeHtml = isTop10 ? 
    `<span class="card-badge-top"><span class="top10-badge">TOP 10</span></span>` :
    `<span class="card-badge-top"><span class="card-badge-n">N</span>${item.type === 'series' ? 'SERIES' : 'FILM'}</span>`;

  return `
    <div class="movie-card" data-id="${item.id}">
      <div class="card-media">
        <img class="card-img" src="${item.backdrop}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';" />
        ${topBadgeHtml}
      </div>

      <!-- Hover Expansion Preview Card -->
      <div class="movie-card-preview">
        <div class="preview-media-wrapper">
          <img class="preview-img" src="${item.backdrop}" alt="${item.title}" onerror="this.onerror=null; this.src='${fallbackSrc}';" />
        </div>

        <div class="preview-info">
          <div class="preview-actions">
            <div class="preview-actions-left">
              <button class="btn-icon-play card-play-btn" data-id="${item.id}" title="Play">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="preview-action-btn card-list-btn ${inMyList ? 'active' : ''}" data-id="${item.id}" title="${inMyList ? 'Remove from My List' : 'Add to My List'}">
                ${inMyList ? 
                  '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
                  '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'
                }
              </button>
              <button class="preview-action-btn card-like-btn ${isLiked ? 'active' : ''}" data-id="${item.id}" title="I like this">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
              </button>
            </div>
            <button class="preview-action-btn card-detail-btn" data-id="${item.id}" title="More info">
              <svg class="svg-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
          </div>

          <div class="preview-title">${item.title}</div>

          <div class="preview-metadata">
            <span class="match-score">${item.matchScore}% Match</span>
            <span class="badge">${item.rating}</span>
            <span class="preview-duration">${durationText}</span>
            <span class="badge badge-quality">${item.resolution ? 'HD' : '4K'}</span>
          </div>

          <div class="preview-genres">
            ${item.genres.slice(0, 3).map((g, i) => `${i > 0 ? '<span class="genre-dot">•</span>' : ''}<span>${g}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindCardInteractions(container) {
  container.querySelectorAll('.movie-card').forEach(card => {
    // Apply 3D tilt physics and specular reflection
    apply3dTilt(card);

    const movieId = card.getAttribute('data-id');

    card.addEventListener('click', (e) => {
      // If an inner button was clicked, don't trigger default card open
      if (e.target.closest('button')) return;
      import('../data.js').then(({ catalog }) => {
        const movie = catalog.find(m => m.id === movieId);
        if (movie) store.openModal(movie);
      });
    });

    const playBtn = card.querySelector('.card-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        import('../data.js').then(({ catalog }) => {
          const movie = catalog.find(m => m.id === movieId);
          if (movie) store.openPlayer(movie);
        });
      });
    }

    const listBtn = card.querySelector('.card-list-btn');
    if (listBtn) {
      listBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleMyList(movieId);
      });
    }

    const likeBtn = card.querySelector('.card-like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleLike(movieId);
      });
    }

    const detailBtn = card.querySelector('.card-detail-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        import('../data.js').then(({ catalog }) => {
          const movie = catalog.find(m => m.id === movieId);
          if (movie) store.openModal(movie);
        });
      });
    }
  });
}

function bindRowEvents(section) {
  const track = section.querySelector('.row-slider-track');
  const leftArrow = section.querySelector('.slider-arrow.left');
  const rightArrow = section.querySelector('.slider-arrow.right');

  // Slider Navigation
  if (leftArrow && track) {
    leftArrow.addEventListener('click', () => {
      const scrollAmount = track.clientWidth * 0.75;
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (rightArrow && track) {
    rightArrow.addEventListener('click', () => {
      const scrollAmount = track.clientWidth * 0.75;
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  bindCardInteractions(section);
}

// Global subscriber to synchronize all My List and Like buttons across all cards and rows
store.subscribe('myListChanged', ({ movieId, added }) => {
  document.querySelectorAll(`.card-list-btn[data-id="${movieId}"]`).forEach(btn => {
    btn.classList.toggle('active', added);
    btn.setAttribute('title', added ? 'Remove from My List' : 'Add to My List');
    btn.innerHTML = added ? 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
  });
});

store.subscribe('likeChanged', ({ movieId, liked }) => {
  document.querySelectorAll(`.card-like-btn[data-id="${movieId}"]`).forEach(btn => {
    btn.classList.toggle('active', liked);
  });
});
