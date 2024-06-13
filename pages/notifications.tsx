import MainContainer from "@/app/buzz-components/MainContainer";
import { FaFire, FaAt } from "react-icons/fa"; // Import icons for All and Mentions
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

import NotificationRow from "@/app/buzz-components/notifications/NotificationRow";
import { useRouter } from "next/router";

const Notifications = () => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const [activeTab, setActiveTab] = useState("all"); // Default active tab is 'all'
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
                  { name: "All", icon: FaFire },
                  { name: "Mentions", icon: FaAt },
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
              {activeTab === "all" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <NotificationRow />
                  {/* Placeholder for All content */}
                </div>
              )}
              {activeTab === "mentions" && (
                <div
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  role="tabpanel"
                >
                  <h1>Placeholder</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default Notifications;
