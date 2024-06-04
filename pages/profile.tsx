import MainContainer from "@/app/buzz-components/MainContainer";
import {
  FaChartLine,
  FaExchangeAlt,
  FaWallet,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { FaRegClock } from "react-icons/fa6";
import TransactionCard from "@/app/buzz-components/profile-tabs/transactions/TransactionCard";
import HoldersTable from "@/app/buzz-components/profile-tabs/holders/HoldersTable";
import NewMarketCard from "@/app/buzz-components/profile-tabs/markets/NewMarketCard";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("markets");
  const { user } = usePrivy();
  console.log(user, "User Data");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <MainContainer>
      {user && (
        <div className="w-full max-w-4xl">
          <div
            style={{
              background: `url('/card-bg.svg')`,
              backgroundSize: "cover",
            }}
            className="flex flex-wrap flex-col md:flex-row md:justify-between items-center w-full p-4 md:p-8 bg-fuchsia-50 shadow-lg rounded-3xl"
          >
            <div className="flex items-center flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <img
                src="/buzz2.png" // Update the path to your actual profile image
                alt="Profile"
                className="w-12 h-12 md:w-20 md:h-20 bg-fuchsia-900 object-cover rounded-full"
              />
              <div className="text-center md:text-left">
                <h2 className="text-sm md:text-lg font-bold text-gray-900">
                  Malcolm
                </h2>
                <p className="text-xs md:text-base text-gray-500">@malcolm</p>
                <div className="flex justify-center md:justify-start space-x-2 md:space-x-4 mt-1 md:mt-4">
                  <div className="text-center">
                    <p className="text-xs md:text-lg font-semibold text-gray-900">
                      12
                    </p>
                    <p className="text-xs text-gray-600">Holding</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-lg font-semibold text-gray-900">
                      117
                    </p>
                    <p className="text-xs text-gray-600">Holders</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
              <button className="px-4 py-2 text-white bg-fuchsia-800 hover:bg-fuchsia-900 rounded-lg text-xs md:text-sm flex items-center">
                Edit Profile
              </button>
              <div className="text-center md:text-right mt-2 md:mt-4">
                <p className="text-sm md:text-lg font-semibold text-gray-900">
                  $1.87
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  $111.87 Earned
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div>
            <div className="mb-4 mt-6 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex justify-between -mb-px font-medium text-center overflow-hidden"
                role="tablist"
              >
                {[
                  { name: "Markets", icon: FaChartLine },
                  { name: "Transactions", icon: FaExchangeAlt },
                  { name: "Holdings", icon: FaWallet },
                  { name: "Holders", icon: FaUsers },
                ].map(({ name, icon: Icon }) => (
                  <li className="flex-1 min-w-0" role="presentation" key={name}>
                    <button
                      className={`inline-flex items-center justify-center p-3 border-b-2 text-xs sm:text-sm md:text-md text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300 rounded-t-lg w-full ${
                        activeTab === name.toLowerCase()
                          ? "text-gray-900 border-gray-900"
                          : ""
                      }`}
                      onClick={() => handleTabClick(name.toLowerCase())}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === name.toLowerCase()}
                      style={{ flex: "1 0 auto" }} // Add this line
                    >
                      <Icon className="mr-2" />
                      <span>{name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {activeTab === "markets" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <NewMarketCard></NewMarketCard>
                </div>
              )}
              {activeTab === "transactions" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <TransactionCard></TransactionCard>
                </div>
              )}
              {activeTab === "holdings" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placeholder content for Holdings.
                  </p>
                </div>
              )}
              {activeTab === "holders" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 "
                  role="tabpanel"
                >
                  <HoldersTable></HoldersTable>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default Profile;
