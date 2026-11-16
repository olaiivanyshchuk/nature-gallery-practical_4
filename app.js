const themeBtn = document.querySelector('#theme-toggle');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeBtn.textContent = isDark ? 'Світла тема' : 'Темна тема';
}

applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);

themeBtn.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

const likeButtons = document.querySelectorAll('.like-btn');
const likesTotal = document.querySelector('#likes-total');

function updateLikesTotal() {
  const sum = [...document.querySelectorAll('.like-count')]
    .reduce((acc, el) => acc + Number(el.textContent), 0);
  likesTotal.textContent = sum;
}

likeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const counter = btn.querySelector('.like-count');
    const liked = btn.classList.toggle('liked');
    btn.setAttribute('aria-pressed', liked);
    counter.textContent = Number(counter.textContent) + (liked ? 1 : -1);
    updateLikesTotal();
  });
});

const form = document.querySelector('#feedback-form');
const fields = {
  name: {
    input: document.querySelector('#fb-name'),
    error: document.querySelector('#fb-name-error'),
    check: (v) => {
  if (v.length < 2) return 'Ім’я має містити щонайменше 2 символи.';
  if (!/^\p{L}[\p{L}\s'’-]*$/u.test(v)) return 'Ім’я може містити лише літери, пробіл, дефіс або апостроф.';
  return '';
}
  },
  email: {
    input: document.querySelector('#fb-email'),
    error: document.querySelector('#fb-email-error'),
    check: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Введіть коректну адресу, наприклад name@mail.com.')
  },
  message: {
    input: document.querySelector('#fb-message'),
    error: document.querySelector('#fb-message-error'),
    check: (v) => (v.length < 10 ? 'Повідомлення має містити щонайменше 10 символів.' : '')
  }
};
const fbCount = document.querySelector('#fb-count');

function validateField(field) {
  const message = field.check(field.input.value.trim());
  field.error.textContent = message;
  field.input.classList.toggle('invalid', message !== '');
  field.input.classList.toggle('valid', message === '');
  return message === '';
}

Object.values(fields).forEach((field) => {
  field.input.addEventListener('blur', () => validateField(field));
  field.input.addEventListener('input', () => {
    if (field.input.classList.contains('invalid')) validateField(field);
  });
});

fields.message.input.addEventListener('input', () => {
  fbCount.textContent = `${fields.message.input.value.length} / ${fields.message.input.maxLength}`;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const results = Object.values(fields).map(validateField);
  if (results.includes(false)) {
    const firstBad = Object.values(fields).find((f) => f.input.classList.contains('invalid'));
    firstBad.input.focus();
    return;
  }

  const name = fields.name.input.value.trim();
  form.reset();
  Object.values(fields).forEach((f) => f.input.classList.remove('valid', 'invalid'));
  fbCount.textContent = '0 / 300';
  openModal(`${name}, ваше повідомлення надіслано. Ми відповімо на пошту найближчим часом.`);
});

const modal = document.querySelector('#modal');
const modalText = document.querySelector('#modal-text');
const modalClose = document.querySelector('#modal-close');

function openModal(text) {
  modalText.textContent = text;
  modal.classList.add('open');
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

const toTop = document.querySelector('#to-top');

window.addEventListener('scroll', () => {
  toTop.classList.toggle('visible', window.scrollY > 400);
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
