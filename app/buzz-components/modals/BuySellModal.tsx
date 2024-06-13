import React, { useState, useEffect } from "react";
import { FaDollarSign, FaEthereum, FaHandHoldingUsd } from "react-icons/fa"; // Ensure icons are imported

const BuySell = ({
  isOpenBuySellModal,
  setOpenBuySellModal,
  buyToken,
  selectedBet,
}) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [buyAmount, setBuyAmount] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);

  useEffect(() => {
    const eth = parseFloat(ethAmount); // Convert ethAmount to a floating-point number
    if (eth === 0.1) {
      setBuyAmount(967);
    }
  }, [ethAmount]); // Effect will run when ethAmount changes

  const handleSubmitBet = () => {
    buyToken("@karateCombat");
    setOpenBuySellModal(false);
  };

  const handleMaxEth = () => {
    setEthAmount("0.01");
  };
  const handleEthChange = (e) => {
    setEthAmount(e.target.value);
  };

  const handleSell = () => {
    alert("Sell functionality is disabled.");
  };

  if (!isOpenBuySellModal) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 relative m-4">
        <button
          onClick={() => setOpenBuySellModal(false)}
          className="absolute top-3 right-3 text-gray-800 dark:text-gray-200"
        >
          &times;
        </button>
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex justify-between -mb-px font-medium text-center overflow-hidden">
            {[
              { name: "Buy", icon: FaDollarSign },
              { name: "Sell", icon: FaHandHoldingUsd },
            ].map(({ name, icon: Icon }) => (
              <li className="flex-1 min-w-0" key={name}>
                <button
                  className={`inline-flex items-center justify-center p-4 border-b-2 text-xs sm:text-sm md:text-md ${
                    activeTab === name.toLowerCase()
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-500 border-gray-100 hover:text-gray-600 hover:border-gray-300"
                  } rounded-t-lg w-full`}
                  onClick={() => setActiveTab(name.toLowerCase())}
                  type="button"
                  aria-selected={activeTab === name.toLowerCase()}
                >
                  <Icon className="mr-2" />
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {activeTab === "buy" && (
          <div className="flex flex-col items-center p-5 bg-white rounded-lg shadow-md max-w-sm mx-auto">
            <div className="relative w-full mb-4">
              <input
                type="number"
                value={ethAmount}
                onChange={handleEthChange}
                className="w-full pl-0 pr-48 py-2 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                <FaEthereum className="text-fuchsia-800" size={24} />
                <span className="ml-1 text-sm text-fuchsia-800">ETH</span>
              </div>
            </div>
            <div className="text-sm mb-5">Balance: 0.15</div>
            <button
              onClick={handleMaxEth}
              className="absolute right-20 mr-12 mt-1.5 top-40 text-fuchsia-800  py-1 px-3 rounded-full text-md font-bold"
            >
              Max
            </button>

            <div className="flex items-center w-full mb-4 mt-8 bg-fuchsia-50 p-3 rounded-xl justify-between">
              <div className="text-lg ml-5 font-bold">{buyAmount}</div>
              <div className="flex items-center">
                <img
                  src="/karate.jpg" // Replace with actual image path
                  alt="Profile Avatar"
                  className="w-10 h-10 mr-3 rounded-full" // Adjust width and height as necessary
                />
                <div className="text-sm">
                  <div className="font-bold">karateCombat</div>
                  <div>Balance: 0</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitBet}
              className="w-full py-2 bg-fuchsia-800 text-white rounded-full"
            >
              Buy
            </button>
          </div>
        )}
        {activeTab === "sell" && (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div style={{ marginBottom: "20px" }}>
              <input
                type="number"
                value={ethAmount}
                onChange={handleEthChange}
                style={{ width: "100%", padding: "10px", margin: "10px 0" }}
              />
            </div>
            <button
              onClick={handleSell}
              style={{
                width: "100%",
                background: "purple",
                color: "white",
                border: "none",
                padding: "15px 0",
                cursor: "pointer",
              }}
            >
              Sell
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySell;
