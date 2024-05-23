import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaBell,
  FaHome,
  FaPlusSquare,
  FaSignOutAlt,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";

const Sidebar = ({}) => {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle window resize to adjust sidebar visibility based on the screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Automatically close the sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Ensure the sidebar is open on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Invoke at mount to set initial state based on current window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full h-26 rounded-br-3xl bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-grow">
              {/* Toggle button only visible on small screens */}
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-green-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <span className="sr-only">Toggle sidebar</span>
                <FaBars color="#4a044e" size={"20px"} />
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  className="h-16 mr-3"
                  src="/buzz.png"
                  alt="BuzzMarkets Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-fuchsia-900 lg:block hidden">
                  BuzzMarkets
                </span>
              </a>
            </div>
            {/* Search bar */}
            <div className="flex-1 max-w-xl lg:max-w-none lg:w-1/3">
              <input
                type="text"
                className="form-input w-full px-4 py-2 border rounded-3xl text-fuchsia-950 focus:ring focus:ring-fuchsia-300 focus:border-fuchsia-300 dark:bg-fuchsia-100 dark:border-gray-600 dark:placeholder-gray-400"
                placeholder="Search..."
              />
            </div>
            <div className="flex items-center ms-3">
              {/* Dropdown or user-related elements */}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar element with conditional CSS for translation */}
      <aside
        id="logo-sidebar"
        style={{ width: "400px" }}
        className={`fixed top-0 left-0 z-40 h-screen pt-20 mt-6  bg-white border-r border-gray-200 dark:bg-fuchsia-950 dark:border-fuchsia-700 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
                  router.pathname === "/home"
                    ? "font-black"
                    : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-200 hover:to-fuchsia-300"
                }`}
                href="/home"
              >
                <FaHome size={"20px"} className="mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                className={`flex items-center p-4 text-lg font-normal rounded-3xl text-fuchsia-950 group ${
                  router.pathname === "/notifications"
                    ? "font-black"
                    : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-200 hover:to-fuchsia-300"
                }`}
                href="/notifications"
              >
                <FaBell size={"20px"} className="mr-3" />
                <span>Notifications</span>
              </Link>
            </li>
            <li>
              <Link
                className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
                  router.pathname === "/creators"
                    ? "font-black"
                    : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-200 hover:to-fuchsia-300"
                }`}
                href="/creators"
              >
                <FaUsers size={"20px"} className="mr-3" />
                <span>Creators</span>
              </Link>
            </li>
            <li>
              <Link
                className={`flex items-center justify-center text-lg  p-4 rounded-3xl text-white   group ${
                  router.pathname === "/create"
                    ? "bg-gradient-to-tl text-white from-fuchsia-200 to-fuchsia-600  hover:bg-gradient-to-tl hover:text-white hover:from-fuchsia-300 hover:to-fuchsia-700 "
                    : "bg-gradient-to-tl text-white from-fuchsia-200 to-fuchsia-600 hover:bg-gradient-to-tl hover:text-white hover:from-fuchsia-300 hover:to-fuchsia-700"
                }`}
                href="/create"
              >
                <FaPlusSquare size={"20px"} className="mr-3" />
                <span>Create</span>
              </Link>
            </li>
          </ul>
          {/* Dropdown menu for additional options */}
          <div className="absolute bottom-10 w-full px-3 flex justify-center">
            <Button
              onClick={toggleDropdown}
              className="items-center justify-center border-2 border-fuchsia-500 bg-transparent bg-gradient-to-tl text-white from-fuchsia-200 to-fuchsia-600 rounded-3xl hover:bg-gradient-to-tl hover:text-white hover:from-fuchsia-200 hover:to-fuchsia-300 shadow-sm w-32 h-10" // Adjusted styles
            >
              {isDropdownOpen ? "Close" : "Arsh"}
            </Button>
            {isDropdownOpen && (
              <div className="flex flex-col items-center bg-fuchsia-200 ms-4  bg-opacity-75 rounded-3xl p-2">
                <Link
                  href="/wallet"
                  className="flex items-center p-2 hover:bg-fuchsia-100 rounded-3xl w-full justify-center"
                >
                  <FaWallet className="mr-2" /> <span>Wallet</span>
                </Link>
                <button className="flex items-center p-2 hover:bg-fuchsia-100 rounded-3xl w-full justify-center">
                  <FaSignOutAlt className="mr-2" /> <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
