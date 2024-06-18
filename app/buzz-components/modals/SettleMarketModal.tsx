import React, { useState } from 'react';

interface MarketOption {
  label: string;
  value: string;
}

interface SettleMarketModalProps {
  isOpen: boolean;
  options: MarketOption[];
  onClose: () => void;
  onSubmit: (winner: string, message: string) => void;
}

const SettleMarketModal: React.FC<SettleMarketModalProps> = ({ isOpen, options, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    const selectedLabel = options.find(option => option.value === selectedValue)?.label || '';
    setSelectedOption(selectedLabel);  // Store the label instead of the value
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption, message);  // Pass the label as 'winner'
    } else {
      alert('Please select a winner.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative m-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-800"
          style={{ background: 'transparent', border: 'none', fontSize: '1.5rem' }}
        >
          &times;
        </button>
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900">
            Settle Market
          </h2>
          <textarea
            placeholder="Enter your message..."
            value={message}
            onChange={handleMessageChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring focus:ring-fuchsia-500 focus:ring-opacity-50"
          />
          {options.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="marketOption"
                value={option.value}
                checked={selectedOption === option.label}  // Check against label
                onChange={handleOptionChange}
                className="form-radio"
              />
              <span className="text-gray-900">{option.label}</span>
            </label>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-fuchsia-800 rounded-xl text-white hover:bg-fuchsia-900"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleMarketModal;
