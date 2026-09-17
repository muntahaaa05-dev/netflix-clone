// Netflix Dedicated My List Grid Component
import { store } from '../store.js';
import { catalog } from '../data.js';
import { renderMovieCard, bindCardInteractions } from './MovieRow.js';

export function renderMyListGrid(container, availableCatalog = catalog) {
  const myListItems = availableCatalog.filter(i => store.isInMyList(i.id));

  container.innerHTML = `
    <section class="movie-row-section" style="margin-top: 90px;">
      <div class="mylist-page-header">
        <h1 class="mylist-page-title">My List</h1>
        <span class="mylist-page-count" id="mylist-count">${myListItems.length} ${myListItems.length === 1 ? 'title' : 'titles'}</span>
      </div>
      <div id="mylist-content-area"></div>
    </section>
  `;

  const contentArea = container.querySelector('#mylist-content-area');
  const countSpan = container.querySelector('#mylist-count');

  if (myListItems.length === 0) {
    renderEmptyState(contentArea, countSpan);
  } else {
    renderGrid(contentArea, countSpan, myListItems);
  }
}

function renderGrid(contentArea, countSpan, items) {
  contentArea.innerHTML = `
    <div class="mylist-grid" id="mylist-grid">
      ${items.map(item => renderMovieCard(item)).join('')}
    </div>
  `;

  bindCardInteractions(contentArea);

  // Hook into list buttons within the grid to smoothly animate card removal
  contentArea.querySelectorAll('.card-list-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const movieId = btn.getAttribute('data-id');
      const card = contentArea.querySelector(`.movie-card[data-id="${movieId}"]`);
      
      // Wait for store toggle to complete
      setTimeout(() => {
        if (!store.isInMyList(movieId) && card) {
          card.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.85)';
          
          setTimeout(() => {
            card.remove();
            const remaining = contentArea.querySelectorAll('.movie-card').length;
            if (countSpan) {
              countSpan.textContent = `${remaining} ${remaining === 1 ? 'title' : 'titles'}`;
            }
            if (remaining === 0) {
              renderEmptyState(contentArea, countSpan);
            }
          }, 280);
        }
      }, 50);
    });
  });
}

function renderEmptyState(contentArea, countSpan) {
  if (countSpan) countSpan.textContent = '0 titles';
  contentArea.innerHTML = `
    <div class="mylist-empty-state">
      <svg class="mylist-empty-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      <h2 class="mylist-empty-title">Your list is empty</h2>
      <p class="mylist-empty-desc">Never lose track of what you want to watch. Add TV shows and movies to your list so you can easily find them later.</p>
      <button class="btn-browse-catalog" id="browse-catalog-btn">Browse Popular Titles</button>
    </div>
  `;

  const browseBtn = contentArea.querySelector('#browse-catalog-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      store.setFilter('all');
    });
  }
}
