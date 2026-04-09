# SBTI

SBTI 人格测试站点复刻工程。

## 当前进度

- [x] 原站 HTML 已归档到 `research/original/SBTI.html`
- [x] 原站结果图已同步到 `public/assets/original/sbti`
- [x] 首页与答题页流程已完成
- [x] 结果页与完整人格判定逻辑
- [ ] 远端 / 本地全结果浏览器抓取
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
