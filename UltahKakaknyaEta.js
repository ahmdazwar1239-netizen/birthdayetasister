// ============= floating petals background =============
(function initPetals() {
  const container = document.getElementById('petals');
  const symbols = ['🌸', '🌷', '❀', '✿'];
  const count = window.innerWidth < 480 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = 12 + Math.random() * 14 + 'px';
    p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    p.style.animationDuration = 10 + Math.random() * 10 + 's';
    p.style.animationDelay = Math.random() * 12 + 's';
    container.appendChild(p);
  }
})();

// ============= envelope open interaction =============
const envelope = document.getElementById('envelope');
const envelopeScene = document.getElementById('envelopeScene');
const letterScene = document.getElementById('letterScene');

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');

  setTimeout(() => {
    envelopeScene.classList.add('hidden');
    letterScene.classList.add('visible');
  }, 750);
});

// ============= carousel / swipeable letter =============
const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pages = document.querySelectorAll('.page');
const total = pages.length;

let current = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let widthPerPage = 0;

// build dots
for (let i = 0; i < total; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
}
const dots = dotsWrap.querySelectorAll('.dot');

function updateTrack(animate = true) {
  track.style.transition = animate ? '' : 'none';
  track.style.transform = `translateX(-${current * (100 / total)}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total - 1;
}

function goTo(index) {
  current = Math.max(0, Math.min(total - 1, index));
  updateTrack();
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// drag / swipe support
function getX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

function dragStart(e) {
  isDragging = true;
  startX = getX(e);
  widthPerPage = track.parentElement.getBoundingClientRect().width;
  track.classList.add('dragging');
}

function dragMove(e) {
  if (!isDragging) return;
  currentX = getX(e) - startX;
  const basePercent = -(current * (100 / total));
  const dragPercent = (currentX / widthPerPage) * (100 / total);
  track.style.transform = `translateX(${basePercent + dragPercent}%)`;
}

function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  track.classList.remove('dragging');

  const threshold = widthPerPage * 0.15;
  if (currentX > threshold && current > 0) {
    current -= 1;
  } else if (currentX < -threshold && current < total - 1) {
    current += 1;
  }
  currentX = 0;
  updateTrack();
}

track.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);

track.addEventListener('touchstart', dragStart, { passive: true });
track.addEventListener('touchmove', dragMove, { passive: true });
track.addEventListener('touchend', dragEnd);

// keyboard support
window.addEventListener('keydown', (e) => {
  if (!letterScene.classList.contains('visible')) return;
  if (e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowLeft') goTo(current - 1);
});

updateTrack(false);