# SBTI Clone Design Spec

**Date:** 2026-04-09

## Context

目标站点是一个单文件实现的 SBTI 人格测试页面，核心特征如下：

- 页面结构：介绍页 → 题目页 → 结果页
- 数据来源：题目数据、类型库、维度解释、图片映射、结果计算逻辑均内嵌在页面脚本中
- 题目机制：30 道常规题 + 1 道随机插入的饮酒补充题；当补充题选择“饮酒”时，再插入第 2 道隐藏题
- 结果机制：
  - 15 个维度，每维 2 题，按总分映射到 `L/M/H`
  - 常规人格通过 25 个 pattern 做最近邻匹配
  - 隐藏人格 `DRUNK` 由补充题直接触发
  - 兜底人格 `HHHH` 在标准人格最高匹配度低于 60% 时触发
- 资源：结果图使用 `images/sbti/*` 下的静态图片

## 用户目标

从 0 到 1 完整复刻目标页面，保留全部题目、文案、结果、图片与判定逻辑；UI 允许轻度优化；完成本地浏览器级验证、GitHub PR 流程和 Vercel 部署。

## 非目标

- 不对题目数据和人格文案做内容删改
- 不引入账号、后端数据库或管理后台
- 不将结果逻辑迁移为远端 API

## 约束与假设

- 当前仓库为空仓库，需要先建立工程骨架
- `impeccable` skill 当前不可用，因此 UI 优化改为在现有设计基础上做体系化重构
- 站点资源可直接从目标站拉取并在仓库内本地化
- 部署目标优先使用 Next.js + Vercel 的静态/边缘友好方案

## 方案对比

### 方案 A：纯静态 HTML 复刻

优点：

- 最接近目标页面实现
- 开发速度快

缺点：

- 可维护性差
- 后续扩展测试、资产整理、类型安全较弱
- Vercel 上线虽简单，但代码组织差

### 方案 B：Next.js App Router + TypeScript + Tailwind（推荐）

优点：

- 保持前端纯客户端交互，同时获得更好工程化能力
- 方便拆分题目数据、类型库、计算逻辑、UI 组件和测试
- 原生适配 Vercel

缺点：

- 比纯静态稍重
- 初始搭建工作更多

### 方案 C：Vite + React

优点：

- 轻量
- 适合纯前端应用

缺点：

- 在当前目标里，相比 Next.js 并无明显收益
- 部署与后续平台集成不如 Next.js 直接

## 选型结论

采用 **方案 B：Next.js App Router + TypeScript + Tailwind + Playwright**。

## 架构设计

### 1. 数据层

把页面数据按职责拆分：

- `src/lib/sbti-data.ts`
  - 维度元数据
  - 题目数据与补充题
  - 类型库
  - 类型图片映射
  - 标准人格 pattern
  - 维度解释
- `public/assets/original/`
  - 保留抓取到的图片资源
- `research/original/`
  - 保留页面快照与浏览器抓取证据

### 2. 领域逻辑层

`src/lib/sbti-engine.ts` 负责：

- 题目可见性计算
- 答案转维度分数
- 维度分数转 `L/M/H`
- pattern 相似度计算
- `DRUNK` / `HHHH` 特判
- 最终结果对象生成

该层要求完全可测试、与 UI 解耦。

### 3. 表现层

页面仍维持 3 段流程：

- Intro
- Quiz
- Result

但通过组件拆分：

- `src/components/sbti/intro-screen.tsx`
- `src/components/sbti/quiz-screen.tsx`
- `src/components/sbti/question-card.tsx`
- `src/components/sbti/result-screen.tsx`
- `src/components/sbti/dimension-list.tsx`

### 4. 状态管理

使用 React 本地状态即可，不引入全局状态库。

状态字段：

- `screen`
- `answers`
- `shuffledQuestionIds`
- `isPreviewMode`（保留兼容扩展位）

### 5. 浏览器抓取与验证

新增脚本：

- `scripts/extract-remote-assets.mjs`：下载远端图片与 HTML
- `scripts/capture-remote-results.mjs`：通过 Playwright 打开参考页面，逐个渲染/截图所有结果状态
- `scripts/capture-local-results.mjs`：对本地复刻站做同样的结果页验证

浏览器验证关注：

- 页面流程可用
- 题目随机插入逻辑正确
- 饮酒隐藏题条件插入正确
- 所有可达人格结果都能被渲染
- 结果图、标题、副标题、匹配度、友情提示、十五维解释均正确显示

## UI 策略

保持信息架构、文案、结果结构、图像内容 1:1；在不影响复刻准确性的前提下做以下改良：

- 统一间距、圆角、阴影与色阶
- 优化移动端排版
- 强化结果页可读性
- 保留参考页面“轻讽刺 + 轻娱乐”的情绪氛围

## 测试策略

### 单元测试

覆盖 `sbti-engine`：

- 维度打分
- `L/M/H` 映射
- 常规人格匹配
- `DRUNK` 特判
- `HHHH` 兜底

### 端到端测试

使用 Playwright：

- 测试完整答题提交
- 测试隐藏题展示
- 测试结果页渲染
- 测试多个代表人格场景

### 对照验证

用脚本对比：

- 远端结果文本抓取结果
- 本地复刻结果文本
- 关键字段一致性

## PR 划分

### PR 0：仓库初始化

- 建立基础分支与工程骨架
- 提交 spec / plan 文档

### PR 1：数据建模与题目流程

- 脚手架
- 页面数据迁移
- 首页/题目页
- 进度条与隐藏题逻辑

### PR 2：结果引擎与结果页

- 结果算法
- 结果图接入
- 结果页完整渲染
- 单元测试

### PR 3：浏览器抓取、E2E、发布

- Playwright 抓取脚本
- 本地 E2E
- GitHub PR 收尾
- Vercel 部署配置与上线

## 验收标准

- 所有题目、文案、人格、图片已本地化
- 本地页面能完整跑通目标答题流程
- 隐藏人格与兜底人格逻辑正确
- 浏览器脚本能抓取并验证所有可达结果
- GitHub 上按功能块完成多个 PR，并处理 Copilot review
- 项目已部署到 Vercel，可公开访问
