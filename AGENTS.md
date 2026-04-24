# AGENTS.md

## 执行约束

每次修改代码后，必须按以下顺序完成：

1. 代码修改和测评：
   - 运行 `单元测试`、`端到端（e2e）测试`、`像素级测试`
   - 提交 PR
   - 执行一次`本地 Review`
   - 如果 review 后继续修改代码，重新运行 `单元测试`、`端到端（e2e）测试`、`像素级测试`
   - 按上述循环继续，直到 PR 可合并并完成合并
2. 打包和代码推送：
   - 打包所有代码，输出静态可部署页面到 `out/`
   - 同步所有代码到 gitee

## 最低检查命令

```bash
npm test
npx playwright test
npx playwright test tests/e2e/visual-regression.spec.ts
git checkout -b <branch-name>
git add .
git commit -m "<message>"
git push github <branch-name>
gh pr create --draft
# 本地执行一次 review，必要时继续修改并复测
gh pr merge
npm run package:out
git push origin main
```
