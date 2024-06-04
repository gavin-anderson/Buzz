import LandingPage from "../app/buzz-components/LandingPage";
import { usePrivy } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Home from "./home";

import Sidebar from "@/app/buzz-components/SideBar";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/home", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function MainScreen() {
  const { login } = usePrivy();

  return (
    <div>
      <LandingPage login={login}></LandingPage>
      {/* {session && (
        <div>
          <Home></Home>
        </div>
      )} */}
    </div>
  );
}
