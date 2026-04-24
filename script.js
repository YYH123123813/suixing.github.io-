const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const scrollLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

function getSectionTargets() {
  return navLinks
    .map((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) return null;
      return {
        id: section.id,
        section,
        top: section.getBoundingClientRect().top + window.scrollY
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.top - b.top);
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
}

function scrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target) return false;

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function updateActiveLink() {
  const targets = getSectionTargets();
  if (!targets.length) return;

  const scrollAnchor = window.scrollY + window.innerHeight * 0.16;
  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
  let current = targets[0];

  targets.forEach((target) => {
    if (target.top <= scrollAnchor) {
      current = target;
    }
  });

  if (pageBottom) {
    current = targets[targets.length - 1];
  }

  setActiveLink(current.id);
}

scrollLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href === '#') return;

  link.addEventListener('click', (event) => {
    if (!document.querySelector(href)) return;
    event.preventDefault();
    scrollToHash(href);
    history.pushState(null, '', href);

    if (href !== '#top') {
      setActiveLink(href.slice(1));
    }
  });
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveLink();
    ticking = false;
  });
}, { passive: true });

window.addEventListener('resize', updateActiveLink);
window.addEventListener('load', () => {
  if (location.hash && document.querySelector(location.hash)) {
    setTimeout(() => scrollToHash(location.hash), 40);
  }
  updateActiveLink();
});

updateActiveLink();
