import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const medusaAuthRouter = router({
  signup: protectedProcedure.mutation(async ({ ctx }) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MEDUSA_API_TOKEN}`,
      },
      body: JSON.stringify({
        email: ctx.session.user.email,
        first_name: ctx.session.user.name,
        last_name: ctx.session.user.name,
        password: (Math.random() + 1).toString(36).substring(7),
      }),
    };

    const response = await fetch(
      `${process.env.MEDUSA_URL}/admin/customers`,
      options,
    );

    console.log("signUp", response.status, response.statusText);

    if (response.status >= 299) {
      const error: TRPCError = {
        name: "TRPCError",
        code: "UNAUTHORIZED",
        message: "Failed to sign in",
      };
      ctx.res.status(401).json(error);
    }

    const body = await response.json();

    return body;
  }),
  signin: protectedProcedure.mutation(async ({ ctx }) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MEDUSA_API_TOKEN}`,
      },
      body: `{"email":"${ctx.session.user.email}"}`,
    };

    const response = await fetch(
      `${process.env.MEDUSA_URL}/admin/email-auth`,
      options,
    );

    console.log("signIn", response.status, response.statusText);

    if (response.status >= 299) {
      const error: TRPCError = {
        name: "TRPCError",
        code: "UNAUTHORIZED",
        message: "Failed to sign in",
      };
      ctx.res.status(401).json(error);
      return;
    }

    const cookie = response.headers.get("set-cookie");

    if (!cookie) {
      const error: TRPCError = {
        name: "TRPCError",
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to sign in",
      };
      ctx.res.status(500).json(error);
      return;
    } else {
      ctx.res.setHeader("set-cookie", cookie);
    }

    const body = await response.json();

    return body;
  }),
});
