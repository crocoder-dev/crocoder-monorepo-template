import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const medusaAuthRouter = router({
  signup: protectedProcedure.mutation(async ({ ctx }) => {}),
  signin: protectedProcedure.mutation(async ({ ctx }) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MEDUSA_API_TOKEN}`,
      },
      body: `{"email":"${ctx.session.user.email}}"}`,
    };

    const response = await fetch(
      `${process.env.MEDUSA_URL}/admin/email-auth`,
      options,
    );
    if (response.status >= 299) {
      const error: TRPCError = {
        name: "TRPCError",
        code: "UNAUTHORIZED",
        message: "Failed to sign in",
      };
      ctx.res.status(401).json(error);
    }

    const cookie = response.headers.get("set-cookie");

    if (!cookie) {
      const error: TRPCError = {
        name: "TRPCError",
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to sign in",
      };
      ctx.res.status(500).json(error);
    } else {
      ctx.res.setHeader("set-cookie", cookie);
    }

    const body = await response.json();

    return body;
  }),
});
