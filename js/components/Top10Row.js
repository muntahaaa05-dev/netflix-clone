// Netflix Top 10 Row Component (Without numbers 1, 2, 3)
import { store } from '../store.js';
import { renderMovieCard, bindCardInteractions } from './MovieRow.js';

export function createTop10Row(title, items, rowId = 'top10-row') {
  const section = document.createElement('section');
  section.className = 'movie-row-section top10-section';
  if (rowId) section.id = rowId;

  // Filter and sort items by isTop10 rank
  const top10Items = [...items]
    .filter(item => item.isTop10 !== null && item.isTop10 !== undefined)
    .sort((a, b) => a.isTop10 - b.isTop10);

  if (top10Items.length === 0) return section;

  section.innerHTML = `
    <div class="movie-row-header">
      <h2 class="movie-row-title">
        <span>${title}</span>
        <span class="row-explore-all">
          Explore All
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </span>
      </h2>
    </div>

    <div class="row-slider-container">
      <button class="slider-arrow left" aria-label="Previous Top 10">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>

      <div class="row-slider-track">
        ${top10Items.map(item => renderMovieCard(item, { isTop10: true })).join('')}
      </div>

      <button class="slider-arrow right" aria-label="Next Top 10">
        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    </div>
  `;

  bindTop10Events(section);
  return section;
}

function bindTop10Events(section) {
  const track = section.querySelector('.row-slider-track');
  const leftArrow = section.querySelector('.slider-arrow.left');
  const rightArrow = section.querySelector('.slider-arrow.right');

  if (leftArrow && track) {
    leftArrow.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth * 0.75, behavior: 'smooth' });
    });
  }

  if (rightArrow && track) {
    rightArrow.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth * 0.75, behavior: 'smooth' });
    });
  }

  // Bind card clicks and hover action buttons
  bindCardInteractions(section);
}
