import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";

type NavLayoutProps = {
  children: ReactNode;
};

const NavLayout = ({ children }: NavLayoutProps) => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);
  const [sidebarWidth, setSidebarWidth] = useState("300px");
  const [rightPaneWidth, setRightPaneWidth] = useState("300px");

  useEffect(() => {
    const updateWidth = () => {
      setSidebarWidth(window.innerWidth < 768 ? "0px" : "300px");
      setRightPaneWidth(window.innerWidth < 1300 ? "0px" : "300px");
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <>
      {ready && authenticated ? (
        <>
          <Sidebar />
          <div className="flex" style={{ minHeight: "100vh" }}>
            <div
              style={{
                flex: "1 1 auto",
                marginLeft: sidebarWidth,
                minWidth: "500px",
              }}
            >
              {children}
            </div>
            <div
              style={{
                width: rightPaneWidth,
                flexShrink: 0,
                display: rightPaneWidth === "0px" ? "none" : "block",
              }}
              className="border-l border-gray-50 shadow-xl"
            >
              {/* Right pane content goes here */}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default NavLayout;
