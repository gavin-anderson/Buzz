import React from "react";
import { FaDollarSign } from "react-icons/fa";

// Sample data for multiple notification cards
const notifications = [
  {
    id: 1,
    winAmount: 1220,
    marketQuestion: "How many rounds will my next fight last?",
    selection: "Under 4.5",
    bet: 488,
    avatarUrl: "/ansem.jpg",
    tokenName: "ANSEM",
  },
  {
    id: 2,
    winAmount: 80,
    marketQuestion: "Will Boden flip Mother before June 15th, 2024",
    selection: "Yes",
    bet: 40,
    avatarUrl: "/toly.jpg",
    tokenName: "TOLY",
  },
  {
    id: 3,
    winAmount: 1450,
    marketQuestion:
      "Will Gordon Ryan fight in the KC pit before August 1st, 2024",
    selection: "No",
    bet: 467,
    avatarUrl: "/karate.jpg",
    tokenName: "KARATE",
  },
  {
    id: 4,
    winAmount: 120,
    marketQuestion: "will oil prices drop?",
    selection: "Yes",
    bet: 90,
    avatarUrl: "/buzz2.png",
  },
  {
    id: 5,
    winAmount: 245,
    marketQuestion: "will interest rates go up?",
    selection: "No",
    bet: 130,
    avatarUrl: "/buzz2.png",
  },
  {
    id: 6,
    winAmount: 190,
    marketQuestion: "will gold prices fall?",
    selection: "Yes",
    bet: 110,
    avatarUrl: "/buzz2.png",
  },
  {
    id: 7,
    winAmount: 275,
    marketQuestion: "will crypto recover soon?",
    selection: "No",
    bet: 160,
    avatarUrl: "/buzz2.png",
  },
];

const NotificationRow = () => {
  return (
    <>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white shadow-md hover:shadow-xl hover:cursor-pointer rounded-lg p-4 mb-4 w-full mx-auto"
        >
          <div className="flex justify-between items-start space-x-3">
            <div className="flex space-x-3">
              <div className="rounded-full">
                <FaDollarSign size={"50px"} className="mt-2 text-fuchsia-800" />
              </div>
              <img
                src={notification.avatarUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full bg-fuchsia-800 object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="text-lg font-semibold">
                You Won {notification.winAmount} {notification.tokenName}
              </p>
              <p className="text-sm text-gray-600">
                Market: "{notification.marketQuestion}"
              </p>
              <p className="text-sm text-gray-600">
                Selection: "{notification.selection}"
              </p>
              <p className="text-sm text-gray-600">Bet: {notification.bet}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationRow;
