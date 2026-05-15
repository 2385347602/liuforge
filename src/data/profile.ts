export const languages = {
  zh: '中文',
  en: 'English',
} as const;

export type Language = keyof typeof languages;

export const profile = {
  name: 'LiuForge',
  role: {
    zh: '全栈工程师 / 独立开发者',
    en: 'Full-stack Engineer / Indie Maker',
  },
  location: {
    zh: '中国杭州',
    en: 'Hangzhou, China',
  },
  headline: {
    zh: '把产品直觉、工程能力和持续写作锻造成一个可被记住的个人品牌。',
    en: 'Turning product intuition, engineering craft, and consistent writing into a memorable personal brand.',
  },
  email: 'hello@liuforge.dev',
  resumeUrl: '/resume',
  github: 'https://github.com',
  x: 'https://x.com',
  rss: '/rss.xml',
  status: {
    zh: '正在做：个人知识库、AI 工作流、独立产品验证',
    en: 'Now: personal knowledge base, AI workflows, indie product validation',
  },
};

export const ui = {
  nav: {
    home: { zh: '首页', en: 'Home' },
    blog: { zh: '文章', en: 'Writing' },
    projects: { zh: '项目', en: 'Projects' },
    timeline: { zh: '时间线', en: 'Timeline' },
    gallery: { zh: '相册', en: 'Gallery' },
    resume: { zh: '简历', en: 'Resume' },
    about: { zh: '关于', en: 'About' },
    search: { zh: '搜索', en: 'Search' },
  },
  theme: {
    system: { zh: '跟随系统', en: 'System' },
    dark: { zh: '深色', en: 'Dark' },
    light: { zh: '浅色', en: 'Light' },
  },
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
    type: {
      zh: '信息聚合仪表盘',
      en: 'Information Dashboard',
    },
    description: {
      zh: '把 GitHub、文章、任务、灵感和站点数据聚合到一个高密度工作台。',
      en: 'A high-density workspace that brings GitHub, writing, tasks, ideas, and site signals together.',
    },
    tags: ['Astro', 'Vue', 'Dashboard'],
    impact: {
      zh: '首屏信息获取时间降低 42%',
      en: 'Reduced first-screen information lookup time by 42%',
    },
    gradient: 'from-emerald-300 via-cyan-300 to-blue-400',
  },
  {
    title: 'Signal Notes',
    type: {
      zh: '写作与阅读系统',
      en: 'Writing System',
    },
    description: {
      zh: '面向长期主义的笔记、文章草稿、标签和全文搜索工作流。',
      en: 'A long-term writing workflow for notes, drafts, tags, and search.',
    },
    tags: ['MDX', 'Search', 'Knowledge'],
    impact: {
      zh: '支持草稿、目录、阅读时间和 RSS',
      en: 'Supports drafts, table of contents, reading time, and RSS',
    },
    gradient: 'from-fuchsia-300 via-rose-300 to-amber-300',
  },
  {
    title: 'Indie Radar',
    type: {
      zh: '项目验证工具',
      en: 'Product Validation Tool',
    },
    description: {
      zh: '记录访谈、痛点、付费意愿和 MVP 假设，帮助更快筛掉伪需求。',
      en: 'Tracks interviews, pain points, willingness to pay, and MVP assumptions to filter weak ideas faster.',
    },
    tags: ['Product', 'Validation', 'SaaS'],
    impact: {
      zh: '3 步完成需求评分',
      en: 'Score a product idea in 3 steps',
    },
    gradient: 'from-lime-300 via-emerald-300 to-teal-400',
  },
];

export const timeline = [
  {
    year: '2026',
    title: {
      zh: '独立产品与个人品牌',
      en: 'Indie Products and Personal Brand',
    },
    description: {
      zh: '把写作、项目展示和工具产品整合到同一个可持续更新的数字主页。',
      en: 'Combining writing, portfolio work, and useful tools into one sustainable digital home.',
    },
  },
  {
    year: '2025',
    title: {
      zh: '全栈工程与内容系统',
      en: 'Full-stack Engineering and Content Systems',
    },
    description: {
      zh: '搭建 Astro 内容站，沉淀技术文章、工具集合、项目复盘和公开时间线。',
      en: 'Built an Astro content site for technical writing, tools, project notes, and a public timeline.',
    },
  },
  {
    year: '2024',
    title: {
      zh: '工程效率与自动化',
      en: 'Engineering Productivity and Automation',
    },
    description: {
      zh: '围绕 TypeScript、云部署、数据看板和 AI 辅助开发建立稳定工作流。',
      en: 'Built stable workflows around TypeScript, cloud deployment, dashboards, and AI-assisted development.',
    },
  },
];

export const gallery = [
  { title: { zh: '深夜工作台', en: 'Late-night Desk' }, category: 'Workspace', height: 'h-80', gradient: 'from-zinc-900 via-cyan-950 to-emerald-900' },
  { title: { zh: '城市漫游', en: 'City Walk' }, category: 'Travel', height: 'h-64', gradient: 'from-sky-900 via-indigo-900 to-zinc-950' },
  { title: { zh: '产品草图', en: 'Product Sketches' }, category: 'Making', height: 'h-96', gradient: 'from-stone-900 via-amber-900 to-rose-950' },
  { title: { zh: '代码切片', en: 'Code Slices' }, category: 'Code', height: 'h-72', gradient: 'from-black via-emerald-950 to-cyan-950' },
  { title: { zh: '阅读角落', en: 'Reading Corner' }, category: 'Life', height: 'h-56', gradient: 'from-neutral-900 via-violet-950 to-slate-950' },
  { title: { zh: '发布瞬间', en: 'Launch Moment' }, category: 'Launch', height: 'h-88', gradient: 'from-blue-950 via-fuchsia-950 to-orange-950' },
];

export const text = <T extends Record<Language, string>>(value: T, lang: Language = 'zh') => value[lang];
