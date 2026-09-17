// Netflix Global State Store with LocalStorage persistence and Event Subscriptions
import { profiles, catalog } from './data.js';

class Store {
  constructor() {
    this.listeners = new Map();
    
    // Load persisted state or fallback
    const savedList = localStorage.getItem('netflix_my_list');
    this.myList = savedList ? new Set(JSON.parse(savedList)) : new Set(['stranger-things', 'cyberpunk-edgerunners', 'inception']);

    const savedLikes = localStorage.getItem('netflix_liked_list');
    this.likedList = savedLikes ? new Set(JSON.parse(savedLikes)) : new Set(['stranger-things', 'arcane']);

    const savedAuth = localStorage.getItem('netflix_is_logged_in');
    this.isLoggedIn = savedAuth !== null ? JSON.parse(savedAuth) : true;
    this.currentUser = { email: 'alex@netflix.demo', name: 'Alex' };

    this.activeProfile = profiles[0];
    this.activeFilter = 'all'; // 'all', 'tv', 'movies', 'latest', 'mylist', 'login'
    this.searchQuery = '';
    this.modalMovie = null;
    this.playerMovie = null;
    this.toastMessage = null;
  }

  // Event Subscription
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  // Authentication Actions
  login(user) {
    this.isLoggedIn = true;
    this.currentUser = user || { email: 'alex@netflix.demo', name: 'Alex' };
    localStorage.setItem('netflix_is_logged_in', 'true');
    this.activeFilter = 'all';
    this.emit('authChanged', { isLoggedIn: true, user: this.currentUser });
    this.showToast(`Welcome back, ${this.currentUser.name}!`);
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.setItem('netflix_is_logged_in', 'false');
    this.emit('authChanged', { isLoggedIn: false });
    this.showToast('Signed out of Netflix');
  }

  // Actions
  toggleMyList(movieId) {
    let added = false;
    if (this.myList.has(movieId)) {
      this.myList.delete(movieId);
      added = false;
    } else {
      this.myList.add(movieId);
      added = true;
    }
    localStorage.setItem('netflix_my_list', JSON.stringify([...this.myList]));
    this.emit('myListChanged', { movieId, added, list: [...this.myList] });
    
    const movie = catalog.find(m => m.id === movieId);
    const title = movie ? movie.title : 'Title';
    this.showToast(added ? `Added "${title}" to My List` : `Removed "${title}" from My List`);
    return added;
  }

  isInMyList(movieId) {
    return this.myList.has(movieId);
  }

  toggleLike(movieId) {
    let liked = false;
    if (this.likedList.has(movieId)) {
      this.likedList.delete(movieId);
      liked = false;
    } else {
      this.likedList.add(movieId);
      liked = true;
    }
    localStorage.setItem('netflix_liked_list', JSON.stringify([...this.likedList]));
    this.emit('likeChanged', { movieId, liked });

    const movie = catalog.find(m => m.id === movieId);
    const title = movie ? movie.title : 'Title';
    this.showToast(liked ? `Rated "${title}" with Thumbs Up` : `Removed rating for "${title}"`);
    return liked;
  }

  isLiked(movieId) {
    return this.likedList.has(movieId);
  }

  setActiveProfile(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      this.activeProfile = profile;
      this.emit('profileChanged', profile);
      this.showToast(`Switched profile to ${profile.name}`);
    }
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.searchQuery = ''; // Clear search when switching tabs
    this.emit('filterChanged', filter);
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.emit('searchChanged', query);
  }

  openModal(movie) {
    this.modalMovie = movie;
    this.emit('modalOpened', movie);
  }

  closeModal() {
    this.modalMovie = null;
    this.emit('modalClosed');
  }

  openPlayer(movie) {
    this.playerMovie = movie;
    this.emit('playerOpened', movie);
  }

  closePlayer() {
    this.playerMovie = null;
    this.emit('playerClosed');
  }

  showToast(message) {
    this.toastMessage = message;
    this.emit('toast', message);
  }
}

export const store = new Store();
