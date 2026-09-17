// Netflix Application Coordinator
import { catalog, heroFeaturedItem } from './data.js';
import { store } from './store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderBillboard } from './components/Billboard.js';
import { createMovieRow } from './components/MovieRow.js';
import { createTop10Row } from './components/Top10Row.js';
import { renderMyListGrid } from './components/MyListGrid.js';
import { initDetailModal } from './components/DetailModal.js';
import { initVideoPlayer } from './components/VideoPlayer.js';
import { initToast } from './components/Toast.js';

class App {
  constructor() {
    this.mainContent = document.getElementById('main-content');
    this.billboardContainer = document.getElementById('hero-billboard-container');
  }

  init() {
    // Initialize common UI systems
    initToast();
    renderNavbar();
    initDetailModal();
    initVideoPlayer();

    // Render initial view
    this.renderView();

    // Subscribe to store events
    store.subscribe('filterChanged', () => {
      renderNavbar();
      this.renderView();
    });

    store.subscribe('searchChanged', (query) => {
      if (query.trim()) {
        this.renderSearchResults(query.trim());
      } else {
        this.renderView();
      }
    });

    store.subscribe('myListChanged', ({ added }) => {
      if (store.activeFilter === 'mylist') {
        // If an item was added from modal, refresh the My List view
        if (added) {
          this.renderView();
        }
      } else {
        // Refresh "My List" row on home page if present
        this.updateMyListRow();
      }
    });

    store.subscribe('profileChanged', () => {
      this.renderView();
    });
  }

  renderView() {
    const filter = store.activeFilter;

    // Filter items based on active profile (Kids filter)
    let availableCatalog = catalog;
    if (store.activeProfile.isKids) {
      availableCatalog = catalog.filter(m => m.rating === 'PG' || m.rating === '13+' || m.genres.includes('Animation'));
    }

    if (filter === 'mylist') {
      this.renderMyListView(availableCatalog);
      return;
    }

    if (filter === 'tv') {
      this.renderTVView(availableCatalog);
      return;
    }

    if (filter === 'movies') {
      this.renderMoviesView(availableCatalog);
      return;
    }

    if (filter === 'latest') {
      this.renderLatestView(availableCatalog);
      return;
    }

    // Default: 'all' / Home
    this.renderHomeView(availableCatalog);
  }

  renderHomeView(items) {
    // Billboard
    this.billboardContainer.style.display = 'block';
    renderBillboard(items[0] || heroFeaturedItem);

    // Rows
    this.mainContent.innerHTML = '';

    const trendingItems = items.filter(i => i.isTrending);
    const popularItems = items.filter(i => i.isPopular);
    const actionSciFi = items.filter(i => i.genres.includes('Action') || i.genres.includes('Sci-Fi'));
    const dramas = items.filter(i => i.genres.includes('Drama') || i.genres.includes('Thriller'));
    const myListItems = items.filter(i => store.isInMyList(i.id));

    // Trending Row
    this.mainContent.appendChild(createMovieRow('Trending Now', trendingItems, 'row-trending'));

    // Top 10 Row (without numbers 1, 2, 3)
    this.mainContent.appendChild(createTop10Row('Top 10 in Your Country Today', items, 'row-top10'));

    // My List Row (if user has items saved)
    if (myListItems.length > 0) {
      this.mainContent.appendChild(createMovieRow('My List', myListItems, 'row-mylist'));
    }

    // Popular on Netflix
    this.mainContent.appendChild(createMovieRow('Popular on Netflix', popularItems, 'row-popular'));

    // Action & Sci-Fi Blockbusters
    this.mainContent.appendChild(createMovieRow('Action & Sci-Fi Blockbusters', actionSciFi, 'row-scifi'));

    // Award-Winning Dramas
    this.mainContent.appendChild(createMovieRow('Award-Winning Dramas & Thrillers', dramas, 'row-drama'));
  }

  renderTVView(items) {
    const tvShows = items.filter(i => i.type === 'series');
    this.billboardContainer.style.display = 'block';
    renderBillboard(tvShows[0] || heroFeaturedItem);

    this.mainContent.innerHTML = '';
    this.mainContent.appendChild(createTop10Row('Top 10 TV Shows Today', tvShows, 'row-tv-top10'));
    this.mainContent.appendChild(createMovieRow('Trending TV Series', tvShows.filter(i => i.isTrending), 'row-tv-trending'));
    this.mainContent.appendChild(createMovieRow('Binge-Worthy Dramas', tvShows.filter(i => i.genres.includes('Drama')), 'row-tv-drama'));
    this.mainContent.appendChild(createMovieRow('Sci-Fi & Supernatural Shows', tvShows.filter(i => i.genres.includes('Sci-Fi')), 'row-tv-scifi'));
  }

  renderMoviesView(items) {
    const movies = items.filter(i => i.type === 'movie');
    this.billboardContainer.style.display = 'block';
    renderBillboard(movies[0] || heroFeaturedItem);

    this.mainContent.innerHTML = '';
    this.mainContent.appendChild(createTop10Row('Top 10 Movies Today', movies, 'row-movies-top10'));
    this.mainContent.appendChild(createMovieRow('Popular Movies', movies, 'row-movies-popular'));
    this.mainContent.appendChild(createMovieRow('Sci-Fi & Fantasy Blockbusters', movies.filter(i => i.genres.includes('Sci-Fi')), 'row-movies-scifi'));
    this.mainContent.appendChild(createMovieRow('Award-Winning Films', movies.filter(i => i.genres.includes('Drama') || i.genres.includes('Crime')), 'row-movies-acclaimed'));
  }

  renderLatestView(items) {
    this.billboardContainer.style.display = 'block';
    renderBillboard(items[1] || heroFeaturedItem);

    this.mainContent.innerHTML = '';
    this.mainContent.appendChild(createTop10Row('Top 10 Today', items, 'row-latest-top10'));
    this.mainContent.appendChild(createMovieRow('New on Netflix', items.filter(i => i.releaseYear >= 2023), 'row-latest-new'));
    this.mainContent.appendChild(createMovieRow('Worth the Wait', items.filter(i => i.matchScore >= 97), 'row-latest-worth'));
  }

  renderMyListView(items) {
    this.billboardContainer.style.display = 'none'; // Hide billboard on dedicated My List view
    renderMyListGrid(this.mainContent, items);
  }

  renderSearchResults(query) {
    this.billboardContainer.style.display = 'none';
    const lowerQuery = query.toLowerCase();

    const matches = catalog.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) ||
      m.genres.some(g => g.toLowerCase().includes(lowerQuery)) ||
      m.cast.some(c => c.toLowerCase().includes(lowerQuery)) ||
      (m.creator && m.creator.toLowerCase().includes(lowerQuery))
    );

    this.mainContent.innerHTML = `
      <section class="movie-row-section" style="margin-top: 100px;">
        <div class="movie-row-header" style="margin-bottom: 24px;">
          <h1 style="font-size: 1.4rem; font-weight: 600; color: var(--text-secondary);">
            Explore titles related to: <span style="color: #fff; font-weight: 700;">"${query}"</span>
          </h1>
        </div>
        <div id="search-grid-container"></div>
      </section>
    `;

    const searchContainer = document.getElementById('search-grid-container');

    if (matches.length === 0) {
      searchContainer.innerHTML = `
        <div style="padding: 60px 0; color: var(--text-muted); line-height: 1.8;">
          <p style="font-size: 1.1rem; color: #dedede;">Your search for "${query}" did not have any matches.</p>
          <p style="margin-top: 14px;">Suggestions:</p>
          <ul style="margin-left: 20px;">
            <li>Try different keywords (e.g. "Sci-Fi", "Action", "Stranger Things", "Inception")</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show, actor or director name</li>
          </ul>
        </div>
      `;
    } else {
      const searchRow = createMovieRow('', matches, 'search-results-row');
      searchContainer.appendChild(searchRow);
    }
  }

  updateMyListRow() {
    const existingMyListRow = document.getElementById('row-mylist');
    const myListItems = catalog.filter(i => store.isInMyList(i.id));

    if (myListItems.length === 0) {
      if (existingMyListRow) existingMyListRow.remove();
    } else {
      const newRow = createMovieRow('My List', myListItems, 'row-mylist');
      if (existingMyListRow) {
        existingMyListRow.replaceWith(newRow);
      } else {
        const top10Row = document.getElementById('row-top10');
        if (top10Row && top10Row.nextSibling) {
          this.mainContent.insertBefore(newRow, top10Row.nextSibling);
        } else {
          this.mainContent.appendChild(newRow);
        }
      }
    }
  }
}

// Boot application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
