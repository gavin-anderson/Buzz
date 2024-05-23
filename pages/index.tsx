import LandingPage from "../app/buzz-components/LandingPage";
import { signIn, useSession } from "next-auth/react";
import Profile from "./creators";
import { createContext, useContext } from "react";
import Home from "./home";

import Sidebar from "@/app/buzz-components/SideBar";

// Create a context
export const SessionContext = createContext(null);

export default function MainScreen() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <SessionContext.Provider value={{ session, status }}>
      <div>
        {!session && <LandingPage></LandingPage>}
        {session && (
          <div>
            <Home></Home>
          </div>
        )}
      </div>
    </SessionContext.Provider>
  );
}
