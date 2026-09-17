// Netflix Navbar Component
import { store } from '../store.js';
import { profiles, catalog } from '../data.js';
import { handleImageError } from '../utils/imageFallback.js';

export function renderNavbar() {
  const header = document.getElementById('navbar-header');
  if (!header) return;

  const currentProfile = store.activeProfile;
  const recentItems = catalog.slice(0, 3);
  const isLoggedIn = store.isLoggedIn;

  header.innerHTML = `
    <nav class="navbar" id="main-nav">
      <div class="nav-left">
        <a href="#" class="netflix-brand" data-filter="all" title="Netflix Home">
          <svg class="netflix-logo-svg" viewBox="0 0 111 30">
            <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.042-13.75-5.813-14.125h5.031l3.156 8.125 3.188-8.125h4.906l-5.344 14.307zM90.468 0v27.094c-1.625-.094-3.219-.188-4.813-.25V0h4.813zm-8.875 0v26.5c-1.625-.125-3.219-.219-4.813-.313V0h4.813zm-11.281 0v4.25h-5.25v21.562c-1.625-.187-3.219-.344-4.813-.5V4.25h-5.25V0h15.313zm-19.875 0v24.625c-1.594-.219-3.219-.438-4.813-.625V0h4.813zm-8.344 0v4.25H36.75v7.219h4.75v4.25h-4.75v9.125c-1.625-.281-3.219-.531-4.813-.75V0h10.438zm-15.031 0v4.25H16.5v7.219h5.156v4.25H16.5v9.5c-1.625-.344-3.219-.656-4.813-.938V0h15.375zM0 0h4.813l6.531 16.563V0h4.813v27.531c-1.656-.375-3.313-.719-4.969-1.031L4.813 9.906V26.25C3.219 25.969 1.625 25.688 0 25.375V0z"/>
          </svg>
        </a>
        <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation">
          <svg class="svg-icon-lg" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
        <ul class="nav-links" id="nav-links-list">
          <li class="nav-item ${store.activeFilter === 'all' ? 'active' : ''}"><a data-filter="all">Home</a></li>
          <li class="nav-item ${store.activeFilter === 'tv' ? 'active' : ''}"><a data-filter="tv">TV Shows</a></li>
          <li class="nav-item ${store.activeFilter === 'movies' ? 'active' : ''}"><a data-filter="movies">Movies</a></li>
          <li class="nav-item ${store.activeFilter === 'latest' ? 'active' : ''}"><a data-filter="latest">New & Popular</a></li>
          <li class="nav-item ${store.activeFilter === 'mylist' ? 'active' : ''}"><a data-filter="mylist">My List</a></li>
        </ul>
      </div>

      <div class="nav-right">
        ${isLoggedIn ? `
          <!-- Live Search Box -->
          <div class="search-box" id="search-box">
            <button class="search-toggle-btn" id="search-toggle" aria-label="Open search">
              <svg class="svg-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <div class="search-input-wrapper">
              <span class="search-icon-inside">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              </span>
              <input type="text" class="search-input" id="search-input" placeholder="Titles, people, genres" autocomplete="off" />
              <button class="search-clear-btn" id="search-clear" aria-label="Clear search">
                <svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
          </div>

          <!-- Kids Portal Link -->
          <span class="nav-kids-link" id="kids-toggle-btn">Children</span>

          <!-- Notifications Dropdown -->
          <div class="notification-menu-container" id="notif-container">
            <button class="notification-bell-btn" id="notif-btn" aria-label="Notifications">
              <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
              <span class="notification-badge">3</span>
            </button>
            <div class="notification-dropdown">
              ${recentItems.map(item => `
                <div class="notification-item" data-id="${item.id}">
                  <img src="${item.poster}" alt="${item.title}" loading="lazy" />
                  <div class="notification-info">
                    <h4>New Arrival</h4>
                    <p>${item.title}</p>
                    <span class="notification-time">Just now</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- User Profile Dropdown -->
          <div class="profile-menu-container" id="profile-container">
            <div class="profile-avatar-trigger" id="profile-trigger">
              <img src="${currentProfile.avatar}" alt="${currentProfile.name}" class="profile-avatar-img" />
              <svg class="svg-icon profile-caret" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
            <div class="profile-dropdown">
              ${profiles.map(p => `
                <div class="profile-item profile-switch-btn ${p.id === currentProfile.id ? 'active' : ''}" data-profile-id="${p.id}">
                  <img src="${p.avatar}" alt="${p.name}" />
                  <span>${p.name}</span>
                </div>
              `).join('')}
              <div class="profile-divider"></div>
              <a class="profile-link" id="goto-login-btn">Sign In as Another User</a>
              <a class="profile-link" id="account-settings-btn">Account</a>
              <a class="profile-link" id="help-center-btn">Help Center</a>
              <div class="profile-divider"></div>
              <a class="profile-link" id="signout-btn" style="color: #e50914; font-weight: 600;">Sign Out of Netflix</a>
            </div>
          </div>
        ` : `
          <button class="btn-login-nav" id="nav-signin-btn" style="background-color: var(--netflix-red); color: #fff; padding: 7px 18px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; cursor: pointer; border: none; transition: transform 0.2s;">
            Sign In
          </button>
        `}
      </div>
    </nav>
  `;

  bindNavbarEvents();
}

function bindNavbarEvents() {
  const nav = document.getElementById('main-nav');
  const searchBox = document.getElementById('search-box');
  const searchToggle = document.getElementById('search-toggle');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksList = document.getElementById('nav-links-list');
  const signinBtn = document.getElementById('nav-signin-btn');
  const signoutBtn = document.getElementById('signout-btn');
  const gotoLoginBtn = document.getElementById('goto-login-btn');

  // Attach image fallback to all images in navbar
  document.querySelectorAll('#navbar-header img').forEach(img => {
    img.addEventListener('error', () => {
      handleImageError(img, img.alt || 'Avatar');
    });
  });

  // Scroll detection
  const handleScroll = () => {
    if (!nav) return;
    if (window.scrollY > 25) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Search box expand & search logic
  if (searchToggle && searchBox && searchInput) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      searchBox.classList.add('open');
      searchInput.focus();
    });

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.trim()) {
        searchBox.classList.add('has-query');
      } else {
        searchBox.classList.remove('has-query');
      }
      store.setSearchQuery(val.trim());
    });

    searchClear.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.value = '';
      searchBox.classList.remove('has-query');
      store.setSearchQuery('');
      searchInput.focus();
    });

    // Close search when clicked outside and empty
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target)) {
        if (!searchInput.value.trim()) {
          searchBox.classList.remove('open');
        }
      }
    });
  }

  // Navigation Filter click
  document.querySelectorAll('.nav-links a, .netflix-brand').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = link.getAttribute('data-filter');
      if (filter) {
        store.setFilter(filter);
        if (searchInput) {
          searchInput.value = '';
          searchBox.classList.remove('open', 'has-query');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('mobile-open');
    });
  }

  // Profile Switchers
  document.querySelectorAll('.profile-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-profile-id');
      store.setActiveProfile(pid);
      renderNavbar();
    });
  });

  // Kids toggle link
  const kidsBtn = document.getElementById('kids-toggle-btn');
  if (kidsBtn) {
    kidsBtn.addEventListener('click', () => {
      store.setActiveProfile('profile-2'); // Switch to Kids profile
      renderNavbar();
    });
  }

  // Sign in / Sign out buttons
  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      store.setFilter('login');
    });
  }

  if (gotoLoginBtn) {
    gotoLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      store.setFilter('login');
    });
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      store.logout();
    });
  }

  // Notification item click opens modal
  document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const movie = catalog.find(m => m.id === id);
      if (movie) {
        store.openModal(movie);
      }
    });
  });

  // Mock account / help links
  ['account-settings-btn', 'help-center-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        store.showToast(`${el.textContent} feature clicked`);
      });
    }
  });
}
