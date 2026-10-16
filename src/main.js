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
const submitButton = form?.querySelector('[type="submit"]');

// https://formtomail.ru/cabinet
const FORM_API_KEY = import.meta.env.VITE_FORMTOMAIL_API_KEY;

function showToast(message, isError = false) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('toast-visible');
  toast.classList.toggle('toast-error', isError);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  if (!FORM_API_KEY || FORM_API_KEY === 'YOUR_API_KEY') {
    showToast('Отправка заявок пока не настроена.', true);
    return;
  }

  const formData = new FormData(form);
  const contact = formData.get('contact')?.toString().trim();
  const role = formData.get('role')?.toString();

  if (!contact || !role) {
    showToast('Заполните контакт и выберите вашу роль.', true);
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
  }

  try {
    const response = await fetch('https://api.formtomail.ru/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FORM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Новая заявка — Вкусно. Выгодно.',
        body: {
          'Контакт': contact,
          'Роль': role,
          'Источник': window.location.href,
          'Дата заявки': new Date().toLocaleString('ru-RU'),
        },
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.statusCode !== 200) {
      throw new Error('Не удалось отправить заявку.');
    }

    showToast(`Спасибо! Заявка подготовлена (${role}). Скоро свяжемся с вами.`);
    form.reset();
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    showToast(
      'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.',
      true,
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  }
});

const header = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  header?.classList.toggle('header-scrolled', currentScrollY > 16);
  lastScrollY = currentScrollY;
}, { passive: true });
