import { FaRegClock } from "react-icons/fa";

const BettingCard = () => {
  const cardsData = [
    {
      username: "@ansem",
      isExpired: { status: true },
      question: "How long will the podcast with goodGame last?",
      details: {
        tokenPrice: "1.43",
        stake: "12.5",
        potentialReturn: "25",
        selection: "Over 1 hour",
      },
      cashOut: "25",
    },
    {
      username: "@jane_doe",
      isExpired: { status: true, timeRemaining: "Expired in 1d 2h 10min" },
      question: "Will it rain tomorrow in Toronto?",
      details: {
        tokenPrice: "0.85",
        stake: "10.0",
        potentialReturn: "15.0",
        selection: "Yes",
      },
      cashOut: "14.0",
    },
    {
      username: "@max_smith",
      isExpired: { status: false, timeRemaining: "Expires in 5d 12h 30min" },
      question: "Can my favorite team win the championship this year?",
      details: {
        tokenPrice: "2.50",
        stake: "20.0",
        potentialReturn: "50.0",
        selection: "Yes",
      },
      cashOut: "45.0",
    },
  ];

  return (
    <div className="space-y-8">
      {cardsData.map((card, index) => (
        <div
          key={index}
          className={` border border-gray-200 shadow rounded-3xl p-4 max-w-full `}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                src="/buzz2.png"
                alt="Profile Picture"
                className="w-8 h-8 mr-2 bg-fuchsia-900 object-cover rounded-full"
              />
              <span className="text-fuchsia-700 font-bold">
                {card.username}
              </span>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-3xl">
              <FaRegClock className="text-red-700" />
              <span className="text-sm text-red-700">
                {card.isExpired.status
                  ? "Expired"
                  : card.isExpired.timeRemaining}
              </span>
            </div>
          </div>
          <div className="text-center mb-2 mt-4">
            <p className="text-sm text-gray-950 font-semibold">
              {card.question}
            </p>
            <div className="border-t border-fuchsia-800 my-4"></div>
          </div>

          <div className="flex justify-center items-center text-sm mb-4 gap-2 md:gap-4 overflow-x-auto flex-nowrap">
            <DetailBox label="Token Price" value={card.details.tokenPrice} />
            <DetailBox label="Stake" value={card.details.stake} />
            <DetailBox
              label="Potential Return"
              value={card.details.potentialReturn}
            />
            <DetailBox label="Selection" value={card.details.selection} />
          </div>
          <button className="w-full mt-3 rounded-3xl hover:bg-fuchsia-900 hover:text-white  bg-fuchsia-800 text-white py-2">
            Cash out for {card.cashOut}
          </button>
        </div>
      ))}
    </div>
  );
};

interface DetailBoxProps {
  label: string;
  value: string | number; // Use 'string | number' if the value can be a string or a number
}

const DetailBox: React.FC<DetailBoxProps> = ({ label, value }) => {
  return (
    <div
      className="flex flex-col items-center justify-center bg-fuchsia-100 p-2 rounded-xl text-center"
      style={{ minWidth: "90px", maxWidth: "120px", minHeight: "40px" }}
    >
      <p className="text-xs text-gray-500 w-full truncate">{label}:</p>
      <p className="text-xs text-gray-950 w-full truncate">{value}</p>
    </div>
  );
};

export default BettingCard;
