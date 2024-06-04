import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaBell,
  FaCheck,
  FaCircle,
  FaClipboard,
  FaHome,
  FaLink,
  FaPlusSquare,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
  FaWallet,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { Button, Modal } from "flowbite-react";
import { usePrivy } from "@privy-io/react-auth";

const Sidebar = ({}) => {
  const router = useRouter();
  const { logout } = usePrivy();

  const { user } = usePrivy();

  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);

  //Wallet Modal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleWalletModal = () => {
    setIsWalletModalOpen(!isWalletModalOpen);
    setIsCopied(false);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setIsBottomNavVisible(true);
      } else if (window.innerWidth < 1024) {
        setIsSidebarOpen(true);
        setIsBottomNavVisible(false);
      } else {
        setIsSidebarOpen(true);
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = (
    <>
      <Link
        href="/home"
        className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
          router.pathname === "/home"
            ? "font-black"
            : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
        }`}
      >
        <FaHome className="sidebar-icon" />
        <span className="sidebar-text">Home</span>
      </Link>
      <Link
        href="/notifications"
        className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
          router.pathname === "/notifications"
            ? "font-black"
            : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
        }`}
      >
        <FaBell className="sidebar-icon" />
        <span className="sidebar-text">Notifications</span>
      </Link>
      <Link
        href="/creators"
        className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
          router.pathname === "/creators"
            ? "font-black"
            : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
        }`}
      >
        <FaUsers className="sidebar-icon" />
        <span className="sidebar-text">Creators</span>
      </Link>
      <Link
        href="/profile"
        className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
          router.pathname === "/profile"
            ? "font-black"
            : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
        }`}
      >
        <FaUser className="sidebar-icon" />
        <span className="sidebar-text">Profile</span>
      </Link>
      <Link
        href="/create"
        className={`flex items-center justify-center text-lg  p-4 rounded-3xl text-white   group ${
          router.pathname === "/create"
            ? "bg-gradient-to-tl text-white from-fuchsia-200 to-fuchsia-600  hover:bg-gradient-to-tl hover:text-white hover:from-fuchsia-300 hover:to-fuchsia-700 "
            : "bg-gradient-to-tl text-white from-fuchsia-200 to-fuchsia-600 hover:bg-gradient-to-tl hover:text-white hover:from-fuchsia-300 hover:to-fuchsia-700"
        }`}
      >
        <FaPlusSquare className="sidebar-icon" />
        <span className="sidebar-text">Create</span>
      </Link>
    </>
  );

  return (
    <>
      {/* Sidebar element with conditional CSS for translation */}
      {!isBottomNavVisible && (
        <aside
          className={`fixed top-0 left-0 z-40 h-screen shadow-xl  bg-white border-r border-gray-50 dark:bg-fuchsia-950 dark:border-fuchsia-700 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: "300px" }}
          aria-label="Sidebar"
        >
          <div className="px-3 py-3">
            <a href="/" className="flex items-center space-x-3">
              <img src="/buzz.png" alt="BuzzMarkets Logo" className="h-20" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-fuchsia-900 hidden lg:block">
                BuzzMarkets
              </span>
            </a>
          </div>
          <div className="h-full px-3 pb-4 overflow-y-auto">
            <div className="h-full px-3 pb-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
                      router.pathname === "/home"
                        ? "font-black"
                        : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
                    }`}
                    href="/home"
                  >
                    <FaHome size={"20px"} className="mr-3" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group ${
                      router.pathname === "/notifications"
                        ? "font-black"
                        : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
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
                        : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
                    }`}
                    href="/creators"
                  >
                    <FaUsers size={"20px"} className="mr-3" />
                    <span>Creators</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center p-4 text-lg rounded-3xl text-fuchsia-950 group mb-3 ${
                      router.pathname === "/profile"
                        ? "font-black"
                        : "hover:bg-gradient-to-tl hover:text-fuchsia-950 hover:from-fuchsia-50 hover:to-fuchsia-100"
                    }`}
                    href="/profile"
                  >
                    <FaUser size={"20px"} className="mr-3" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center justify-center text-lg  p-4 rounded-3xl text-white   group ${
                      router.pathname === "/create"
                        ? "bg-fuchsia-800 hover:bg-fuchsia-700 text-white "
                        : "hover:bg-fuchsia-700 bg-fuchsia-800 text-white"
                    }`}
                    href="/create"
                  >
                    <FaPlusSquare size={"20px"} className="mr-3" />
                    <span>Create</span>
                  </Link>
                </li>
              </ul>
              {/* Dropdown menu for additional options */}
              <div className="absolute bottom-14 text-lg p-4 w-full flex pr-12 justify-center">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center border-2 border-fuchsia-800 hover:bg-fuchsia-800 hover:text-white bg-transparent text-gray-900 rounded-3xl shadow-sm px-4 py-2 min-w-fit z-10"
                >
                  {isDropdownOpen
                    ? "Close"
                    : user && user.google
                    ? user.google.name
                    : "Loading..."}
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-[-120px] flex flex-col items-center   rounded-3xl p-2 w-48">
                    <button
                      onClick={toggleWalletModal}
                      className="flex items-center p-2 mb-2 bg-fuchsia-800 hover:bg-fuchsia-700 hover:text-white text-white rounded-3xl w-full justify-center"
                    >
                      <FaWallet className="mr-2" /> <span>Wallet</span>
                    </button>
                    <button
                      onClick={logout}
                      className="flex items-center p-2 bg-fuchsia-800 hover:bg-fuchsia-700 hover:text-white text-white rounded-3xl w-full justify-center"
                    >
                      <FaSignOutAlt className="mr-2" /> <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}
      {isBottomNavVisible && (
        <div className="bottom-nav shadow-xl ">{navItems}</div>
      )}
      {user && (
        <Modal
          className=" "
          show={isWalletModalOpen}
          onClose={toggleWalletModal}
          size="md"
        >
          <Modal.Body className="bg-fuchsia-50 rounded-lg  p-6 relative text-fuchsia-950">
            <button
              onClick={toggleWalletModal}
              className="absolute top-3 mt-3 right-3 text-fuchsia-900 hover:text-gray-800"
            >
              <FaTimes size={"20px"} />
            </button>
            <div className="flex items-center mb-4">
              <FaWallet className="text-xl mr-2" />
              <h2 className="text-xl font-semibold">Wallets</h2>
            </div>
            {/* <p className="text-gray-600 mb-4">
              Connect and link wallets to your account.
            </p> */}
            <div className="flex items-center justify-between border rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <FaCircle className="text-2xl text-fuchsia-500 mr-2" />
                <span className="text-gray-700">
                  {user.wallet
                    ? truncateAddress(user.wallet.address)
                    : "No wallet address"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-fuchsia-100 text-fuchsia-500 text-sm font-semibold px-2 py-1 rounded mr-2">
                  Active
                </span>
                <button
                  onClick={() =>
                    user.wallet &&
                    user.wallet.address &&
                    copyToClipboard(user.wallet.address)
                  }
                  className="text-gray-600 hover:text-gray-800"
                >
                  {isCopied ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaClipboard />
                  )}
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
