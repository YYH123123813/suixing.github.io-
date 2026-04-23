const projects = [
  {
    name: "随记 / ShadowNote",
    subtitle: "带预算、账单、交易、提醒与 OCR 能力的个人管理应用。",
    type: "iOS App",
    status: "公开仓库",
    description:
      "把记录、预算、交易、通知与 OCR 融成一套轻量但完成度较高的个人管理产品，更能体现移动端信息结构和持续迭代能力。",
    proof:
      "更像完整消费级产品，适合快速判断信息结构、功能整合与产品完成度。",
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
      "最能证明我把明确需求做成稳定工具产品，而不是只做概念演示。",
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
      "记忆点强，同时能体现桌面产品感、系统交互理解与实现深度。",
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
      "能够证明我在工具型移动应用中的流程设计与细节打磨能力。",
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
      "更偏审美与内容表达，能补足我在产品气质和界面叙事上的能力面。",
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
      "更偏开发者工具方向，说明我也能处理效率型和工作流型产品。",
    stack: ["JavaScript", "VS Code API", "Python", "VSIX"],
    repoName: "antigravity-auto-approve",
    image: "./assets/covers/antigravity-auto-approve.png"
  }
];

const featuredGrid = document.querySelector("#featured-grid");
const projectList = document.querySelector("#project-list");

function createRepoUrl(repoName) {
  return `https://github.com/YYH123123813/${repoName}`;
}

function renderFeatured() {
  const featuredProjects = projects.filter((project) => project.featured);

  featuredGrid.innerHTML = featuredProjects
    .map((project) => {
      const repoUrl = createRepoUrl(project.repoName);
      return `
        <article class="featured-card">
          <div class="featured-visual">
            <img src="${project.image}" alt="${project.name} 项目封面图" loading="lazy">
          </div>
          <div class="featured-copy">
            <div class="card-meta">
              <span class="card-type">${project.type}</span>
              <span class="card-status">${project.status}</span>
            </div>
            <h3>${project.name}</h3>
            <p class="featured-subtitle">${project.subtitle}</p>
            <p class="featured-description">${project.description}</p>
            <p class="featured-proof">${project.proof}</p>
            <p class="card-stack">技术栈：${project.stack.join(" · ")}</p>
            <div class="card-footer">
              <span class="repo-slug">github.com/YYH123123813/${project.repoName}</span>
              <a class="text-link" href="${repoUrl}" target="_blank" rel="noreferrer">查看仓库</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProjectList() {
  const compactProjects = projects.filter((project) => !project.featured);

  projectList.innerHTML = compactProjects
    .map((project) => {
      const repoUrl = createRepoUrl(project.repoName);
      return `
        <article class="list-card">
          <div class="list-thumb">
            <img src="${project.image}" alt="${project.name} 项目封面图" loading="lazy">
          </div>
          <div class="list-main">
            <div class="list-top">
              <h3 class="list-name">${project.name}</h3>
              <span class="list-meta">${project.type} · ${project.status}</span>
            </div>
            <p class="list-subtitle">${project.subtitle}</p>
            <p class="list-proof">${project.proof}</p>
            <p class="list-stack">技术栈：${project.stack.join(" · ")}</p>
          </div>
          <a class="button button-ghost" href="${repoUrl}" target="_blank" rel="noreferrer">查看仓库</a>
        </article>
      `;
    })
    .join("");
}

renderFeatured();
renderProjectList();
