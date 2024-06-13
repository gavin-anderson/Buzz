import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const tableData = [
  {
    user: "Ansem",
    tokenPrice: "$1.64",
    holders: 233,
    markets: 23,
    "24h": "25.5%",
    "7d": "10.2%",
    created: "02/01/2023",
    avatarUrl: "/ansem.jpg",
  },
  {
    user: "Toly",
    tokenPrice: "$2.30",
    holders: 150,
    markets: 15,
    "24h": "15.3%",
    "7d": "5.7%",
    created: "02/01/2023",
    avatarUrl: "/toly.jpg",
  },
  {
    user: "Karate",
    tokenPrice: "$0.84",
    holders: 500,
    markets: 42,
    "24h": "30.0%",
    "7d": "12.5%",
    created: "02/01/2023",
    avatarUrl: "/karate.jpg",
  },
  {
    user: "Michael",
    tokenPrice: "$5.20",
    holders: 120,
    markets: 12,
    "24h": "10.0%",
    "7d": "3.8%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Daniel",
    tokenPrice: "$0.95",
    holders: 300,
    markets: 30,
    "24h": "22.2%",
    "7d": "9.9%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Sophia",
    tokenPrice: "$1.05",
    holders: 205,
    markets: 18,
    "24h": "18.4%",
    "7d": "7.1%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Lucas",
    tokenPrice: "$3.30",
    holders: 180,
    markets: 19,
    "24h": "20.5%",
    "7d": "8.3%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Isabella",
    tokenPrice: "$4.50",
    holders: 222,
    markets: 25,
    "24h": "23.1%",
    "7d": "11.2%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Ethan",
    tokenPrice: "$2.10",
    holders: 210,
    markets: 20,
    "24h": "12.2%",
    "7d": "6.5%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
  {
    user: "Olivia",
    tokenPrice: "$3.75",
    holders: 340,
    markets: 35,
    "24h": "25.0%",
    "7d": "10.0%",
    created: "02/01/2023",
    avatarUrl: "/buzz2.png",
  },
];

const SearchUsers = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = searchText
    ? tableData.filter((item) =>
        item.user.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full p-4">
        <FaSearch
          className="absolute left-7 top-7 text-gray-300 z-10 pointer-events-none"
          size={20}
        />
        <input
          type="text"
          className="pl-10 pr-3 py-2 w-full rounded-full border border-gray-300 text-gray-500 placeholder-gray-400"
          placeholder="Search by user..."
          value={searchText}
          onChange={handleSearchChange}
        />
        {searchText && (
          <FaTimes
            className="absolute right-7 top-7 text-gray-500 cursor-pointer"
            size={20}
            onClick={() => setSearchText("")}
          />
        )}
      </div>
      <div className="w-full px-4">
        {filteredData.map((data, index) => (
          <div key={index} className="w-full p-2">
            <div className="max-w-full w-full rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-xl cursor-pointer">
              <div
                style={{
                  background: `url('/card-bg.svg')`,
                  backgroundSize: "cover",
                }}
                className="p-3 flex justify-center items-end h-32 sm:h-24 relative"
              >
                <img
                  className="rounded-full bg-gradient-to-tl from-fuchsia-800 to-fuchsia-600 absolute -bottom-10 sm:-bottom-12 w-16 sm:w-24 h-16 sm:h-24"
                  src={data.avatarUrl}
                  alt="Profile"
                />
                <div className="absolute left-3 sm:left-6 top-12 transform -translate-y-1/2">
                  <p className="text-xl sm:text-3xl font-semibold">
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
                  {data.user}
                </h2>
                <p className="text-xs sm:text-sm font-normal text-black">
                  @{data.user}
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
                    <div className="text-sm sm:text-md font-semibold">2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
