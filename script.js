document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.navbar-collapse');
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  document.querySelectorAll('.product-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.product-card');
      const isOpen = card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const authModal = document.querySelector('#authModal');
  const signInButton = document.querySelector('.sign-in-button');
  const accountMenu = document.querySelector('.account-menu');
  const accountTrigger = document.querySelector('.account-trigger');
  const accountName = document.querySelector('.account-name');
  const accountAvatar = document.querySelector('.account-avatar');
  const sessionKey = 'faithydesigns-session';

  const showAccount = (session) => {
    if (!session) {
      signInButton.hidden = false;
      accountMenu.hidden = true;
      return;
    }
    signInButton.hidden = true;
    accountMenu.hidden = false;
    accountName.textContent = session.name;
    accountAvatar.textContent = session.name.charAt(0).toUpperCase();
  };

  showAccount(JSON.parse(localStorage.getItem(sessionKey) || 'null'));

  document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const isLogin = tab.dataset.authTab === 'login';
      document.querySelectorAll('.auth-tab').forEach((item) => {
        item.classList.toggle('active', item === tab);
        item.setAttribute('aria-selected', String(item === tab));
      });
      document.querySelector('#loginForm').hidden = !isLogin;
      document.querySelector('#registerForm').hidden = isLogin;
    });
  });

  const completeAuth = (form, name, email) => {
    localStorage.setItem(sessionKey, JSON.stringify({ name, email }));
    showAccount({ name, email });
    form.querySelector('.auth-message').textContent = 'You are signed in. Welcome to faithydesigns.';
    window.setTimeout(() => bootstrap.Modal.getOrCreateInstance(authModal).hide(), 700);
  };

  document.querySelector('#loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    completeAuth(form, form.email.value.split('@')[0], form.email.value);
  });

  document.querySelector('#registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    completeAuth(form, form.name.value, form.email.value);
  });

  accountTrigger.addEventListener('click', () => {
    accountMenu.classList.toggle('is-open');
  });

  document.querySelector('.sign-out-button').addEventListener('click', () => {
    localStorage.removeItem(sessionKey);
    accountMenu.classList.remove('is-open');
    showAccount(null);
  });

  authModal.addEventListener('hidden.bs.modal', () => {
    document.querySelectorAll('.auth-form').forEach((form) => form.reset());
    document.querySelectorAll('.auth-message').forEach((message) => { message.textContent = ''; });
  });
});