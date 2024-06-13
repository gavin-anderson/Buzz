import { useState } from "react";
import { FaUpload } from "react-icons/fa";

const CreateMarketModal = ({ isOpenCreateModal, setOpenCreateModal }) => {
  const [marketInfo, setMarketInfo] = useState({
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

  function handleChange(e) {
    const { name, value } = e.target;
    setMarketInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              onClick={() => console.log("Launching Market...", marketInfo)}
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
