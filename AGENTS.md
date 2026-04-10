# AGENTS.md

## 执行约束

每次修改代码后，必须按以下顺序完成：

1. 运行端到端测试
2. 重新打包成静态可部署页面，输出到 `out/`
3. 提交代码
4. 推送代码

## 最低检查命令

```bash
npx playwright test
npm run package:out
git add .
git commit -m "<message>"
git push origin main
git push origin main:master
```
