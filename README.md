# 🪄 AI 朋友圈广告素材生成器

> 一键批量生成微信朋友圈腾讯广告样式的图文素材 —— 输入公司名称，自动生成 Logo、广告文案、海报图片和 Slogan。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-brightgreen.svg)
![Vue](https://img.shields.io/badge/Vue-3.x-42b883.svg)

---

## 📋 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [效果预览](#-效果预览)
- [技术架构](#-技术架构)
- [快速开始](#-快速开始)
- [使用指南](#-使用指南)
- [项目结构](#-项目结构)
- [配置说明](#-配置说明)
- [常见问题](#-常见问题)
- [许可证](#-许可证)

---

## 📖 项目简介

**AI 朋友圈广告素材生成器** 是一个基于阿里云 DashScope API（通义千问 + 万象图像生成）的自动化广告素材创作工具。它能够模拟微信朋友圈原生广告的视觉样式，根据公司/品牌名称自动生成完整的广告卡片，包括：

- 🎨 **品牌 Logo** — AI 自动设计扁平化矢量图标
- ✍️ **广告文案** — AI 撰写具有感染力的朋友圈短文案
- 🏷️ **海报标语 (Slogan)** — AI 生成简短有力的品牌标语
- 🖼️ **商业海报底图** — AI 根据品牌行业特征生成定制化海报

生成的卡片完美还原微信朋友圈广告的排版风格（头像 + 名称 + 文案 + 配图 + 查看详情），可直接截图用于广告案例展示、方案演示或教学参考。

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🚀 **批量生成** | 一次输入多个公司名称，自动逐一生成对应卡片 |
| ⚡ **双模式切换** | 极速模拟（免费，使用模板数据）/ 真实 AI（调用大模型 API） |
| 📐 **多比例适配** | 支持横版（540×305）和竖版（320×560）两种图片比例 |
| ✏️ **在线编辑** | 生成后可直接修改公司名称和广告文案（ContentEditable） |
| 🔄 **单项重新生成** | 对 Logo 或海报图片不满意？点击即可单独重新生成 |
| 📦 **一键打包下载** | 将所有卡片以 PNG 格式打包为 ZIP 文件下载 |
| 🎯 **行业智能联想** | AI 根据品牌名自动推断行业，生成对应行业风格的海报 |
| 🎨 **20 种标语样式** | 内置 20 种海报 Slogan 排版样式，随机应用增加多样性 |
| 📊 **实时进度条** | 批量生成时显示处理进度和当前状态 |

---

## 🎬 效果预览

生成的卡片完美模拟微信朋友圈原生广告样式：

```
┌──────────────────────────────────┐
│ [Logo]  公司名称         广告 ▾  │
│         广告文案内容...           │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │     AI 生成的海报底图       │  │
│  │        + Slogan 标语       │  │
│  │                            │  │
│  └────────────────────────────┘  │
│  🔗 查看详情                 >   │
│  6小时前                    ··   │
└──────────────────────────────────┘
```

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────┐
│                    前端 (浏览器)                       │
│  Vue 3 (CDN) + html2canvas + JSZip + FileSaver      │
│                                                      │
│  index.html  ──  script.js  ──  style.css            │
└────────────┬────────────────────────────────────┬────┘
             │  /api/generate-text               │
             │  /api/generate-image              │
             │  /api/task/{taskId}               │
             │  /proxy-image?url=...             │
             ▼                                    │
┌──────────────────────────────┐                  │
│      server.js (Node.js)     │                  │
│   本地代理服务器 (Port 3000)   │                  │
│   • API 密钥管理              │                  │
│   • 静态文件服务              │                  │
│   • 图片跨域代理              │                  │
└────────────┬─────────────────┘                  │
             │ HTTPS                              │
             ▼                                    │
┌──────────────────────────────┐                  │
│   阿里云 DashScope API       │                  │
│   • 通义千问 (qwen-turbo)     │  ◄── 文案 / 标语 │
│   • 万象 (wanx2.0-t2i-turbo) │  ◄── Logo / 海报  │
└──────────────────────────────┘
```

**核心技术栈：**

- **前端框架**：Vue 3 (CDN 方式引入，无需构建工具)
- **UI 手写还原**：纯 CSS 模拟微信朋友圈原生广告样式
- **截图导出**：html2canvas — 将 DOM 转为图片
- **批量打包**：JSZip + FileSaver.js — 打包 ZIP 下载
- **后端服务**：Node.js 原生 HTTP 模块（零依赖）
- **AI 能力**：阿里云 DashScope API（通义千问文本 + 万象图像）

---

## 🚀 快速开始

### 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | ≥ 14.0 | [官网下载](https://nodejs.org/) |
| **浏览器** | 现代浏览器 | 推荐 Chrome / Edge / Safari |
| **阿里云 API Key** | — | [DashScope 控制台](https://dashscope.console.aliyun.com/) 获取 |

### 安装步骤

#### 1️⃣ 克隆项目

```bash
git clone https://github.com/你的用户名/ai-wechat-ad-generator.git
cd ai-wechat-ad-generator
```

#### 2️⃣ 配置 API Key

打开 `server.js`，找到第 8 行，将 `API_KEY` 替换为你自己的阿里云 DashScope API Key：

```javascript
const API_KEY = 'sk-你的API密钥'; // 替换为你的 DashScope API Key
```

> **💡 如何获取 API Key？**
> 1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
> 2. 注册/登录后，进入「API-KEY 管理」
> 3. 创建新的 API Key 并复制

#### 3️⃣ 启动服务

**方式一：命令行启动（推荐）**

```bash
node server.js
```

启动成功后会看到：

```
==================================================
✅ App Server is running!
👉 Access URL: http://localhost:3000
   - Static files served from current directory
   - API calls secured and proxied to Alibaba Cloud
==================================================
```

**方式二：Mac 用户双击启动**

```bash
# 先赋予执行权限（首次需要）
chmod +x start_mac.command

# 然后双击 start_mac.command 文件即可
```

#### 4️⃣ 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)，即可开始使用。

---

## 📚 使用指南

### 基本操作流程

```
 输入公司名称 → 选择设置 → 点击生成 → 预览编辑 → 下载导出
```

### 第一步：输入公司名称

在左侧「输入公司名称」文本框中，输入你想生成广告素材的公司/品牌名称，**每行一个**：

```
星河科技有限公司
云端未来科技
绿色动力新能源
华泰医疗器械
天然气集团公司
```

> **💡 技巧**：AI 会根据公司名称自动推断行业类型，所以公司名称越能体现行业属性，生成效果越好。
> 例如：「华泰医疗器械」→ 医疗行业风格海报；「天然气集团公司」→ 能源行业风格海报。

### 第二步：选择设置

#### 图片比例

| 选项 | 尺寸 | 适用场景 |
|------|------|---------|
| **横版** | 540 × 305 | 标准朋友圈广告比例，适合多数场景 |
| **竖版** | 320 × 560 | 竖屏展示，适合产品展示或人物类广告 |

#### 生成模式

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| **⚡ 极速模拟** | 使用预设模板数据，无需API，0 成本 | 测试界面效果、演示功能 |
| **🧠 真实 AI** | 调用阿里云 AI 模型，生成原创内容 | 实际使用、生成正式素材 |

### 第三步：开始生成

点击 **「开始批量生成」** 按钮：
- 界面会显示进度条和处理状态（正在生成: 1 / 5）
- 每个公司会依次生成 Logo、文案、标语、海报四项内容
- AI 模式下，每个公司大约需要 30-60 秒

### 第四步：预览与编辑

生成完成后，卡片会在右侧预览区域展示。你可以：

| 操作 | 方法 |
|------|------|
| **编辑公司名称** | 直接点击卡片上的公司名文字进行修改 |
| **编辑广告文案** | 直接点击卡片上的文案文字进行修改 |
| **重新生成 Logo** | 点击卡片左侧的 Logo 图片 |
| **重新生成海报图片** | 点击海报右上角的 🔄 刷新按钮 |

### 第五步：下载导出

点击左侧底部的 **「下载全部 (ZIP)」** 按钮：
- 系统将每张卡片截图为 PNG 图片（2x 清晰度）
- 文件名以公司名称命名
- 打包为 `promo-cards.zip` 文件自动下载

---

## 📁 项目结构

```
ai-wechat-ad-generator/
│
├── index.html           # 主页面 (Vue 3 模板)
├── script.js            # 核心业务逻辑 (Vue 3 Composition API)
├── style.css            # 全部样式 (含 20 种 Slogan 样式)
├── server.js            # Node.js 后端代理服务器 (零依赖)
├── start_mac.command    # Mac 一键启动脚本
├── xcxtb.png            # 小程序图标素材
└── README.md            # 项目说明文件
```

### 核心文件说明

#### `server.js` — 后端代理服务器

- **职责**：API 密钥管理、静态文件服务、跨域代理
- **端口**：3000
- **API 路由**：
  | 路由 | 功能 | 对应 DashScope API |
  |------|------|--------------------|
  | `POST /api/generate-text` | 文本生成（文案/标语） | `/api/v1/services/aigc/text-generation/generation` |
  | `POST /api/generate-image` | 图像生成提交（Logo/海报） | `/api/v1/services/aigc/text2image/image-synthesis` |
  | `GET /api/task/{taskId}` | 图像生成进度查询 | `/api/v1/tasks/{taskId}` |
  | `GET /proxy-image?url=` | 图片跨域代理 | 直接转发目标 URL |

#### `script.js` — 前端核心逻辑

- **框架**：Vue 3 Composition API (setup 语法)
- **核心函数**：
  | 函数 | 功能 |
  |------|------|
  | `generateBatch()` | 批量生成入口，支持模拟/AI 两种模式 |
  | `callQwenApi()` | 调用通义千问文本接口 |
  | `callWanxTurbo()` | 调用万象图像生成接口（异步轮询） |
  | `regenerateImage()` | 单独重新生成某张图片 |
  | `regenerateCopy()` | 单独重新生成文案 |
  | `downloadAll()` | 批量截图打包下载 |
  | `proxified()` | 图片 URL 代理转换（解决跨域） |

#### `style.css` — 样式文件

- 完整还原微信朋友圈原生广告卡片样式
- 内置 **20 种** 海报 Slogan 排版样式（`.slogan-style-0` ~ `.slogan-style-19`）
  - 经典底部白字阴影
  - 现代毛玻璃卡片
  - 极简标签式
  - 渐变文字效果
  - 浮动徽章式
  - ……等等

---

## ⚙️ 配置说明

### API Key 配置

在 `server.js` 中第 8 行修改：

```javascript
const API_KEY = 'sk-你的密钥';
```

### 服务端口配置

在 `server.js` 中第 7 行修改：

```javascript
const PORT = 3000; // 修改为你需要的端口
```

### AI 提示词自定义

在 `script.js` 中，以下变量控制 AI 生成内容的提示词，你可以根据需要进行定制：

| 变量名 | 用途 | 位置 |
|--------|------|------|
| `logoPromptTemplate` | Logo 生成提示词 | 第 24 行 |
| `copySystemPrompt` | 文案系统角色设定 | 第 27 行 |
| `copyUserPrompt` | 文案生成提示词 | 第 30 行 |
| `sloganPromptTemplate` | Slogan 生成提示词 | 第 33 行 |
| `imagePromptTemplate` | 海报图片生成提示词（含行业联想） | 第 37-72 行 |

> **💡 提示词支持 `{name}` 占位符**，系统会自动替换为当前正在处理的公司/品牌名称。

### AI 模型配置

| 用途 | 默认模型 | 可替换为 |
|------|---------|---------|
| 文案 / 标语 | `qwen-turbo` | `qwen-plus`、`qwen-max` |
| Logo / 海报 | `wanx2.0-t2i-turbo` | `wanx2.1-t2i-turbo` 等 |

---

## ❓ 常见问题

### Q: 生成时提示「生成失败：请确认服务器已正常运行」

请确认：
1. `server.js` 是否已启动（终端中应显示 `✅ App Server is running!`）
2. API Key 是否正确配置
3. 阿里云 DashScope 账户是否有足够的 API 调用额度

### Q: 图片无法显示或显示为占位图

可能原因：
- API 调用超时（图像生成通常需要 10-30 秒）
- 网络连接不稳定
- API 调用频率超限（默认每个公司间隔 1 秒）

### Q: 如何在 Windows 上运行？

```bash
# 在项目根目录下运行
node server.js
```

然后在浏览器中访问 `http://localhost:3000`。

### Q: 极速模拟模式的图片从哪来？

模拟模式使用 Unsplash 的免费商业图片作为占位图（非 AI 生成），仅用于功能测试和界面演示。

### Q: 下载的 ZIP 文件打开是空白图

请确保浏览器窗口没有被缩小或遮挡，html2canvas 需要卡片在可视区域内才能正确截图。

---

## 🔐 安全提示

> ⚠️ **重要**：请勿将包含真实 API Key 的 `server.js` 直接提交到公开仓库！
>
> 建议在上传 GitHub 前：
> 1. 将 API Key 替换为占位符（如 `sk-your-api-key-here`）
> 2. 或使用环境变量方式读取（推荐）

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- [阿里云 DashScope](https://dashscope.console.aliyun.com/) — AI 能力提供
- [Vue.js](https://vuejs.org/) — 前端框架
- [html2canvas](https://html2canvas.hertzen.com/) — DOM 截图
- [JSZip](https://stuk.github.io/jszip/) — ZIP 打包
- [Font Awesome](https://fontawesome.com/) — 图标库
- [Unsplash](https://unsplash.com/) — 模拟模式占位图

---

<p align="center">
  ⭐ 如果这个项目对你有帮助，欢迎点个 Star 支持一下！
</p>
