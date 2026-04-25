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
- 微信内分享卡片默认会请求同域的 `POST /common/wx/oa/signature`
- 如果前端与签名后端不在同域，可显式指定：
  - `NEXT_PUBLIC_WECHAT_OA_SIGNATURE_ENDPOINT=https://your-api.example.com/common/wx/oa/signature`
- 推荐生产方案：让 `sbti.orangemust.com` 反向代理 `/common/wx/oa/signature` 到实际后端签名服务，保证浏览器侧保持同域请求，避免 CORS 预检失败
- 分享能力当前按环境拆分：
  - 普通微信 H5：支持 OA JS-SDK 卡片分享（好友 / 朋友圈菜单）
  - 小程序 `web-view`：只提供 H5 内的分享图、复制文案、复制链接，不再假定可直接调起微信卡片分享
- 也可以替换成自定义 CDN / OSS 域名：

```bash
NEXT_PUBLIC_ASSET_BASE_URL=https://your-cdn.example.com/assets npm run dev
```

示例 Nginx 反向代理：

```nginx
location /common/wx/oa/signature {
    proxy_pass https://test.doors.orangemust.com/common/wx/oa/signature;
    proxy_set_header Host test.doors.orangemust.com;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
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
