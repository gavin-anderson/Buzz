import { useState } from "react";
import { FaUpload } from "react-icons/fa";

const CreateMarketPreview = ({marketInfo}) => {
  return (
    <div className="border border-gray-200 shadow rounded-3xl p-4 max-w-full space-y-4">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Create Market
      </h3>
      <input
        type="text"
        className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
        placeholder="What are your holders betting on?"
        name="title"
        value={marketInfo.title}
        
      />
      {marketInfo.title && (
        <>
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
            placeholder="Option 1"
            name="option1"
            value={marketInfo.option1}
            
          />
          <input
            type="text"
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
            placeholder="Option 2"
            name="option2"
            value={marketInfo.option2}
            
          />
          <div className="flex flex-col p-4 bg-fuchsia-50 rounded-3xl">
            <label className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Market Length
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-white">
                  Days
                </label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-gray-300 rounded-3xl"
                  name="days"
                  value={marketInfo.days}
                  
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-white">
                  Hours
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-1 text-center border border-gray-300 rounded-3xl"
                  name="hours"
                  value={marketInfo.hours}
                  
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-white">
                  Minutes
                </label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-gray-300 rounded-3xl"
                  name="minutes"
                  value={marketInfo.minutes}
                  
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center space-x-2 mt-4">
            <button
              type="button"
              className="p-3 rounded-xl text-gray-900 hover:bg-fuchsia-900 hover:text-white flex items-center"
              onClick={() => console.log("Uploading Picture...")}
            >
              <FaUpload />
            </button>
            <button
              type="button"
              className="flex-grow px-4 py-2 bg-fuchsia-800 rounded-xl text-white hover:bg-fuchsia-900"
              onClick={() => console.log("Launching Market...", marketInfo)}
            >
              Launch Market
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateMarketPreview;
