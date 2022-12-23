import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { Button } from "@crocoderdev/component-library";
import { useMeCustomer } from "medusa-react";

const Home: NextPage = () => {
  const test = trpc.example.test.useQuery();
  const { customer } = useMeCustomer();
  return <>ey</>;
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {session?.user && (
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
