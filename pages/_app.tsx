import RootLayout from "../app/layout"; // Ensure the path is correct based on your directory structure
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import {UserProvider} from "../contexts/UserContext"
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>BuzzMarkets</title>
        <meta name="description" content="The SocialFi platform with unlimited upside." />
        <meta property="og:title" content="BuzzMarkets" />
        <meta property="og:description" content="The SocialFi platform with unlimited upside." />
        <meta property="og:image" content="landing.png" />
        <meta property="og:url" content="https://www.buzzmarkets.io/" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "users-without-wallets",  // Ensure this is correctly configured
          },
        }}
        onSuccess={() => {
          router.push("/");
        }}
      >
        <UserProvider>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </UserProvider>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
