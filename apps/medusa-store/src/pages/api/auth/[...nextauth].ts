import NextAuth from "next-auth";
import Medusa from "@medusajs/medusa-js";

import { authOptions } from "@crocoderdev/auth";

export default NextAuth({
  ...authOptions,
  events: {
    createUser: async (message) => {
      console.log("createUser", message);
      const medusa = new Medusa({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        baseUrl: process.env.MEDUSA_URL!,
        maxRetries: 3,
      });
      console.log({
        first_name: message.user.name || "",
        last_name: message.user.name || "",
        email: message.user.email!,
        password: (Math.random() + 1).toString(36).substring(7),
      });
      await medusa.customers.create({
        first_name: message.user.name || "",
        last_name: message.user.name || "",
        email: message.user.email!,
        password: (Math.random() + 1).toString(36).substring(7),
      });
    },
  },
});
