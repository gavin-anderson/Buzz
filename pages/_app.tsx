// pages/_app.tsx
import { SessionProvider } from "next-auth/react";
import RootLayout from "../app/layout"; // Make sure this path is correct based on your directory structure

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}

export default MyApp;
