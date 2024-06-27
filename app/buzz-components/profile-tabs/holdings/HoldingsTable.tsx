import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useUser } from "../../../../contexts/UserContext";

interface UserHoldings {
  username: string;
  tokenId: string;
  priceEth: string;
  priceUSD: string;
  volume: number;
}

interface HoldingsTableProps {
  holdingDetails: UserHoldings[];
}

interface TokenOwnedEntry {
  tokenId: string;
  amount: number;
}

function getAmountForToken(tokenId: string, tokensOwned: TokenOwnedEntry[]): number {
  const tokenEntry = tokensOwned.find(entry => entry.tokenId === tokenId);
  return tokenEntry ? tokenEntry.amount : 0;
}

const HoldingsTable = ({ holdingDetails }: HoldingsTableProps) => {
  const [data, setData] = useState<UserHoldings[]>(holdingDetails || []);
  const [searchText, setSearchText] = useState("");
  const [visibleData, setVisibleData] = useState<UserHoldings[]>([]);
  const itemsPerPage = 9;
  const [lastItemIndex, setLastItemIndex] = useState(itemsPerPage);
  const userInfo = useUser();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const filteredData = data.filter(item =>
        item.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setVisibleData(filteredData.slice(0, lastItemIndex));
    }
  }, [searchText, lastItemIndex, data]);

  useEffect(() => {
    setData(holdingDetails);  // Update data whenever holdingDetails prop changes
  }, [holdingDetails]);

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Load more data if not at the end of data
        setLastItemIndex(prevLastItemIndex =>
          Math.min(prevLastItemIndex + itemsPerPage, data.length)
        );
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setLastItemIndex(itemsPerPage); // Reset to initial amount of visible items on search
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg p-4 bg-fuchsia-100">
      <div className="flex items-center w-full mb-4">
        <FaSearch
          className="absolute left-7 text-gray-300 z-10 pointer-events-none"
          size={20}
        />
        <input
          type="text"
          className="border border-gray-300 text-gray-500 w-full rounded-3xl pl-10 pr-3"
          placeholder="Search by user..."
          value={searchText}
          onChange={handleSearchChange}
        />
        {searchText && (
          <FaTimes
            className="absolute right-3 text-gray-500 cursor-pointer"
            onClick={() => setSearchText("")}
          />
        )}
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
                      src={"../buzz2.png"}
                      alt="Profile"
                      className="w-8 h-8 mr-3 bg-fuchsia-900 object-cover rounded-full"
                    />
                    {item.username}
                  </div>
                </td>
                <td className="px-6 py-2 md:px-10 whitespace-nowrap">
                  {item.priceUSD}
                </td>
                <td className="px-4 py-2 whitespace-nowrap"> {getAmountForToken(item.tokenId, userInfo?.tokensOwned ?? [])}</td>
                <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                  {item.volume}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {1 > 0 ? (
                    <span className="text-green-500 ">{1}</span>
                  ) : (
                    <span className="text-red-500 ">{1}</span>
                  )}
                </td>
                <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                  {/* {item.firstBought} */}
                  First Bought
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

export default HoldingsTable;
