import MainContainer from "@/app/buzz-components/MainContainer";
import { FaCommentsDollar, FaHistory, FaHandHoldingUsd } from "react-icons/fa";
import { Tabs } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";

const Create = () => {
  return (
    <MainContainer>
      <div className="w-full max-w-4xl">
        {/* Profile section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full p-16 rounded-3xl bg-fuchsia-200">
          <div className="flex items-center space-x-4">
            <img
              src="buzz2.png"
              alt="Profile"
              className="w-20 h-20 bg-fuchsia-900 rounded-full"
            />
            <div className="text-left">
              <h2 className="font-bold text-xl text-fuchsia-900">Malcolm</h2>
              <p className="text-fuchsia-700">@malcolm</p>
              <div className="text-sm text-gray-600">
                <span>117 Holders</span> · <span>12 Holding</span>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <button className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white rounded-xl">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full mt-6 border-2 border-fuchsia-900 p-6 rounded-3xl shadow-md">
          <Tabs aria-label="Profile and settings tabs " style="fullWidth">
            <Tabs.Item
              active
              title="Markets"
              icon={FaCommentsDollar}
              className="text-fuchsia-900 hover:text-fuchsia-700 "
            >
              <div className="p-4 text-gray-800 dark:text-white">
                This is the Markets tab's associated content. Here you can view
                and participate in active markets.
              </div>
            </Tabs.Item>
            <Tabs.Item
              title="History"
              icon={FaHistory}
              className="text-fuchsia-900 hover:text-fuchsia-700 "
            >
              <div className="p-4 text-gray-800 dark:text-white">
                This is the History tab's associated content. Here you can view
                past transactions and activities.
              </div>
            </Tabs.Item>
            <Tabs.Item
              title="Holdings"
              icon={FaHandHoldingUsd}
              className="text-fuchsia-900 hover:text-fuchsia-700"
            >
              <div className="p-4 text-gray-800 dark:text-white">
                This is the Holdings tab's associated content. This tab shows
                your current holdings and investments.
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </MainContainer>
  );
};

export default Create;
