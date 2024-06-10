import "@/styles/globals.css";
import { Fragment } from "react";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/Components/Layout";
import "@pqina/pintura/pintura.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Fragment>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </SessionProvider>
    </Fragment>
  );
}
