const projects = [
  {
    name: "Mac 灵动岛",
    subtitle: "把 Mac 顶部刘海变成可交互的信息中心",
    type: "macOS App",
    folder: "Mac灵动岛",
    status: "已公开",
    accent: "#d06f3b",
    description:
      "基于 macOS 原生能力做动态刘海交互层，覆盖音乐控制、电量、文件拖放、日历、快捷键与菜单栏联动，定位是更完整的桌面效率壳层。",
    stack: ["SwiftUI", "AppKit", "EventKit", "MediaRemote", "AppleScript"],
    highlights: ["动态岛交互", "音乐控制", "文件托盘", "系统整合"],
    repoName: "mac-dynamic-island"
  },
  {
    name: "反重力插件 Auto Approve",
    subtitle: "把 Run 批准流程从人工点击改为设置级自动化",
    type: "IDE Extension",
    folder: "反重力插件-自动run",
    status: "已公开",
    accent: "#2f7d75",
    description:
      "围绕 Antigravity 内建的工具批准能力做扩展封装，提供状态栏、快速开关与设置入口，目标是让工具批准和终端命令批准更稳定地自动执行。",
    stack: ["JavaScript", "VS Code API", "Python", "VSIX"],
    highlights: ["自动批准", "状态栏开关", "设置跳转", "避免坐标点击"],
    repoName: "antigravity-auto-approve"
  },
  {
    name: "Gemini Navigator",
    subtitle: "为 Gemini 对话加入目录导航、导出与阅读增强",
    type: "Chrome Extension",
    folder: "gemini-sidebar-extension",
    status: "已公开",
    accent: "#4d66d5",
    description:
      "这是当前目录里最明确对应 Gemini 的扩展项目。它通过侧边目录、搜索过滤、导出 Markdown、复制内容和阅读模式，把长对话浏览体验做成了产品级插件。",
    stack: ["JavaScript", "Manifest V3", "Shadow DOM", "MutationObserver"],
    highlights: ["目录导航", "导出 Markdown", "阅读模式", "实时同步"],
    repoName: "gemini-navigator-sidebar"
  },
  {
    name: "随记 / ShadowNote",
    subtitle: "带预算、账单与通知能力的个人记录应用",
    type: "iOS App",
    folder: "随记",
    status: "已公开",
    accent: "#8f5a2d",
    description:
      "从工程结构看，它已经扩展到交易记录、预算概览、通知、OCR 与相册能力，不只是普通备忘录，更像轻量个人财务与生活记录工具。",
    stack: ["SwiftUI", "Core Data", "UserNotifications", "Vision OCR"],
    highlights: ["预算管理", "交易记录", "通知提醒", "OCR 能力"],
    repoName: "shadownote"
  },
  {
    name: "iOS 长截屏",
    subtitle: "多张截图拼接与作品管理的一体化应用",
    type: "iOS App",
    folder: "ios 长截屏",
    status: "已公开",
    accent: "#7f4cc9",
    description:
      "项目聚焦截图拼接体验，包含拖拽排序、拼接方向控制、实时预览、作品管理与上架准备文档，明显朝 App Store 可交付方向推进。",
    stack: ["SwiftUI", "iOS 17", "Image Stitching", "Design System"],
    highlights: ["长图拼接", "实时预览", "作品库", "上架准备"],
    repoName: "ios-long-screenshot"
  },
  {
    name: "电影邮票 / CinePost",
    subtitle: "把电影观影记录做成邮票与信封式收藏体验",
    type: "iOS App",
    folder: "电影邮票",
    status: "已公开",
    accent: "#b48a2d",
    description:
      "以电影为内容，以邮票、信封、邮戳为视觉骨架，做观影收藏和归档体验。项目里已经有档案检索、评分、统计和上架准备文档。",
    stack: ["SwiftUI", "Component Design", "Localization", "App Store Prep"],
    highlights: ["主题化 UI", "电影归档", "统计视图", "视觉记忆点强"],
    repoName: "movie-stamps-cinepost"
  },
  {
    name: "公众号导出工具",
    subtitle: "批量导出公众号文章到本地的桌面应用",
    type: "Electron App",
    folder: "GONGzhonghao",
    status: "已公开",
    accent: "#17645c",
    description:
      "Electron + React + TypeScript 的桌面工具，支持批量下载公众号文章、图片和媒体内容。发布时会避开内部第三方分析子仓库，保留主应用源码。",
    stack: ["Electron", "React", "TypeScript", "Puppeteer", "Ant Design"],
    highlights: ["批量导出", "桌面应用", "媒体下载", "进度反馈"],
    repoName: "wechat-article-exporter-desktop"
  }
];

const grid = document.querySelector("#project-grid");

function renderProjects() {
  grid.innerHTML = projects.map((project) => {
    const stack = project.stack
      .map((item) => `<span class="stack-chip">${item}</span>`)
      .join("");

    const highlights = project.highlights
      .map((item) => `<span class="highlight-chip">${item}</span>`)
      .join("");

    return `
      <article class="project-card" style="--card-accent:${project.accent}">
        <div class="project-header">
          <div>
            <h3 class="project-title">${project.name}</h3>
            <div class="project-subtitle">${project.subtitle}</div>
          </div>
          <span class="status-chip">${project.status}</span>
        </div>
        <div class="type-row">
          <span class="type-chip">${project.type}</span>
          <span class="type-chip">目录：${project.folder}</span>
          <span class="type-chip">计划仓库：${project.repoName}</span>
        </div>
        <p class="project-description">${project.description}</p>
        <div class="stack-row">${stack}</div>
        <div class="highlight-row">${highlights}</div>
        <div class="project-actions">
          <a class="button secondary" href="https://github.com/YYH123123813/${project.repoName}" target="_blank" rel="noreferrer">查看仓库</a>
          <a class="button secondary" href="https://github.com/YYH123123813" target="_blank" rel="noreferrer">GitHub 主页</a>
        </div>
      </article>
    `;
  }).join("");
}

function observeCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".project-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 70}ms`;
    observer.observe(card);
  });
}

renderProjects();
observeCards();
