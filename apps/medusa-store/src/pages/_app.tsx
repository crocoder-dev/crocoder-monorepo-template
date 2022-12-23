// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { Hydrate } from "react-query";
import { CartProvider, MedusaProvider } from "medusa-react";
import { queryClient, MEDUSA_BACKEND_URL } from "../utils/medusaClient";

import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MedusaProvider
        baseUrl={MEDUSA_BACKEND_URL}
        queryClientProviderProps={{
          client: queryClient,
        }}
      >
        <Hydrate state={(pageProps as any).dehydratedState}>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </Hydrate>
      </MedusaProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
