const projects = [
  {
    name: "随记 / ShadowNote",
    subtitle: "带预算、账单、交易、提醒与 OCR 能力的个人管理应用。",
    type: "iOS App",
    status: "公开仓库",
    description:
      "把记录、预算、交易、通知与 OCR 融成一套轻量但完成度较高的个人管理产品，更能体现移动端信息结构和持续迭代能力。",
    proof:
      "它更像完整消费级产品，适合快速判断我在信息结构、功能整合与产品完成度上的上限。",
    stack: ["SwiftUI", "Core Data", "UserNotifications", "Vision OCR"],
    repoName: "shadownote",
    image: "./assets/covers/shadownote.png",
    featured: true
  },
  {
    name: "公众号导出工具",
    subtitle: "批量导出文章、图片与媒体资源的桌面工具。",
    type: "Desktop Tool",
    status: "公开仓库",
    description:
      "围绕真实内容处理工作流构建的 Electron 桌面应用，能够批量下载公众号文章、图片与媒体内容，强调可交付与可操作性。",
    proof:
      "它最能证明我不是只会做概念展示，而是能把明确需求做成稳定工具产品。",
    stack: ["Electron", "React", "TypeScript", "Puppeteer", "Ant Design"],
    repoName: "wechat-article-exporter-desktop",
    image: "./assets/covers/wechat-article-exporter-desktop.png",
    featured: true
  },
  {
    name: "Mac 灵动岛",
    subtitle: "把 Mac 顶部刘海重做为可交互的信息中心。",
    type: "macOS App",
    status: "公开仓库",
    description:
      "围绕 macOS 原生能力做动态交互层，覆盖音乐控制、电量状态、文件拖放、日历提醒与菜单栏联动，体现系统级整合能力。",
    proof:
      "它既有记忆点，也能体现我对系统交互和桌面产品感的理解深度。",
    stack: ["SwiftUI", "AppKit", "EventKit", "MediaRemote", "AppleScript"],
    repoName: "mac-dynamic-island",
    image: "./assets/covers/mac-dynamic-island.png",
    featured: true
  },
  {
    name: "iOS 长截屏",
    subtitle: "多张截图拼接与作品管理的一体化工具。",
    type: "iOS App",
    status: "公开仓库",
    description:
      "聚焦长图拼接体验，包含拖拽排序、拼接方向控制、实时预览与作品管理，更偏工具型产品完成度。",
    proof:
      "能够证明我在工具型移动应用里的流程设计与细节打磨能力。",
    stack: ["SwiftUI", "iOS 17", "Image Stitching"],
    repoName: "ios-long-screenshot",
    image: "./assets/covers/ios-long-screenshot.png"
  },
  {
    name: "Gemini Navigator",
    subtitle: "为长对话加入目录导航、搜索过滤与导出能力。",
    type: "Chrome Extension",
    status: "公开仓库",
    description:
      "通过侧边目录、搜索过滤、导出 Markdown、复制内容和阅读模式，改善长对话浏览与整理体验。",
    proof:
      "体现我对阅读秩序、信息结构和轻量扩展工具的理解。",
    stack: ["JavaScript", "Manifest V3", "Shadow DOM"],
    repoName: "gemini-navigator-sidebar",
    image: "./assets/covers/gemini-navigator-sidebar.png"
  },
  {
    name: "电影邮票 / CinePost",
    subtitle: "把电影记录做成更有归档感的收藏体验。",
    type: "iOS App",
    status: "公开仓库",
    description:
      "以邮票、信封、邮戳为视觉骨架，做观影收藏和归档体验，强调内容主题与产品表达的一致性。",
    proof:
      "它更偏审美与内容表达，能补足我在产品气质和界面叙事上的能力面。",
    stack: ["SwiftUI", "Component Design", "Localization"],
    repoName: "movie-stamps-cinepost",
    image: "./assets/covers/movie-stamps-cinepost.png"
  },
  {
    name: "反重力插件 Auto Approve",
    subtitle: "把工具批准流程从人工点击改成设置级自动化。",
    type: "IDE Extension",
    status: "公开仓库",
    description:
      "围绕 Antigravity 的工具批准能力做扩展封装，减少重复人工批准动作，让开发工作流更稳定。",
    proof:
      "它更偏开发者工具方向，说明我也能处理效率型和工作流型产品。",
    stack: ["JavaScript", "VS Code API", "Python", "VSIX"],
    repoName: "antigravity-auto-approve",
    image: "./assets/covers/antigravity-auto-approve.png"
  }
];

const featuredGrid = document.querySelector("#featured-grid");
const projectList = document.querySelector("#project-list");
const scrollProgress = document.querySelector("#scroll-progress");
const heroStage = document.querySelector("#hero-stage");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createRepoUrl(repoName) {
  return `https://github.com/YYH123123813/${repoName}`;
}

function renderFeatured() {
  if (!featuredGrid) return;

  const featuredProjects = projects.filter((project) => project.featured);
  const [leadProject, ...secondaryProjects] = featuredProjects;

  featuredGrid.innerHTML = `
    <div class="project-stage">
      <article class="project-lead panel motion-card spotlight reveal" data-tilt data-tilt-strength="10">
        <div class="project-media">
          <img src="${leadProject.image}" alt="${leadProject.name} 项目封面图" loading="lazy">
        </div>
        <div class="project-content">
          <div class="project-meta">
            <span class="label-chip">${leadProject.type}</span>
            <span class="project-status">${leadProject.status}</span>
          </div>
          <h3>${leadProject.name}</h3>
          <p class="project-subtitle">${leadProject.subtitle}</p>
          <p class="project-description">${leadProject.description}</p>
          <p class="project-proof">为什么它值得被放到首页：${leadProject.proof}</p>
          <div class="project-foot">
            <p class="stack-line">${leadProject.stack.join(" · ")}</p>
            <a class="text-link" href="${createRepoUrl(leadProject.repoName)}" target="_blank" rel="noreferrer">查看仓库 ↗</a>
          </div>
        </div>
      </article>

      <div class="project-side">
        ${secondaryProjects
          .map((project) => {
            return `
              <article class="project-card-small panel motion-card spotlight reveal">
                <div class="project-small-media">
                  <img src="${project.image}" alt="${project.name} 项目封面图" loading="lazy">
                </div>
                <div class="project-content">
                  <div class="project-meta">
                    <span class="label-chip">${project.type}</span>
                    <span class="project-status">${project.status}</span>
                  </div>
                  <h3>${project.name}</h3>
                  <p class="project-description">${project.proof}</p>
                  <div class="project-foot">
                    <p class="stack-line">${project.stack.join(" · ")}</p>
                    <a class="text-link" href="${createRepoUrl(project.repoName)}" target="_blank" rel="noreferrer">查看仓库 ↗</a>
                  </div>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderProjectList() {
  if (!projectList) return;

  const compactProjects = projects.filter((project) => !project.featured);

  projectList.innerHTML = compactProjects
    .map((project) => {
      return `
        <article class="project-row panel motion-card spotlight reveal">
          <div class="project-thumb">
            <img src="${project.image}" alt="${project.name} 项目封面图" loading="lazy">
          </div>
          <div class="project-row-copy">
            <div class="project-row-top">
              <h3>${project.name}</h3>
              <span class="project-row-meta">${project.type} · ${project.status}</span>
            </div>
            <div class="project-row-content">
              <p>${project.subtitle}</p>
              <p>${project.proof}</p>
            </div>
            <a class="project-row-link" href="${createRepoUrl(project.repoName)}" target="_blank" rel="noreferrer">打开仓库 ↗</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function initReveal() {
  const revealNodes = document.querySelectorAll(".reveal");

  if (!revealNodes.length) return;
  if (prefersReducedMotion) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initSpotlight() {
  document.querySelectorAll(".spotlight").forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--mx", `${x}%`);
      node.style.setProperty("--my", `${y}%`);
      node.style.setProperty("--spotlight-opacity", "1");
    });

    node.addEventListener("pointerleave", () => {
      node.style.setProperty("--spotlight-opacity", "0");
    });
  });
}

function initTilt() {
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-tilt]").forEach((node) => {
    const strength = Number(node.dataset.tiltStrength || 7);

    const reset = () => {
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
      node.style.setProperty("--scale", "1");
    };

    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * strength;
      const rotateX = (0.5 - y) * strength;

      node.style.setProperty("--rx", `${rotateX}deg`);
      node.style.setProperty("--ry", `${rotateY}deg`);
      node.style.setProperty("--scale", "1.01");
    });

    node.addEventListener("pointerleave", reset);
    reset();
  });
}

function initHeroStage() {
  if (!heroStage || prefersReducedMotion) return;

  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    heroStage.style.setProperty("--pointer-x", `${x}%`);
    heroStage.style.setProperty("--pointer-y", `${y}%`);
  });

  heroStage.addEventListener("pointerleave", () => {
    heroStage.style.setProperty("--pointer-x", "50%");
    heroStage.style.setProperty("--pointer-y", "40%");
  });
}

function initNavSpy() {
  const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (!navLinks.length || !sections.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;
      setActive(visibleEntry.target.id);
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.18, 0.4, 0.68]
    }
  );

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].id);
}

function updateScrollProgress() {
  if (!scrollProgress) return;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
}

function boot() {
  renderFeatured();
  renderProjectList();
  initReveal();
  initSpotlight();
  initTilt();
  initHeroStage();
  initNavSpy();
  updateScrollProgress();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
}

boot();
