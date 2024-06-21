import React, { useState } from "react";
import {
  FaUser,
  FaRegUser,
  FaComment,
  FaRegComment,
  FaChartBar,
  FaRegChartBar,
} from "react-icons/fa";
import SettleMarketModal from "../../modals/SettleMarketModal";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from '../../../../contexts/UserContext';

type UsersMarketsData = {
  creatorAddress: string;
  marketAddress: string;
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
};

type MarketOption = {
  label: string;
  value: string;
};

interface NewMarketCardProps {
  usersMarketData: UsersMarketsData[];
}

const PersonalMarketsCard = ({ usersMarketData }: NewMarketCardProps) => {
  const router = useRouter();
  const { user } = usePrivy();
  const userInfo = useUser();
  const isProfile = router.pathname === "/profile";
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [isOpenVolume, setIsOpenVolume] = useState(false);
  const [isOpenBettor, setIsOpenBettor] = useState(false);
  const [selectedMarketOptions, setSelectedMarketOptions] = useState<MarketOption[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<UsersMarketsData | null>(null);

  console.log("USERINFO", JSON.stringify(userInfo));
  const handleOpenModal = (card: UsersMarketsData) => {
    setSelectedMarketOptions([
      { label: card.option1, value: "option1" },
      { label: card.option2, value: "option2" }
    ]);
    setSelectedMarket(card);
    setModalOpen(true);
  };

  return (
    <>
      {selectedMarket && (
        <SettleMarketModal
          isOpen={modalOpen}
          options={selectedMarketOptions}
          onClose={() => setModalOpen(false)}
          onSubmit={()=> setModalOpen(false)}
          creatorAddress={String(user?.wallet?.address)}
          marketAddress={selectedMarket.marketAddress}
        />
      )}
      <div className="space-y-5">
        {usersMarketData.map((card, index) => (
          <div key={index} className="border border-gray-200 shadow rounded-3xl p-4 max-w-full">
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
                  onClick={() => handleOpenModal(card)}
                >
                  Settle Market
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsOpenBettor(!isOpenBettor)}
                  className="text-xs pr-4 flex items-center"
                >
                  {isOpenBettor ? (
                    <FaUser className="mr-1 hover:fill-current text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegUser className="mr-1 hover:fill-current text-gray-500 cursor-pointer" />
                  )}
                  {card.totalBettors}
                </button>
                <button
                  onClick={() => setIsOpenComments(!isOpenComments)}
                  className="text-xs pr-4 flex items-center"
                >
                  {isOpenComments ? (
                    <FaComment className="mr-1 text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegComment className="mr-1 text-gray-500 cursor-pointer" />
                  )}
                  {card.totalComments}
                </button>
                <button
                  onClick={() => setIsOpenVolume(!isOpenVolume)}
                  className="text-xs pr-4 flex items-center"
                >
                  {isOpenVolume ? (
                    <FaChartBar className="mr-1 hover:fill-current text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegChartBar className="mr-1 hover:fill-current text-gray-500 cursor-pointer" />
                  )}
                  {card.totalVolume}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PersonalMarketsCard;
