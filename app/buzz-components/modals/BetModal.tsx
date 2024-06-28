import React, { useState } from "react";

interface BetModalProps {
  isOpenBetModal: boolean;
  setOpenBetModal: (isOpen: boolean) => void;
  selectedBet: {
    postMessage: string;
    username: string;
    userBalance: number;
    creatorAddress: string;
    marketAddress: string;
    option1: string;
    option2: string;
  };
  selectedOptions: {
    label: string;
    multiplier: number;
  };
  traderId: string;
}

const BetModal: React.FC<BetModalProps> = ({
  isOpenBetModal,
  setOpenBetModal,
  selectedBet,
  selectedOptions,
  traderId
}) => {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);
  console.log("SELECTEDBET", selectedBet);

  function onCloseModal() {
    setOpenBetModal(false);
  }

  const handleSubmitBet = async () => {
    const yesAmount = selectedOptions.label === selectedBet.option1 ? toWin() : 0;
    const noAmount = selectedOptions.label === selectedBet.option2 ? toWin() : 0;

    const transactionData = {
      marketId: selectedBet.marketAddress,
      creatorId: selectedBet.creatorAddress,
      traderId,
      transactionId: 'TX-hash', // Replace with actual transactionId
      isMint: true,
      isfinalRedeem: false,
      tokensAmount: betAmount,
      priceBefore: 0,
      priceAfter: 0,
      yesPoolBefore: 0,
      yesPoolAfter: 0,
      noPoolBefore: 0,
      noPoolAfter: 0,
      tokensBurned: 0,
      yesAmount,
      noAmount,
    };

    try {
      const response = await fetch('/api/marketTx/submit-market-tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit transaction');
      }

      const data = await response.json();
      console.log(data);
      setOpenBetModal(false);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  function handleSetAmount(percentage: number) {
    setBetAmount(Math.floor(selectedBet.userBalance * percentage));
  }

  function toWin() {
    return Math.floor(betAmount * selectedOptions.multiplier);
  }

  if (!isOpenBetModal) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 relative m-4">
        <button
          onClick={onCloseModal}
          className="absolute top-3 right-3 text-gray-800 dark:text-gray-200"
        >
          &times;
        </button>
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {selectedBet.postMessage}
          </h3>
          <p className="text-gray-500">Selection: {selectedOptions.label}</p>
          <div className="flex items-center justify-center gap-4 pt-8 w-full">
            <input
              type="number"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              style={{ flex: "3" }}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
            <span
              className="flex-none text-lg font-medium"
              style={{ flex: "1" }}
            >
              {`${selectedOptions.multiplier}x`}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 pb-8">
            <span className="text-gray-500">
              Balance: {selectedBet.userBalance}
            </span>
            <div>
              <button
                className="px-2 py-1 mr-1 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-full text-xs"
                onClick={() => handleSetAmount(1)}
              >
                Max
              </button>
              <button
                className="px-2 py-1 mr-1 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-full text-xs"
                onClick={() => handleSetAmount(0.5)}
              >
                50%
              </button>
              <button
                className="px-2 py-1 mr-1 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-full text-xs"
                onClick={() => handleSetAmount(0.25)}
              >
                25%
              </button>
              <button
                className="px-2 py-1 mr-1 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-full text-xs"
                onClick={() => handleSetAmount(0.1)}
              >
                10%
              </button>
            </div>
          </div>
          <button
            className="w-full px-4 py-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-full"
            onClick={handleSubmitBet}
          >
            Bet {betAmount} {selectedBet.username}
            <p className="text-center text-white text-xs">To Win: {toWin()}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetModal;
