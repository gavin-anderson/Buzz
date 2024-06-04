import { FaRegClock } from "react-icons/fa";

const NewMarketCard = () => {
  const cardsData = [
    {
      username: "Malcolm",
      userHandle: "@arsh_kochhar",
      avatarUrl: "/path_to_avatar.jpg", // Placeholder for the avatar image URL
      postedTime: "1d",
      question:
        "Going to play 18 today, what am I shooting? (It's wet and cold here.)",
      options: [
        { label: "Under 90", multiplier: "2.5x" },
        { label: "Over 90", multiplier: "1.43x" },
      ],
      likes: 3,
      comments: 15,
      views: 1232,
      isExpired: { status: false, timeRemaining: "22mins" },
    },
  ];

  return (
    <div className="space-y-8">
      {cardsData.map((card, index) => (
        <div
          key={index}
          className="border border-gray-200 shadow rounded-3xl p-4 max-w-full"
        >
          <div className="flex items-center space-x-2 mb-4">
            <img
              src="/buzz2.png"
              alt="Profile"
              className="w-10 h-10 rounded-full bg-fuchsia-800 object-cover"
            />
            <div>
              <p className="font-bold">
                <span className="text-fuchsia-800">{card.userHandle}</span>
              </p>
              <p className="text-gray-500 text-sm">Posted {card.postedTime}</p>
            </div>
          </div>
          <div className="text-sm text-fuchsia-950 mb-4 text-center font-semibold">
            <p className="text-sm font-semibold">{card.question}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-around md:space-x-4">
            {card.options.map((option, idx) => (
              <button
                key={idx}
                className="flex-1 text-center p-2 border border-gray-300 rounded-xl m-1 bg-fuchsia-800 hover:bg-fuchsia-950 text-white"
              >
                <div>
                  <p className="font-bold">{option.label}</p>
                  <p>{option.multiplier}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-1">
              <FaRegClock />
              <span className="text-xs">{card.isExpired.timeRemaining}</span>
            </div>
            <div className="flex space-x-4">
              <span className="text-xs">{card.likes} ❤️</span>
              <span className="text-xs">{card.comments} 💬</span>
              <span className="text-xs">{card.views} 👁️</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewMarketCard;
