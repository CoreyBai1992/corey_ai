import { defineAgent } from "@cursor/bdk";

export default defineAgent({
  name: "Corey",
  description: "日常对话助手，负责知识问答、好物推荐和资料查询。",
  model: {
    id: "grok-4.5",
    params: [
      { id: "effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
  // Inbound chat should not get a shell. Read tools stay so the journal
  // can be searched. Sandbox is off because it fail-closes MCP, which is
  // how these server tools reach the model.
  tools: ["read", "grep", "glob", "ls"],
  hosting: {
    egressDomains: ["zh.wikipedia.org", "en.wikipedia.org"],
  },
});
