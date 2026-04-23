const ARTBOARD_WIDTH = 1086;
const ARTBOARD_HEIGHT = 1448;

const wrap = document.querySelector('.browser-scale-wrap');
const artboard = document.querySelector('.browser-scale');
const navLinks = Array.from(document.querySelectorAll('.topnav a'));
const sectionTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function fitArtboard() {
  if (!wrap || !artboard) return;

  const availableWidth = Math.max(320, Math.min(window.innerWidth - 32, ARTBOARD_WIDTH));
  const scale = Math.min(1, availableWidth / ARTBOARD_WIDTH);

  artboard.style.transform = `scale(${scale})`;
  wrap.style.height = `${ARTBOARD_HEIGHT * scale}px`;
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
}

function scrollToTarget(target) {
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: 'smooth' });
}

function updateActiveByViewport() {
  if (!sectionTargets.length) return;

  const viewportAnchor = window.innerHeight * 0.28;
  const ranked = sectionTargets
    .map((section) => ({
      id: section.id,
      distance: Math.abs(section.getBoundingClientRect().top - viewportAnchor)
    }))
    .sort((a, b) => a.distance - b.distance);

  if (ranked[0]) {
    setActiveLink(ranked[0].id);
  }
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    setActiveLink(target.id);
    scrollToTarget(target);
  });
});

window.addEventListener('resize', fitArtboard);
window.addEventListener('load', () => {
  fitArtboard();
  updateActiveByViewport();
});
window.addEventListener('scroll', updateActiveByViewport, { passive: true });

fitArtboard();
updateActiveByViewport();
