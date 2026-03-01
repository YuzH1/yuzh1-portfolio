# 雨止工作室 - 个人项目展示系统

YuzH1 的个人项目展示网站，支持 B 站视频嵌入、后台管理、昼夜主题切换。

## 功能特性

- 🎨 **创意简约设计** - 动态交互、流畅动画
- 🌓 **昼夜主题切换** - 自动检测系统偏好
- 🎬 **B站视频嵌入** - 自动解析 BV 号
- ⚙️ **后台管理** - 项目的增删改查
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **高性能** - Next.js 14 + ISR

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **数据库**: SQLite + Prisma
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
cd D:\projects\yuzh1-portfolio
npm install
```

### 2. 初始化数据库

```bash
npm run db:push
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 访问后台管理

http://localhost:3000/admin

## 项目结构

```
yuzh1-portfolio/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── api/             # API 路由
│   │   ├── admin/           # 后台管理页面
│   │   ├── projects/        # 项目展示页面
│   │   └── about/           # 关于页面
│   ├── components/          # React 组件
│   └── lib/                 # 工具函数
├── prisma/
│   └── schema.prisma        # 数据库模型
└── public/                  # 静态资源
```

## 使用指南

### 添加项目

1. 访问 `/admin` 后台管理页面
2. 点击「添加项目」按钮
3. 填写项目信息：
   - 项目名称
   - 项目描述
   - 封面图 URL（可选）
   - B站视频链接（自动提取 BV 号）
   - GitHub 链接（可选）
   - 演示链接（可选）
   - 技术栈（逗号分隔）
   - 是否精选

### 更新个人信息

通过 API 更新个人信息：

```bash
curl -X PUT http://localhost:3000/api/about \
  -H "Content-Type: application/json" \
  -d '{
    "name": "你的名字",
    "nickname": "昵称",
    "teamName": "雨止工作室",
    "bio": "个人简介",
    "email": "your@email.com",
    "github": "https://github.com/yourusername",
    "bilibili": "https://space.bilibili.com/yourid"
  }'
```

## 部署

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 自动部署

### 其他平台

```bash
npm run build
npm start
```

## License

MIT