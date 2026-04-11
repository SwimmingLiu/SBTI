# Persona Test Library

多题库人格测试复刻工程，当前以 SBTI 为基线，逐步接入 SDTI 与 HERTI。

## 当前进度

- [x] 多题库总体设计与分 PR 计划
- [x] 首页升级为题库入口页
- [x] SBTI 迁移到 `/tests/sbti`
- [x] SDTI 完整接入
- [x] HERTI 完整接入
- [x] 参考页面快照已归档到 `research/original/SBTI.html`
- [x] 结果图资源已同步到阿里云 OSS
- [x] 首页与答题页流程已完成
- [x] 结果页与完整人格判定逻辑
- [x] 远端 / 本地全结果浏览器抓取
- [ ] Vercel 生产部署

## 本地开发

```bash
npm install
npm run dev
```

### 图片资源来源

- 默认情况下，运行时图片资源会走阿里云 OSS：
  - `NEXT_PUBLIC_ASSET_BASE_URL=https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets`
- 也可以替换成自定义 CDN / OSS 域名：

```bash
NEXT_PUBLIC_ASSET_BASE_URL=https://your-cdn.example.com/assets npm run dev
```

## 测试

```bash
npm run lint
npx vitest run
npx playwright test
npm run build
```

## 资源同步

```bash
node scripts/extract-remote-assets.mjs
```

## 全结果抓取

```bash
npm run capture:remote
npm run capture:local
```

抓取结果会输出到：

- `research/original/results`
- `research/local/results`
