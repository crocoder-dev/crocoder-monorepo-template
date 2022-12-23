import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useMeCustomer } from "medusa-react";

const Home: NextPage = () => {
  const { mutate: signInMedusa } = trpc.medusaAuth.signin.useMutation();
  const { customer } = useMeCustomer();
  return (
    <>
      <AuthShowcase />
      <button onClick={() => signInMedusa()}>Sign in Medusa</button>
    </>
  );
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
        <p>
          {session && <span>Logged in as {session?.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button className="" onClick={session ? () => signOut() : () => signIn()}>
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
