import NextAuth from "next-auth";

import { authOptions } from "@crocoderdev/auth";

export default NextAuth({... authOptions, pages: { signIn: '/signin'}});
