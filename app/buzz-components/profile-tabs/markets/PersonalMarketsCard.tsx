import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaRegUser,
  FaComment,
  FaRegComment,
  FaChartBar,
  FaRegChartBar,
} from "react-icons/fa";
import CreateMarketPreview from "./CreateMarketPreview";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from '../../../../contexts/UserContext';

type UsersMarketsData = {
  postMessage: string;
  option1: string;
  option2: string;
  totalComments: number;
  totalVolume: number;
  totalBettors: number;
  isSettled: boolean;
  settledAt: string;
  settleMessage: string;
  postedAgo: string;
  comments: string[];
}

interface NewMarketCardProps {
  usersMarketData: UsersMarketsData[];
}

const PersonalMarketsCard = ({ usersMarketData }: NewMarketCardProps) => {
  const router = useRouter();
  const { user } = usePrivy();
  const userInfo = useUser();
  const isProfile = router.pathname === "/profile";

  const [selectedOptions, setSelectedOptions] = useState<string | undefined>();

  useEffect(() => {
    console.log("Selected options changed:", selectedOptions);
  }, [selectedOptions]);

  const handleOptionsModal = (option: string) => {
    setSelectedOptions(option);
  };

  return (
    <>
      <div className="space-y-5">
        {!isProfile && <CreateMarketPreview marketInfo={null} />}

        {usersMarketData.map((card, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow rounded-3xl p-4 max-w-full"
          >
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={"../buzz2.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full bg-fuchsia-800 object-cover"
              />
              <div>
                <p className="font-bold">
                  <span className="text-fuchsia-800">{userInfo?.username}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Posted {card.postedAgo}
                </p>
              </div>
            </div>
            <div className="text-sm text-fuchsia-950 mb-4 text-center font-semibold">
              <p className="text-sm font-semibold">{card.postMessage}</p>
            </div>
            <div className="mt-2 text-center">
              <p className="text-gray-700">{card.isSettled ? "Options were:" : "Options are:"}</p>
              <p className="font-semibold inline mx-2">{card.option1}</p>
              <p className="font-semibold inline mx-2">{card.option2}</p>
            </div>
            {card.isSettled ? (
              <p className="text-center text-gray-500 italic mt-4">{card.settleMessage}</p>
            ) : (
              <div className="text-center mt-4">
                <button
                  className="bg-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-400"
                  onClick={() => console.log("Settle Market")}
                >
                  Settle Market
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonalMarketsCard;
