import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";

interface UserData {
  username: string;
  profileName: string;
  tokenPrice: string;
  holders: number;
  markets: number;
  liveMarkets:number;
  "24h": string;
  "7d": string;
  created: string;
}


interface PopularCreatorsTableProps {
  tableData: UserData[];
}

const PopularCreatorsTable: React.FC<PopularCreatorsTableProps> = ({ tableData }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {tableData.map((data, index) => (
        <div key={index} className="w-1/2 p-2">
          <div className="max-w-sm w-full rounded-3xl bg-white overflow-hidden hover:shadow-xl hover:cursor-pointer shadow-sm m-auto">
            <div
              style={{
                background: `url('/card-bg.svg')`,
                backgroundSize: "cover",
              }}
              className="p-3 flex justify-center items-end h-32 sm:h-24 relative"
            >
              {/* <img
                className="rounded-full bg-gradient-to-tl from-fuchsia-800 to-fuchsia-600 absolute -bottom-10 sm:-bottom-12 w-16 sm:w-24 h-16 sm:h-24"
                src={data.avatarUrl}
                alt="Profile"
              /> */}
              <div className="absolute left-3 sm:left-6 top-12 transform -translate-y-1/2 ">
                <p className="text-xl sm:text-3xl font-semibold items-baseline">
                  <span className="text-black">{data.tokenPrice}</span>
                </p>
                <span className="text-xs sm:text-sm font-light text-green-500 ml-1">
                  +{data["24h"]}
                </span>
              </div>
              <div className="absolute right-1 sm:right-2 top-8 transform -translate-y-1/2 text-black">
                <p className="text-xs sm:text-sm text-black font-normal mt-1 sm:mt-2 bg-fuchsia-50 px-2 sm:px-3 py-1 rounded-full">
                  {data.created}
                </p>
              </div>
            </div>
            <div className="bg-white text-center p-3 sm:p-4 mt-8 sm:mt-10 flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {data.profileName}
              </h2>
              <p className="text-xs sm:text-sm font-normal text-black">
                {data.username}
              </p>
              <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                <div className="px-2 sm:px-4 py-2">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Holders
                  </div>
                  <div className="text-sm sm:text-md font-semibold">
                    {data.holders}
                  </div>
                </div>
                <div className="px-2 sm:px-4 py-2">
                  <div className="text-xs sm:text-sm text-gray-400">
                    Markets
                  </div>
                  <div className="text-sm sm:text-md font-semibold">
                    {data.markets}
                  </div>
                </div>
                <div className="px-2 sm:px-4 py-2">
                  <div className="text-xs sm:text-sm text-gray-400">Live</div>
                  <div className="text-sm sm:text-md font-semibold">{data.liveMarkets}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default PopularCreatorsTable;
