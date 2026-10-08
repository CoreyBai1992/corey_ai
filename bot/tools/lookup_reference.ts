import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { lookupWikipedia, type WikiLanguage } from "../lib/wikipedia.js";

export default defineTool({
  description:
    "从维基百科查询定义、人物、地点或概念的简短摘要。不要用于价格、库存、天气或新闻。",
  effect: "read",
  inputSchema: z.object({
    query: z.string().min(1).max(120),
    language: z.enum(["zh", "en"]).optional(),
  }),
  async execute({ query, language }) {
    const lang: WikiLanguage = language ?? "zh";
    return lookupWikipedia(query.trim(), lang);
  },
});
