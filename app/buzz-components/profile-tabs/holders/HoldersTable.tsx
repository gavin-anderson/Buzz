import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const HoldersTable = ({}) => {
  const tableData = [
    {
      user: "John",
      tokenPrice: "$1.64",
      amount: 778,
      volume: 2134,
      pnl: 178,
      firstBought: "July 1, 2023",
    },
    {
      user: "Adam",
      tokenPrice: "$0.13",
      amount: 654,
      volume: 3255,
      pnl: 54,
      firstBought: "July 3, 2023",
    },
    {
      user: "Tina",
      tokenPrice: "$10.33",
      amount: 555,
      volume: 233,
      pnl: 510,
      firstBought: "May 7, 2024",
    },
    {
      user: "Gavin",
      tokenPrice: "$1.11",
      amount: 534,
      volume: 18,
      pnl: 54,
      firstBought: "April 21, 2023",
    },
    {
      user: "Betty",
      tokenPrice: "$0.05",
      amount: 501,
      volume: 8122,
      pnl: 1,
      firstBought: "Sept 19, 2023",
    },
    {
      user: "Arsh",
      tokenPrice: "$0.02",
      amount: 123,
      volume: 122,
      pnl: 13,
      firstBought: "Jan 29, 2023",
    },
    {
      user: "John",
      tokenPrice: "$8.2",
      amount: 29,
      volume: 2444,
      pnl: 0,
      firstBought: "July 1st, 2023",
    },
    {
      user: "Maria",
      tokenPrice: "$5.20",
      amount: 312,
      volume: 411,
      pnl: 150,
      firstBought: "June 12, 2023",
    },
    {
      user: "Steve",
      tokenPrice: "$0.90",
      amount: 866,
      volume: 980,
      pnl: 88,
      firstBought: "August 22, 2023",
    },
    {
      user: "Lucy",
      tokenPrice: "$7.35",
      amount: 413,
      volume: 487,
      pnl: 201,
      firstBought: "March 15, 2024",
    },
    {
      user: "Donna",
      tokenPrice: "$1.25",
      amount: 645,
      volume: 832,
      pnl: 67,
      firstBought: "January 10, 2023",
    },
    {
      user: "Robert",
      tokenPrice: "$3.40",
      amount: 220,
      volume: 350,
      pnl: 300,
      firstBought: "December 5, 2022",
    },
  ];

  const [data, setData] = useState(tableData);
  const [searchText, setSearchText] = useState("");
  const [visibleData, setVisibleData] = useState([]);
  const itemsPerPage = 9;
  const [lastItemIndex, setLastItemIndex] = useState(itemsPerPage);
  const tableRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      // Load more data if not at the end of data
      setLastItemIndex((prevLastItemIndex) =>
        Math.min(prevLastItemIndex + itemsPerPage, data.length)
      );
    }
  };

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.user.toLowerCase().includes(searchText.toLowerCase())
    );
    setVisibleData(filteredData.slice(0, lastItemIndex));
  }, [searchText, lastItemIndex, data]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setLastItemIndex(itemsPerPage); // Reset to initial amount of visible items on search
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg p-4 bg-fuchsia-100">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-fuchsia-700">Search Holders</span>
        <div className="flex items-center">
          <input
            type="text"
            className="border border-fuchsia-600 text-fuchsia-800 w-full max-w-xs rounded-3xl"
            placeholder="Search by user..."
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <FaTimes
              className="ml-2 text-gray-500 cursor-pointer"
              onClick={() => setSearchText("")}
            />
          )}
        </div>
      </div>
      <div
        className="overflow-auto relative shadow-md sm:rounded-lg"
        style={{ maxHeight: "calc(3.5rem * 9)" }}
        ref={tableRef}
        onScroll={handleScroll}
      >
        <table className="table-auto w-full text-left text-sm text-gray-500">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-6 py-2 md:px-10 ">Token Price</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2 hidden md:table-cell">Volume</th>
              <th className="px-4 py-2">PNL</th>
              <th className="px-4 py-2 hidden md:table-cell">First Bought</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/buzz2.png"
                      alt="Profile"
                      className="w-8 h-8 mr-3 bg-fuchsia-900 object-cover rounded-full"
                    />
                    {item.user}
                  </div>
                </td>
                <td className="px-6 py-2 md:px-10 whitespace-nowrap">
                  {item.tokenPrice}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{item.amount}</td>
                <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                  {item.volume}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{item.pnl}</td>
                <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                  {item.firstBought}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button className="text-xs bg-fuchsia-800 px-3 py-1 rounded-2xl text-white">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldersTable;
