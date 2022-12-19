import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  test: publicProcedure.query(async ({ ctx }) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 12345",
      },
      body: '{"email":"user@example.com"}',
    };

    const response = await fetch(
      "http://localhost:9000/admin/email-auth",
      options,
    );
    const cookie = response.headers.get("set-cookie");
    const body = await response.json();
    console.log(cookie, body);
    ctx.res.setHeader("set-cookie", cookie!);
    return { cookie, body };
  }),
});
