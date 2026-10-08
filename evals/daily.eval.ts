import { defineEval } from "@cursor/bdk/evals";

export default defineEval({
  tags: ["smoke"],
  cases: [
    {
      id: "chair",
      description: "A product recommendation reads saved preferences and skips the encyclopedia.",
      async test(t) {
        await t.send("帮我推荐一把居家办公的人体工学椅，预算 1500 元。");
        t.succeeded();
        t.calledTool("list_preferences");
        t.notCalledTool("lookup_reference");
      },
    },
    {
      id: "photosynthesis",
      description: "A factual lookup uses Wikipedia.",
      async test(t) {
        await t.send("光合作用是什么？请查一下资料。");
        t.succeeded();
        t.calledTool("lookup_reference");
      },
    },
    {
      id: "coffee",
      description: "A lasting preference is saved.",
      async test(t) {
        await t.send("记住：我喝咖啡，不喝茶。");
        t.succeeded();
        t.calledTool("remember_preference");
      },
    },
  ],
});
