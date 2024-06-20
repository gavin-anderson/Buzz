import { useEffect, useState } from "react";
import {
  FaRegClock,
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegHandshake,
  FaRegChartBar,
  FaUser,
  FaRegUser,
  FaComment,
  FaChartBar,
  FaUpload,
} from "react-icons/fa";
import BetModal from "../modals/BetModal";
import CreateMarketPreview from "./CreateMarketPreview";
import { useRouter } from "next/router";
import BuySell from "../modals/BuySellModal";

interface CommentData {
  userId: string;
  marketId: string;
  commentId: string;
  comment: string;
  yesHeld: number;
  noHeld: number;
  isReply: boolean;
  replyId: string;
  user: {
    username: string;
    profileName: string;
  } | null;
}

interface MarketData {
  username: string;
  creatorAddress: string;
  marketAddress: string;
  postMessage: string;
  option1: string;
  option2: string;
  totalComments: number;
  totalVolume: number;
  totalBettors: number;
  isTokenOwned: boolean;
  comments: CommentData[];
  postedAgo: string;
}

interface MainFeedProps {
  marketFeed: MarketData[];
}

const MainFeed: React.FC<MainFeedProps> = ({ marketFeed }) => {
  const router = useRouter();
  const isProfile = router.pathname === "/profile";
  console.log(marketFeed);

  const [isOpenBettor, setIsOpenBettor] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [isOpenVolume, setIsOpenVolume] = useState(false);
  const [isOpenBetModal, setOpenBetModal] = useState(false);
  const [isOpenBuySellModal, setOpenBuySellModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<MarketData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string>("");
  const [cardsData, setCardsData] = useState<MarketData[]>(marketFeed);
  const [marketInfo, setMarketInfo] = useState({
    title: "",
    option1: "",
    option2: "",
    days: 1,
    hours: 0,
    minutes: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMarketInfo((prev) => ({ ...prev, [name]: value }));
  };

  const placeBet = (cardId: string) => {
    const newCardsData = cardsData.map((card) =>
      card.username === cardId ? { ...card, hasBet: true } : card
    );
    setCardsData(newCardsData);
  };

  const buyToken = (cardId: string) => {
    const newCardsData = cardsData.map((card) =>
      card.username === cardId ? { ...card, isHolding: true } : card
    );
    setCardsData(newCardsData);
  };

  const handleOptionsModal = (card: MarketData, option: string) => {
    setSelectedBet(card);
    setSelectedOptions(option);
    setOpenBetModal(true);
  };

  useEffect(() => {
    if (selectedOptions) {
      console.log(selectedOptions);
    }
  }, [selectedOptions]);

  return (
    <>
      <BuySell
        isOpenBuySellModal={isOpenBuySellModal}
        setOpenBuySellModal={setOpenBuySellModal}
        buyToken={buyToken}
        selectedBet={selectedBet}
      />
      {selectedBet && selectedOptions && (
        <BetModal
          isOpenBetModal={isOpenBetModal}
          setOpenBetModal={setOpenBetModal}
          selectedBet={selectedBet}
          selectedOptions={selectedOptions}
          placeBet={placeBet}
        />
      )}
      <div className="space-y-5">
        {!isProfile && (
          <CreateMarketPreview
            marketInfo={marketInfo}
            handleChange={handleChange}
          />
        )}

        {cardsData.map((card, index) => (
          <div
            key={index}
            className="border border-gray-200 shadow rounded-3xl p-4 max-w-full"
          >
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={"./buzz2.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full bg-fuchsia-800 object-cover"
              />
              <div>
                <p className="font-bold">
                  <span className="text-fuchsia-800">{card.username}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Posted {card.postedAgo}
                </p>
              </div>
            </div>
            <div className="text-sm text-fuchsia-950 mb-4 text-center font-semibold">
              <p className="text-sm font-semibold">{card.postMessage}</p>
            </div>
            {card.isTokenOwned ? (
              !card.hasBet ? (
                <div className="flex flex-col md:flex-row justify-around md:space-x-4">
                  <button
                    onClick={() => handleOptionsModal(card, card.option1)}
                    className="flex-1 text-center p-2 border border-gray-300 rounded-xl m-1 bg-fuchsia-800 hover:bg-fuchsia-950 text-white"
                  >
                    <div>
                      <p className="font-bold">{card.option1}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleOptionsModal(card, card.option2)}
                    className="flex-1 text-center p-2 border border-gray-300 rounded-xl m-1 bg-fuchsia-800 hover:bg-fuchsia-950 text-white"
                  >
                    <div>
                      <p className="font-bold">{card.option2}</p>
                    </div>
                  </button>
                </div>
              ) : (
                <button className="w-full mt-3 rounded-3xl hover:bg-fuchsia-900 hover:text-white bg-fuchsia-800 text-white py-2">
                  Cash out for {card.cashOutPrice} {card.tokenName}
                </button>
              )
            ) : (
              <div>
                <button
                  onClick={() => {
                    setSelectedBet(card);
                    setOpenBuySellModal(true);
                  }}
                  className="w-full mt-3 rounded-3xl border-4 border-black hover:bg-fuchsia-900 hover:text-white bg-fuchsia-800 text-white py-2"
                >
                  Buy {card.username} to play
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
              <div className="flex space-x-4"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MainFeed;
