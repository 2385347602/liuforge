export const profile = {
  name: 'LiuForge',
  role: '全栈工程师 / 独立开发者',
  location: '中国杭州',
  headline: '把产品直觉、工程能力和持续写作锻造成一个可被记住的个人品牌。',
  email: 'hello@liuforge.dev',
  resumeUrl: '/resume',
  github: 'https://github.com',
  x: 'https://x.com',
  rss: '/rss.xml',
  status: '正在做：个人知识库、AI 工作流、独立产品验证',
};

export const techStack = [
  'TypeScript',
  'Astro',
  'Vue',
  'React',
  'Node.js',
  'Python',
  'Cloudflare',
  'Tailwind CSS',
  'PostgreSQL',
  'Docker',
];

export const projects = [
  {
    title: 'ForgeBoard',
    type: '信息聚合仪表盘',
    description: '把 GitHub、文章、任务、灵感和站点数据聚合到一个高密度工作台。',
    tags: ['Astro', 'Vue', 'Dashboard'],
    impact: '首屏信息获取时间降低 42%',
    gradient: 'from-emerald-300 via-cyan-300 to-blue-400',
  },
  {
    title: 'Signal Notes',
    type: '写作与阅读系统',
    description: '面向长期主义的笔记、文章草稿、标签和全文检索工作流。',
    tags: ['MDX', 'Search', 'Knowledge'],
    impact: '支持草稿、目录、阅读时间和 RSS',
    gradient: 'from-fuchsia-300 via-rose-300 to-amber-300',
  },
  {
    title: 'Indie Radar',
    type: '项目验证工具',
    description: '记录访谈、痛点、付费意愿和 MVP 假设，帮助更快筛掉伪需求。',
    tags: ['Product', 'Validation', 'SaaS'],
    impact: '3 步完成需求评分',
    gradient: 'from-lime-300 via-emerald-300 to-teal-400',
  },
];

export const timeline = [
  {
    year: '2026',
    title: '独立产品与个人品牌',
    description: '把写作、项目展示和工具产品整合到同一个可持续更新的数字主页。',
  },
  {
    year: '2025',
    title: '全栈工程与内容系统',
    description: '搭建 Astro 内容站，沉淀技术文章、工具集合、项目复盘和公开时间线。',
  },
  {
    year: '2024',
    title: '工程效率与自动化',
    description: '围绕 TypeScript、云部署、数据看板和 AI 辅助开发建立稳定工作流。',
  },
];

export const gallery = [
  { title: '深夜工作台', category: 'Workspace', height: 'h-80', gradient: 'from-zinc-900 via-cyan-950 to-emerald-900' },
  { title: '城市漫游', category: 'Travel', height: 'h-64', gradient: 'from-sky-900 via-indigo-900 to-zinc-950' },
  { title: '产品草图', category: 'Making', height: 'h-96', gradient: 'from-stone-900 via-amber-900 to-rose-950' },
  { title: '代码切片', category: 'Code', height: 'h-72', gradient: 'from-black via-emerald-950 to-cyan-950' },
  { title: '阅读角落', category: 'Life', height: 'h-56', gradient: 'from-neutral-900 via-violet-950 to-slate-950' },
  { title: '发布瞬间', category: 'Launch', height: 'h-88', gradient: 'from-blue-950 via-fuchsia-950 to-orange-950' },
];
