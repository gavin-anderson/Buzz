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
import BetModal from "../../modals/BetModal";
import CreateMarketPreview from "./CreateMarketPreview";
import { useRouter } from "next/router";
import BuySell from "../../modals/BuySellModal";

const NewMarketCard = () => {
  const router = useRouter();
  const isProfile = router.pathname === "/profile";
  const data = [
    {
      userHandle: "@Ansem",
      tokenName: "ANSEM",
      avatarUrl: "/ansem.jpg",
      postedTime: "1d",
      question: "How many rounds will my next fight last?",
      options: [
        { label: "Under 4.5", multiplier: 2.5 },
        { label: "Over 4.5", multiplier: 2.43 },
      ],
      likes: 148,
      comments: 15,
      views: 18232,
      isExpired: { status: false, timeRemaining: "22mins" },
      isHolding: true,
      hasBet: false,
      cashOutPrice: 488,
      clickedCashOut: false,
      balance: 976,
    },
    {
      userHandle: "@toly",
      avatarUrl: "/toly.jpg",
      postedTime: "1d",
      question: "Will $MOTHER pass $300m mcap today?",
      options: [
        { label: "Yes", multiplier: 2 },
        { label: "No", multiplier: 2 },
      ],
      likes: 213,
      comments: 32,
      views: 27862,
      isExpired: { status: false, timeRemaining: "22mins" },
      isHolding: true,
      hasBet: false,
      cashOutPrice: 40,
      balance: 400,
    },
    {
      userHandle: "@karateCombat",
      avatarUrl: "/karate.jpg",
      postedTime: "1d",
      question: "Will Gordon Ryan fight in the KC pit before August 1st, 2024",
      options: [
        { label: "Yes", multiplier: 3 },
        { label: "No", multiplier: 1.4 },
      ],
      likes: 412,
      comments: 13,
      views: 42882,
      isExpired: { status: false, timeRemaining: "52days" },
      isHolding: false,
      hasBet: false,
      cashOutPrice: 467,
      balance: 967,
    },
  ];

  const [isOpenBettor, setIsOpenBettor] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [isOpenVolume, setIsOpenVolume] = useState(false);
  const [isOpenBetModal, setOpenBetModal] = useState(false);
  const [isOpenBuySellModal, setOpenBuySellModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState({});
  const [selectedOptions, setSelectedOptions] = useState();
  const [cardsData, setCardsData] = useState(data);
  const [marketInfo, setMarketInfo] = useState({
    title: "",
    option1: "",
    option2: "",
    days: 1,
    hours: 0,
    minutes: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketInfo((prev) => ({ ...prev, [name]: value }));
  };

  const placeBet = (cardId) => {
    const newCardsData = cardsData.map((card) =>
      card.userHandle === cardId ? { ...card, hasBet: true } : card
    );
    // Assuming you can setCardsData here, but you need to have cardsData in state to do this
    setCardsData(newCardsData);
  };

  const buyToken = (cardId) => {
    const newCardsData = cardsData.map((card) =>
      card.userHandle === cardId ? { ...card, isHolding: true } : card
    );
    // Assuming you can setCardsData here, but you need to have cardsData in state to do this
    setCardsData(newCardsData);
  };

  // Inside your component
  function handleOptionsModal(card, option) {
    setSelectedBet(card);
    setSelectedOptions(option);
    setOpenBetModal(true);
  }

  // Add useEffect to log the state after it updates
  useEffect(() => {
    if (selectedOptions) {
    }
  }, [selectedOptions]); // This effect runs whenever selectedOptions changes

  return (
    <>
      {" "}
      <BuySell
        isOpenBuySellModal={isOpenBuySellModal}
        setOpenBuySellModal={setOpenBuySellModal}
        buyToken={buyToken}
        selectedBet={selectedBet}
      ></BuySell>
      {selectedBet && selectedOptions && (
        <BetModal
          isOpenBetModal={isOpenBetModal}
          setOpenBetModal={setOpenBetModal}
          selectedBet={selectedBet}
          selectedOptions={selectedOptions}
          placeBet={placeBet}
        ></BetModal>
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
                src={card.avatarUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full bg-fuchsia-800 object-cover"
              />
              <div>
                <p className="font-bold">
                  <span className="text-fuchsia-800">{card.userHandle}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Posted {card.postedTime}
                </p>
              </div>
            </div>
            <div className="text-sm text-fuchsia-950 mb-4 text-center font-semibold">
              <p className="text-sm font-semibold">{card.question}</p>
            </div>
            {card.isHolding ? (
              !card.hasBet ? (
                <div className="flex flex-col md:flex-row justify-around md:space-x-4">
                  {card.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionsModal(card, option)}
                      className="flex-1 text-center p-2 border border-gray-300 rounded-xl m-1 bg-fuchsia-800 hover:bg-fuchsia-950 text-white"
                    >
                      <div>
                        <p className="font-bold">{option.label}</p>
                        <p>{option.multiplier}x</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <button className="w-full mt-3 rounded-3xl hover:bg-fuchsia-900 hover:text-white  bg-fuchsia-800 text-white py-2">
                  Cash out for {card.cashOutPrice} {card.tokenName}
                </button>
              )
            ) : (
              <div>
                <button
                  onClick={() => setOpenBuySellModal(true)}
                  className="w-full mt-3 rounded-3xl border-4 border-black hover:bg-fuchsia-900 hover:text-white bg-fuchsia-800 text-white py-2"
                >
                  Buy {card.userHandle} to play
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsOpenBettor(!isOpenBettor)}
                  className="text-xs pr-4  flex items-center"
                >
                  {isOpenBettor ? (
                    <FaUser className="mr-1  hover:fill-current text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegUser className="mr-1  hover:fill-current text-gray-500 cursor-pointer" />
                  )}

                  {card.likes}
                </button>
                <button
                  onClick={() => setIsOpenComments(!isOpenComments)}
                  className="text-xs pr-4  flex items-center   "
                >
                  {isOpenComments ? (
                    <FaComment className="mr-1   text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegComment className="mr-1   text-gray-500 cursor-pointer" />
                  )}

                  {card.comments}
                </button>
                <button
                  onClick={() => setIsOpenVolume(!isOpenVolume)}
                  className="text-xs pr-4  flex items-center"
                >
                  {isOpenVolume ? (
                    <FaChartBar className="mr-1  hover:fill-current text-gray-500 cursor-pointer" />
                  ) : (
                    <FaRegChartBar className="mr-1 hover:fill-current text-gray-500 cursor-pointer" />
                  )}

                  {card.views}
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

export default NewMarketCard;
