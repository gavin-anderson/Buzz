import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./SideBar";

type NavLayoutProps = {
  children: ReactNode;
};

const NavLayout = ({ children }: NavLayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState("400px"); // Default sidebar width
  const [rightPaneWidth, setRightPaneWidth] = useState("500px"); // Default right pane width

  useEffect(() => {
    const updateWidth = () => {
      setSidebarWidth(window.innerWidth < 768 ? "0px" : "400px");
      setRightPaneWidth(window.innerWidth < 768 ? "0px" : "500px");
    };

    // Call updateWidth once to set the initial widths
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <>
      <Sidebar className="sidebar" />
      <div className="flex" style={{ minHeight: "100vh" }}>
        <div
          style={{
            flex: "1 1 auto",
            marginLeft: sidebarWidth,
            marginTop: "100px", // Adjust margin to match Sidebar height
            minWidth: "400px", // Set a minimum width for the main content area
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
          className="border-l border-gray-300" // Added Tailwind classes for left border
        >
          {/* Right pane content goes here */}
        </div>
      </div>
    </>
  );
};

export default NavLayout;
