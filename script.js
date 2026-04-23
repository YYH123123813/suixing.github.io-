const sections = document.querySelectorAll('.reveal-section');
const navLinks = document.querySelectorAll('.topnav a');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  if (prefersReducedMotion) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initNavSpy() {
  const targets = Array.from(document.querySelectorAll('main [id], footer[id]'));
  if (!targets.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      setActive(visible.target.id);
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: '-18% 0px -55% 0px'
    }
  );

  targets.forEach((target) => observer.observe(target));
}

initReveal();
initNavSpy();
