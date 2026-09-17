// Netflix Sign In & Authentication Page Component
import { store } from '../store.js';
import { profiles } from '../data.js';

export function renderLoginPage(container) {
  container.innerHTML = `
    <div class="login-page-container" id="login-page">
      <!-- Background Collage with Dark Vignette -->
      <div class="login-bg-wrapper">
        <img class="login-bg-img" src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80" alt="Netflix Background" />
        <div class="login-bg-vignette"></div>
      </div>

      <!-- Header -->
      <header class="login-header">
        <a href="#" class="netflix-brand" id="login-logo-link" title="Netflix">
          <svg class="netflix-logo-svg" style="height: 36px;" viewBox="0 0 111 30">
            <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.042-13.75-5.813-14.125h5.031l3.156 8.125 3.188-8.125h4.906l-5.344 14.307zM90.468 0v27.094c-1.625-.094-3.219-.188-4.813-.25V0h4.813zm-8.875 0v26.5c-1.625-.125-3.219-.219-4.813-.313V0h4.813zm-11.281 0v4.25h-5.25v21.562c-1.625-.187-3.219-.344-4.813-.5V4.25h-5.25V0h15.313zm-19.875 0v24.625c-1.594-.219-3.219-.438-4.813-.625V0h4.813zm-8.344 0v4.25H36.75v7.219h4.75v4.25h-4.75v9.125c-1.625-.281-3.219-.531-4.813-.75V0h10.438zm-15.031 0v4.25H16.5v7.219h5.156v4.25H16.5v9.5c-1.625-.344-3.219-.656-4.813-.938V0h15.375zM0 0h4.813l6.531 16.563V0h4.813v27.531c-1.656-.375-3.313-.719-4.969-1.031L4.813 9.906V26.25C3.219 25.969 1.625 25.688 0 25.375V0z"/>
          </svg>
        </a>
        <button class="login-back-btn" id="login-browse-guest-btn">
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          <span>Browse Catalog</span>
        </button>
      </header>

      <!-- Center Login Card -->
      <div class="login-content-wrapper">
        <div class="login-card" id="login-card-box">
          <h1 class="login-title" id="form-heading">Sign In</h1>

          <form class="login-form" id="auth-form" onsubmit="return false;">
            <!-- Email / Phone Input -->
            <div class="login-input-group" id="email-group">
              <input type="text" class="login-input" id="login-email" placeholder=" " autocomplete="email" required />
              <label class="login-label" for="login-email">Email or mobile number</label>
              <span class="login-error-msg" id="email-error">Please enter a valid email or phone number.</span>
            </div>

            <!-- Password Input -->
            <div class="login-input-group" id="password-group">
              <input type="password" class="login-input" id="login-password" placeholder=" " autocomplete="current-password" required />
              <label class="login-label" for="login-password">Password</label>
              <span class="login-input-toggle-pw" id="toggle-pw-btn">SHOW</span>
              <span class="login-error-msg" id="password-error">Your password must contain between 4 and 60 characters.</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-login-submit" id="login-submit-btn">Sign In</button>

            <!-- OR Divider -->
            <div class="login-divider">
              <span>OR</span>
            </div>

            <!-- 1-Click Quick Demo Sign In -->
            <div class="quick-demo-section">
              <span class="quick-demo-title">1-Click Quick Demo Sign In</span>
              ${profiles.map(p => `
                <button type="button" class="btn-quick-login" data-profile-id="${p.id}" data-profile-name="${p.name}">
                  <img src="${p.avatar}" alt="${p.name}" />
                  <span>Sign in as <strong>${p.name}</strong> ${p.isKids ? '(Kids)' : ''}</span>
                </button>
              `).join('')}
            </div>

            <!-- Remember Me & Help -->
            <div class="login-options">
              <label class="login-remember-wrapper">
                <input type="checkbox" class="login-remember-checkbox" checked />
                <span>Remember me</span>
              </label>
              <a href="#" class="login-help-link" id="login-help-link">Need help?</a>
            </div>

            <!-- Switch to Sign Up -->
            <div class="login-switch-view">
              <span id="switch-text">New to Netflix?</span>
              <a class="login-switch-link" id="switch-mode-btn">Sign up now.</a>
            </div>

            <!-- ReCAPTCHA notice -->
            <div class="login-recaptcha-notice">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. 
              <a href="#" style="color: #0071eb;">Learn more.</a>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer Simple -->
      <footer class="netflix-footer" style="margin-top: 0; padding-bottom: 24px;">
        <div class="footer-links" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 12px;">
          <a href="#">FAQ</a>
          <a href="#">Help Center</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Corporate Information</a>
        </div>
        <div class="footer-copyright">&copy; 2026 Netflix, Inc.</div>
      </footer>
    </div>
  `;

  bindLoginEvents(container);
}

function bindLoginEvents(container) {
  const form = container.querySelector('#auth-form');
  const emailInput = container.querySelector('#login-email');
  const passwordInput = container.querySelector('#login-password');
  const emailGroup = container.querySelector('#email-group');
  const passwordGroup = container.querySelector('#password-group');
  const togglePwBtn = container.querySelector('#toggle-pw-btn');
  const formHeading = container.querySelector('#form-heading');
  const submitBtn = container.querySelector('#login-submit-btn');
  const switchModeBtn = container.querySelector('#switch-mode-btn');
  const switchText = container.querySelector('#switch-text');
  const browseGuestBtn = container.querySelector('#login-browse-guest-btn');
  const logoLink = container.querySelector('#login-logo-link');

  let isSignUpMode = false;

  // Toggle Password visibility
  togglePwBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePwBtn.textContent = 'HIDE';
    } else {
      passwordInput.type = 'password';
      togglePwBtn.textContent = 'SHOW';
    }
  });

  // Switch between Sign In and Sign Up modes
  switchModeBtn.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
      formHeading.textContent = 'Sign Up';
      submitBtn.textContent = 'Create Account';
      switchText.textContent = 'Already have an account?';
      switchModeBtn.textContent = 'Sign in now.';
    } else {
      formHeading.textContent = 'Sign In';
      submitBtn.textContent = 'Sign In';
      switchText.textContent = 'New to Netflix?';
      switchModeBtn.textContent = 'Sign up now.';
    }
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;

    if (!email || email.length < 3) {
      emailGroup.classList.add('has-error');
      valid = false;
    } else {
      emailGroup.classList.remove('has-error');
    }

    if (!password || password.length < 4) {
      passwordGroup.classList.add('has-error');
      valid = false;
    } else {
      passwordGroup.classList.remove('has-error');
    }

    if (valid) {
      const name = email.split('@')[0] || 'Member';
      store.login({
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1)
      });
    }
  });

  // Quick Demo Login buttons
  container.querySelectorAll('.btn-quick-login').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-profile-id');
      const pname = btn.getAttribute('data-profile-name');
      store.setActiveProfile(pid);
      store.login({
        email: `${pname.toLowerCase()}@netflix.demo`,
        name: pname
      });
    });
  });

  // Back to browse without full auth
  const handleBrowseGuest = (e) => {
    e.preventDefault();
    store.login({
      email: 'guest@netflix.demo',
      name: 'Guest'
    });
  };

  browseGuestBtn.addEventListener('click', handleBrowseGuest);
  logoLink.addEventListener('click', handleBrowseGuest);
}
