 
# LiuForge - 个人网站

<div align="center">

![Astro](https://img.shields.io/badge/Astro-4.16.0-bc52ee?style=for-the-badge&logo=astro)
![Vue](https://img.shields.io/badge/Vue-3.5.0-4fc08d?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38b2ac?style=for-the-badge&logo=tailwind-css)

**一个开发者的数字花园，分享技术博客、实用工具和精选排行榜**

[在线访问](https://liuforge.com) · [报告问题](https://github.com/yourusername/liuforge/issues) · [功能请求](https://github.com/yourusername/liuforge/issues)

</div>

## 📖 项目简介

LiuForge 是一个现代化的个人网站，使用 Astro 框架构建。它集成了博客系统、实用工具集和精选排行榜功能，为开发者提供一个全面的数字平台。

"Forge"意为锻造，象征着用代码铸造更好的数字体验。

## ✨ 功能特性

### 📝 博客系统
- 支持 MDX 格式的文章编写
- 标签分类和日期排序
- 响应式文章卡片展示
- 语法高亮支持

### 🛠️ 实用工具集
- JSON 格式化工具
- Base64 编解码工具
- 时间戳转换工具
- 更多工具持续更新中...

### 🏆 精选排行榜
- 开发者工具排行
- 学习资源推荐
- 社区热门内容

### 🎨 设计特色
- 深色主题设计
- 流畅的动画效果
- 完全响应式布局
- 优秀的用户体验

## 🚀 技术栈

- **框架**: [Astro](https://astro.build/) - 现代静态站点生成器
- **前端**: [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **内容**: [MDX](https://mdxjs.com/) - Markdown + JSX
- **类型检查**: [TypeScript](https://www.typescriptlang.org/)
- **代码高亮**: Shiki - 基于 VS Code 主题的语法高亮器

## 📦 安装与运行

### 环境要求
- Node.js >= 18.0.0
- pnpm (推荐) 或 npm

### 快速开始

1. **克隆项目**
 
   
   ```
bash
git clone https://github.com/yourusername/liuforge.git
cd liuforge
   ```

2. **安装依赖**
  
   
   ```
bash
pnpm install
   ```
 
3. **启动开发服务器**



   ```
bash
pnpm dev
   ```
   访问 `http://localhost:4321` 查看效果

4. **构建生产版本**
 

   ```
bash
pnpm build
   ```
5. **预览生产构建**
 

   ```
bash
pnpm preview
   ```
## 📁 项目结构

```

liuforge/
├── src/
│   ├── components/          # Vue 和 Astro 组件
│   │   ├── blog/           # 博客相关组件
│   │   ├── layout/         # 布局组件
│   │   ├── rankings/       # 排行榜组件
│   │   └── tools/          # 工具组件
│   ├── content/            # 内容文件
│   │   └── blog/           # 博客文章 (MDX)
│   ├── data/               # 数据文件
│   ├── pages/              # 页面路由
│   │   ├── blog/           # 博客页面
│   │   ├── tools/          # 工具页面
│   │   └── rankings/       # 排行榜页面
│   └── styles/             # 全局样式
├── public/                 # 静态资源
├── astro.config.mjs        # Astro 配置
├── tailwind.config.js      # Tailwind 配置
└── package.json            # 项目配置
```
## 🛠️ 开发指南

### 添加新博客文章
在 `src/content/blog/` 目录下创建新的 `.mdx` 文件：

```
mdx
---
title: "文章标题"
description: "文章描述"
date: 2024-01-01
tags: ["JavaScript", "Web开发"]
---

文章内容...
```
### 添加工具
1. 在 `src/components/tools/` 创建 Vue 组件
2. 在 `src/pages/tools/` 创建对应的 Astro 页面
3. 在首页添加工具入口

### 自定义样式
修改 `src/styles/global.css` 或使用 Tailwind 类名进行样式定制。

## 🌐 部署

本项目可以部署到任何静态托管服务：

- **Cloudflare Pages**: 已配置 `wrangler.toml`
- **Vercel**: 一键部署
- **Netlify**: 拖拽部署
- **GitHub Pages**: 配合 GitHub Actions

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**LiuForge Team**

- Website: https://liuforge.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 致谢

感谢以下开源项目：
- [Astro](https://astro.build/)
- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个星！**

Made with ❤️ by LiuForge Team

</div>
 


 