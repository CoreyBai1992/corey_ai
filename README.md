# Corey

日常对话助手，用来做三件事：

- 知识问答
- 好物推荐（优先国内能买到的，平台以山姆、天猫、京东、拼多多为先，并记住预算、禁忌这类偏好）
- 资料查询（百科类问题查维基百科摘要）

本地对话：

```bash
npm install
npm run dev
```

打开终端里打印的 playground 地址即可聊天。模型回合需要 Cursor 登录（`npx bdk login`）。

检查：

```bash
npx bdk validate --dir .
npx bdk info --dir . --json
npm run check
npx bdk call lookup_reference --dir . --input '{"query":"光合作用"}'
```
