import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod";
import { PROFILE_KEY, readProfile } from "../lib/profile.js";

export default defineTool({
  description: "读取已记住的偏好，例如预算、禁忌和使用场景。推荐商品前先调用。",
  effect: "read",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const profile = readProfile(await ctx.host.kv.get(PROFILE_KEY));
    return { preferences: profile.preferences };
  },
});
