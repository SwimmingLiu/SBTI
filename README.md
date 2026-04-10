# Persona Test Library

多题库人格测试复刻工程，当前以 SBTI 为基线，逐步接入 SDTI 与 HERTI。

## 当前进度

- [x] 多题库总体设计与分 PR 计划
- [x] 首页升级为题库入口页
- [x] SBTI 迁移到 `/tests/sbti`
- [x] SDTI 完整接入
- [x] 参考页面快照已归档到 `research/original/SBTI.html`
- [x] 结果图资源已同步到 `public/assets/original/sbti`
- [x] 首页与答题页流程已完成
- [x] 结果页与完整人格判定逻辑
- [x] 远端 / 本地全结果浏览器抓取
- [ ] HERTI 完整接入
- [ ] Vercel 生产部署

## 本地开发

```bash
npm install
npm run dev
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
