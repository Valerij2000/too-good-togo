import './style.css';

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('nav-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('nav-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.faq details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq details').forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

const form = document.querySelector('#join-form');
const toast = document.querySelector('.toast');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const contact = new FormData(form).get('contact')?.toString().trim();
  const role = new FormData(form).get('role')?.toString();

  // Demo only: replace with your API, CRM, email, or messaging integration.
  toast.textContent = `Спасибо! Заявка подготовлена (${role}). Перед запуском подключите отправку контакта: ${contact}.`;
  toast.classList.add('toast-visible');
  window.setTimeout(() => toast.classList.remove('toast-visible'), 6000);
  form.reset();
});

const header = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  header?.classList.toggle('header-scrolled', currentScrollY > 16);
  lastScrollY = currentScrollY;
}, { passive: true });
