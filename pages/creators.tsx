import MainContainer from "@/app/buzz-components/MainContainer";
import { FaFire, FaRegClock } from "react-icons/fa"; // Import icons for Popular and New
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import PopularCreatorsTable from "@/app/buzz-components/creator-tabs/PopularCreatorsTable";
import HoldersTable from "@/app/buzz-components/profile-tabs/holders/HoldersTable";

const Creators = () => {
  const [activeTab, setActiveTab] = useState("popular"); // Default active tab
  const { user } = usePrivy();
  console.log(user, "User Data");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <MainContainer>
      {user && (
        <div className="w-full max-w-4xl">
          {/* Tabs Section */}
          <div>
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex justify-between -mb-px font-medium text-center overflow-hidden"
                role="tablist"
              >
                {[
                  { name: "Popular", icon: FaFire },
                  { name: "New", icon: FaRegClock },
                ].map(({ name, icon: Icon }) => (
                  <li className="flex-1 min-w-0" role="presentation" key={name}>
                    <button
                      className={`inline-flex items-center justify-center p-4 border-b-2 text-xs sm:text-sm md:text-md text-gray-500 hover:text-gray-600 border-gray-100 hover:border-gray-300 rounded-t-lg w-full ${
                        activeTab === name.toLowerCase()
                          ? "text-gray-900 border-gray-900"
                          : ""
                      }`}
                      onClick={() => handleTabClick(name.toLowerCase())}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === name.toLowerCase()}
                    >
                      <Icon className="mr-2" />
                      <span>{name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {activeTab === "popular" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <PopularCreatorsTable />
                  {/* Placeholder for Popular content */}
                </div>
              )}
              {activeTab === "new" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placeholder content for New.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default Creators;
