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
    id: 'ai-course',
    title: 'AI 系统知识及应用课程',
    category: '课程产品 / AI 教育 / SOP 搭建',
    year: '2024.09—2024.10',
    role: '课程创始人 / 主理人 / 主讲人',
    image: './assets/covers/gemini-navigator-sidebar.png',
    alt: 'AI 系统知识及应用课程项目预览',
    description: '从 0 组建团队打磨 AI 系统课程，建立课程 SOP、分销机制与答疑流程，负责 AI 知识讲解和课程交付。'
  },
  {
    id: 'songguoren-media',
    title: '松果仁研习社新媒体项目',
    category: '新媒体运营 / 公众号 / 团队培养',
    year: '2024.09—2024.10',
    role: '新媒体项目部负责人',
    image: './assets/covers/wechat-article-exporter-desktop.png',
    alt: '松果仁研习社新媒体项目预览',
    description: '负责公司公众号运营、新人面试与培养，带领团队快速理解公众号基础技能、内容流程与项目协作方式。'
  },
  {
    id: 'shuchenglin-ip',
    title: '树成林 IP 觉醒课程实践',
    category: '社群运营 / 知识星球 / 内容整理',
    year: '2024.07—2024.09',
    role: '线上群维护 / 运营执行',
    image: './assets/covers/movie-stamps-cinepost.png',
    alt: '树成林 IP 觉醒课程实践项目预览',
    description: '参与杭州树成林教育科技集团 IP 觉醒课程实践，负责线上群聊维护、内容整理，并接触知识星球运营管理。'
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding 软件作品集',
    category: 'AI Coding / 全栈开发 / 软件原型',
    year: '2025—至今',
    role: '个体开发者 / 产品原型实现',
    image: './assets/covers/mac-dynamic-island.png',
    alt: 'Vibe Coding 软件作品集项目预览',
    description: '一年内用 AI 辅助开发 10+ 款软件与原型，包含 Mac 灵动岛、公众号工具、自主下单网站、记账软件、小程序与网页产品。'
  },
  {
    id: 'video-account-viral',
    title: '微信视频号爆款内容',
    category: '短视频内容 / AI 视频 / 流量增长',
    year: '2025—至今',
    role: '选题 / 生成 / 发布 / 复盘',
    image: './assets/covers/ios-long-screenshot.png',
    alt: '微信视频号爆款内容项目预览',
    description: '围绕 AI 视频与平台选题做内容实验，微信视频号爆款视频累计约 300w 播放，形成选题、生成、发布、复盘的实战经验。'
  },
  {
    id: 'xianyu-growth',
    title: '闲鱼引流变现项目',
    category: '需求捕捉 / 引流转化 / 商业验证',
    year: '2024—2025',
    role: '个人项目 / 获客与成交',
    image: './assets/covers/shadownote.png',
    alt: '闲鱼引流变现项目预览',
    description: '通过闲鱼捕捉真实需求并做引流转化，曾实现 24 小时收入 4k，用低成本验证需求、话术、成交链路与交付效率。'
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
