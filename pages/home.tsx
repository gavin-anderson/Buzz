import MainContainer from "@/app/buzz-components/MainContainer";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import MainFeed from "@/app/buzz-components/home/MainFeed";

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
  hasBet: boolean;
  userBalance: number;
  comments: CommentData[];
  postedAgo: string;
}

const Home = () => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const [feed, setFeed] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const fetchMarkets = async () => {
      if (ready && authenticated && user && user.wallet) {
        try {
          const response = await fetch(`/api/home/get-markets?userAddress=${user.wallet.address}`);
          if (!response.ok) {
            throw new Error("Failed to fetch markets");
          }
          const data = await response.json();
          setFeed(data);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMarkets();
  }, [ready, authenticated, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainContainer>
      <div className="w-full max-w-4xl mt-5">
        <MainFeed marketFeed={feed} />
      </div>
    </MainContainer>
  );
};

export default Home;
