import LandingPage from "../app/buzz-components/LandingPage";
import { usePrivy } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import { connectToDatabase } from '@/lib/mongodb';
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
    const userId = claims.userId;

    const { db } = await connectToDatabase();
    const userCollection = db.collection('users');
    const tokenCollection = db.collection('tokens');

    const user = await userCollection.findOne({ privy_id: userId });
    const token = await tokenCollection.findOne({ tokenId: user?.walletAddress });

    if (user && token) {
      return {
        props: {},
        redirect: { destination: '/home', permanent: false },
      };
    } else {
      return {
        props: {},
        redirect: { destination: '/createToken', permanent: false },
      };
    }
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
