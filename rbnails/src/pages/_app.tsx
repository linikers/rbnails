import "@/styles/_variables.scss";
import "@/styles/agenda.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import type { AppProps } from "next/app";
import { SnackbarProvider } from "@/context/snackbarContext";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider>
        <Component {...pageProps} />
      </SnackbarProvider>
    </SessionProvider>
  );
}
