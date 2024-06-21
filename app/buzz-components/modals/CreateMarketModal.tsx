import { useState, ChangeEvent } from "react";
import { FaUpload } from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";

interface CreateMarketModalProps {
  isOpenCreateModal: boolean;
  setOpenCreateModal: (isOpen: boolean) => void;
}

interface MarketInfo {
  title: string;
  option1: string;
  option2: string;
  days: number;
  hours: number;
  minutes: number;
}

const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ isOpenCreateModal, setOpenCreateModal }) => {
  const { ready, authenticated, user } = usePrivy();
  const [marketInfo, setMarketInfo] = useState<MarketInfo>({
    title: "",
    option1: "",
    option2: "",
    days: 1,
    hours: 0,
    minutes: 0,
  });

  function onCloseModal() {
    setOpenCreateModal(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setMarketInfo((prev) => ({
      ...prev,
      [name]: name === 'days' || name === 'hours' || name === 'minutes' ? parseInt(value) : value,
    }));
  }

  async function handleSubmit() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + marketInfo.days);
    expiry.setHours(expiry.getHours() + marketInfo.hours);
    expiry.setMinutes(expiry.getMinutes() + marketInfo.minutes);

    const marketData = {
      creatorAddress: user?.wallet?.address || '',
      marketAddress: expiry.toISOString(),
      marketType: "Binary",
      postMessage: marketInfo.title,
      options: [
        { A: marketInfo.option1, B: marketInfo.option2 }
      ],
      totalComments: 0,
      totalVolume: 0,
      totalBettors: 0,
      K: 0,
      expiry,
      isSettled: false,
      settledAt: null,
      settleMessage: null,
      supplyChange: 0,
      reportedValue: null,
      isReportedValue: false,
      claimed: 0,
      unclaimed: 0,
      createdAt: new Date(),
      bettors: [],
      comments: [],
    };

    try {
      const response = await fetch('/api/createMarket/create-market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const result = await response.json();
      console.log('Market created successfully:', result);
      onCloseModal();
    } catch (error) {
      console.error('Error creating market:', error);
    }
  }

  if (!isOpenCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-6 relative m-4">
        <button
          onClick={onCloseModal}
          className="absolute top-3 right-3 text-gray-800 dark:text-gray-200"
        >
          &times;
        </button>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create Market
          </h3>
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
            placeholder="What are your holders betting on?"
            name="title"
            value={marketInfo.title}
            onChange={handleChange}
          />
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
            placeholder="Option 1"
            name="option1"
            value={marketInfo.option1}
            onChange={handleChange}
          />
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
            placeholder="Option 2"
            name="option2"
            value={marketInfo.option2}
            onChange={handleChange}
          />
          <div className="flex gap-2 justify-between p-4 bg-fuchsia-50 rounded-3xl">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Market Length
              </label>
              <div className="flex gap-2 justify-between mt-4">
                <div>
                  <label className="block ml-2 text-xs font-medium text-gray-500 dark:text-white">
                    Days
                  </label>
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded-3xl"
                    name="days"
                    value={marketInfo.days}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block ml-2 text-xs font-medium text-gray-500 dark:text-white">
                    Hours
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-1 text-center border border-gray-300 rounded-3xl"
                    name="hours"
                    value={marketInfo.hours}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block ml-2 text-xs font-medium text-gray-500 dark:text-white">
                    Minutes
                  </label>
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded-3xl"
                    name="minutes"
                    value={marketInfo.minutes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center space-x-2">
            <button
              type="button"
              className="p-3  rounded-xl text-gray-900 hover:bg-fuchsia-900 hover:text-white flex items-center"
              onClick={() => console.log("Uploading Picture...")}
            >
              <FaUpload className="" />
            </button>
            <button
              type="button"
              className="flex-grow px-4 py-2 bg-fuchsia-800 rounded-xl text-white hover:bg-fuchsia-900"
              onClick={handleSubmit}
            >
              Launch Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMarketModal;
