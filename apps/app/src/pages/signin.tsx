import { getProviders, signIn } from "next-auth/react";
export default function SignIn({
  providers,
}: {
  providers: { name: string; id: string }[];
}) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}
export async function getServerSideProps() {
  return { props: { providers: await getProviders() } };
}
