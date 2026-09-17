// Netflix Detail Modal Component
import { store } from '../store.js';
import { catalog } from '../data.js';
import { getFallbackImage } from '../utils/imageFallback.js';

export function initDetailModal() {
  let modalBackdrop = document.getElementById('detail-modal-backdrop');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'detail-modal-backdrop';
    modalBackdrop.className = 'modal-backdrop';
    document.body.appendChild(modalBackdrop);
  }

  store.subscribe('modalOpened', (movie) => {
    renderModalContent(modalBackdrop, movie);
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  });

  store.subscribe('modalClosed', () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  });

  // Close on backdrop click
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      store.closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      store.closeModal();
    }
  });
}

function renderModalContent(container, movie) {
  const inMyList = store.isInMyList(movie.id);
  const isLiked = store.isLiked(movie.id);
  const durationText = movie.type === 'series' ? `${movie.seasons} ${movie.seasons > 1 ? 'Seasons' : 'Season'}` : movie.duration;

  // Find related titles (same genre, exclude current)
  const related = catalog
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 6);

  container.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" id="modal-close-x" aria-label="Close modal">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>

      <!-- Modal Hero Banner -->
      <div class="modal-hero">
        <img class="modal-hero-media" src="${movie.backdrop}" alt="${movie.title}" onerror="this.onerror=null; this.src='${getFallbackImage(movie.title, movie.type)}';" />
        <div class="modal-hero-vignette"></div>

        <div class="modal-hero-content">
          <div class="modal-hero-left">
            <h2 class="modal-title">${movie.logoTitle || movie.title}</h2>
            <div class="modal-hero-actions">
              <button class="btn-play" id="modal-play-btn">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Play</span>
              </button>
              <button class="icon-btn modal-list-btn ${inMyList ? 'active' : ''}" id="modal-list-btn" data-id="${movie.id}" title="${inMyList ? 'Remove from My List' : 'Add to My List'}">
                ${inMyList ? 
                  '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
                  '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'
                }
              </button>
              <button class="icon-btn modal-like-btn ${isLiked ? 'active' : ''}" id="modal-like-btn" data-id="${movie.id}" title="Like">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <div class="modal-meta-grid">
          <div class="modal-meta-left">
            <div class="modal-badges-row">
              <span class="match-score">${movie.matchScore}% Match</span>
              <span class="meta-val">${movie.releaseYear}</span>
              <span class="badge">${movie.rating}</span>
              <span class="meta-val">${durationText}</span>
              <span class="badge badge-quality">${movie.resolution || 'HD'}</span>
              <span class="badge badge-quality">${movie.audio || '5.1'}</span>
            </div>
            <p class="modal-overview">${movie.overview}</p>
          </div>

          <div class="modal-meta-right">
            <div class="modal-meta-item">
              <span class="meta-label">Cast: </span>
              <span class="meta-val">${movie.cast.slice(0, 4).join(', ')}</span>
            </div>
            <div class="modal-meta-item">
              <span class="meta-label">Genres: </span>
              <span class="meta-val">${movie.genres.join(', ')}</span>
            </div>
            <div class="modal-meta-item">
              <span class="meta-label">This show is: </span>
              <span class="meta-val">${(movie.tags || ['Exciting', 'Popular']).join(', ')}</span>
            </div>
          </div>
        </div>

        <!-- Episodes Section (If Series) -->
        ${movie.type === 'series' && movie.episodes && movie.episodes.length > 0 ? `
          <div class="episodes-section">
            <div class="episodes-header">
              <h3>Episodes</h3>
              <select class="season-selector" id="season-selector" aria-label="Select season">
                <option value="1">Season 1</option>
                ${movie.seasons > 1 ? '<option value="2">Season 2</option>' : ''}
              </select>
            </div>

            <div class="episode-list">
              ${movie.episodes.map(ep => `
                <div class="episode-item" data-episode-id="${ep.id}">
                  <span class="episode-number">${ep.number}</span>
                  <div class="episode-thumb-wrap">
                    <img class="episode-thumb-img" src="${ep.thumbnail}" alt="${ep.title}" loading="lazy" onerror="this.onerror=null; this.src='${getFallbackImage(ep.title, 'EPISODE')}';" />
                    <span class="episode-play-icon">
                      <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                  </div>
                  <div class="episode-details">
                    <div class="episode-title-row">
                      <span>${ep.title}</span>
                      <span class="episode-duration">${ep.duration}</span>
                    </div>
                    <p class="episode-overview">${ep.overview}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- More Like This -->
        ${related.length > 0 ? `
          <div class="more-like-this-section">
            <h3>More Like This</h3>
            <div class="more-like-grid">
              ${related.map(rel => {
                const relInList = store.isInMyList(rel.id);
                return `
                  <div class="more-like-card" data-id="${rel.id}">
                    <div class="more-like-thumb">
                      <img src="${rel.backdrop}" alt="${rel.title}" loading="lazy" onerror="this.onerror=null; this.src='${getFallbackImage(rel.title, rel.type)}';" />
                      <span class="more-like-duration">${rel.type === 'series' ? `${rel.seasons} Seasons` : rel.duration}</span>
                    </div>
                    <div class="more-like-info">
                      <div class="more-like-meta">
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <span class="match-score">${rel.matchScore}% Match</span>
                          <span class="badge">${rel.rating}</span>
                        </div>
                        <button class="icon-btn related-list-btn ${relInList ? 'active' : ''}" data-id="${rel.id}" title="Add to My List">
                          ${relInList ? 
                            '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
                            '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'
                          }
                        </button>
                      </div>
                      <p class="more-like-desc">${rel.overview}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- About Section -->
        <div class="about-section">
          <h3>About <strong>${movie.title}</strong></h3>
          <div class="about-row"><span class="meta-label">Director/Creator: </span><span class="meta-val">${movie.creator || 'Various'}</span></div>
          <div class="about-row"><span class="meta-label">Cast: </span><span class="meta-val">${movie.cast.join(', ')}</span></div>
          <div class="about-row"><span class="meta-label">Genres: </span><span class="meta-val">${movie.genres.join(', ')}</span></div>
          <div class="about-row"><span class="meta-label">Maturity Rating: </span><span class="meta-val">${movie.rating} - Recommended for mature audiences.</span></div>
        </div>
      </div>
    </div>
  `;

  bindModalEvents(container, movie);
}

function bindModalEvents(container, movie) {
  const closeBtn = container.querySelector('#modal-close-x');
  const playBtn = container.querySelector('#modal-play-btn');
  const listBtn = container.querySelector('#modal-list-btn');
  const likeBtn = container.querySelector('#modal-like-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.closeModal());
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      store.closeModal();
      store.openPlayer(movie);
    });
  }

  if (listBtn) {
    listBtn.addEventListener('click', () => {
      const added = store.toggleMyList(movie.id);
      listBtn.classList.toggle('active', added);
      listBtn.innerHTML = added ? 
        '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
        '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
    });
  }

  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const liked = store.toggleLike(movie.id);
      likeBtn.classList.toggle('active', liked);
    });
  }

  // Episode click -> launches player with episode info
  container.querySelectorAll('.episode-item').forEach(item => {
    item.addEventListener('click', () => {
      const epId = item.getAttribute('data-episode-id');
      const episode = movie.episodes?.find(e => e.id === epId);
      store.closeModal();
      store.openPlayer({
        ...movie,
        currentEpisode: episode
      });
    });
  });

  // Related cards click -> switch modal to that movie
  container.querySelectorAll('.more-like-card').forEach(card => {
    const relId = card.getAttribute('data-id');

    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const targetMovie = catalog.find(m => m.id === relId);
      if (targetMovie) {
        renderModalContent(container, targetMovie);
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    const relListBtn = card.querySelector('.related-list-btn');
    if (relListBtn) {
      relListBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleMyList(relId);
      });
    }
  });
}

// Global synchronization for detail modal list button
store.subscribe('myListChanged', ({ movieId, added }) => {
  const modalListBtn = document.getElementById('modal-list-btn');
  if (modalListBtn && modalListBtn.getAttribute('data-id') === movieId) {
    modalListBtn.classList.toggle('active', added);
    modalListBtn.setAttribute('title', added ? 'Remove from My List' : 'Add to My List');
    modalListBtn.innerHTML = added ? 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
  }

  document.querySelectorAll(`.related-list-btn[data-id="${movieId}"]`).forEach(btn => {
    btn.classList.toggle('active', added);
    btn.setAttribute('title', added ? 'Remove from My List' : 'Add to My List');
    btn.innerHTML = added ? 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>' : 
      '<svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
  });
});
