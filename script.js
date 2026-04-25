const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const scrollLinks = Array.from(document.querySelectorAll('a[href^="#"]:not(.project-card)'));
const projectCards = Array.from(document.querySelectorAll('.project-card[data-project]'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
const useLightweightMobile = isCoarsePointer || isMobileViewport;
let manualActiveUntil = 0;
let lastFocusedElement = null;
let updateRevealScenes = () => {};

const projectData = [
  {
    id: 'mac-dynamic-island',
    title: 'Mac 灵动岛',
    category: 'macOS 工具 / Vibe Coding',
    year: '2025',
    role: 'macOS 交互原型',
    image: './assets/covers/mac-dynamic-island.png',
    alt: 'Mac 灵动岛项目预览',
    repo: 'https://github.com/YYH123123813/mac-dynamic-island',
    description: '桌面端灵动岛交互实验，把通知、快捷操作和状态信息做成更轻的 macOS 浮层体验。'
  },
  {
    id: 'shadownote',
    title: 'ShadowNote 记账软件',
    category: 'iOS App / 个人效率 / Vibe Coding',
    year: '2025',
    role: 'iOS 应用原型',
    image: './assets/covers/shadownote.png',
    alt: 'ShadowNote 记账软件预览',
    repo: 'https://github.com/YYH123123813/shadownote',
    description: '围绕预算、账单、交易记录、提醒与 OCR 记账做的个人管理类 App 原型。'
  },
  {
    id: 'wechat-article-exporter-desktop',
    title: '公众号导出桌面工具',
    category: '桌面工具 / 内容自动化 / Vibe Coding',
    year: '2025',
    role: 'Electron 工具原型',
    image: './assets/covers/wechat-article-exporter-desktop.png',
    alt: '公众号导出桌面工具预览',
    repo: 'https://github.com/YYH123123813/wechat-article-exporter-desktop',
    description: '用于公众号文章、图片和媒体内容批量导出的桌面工具，减少重复整理成本。'
  },
  {
    id: 'ios-long-screenshot',
    title: 'iOS 长截屏工具',
    category: 'iOS Utility / Screenshot / Vibe Coding',
    year: '2025',
    role: 'iOS 工具原型',
    image: './assets/covers/ios-long-screenshot.png',
    alt: 'iOS 长截屏工具预览',
    repo: 'https://github.com/YYH123123813/ios-long-screenshot',
    description: '面向移动端长图拼接、页面整理和截图导出的 iOS 工具尝试。'
  },
  {
    id: 'gemini-navigator-sidebar',
    title: 'Gemini Navigator Sidebar',
    category: 'Browser Extension / AI Workflow',
    year: '2025',
    role: '浏览器扩展原型',
    image: './assets/covers/gemini-navigator-sidebar.png',
    alt: 'Gemini Navigator Sidebar 项目预览',
    repo: 'https://github.com/YYH123123813/gemini-navigator-sidebar',
    description: '围绕 Gemini 使用场景做的侧边栏扩展，把导航、上下文和操作入口集中到浏览器侧栏。'
  },
  {
    id: 'movie-stamps-cinepost',
    title: '电影邮票 CinePost',
    category: 'iOS App / Visual Product / Vibe Coding',
    year: '2025',
    role: '视觉产品原型',
    image: './assets/covers/movie-stamps-cinepost.png',
    alt: '电影邮票 CinePost 项目预览',
    repo: 'https://github.com/YYH123123813/movie-stamps-cinepost',
    description: '把电影画面、邮票式视觉和收藏卡片结合，探索影像内容的移动端视觉呈现。'
  },
  {
    id: 'antigravity-auto-approve',
    title: 'Antigravity Auto Approve',
    category: 'VS Code Extension / Automation',
    year: '2025',
    role: '开发自动化插件',
    image: './assets/covers/antigravity-auto-approve.png',
    alt: 'Antigravity Auto Approve 项目预览',
    repo: 'https://github.com/YYH123123813/antigravity-auto-approve',
    description: '面向 Antigravity/Coding Agent 工作流的自动确认插件，减少重复点击和上下文切换。'
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
  if (useLightweightMobile) return;
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

  if (useLightweightMobile) {
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      scenes.forEach((scene) => scene.classList.add('is-visible'));
      return;
    }

    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        mobileObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    scenes.forEach((scene) => mobileObserver.observe(scene));
    return;
  }

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
  drawerKicker.textContent = '精选项目 / Project sheet';
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

  if (!timeline || prefersReducedMotion || useLightweightMobile) {
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

  if (prefersReducedMotion || useLightweightMobile || !window.matchMedia('(hover: hover)').matches) return;

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
  if (prefersReducedMotion || useLightweightMobile) return;
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
if (!useLightweightMobile) {
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveLink();
      updateRevealScenes();
      ticking = false;
    });
  }, { passive: true });
}

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
