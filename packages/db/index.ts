import { PrismaClient } from "@prisma/client";
import * as edge from "@prisma/client/edge";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

export * from "@prisma/client";
export { edge };

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
