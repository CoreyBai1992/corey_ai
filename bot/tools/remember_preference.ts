import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { PROFILE_KEY, readProfile, upsertPreference } from "../lib/profile.js";

export default defineTool({
  description: "记住一条长期偏好，供以后的好物推荐使用。topic 用短词，例如预算、饮品、办公。",
  effect: "write",
  inputSchema: z.object({
    topic: z.string().min(1).max(40),
    detail: z.string().min(1).max(280),
  }),
  async execute({ topic, detail }, ctx) {
    const current = readProfile(await ctx.host.kv.get(PROFILE_KEY));
    const profile = upsertPreference(current, topic, detail, new Date().toISOString());
    await ctx.host.kv.put(PROFILE_KEY, profile);
    const saved = profile.preferences.find((item) => item.topic.toLowerCase() === topic.trim().toLowerCase());
    return {
      saved: true,
      preference: saved ?? { topic: topic.trim(), detail: detail.trim(), updatedAt: "" },
    };
  },
});
