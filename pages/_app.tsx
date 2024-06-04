// pages/_app.tsx
import RootLayout from "../app/layout"; // Make sure this path is correct based on your directory structure
import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>BuzzMarkets</title>
        <meta
          name="description"
          content="The SocialFi platform with unlimited upside."
        />
        <meta property="og:title" content="BuzzMarkets" />
        <meta
          property="og:description"
          content="The SocialFi platform with unlimited upside."
        />
        <meta property="og:image" content="landing.png" />
        <meta property="og:url" content="https://www.buzzmarkets.io/" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "users-without-wallets", // defaults to 'off'
          },
        }}
        onSuccess={() => router.push("/home")}
      >
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </PrivyProvider>
    </>
  );
}

export default MyApp;
