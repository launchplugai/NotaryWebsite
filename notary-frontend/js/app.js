/**
 * Main Application — Navigation, Toast, and Shared Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  updateAuthLinks();
});

// === Navigation scroll effect ===
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// === Mobile menu toggle ===
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

// === Update nav based on auth state ===
function updateAuthLinks() {
  const authLink = document.querySelector('[data-auth-link]');
  if (!authLink) return;

  if (isAuthenticated()) {
    const user = getCurrentUser();
    authLink.textContent = user ? user.name.split(' ')[0] : 'Account';
    authLink.href = 'dashboard.html';
  } else {
    authLink.textContent = 'Sign In';
    authLink.href = 'login.html';
  }
}

// === Toast notifications ===
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// === Loading state for buttons ===
function setLoading(btn, loading = true) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.originalText || 'Submit';
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// === Form validation ===
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s\-\(\)\+]{7,}$/.test(phone);
}
