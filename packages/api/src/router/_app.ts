import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { medusaAuthRouter } from "./medusaAuth";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  medusaAuth: medusaAuthRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
