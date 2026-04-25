const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const scrollLinks = Array.from(document.querySelectorAll('a[href^="#"]:not(.project-card)'));
const projectCards = Array.from(document.querySelectorAll('.project-card[data-project]'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let manualActiveUntil = 0;
let lastFocusedElement = null;
let updateRevealScenes = () => {};

const projectData = [
  {
    id: 'ouur',
    title: 'Ouur Coffee',
    category: 'Branding & Packaging',
    year: '2024',
    role: 'Identity system / packaging rhythm',
    image: './assets/editorial/work-1.png',
    alt: 'Ouur Coffee branding and packaging grayscale project preview',
    description: 'A packaging system for a slower lifestyle ritual — built around warm material cues, quiet typography, and a restrained archive-like visual language.'
  },
  {
    id: 'lightfall',
    title: 'Lightfall',
    category: 'Visual Identity',
    year: '2023',
    role: 'Art direction / identity logic',
    image: './assets/editorial/work-2.png',
    alt: 'Lightfall visual identity grayscale project preview',
    description: 'A visual identity built around contrast, glow, and restraint — a system that turns light, darkness, and negative space into a brand rhythm.'
  },
  {
    id: 'chaos',
    title: 'Wonder in Chaos',
    category: 'Gallery Website',
    year: '2023',
    role: 'Web design / editorial interface',
    image: './assets/editorial/work-3.png',
    alt: 'Wonder in Chaos gallery website grayscale project preview',
    description: 'An online gallery rhythm shaped for visual disorder — designed as a controlled sequence of visual tension, breathing space, and discovery.'
  }
];

const drawer = document.querySelector('.project-drawer');
const drawerPanel = document.querySelector('.drawer-panel');
const drawerBackdrop = document.querySelector('.drawer-backdrop');
const drawerClose = document.querySelector('.drawer-close');
const drawerPrev = document.querySelector('.drawer-prev');
const drawerNext = document.querySelector('.drawer-next');
const drawerTitle = document.querySelector('#drawer-title');
const drawerKicker = document.querySelector('#drawer-kicker');
const drawerCategory = document.querySelector('#drawer-category');
const drawerYear = document.querySelector('#drawer-year');
const drawerRole = document.querySelector('#drawer-role');
const drawerImage = document.querySelector('#drawer-image');
const drawerDescription = document.querySelector('#drawer-description');
let activeProjectIndex = 0;

function getSectionTargets() {
  return navLinks
    .map((link, index) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) return null;
      return {
        id: section.id,
        section,
        index,
        top: section.getBoundingClientRect().top + window.scrollY
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.top - b.top) || (a.index - b.index));
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
}

function scrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target) return false;
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  return true;
}

function updateActiveLink() {
  if (Date.now() < manualActiveUntil) return;

  const targets = getSectionTargets();
  if (!targets.length) return;

  const scrollAnchor = window.scrollY + window.innerHeight * 0.16;
  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
  let current = targets[0];

  targets.forEach((target) => {
    if (target.top <= scrollAnchor) current = target;
  });

  if (pageBottom) current = targets[targets.length - 1];
  setActiveLink(current.id);
}

function initPageLoad() {
  document.body.classList.add('motion-ready');
  requestAnimationFrame(() => {
    document.body.classList.add('is-loaded');
  });
}

function initScrollLinks() {
  scrollLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    link.addEventListener('click', (event) => {
      if (!document.querySelector(href)) return;
      event.preventDefault();
      scrollToHash(href);
      history.pushState(null, '', href);
      if (href !== '#top') {
        manualActiveUntil = Date.now() + 1600;
        setActiveLink(href.slice(1));
      }
    });
  });
}

function initReveals() {
  const scenes = Array.from(document.querySelectorAll('.reveal-scene'));

  updateRevealScenes = () => {
    scenes.forEach((scene) => {
      if (scene.classList.contains('is-visible')) return;
      const rect = scene.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        scene.classList.add('is-visible');
      }
    });
  };

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    scenes.forEach((scene) => scene.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: [0.04, 0.12, 0.22], rootMargin: '0px 0px -6% 0px' });

  scenes.forEach((scene) => observer.observe(scene));
  window.addEventListener('scroll', updateRevealScenes, { passive: true });
  window.addEventListener('resize', updateRevealScenes);
  const revealSafetyTimer = window.setInterval(() => {
    updateRevealScenes();
    if (scenes.every((scene) => scene.classList.contains('is-visible'))) {
      window.clearInterval(revealSafetyTimer);
    }
  }, 650);
  updateRevealScenes();
}

function openProject(index) {
  if (!drawer || !projectData[index]) return;
  const project = projectData[index];
  activeProjectIndex = index;
  lastFocusedElement = document.activeElement;

  drawerTitle.textContent = project.title;
  drawerKicker.textContent = 'Selected archive / project sheet';
  drawerCategory.textContent = project.category;
  drawerYear.textContent = project.year;
  drawerRole.textContent = project.role;
  drawerImage.src = project.image;
  drawerImage.alt = project.alt;
  drawerDescription.textContent = project.description;

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  requestAnimationFrame(() => drawerPanel?.focus());
}

function closeProject() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus({ preventScroll: true });
  }
}

function showRelativeProject(offset) {
  const next = (activeProjectIndex + offset + projectData.length) % projectData.length;
  openProject(next);
}

function initProjectDrawer() {
  projectCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      const index = projectData.findIndex((project) => project.id === card.dataset.project);
      openProject(Math.max(0, index));
    });
  });

  drawerBackdrop?.addEventListener('click', closeProject);
  drawerClose?.addEventListener('click', closeProject);
  drawerPrev?.addEventListener('click', () => showRelativeProject(-1));
  drawerNext?.addEventListener('click', () => showRelativeProject(1));
}

function initManifesto() {
  const card = document.querySelector('.manifesto-card');
  const toggle = document.querySelector('.manifesto-toggle');
  const extra = document.querySelector('#manifesto-extra');
  if (!card || !toggle || !extra) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    card.classList.toggle('is-expanded', !isExpanded);
    extra.hidden = isExpanded;
    toggle.querySelector('span').textContent = isExpanded ? '＋' : '−';
  });
}

function initTimeline() {
  const timeline = document.querySelector('.timeline');
  const items = Array.from(document.querySelectorAll('.timeline-item'));

  items.forEach((item) => {
    const button = item.querySelector('.timeline-toggle');
    const more = item.querySelector('.timeline-more');
    if (!button || !more) return;

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      item.classList.toggle('is-expanded', !expanded);
      more.hidden = expanded;
      button.textContent = expanded ? 'More detail' : 'Less detail';
    });
  });

  if (!timeline || prefersReducedMotion) {
    timeline?.style.setProperty('--timeline-progress', '100%');
    return;
  }

  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const start = window.innerHeight * 0.78;
    const end = window.innerHeight * 0.24;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (rect.height + start - end)));
    timeline.style.setProperty('--timeline-progress', `${Math.round(progress * 100)}%`);
  };

  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();
}

function initSkills() {
  const tooltip = document.querySelector('.skill-tooltip');
  const rows = Array.from(document.querySelectorAll('.skills-list li[data-skill-note]'));
  if (!tooltip || !rows.length) return;

  const show = (row, anchor) => {
    rows.forEach((item) => item.classList.toggle('is-active', item === row));
    tooltip.textContent = row.dataset.skillNote;
    tooltip.hidden = false;
    const rect = (anchor || row).getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 12}px`;
  };

  const hide = ({ force = false } = {}) => {
    const pinned = rows.some((item) => item.classList.contains('is-pinned'));
    if (pinned && !force) return;
    rows.forEach((item) => item.classList.remove('is-active', 'is-pinned'));
    tooltip.hidden = true;
  };

  rows.forEach((row) => {
    const trigger = row.querySelector('.skill-note-trigger');
    row.addEventListener('mouseenter', () => show(row, trigger || row));
    row.addEventListener('mouseleave', () => hide());
    row.addEventListener('focusin', () => show(row, trigger || row));
    row.addEventListener('focusout', (event) => {
      if (!row.contains(event.relatedTarget)) hide();
    });
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const shouldClose = row.classList.contains('is-pinned') && !tooltip.hidden;
      rows.forEach((item) => item.classList.remove('is-pinned'));
      if (shouldClose) {
        hide({ force: true });
        return;
      }
      row.classList.add('is-pinned');
      show(row, trigger);
    });
  });
}

function initPortraitInteraction() {
  const visual = document.querySelector('.hero-visual');
  const portrait = document.querySelector('.portrait-card');
  if (!visual || !portrait) return;

  portrait.addEventListener('click', () => {
    const isOpen = visual.classList.toggle('portrait-open');
    portrait.setAttribute('aria-expanded', String(isOpen));
  });

  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  portrait.addEventListener('mousemove', (event) => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 1.4).toFixed(2);
    const rotateY = (x * 1.4).toFixed(2);
    portrait.style.transform = `translate3d(0, 0, 104px) rotate(0.75deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  portrait.addEventListener('mouseleave', () => {
    portrait.style.transform = '';
  });
}

function initParallax() {
  if (prefersReducedMotion) return;
  const title = document.querySelector('.hero-title');
  const note = document.querySelector('.handwritten-note');
  const doodle = document.querySelector('.ink-doodle');
  const stamp = document.querySelector('.surface-stamp');
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const heroLimit = Math.min(1, y / Math.max(1, window.innerHeight));
    title?.style.setProperty('--ink-shift', `${heroLimit * 100}%`);
    if (note) note.style.translate = `0 ${heroLimit * -10}px`;
    if (doodle) doodle.style.translate = `0 ${heroLimit * 14}px`;
    if (stamp) stamp.style.translate = `0 ${heroLimit * 10}px`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveLink();
    updateRevealScenes();
    ticking = false;
  });
}, { passive: true });

window.addEventListener('resize', () => {
  updateActiveLink();
  updateRevealScenes();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
    closeProject();
  }
});

window.addEventListener('load', () => {
  if (location.hash && document.querySelector(location.hash)) {
    setTimeout(() => scrollToHash(location.hash), 40);
  }
  updateActiveLink();
  updateRevealScenes();
});

initPageLoad();
initScrollLinks();
initReveals();
initProjectDrawer();
initManifesto();
initTimeline();
initSkills();
initPortraitInteraction();
initParallax();
updateActiveLink();
