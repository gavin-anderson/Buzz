import MainContainer from "@/app/buzz-components/MainContainer";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import NewMarketCard from "@/app/buzz-components/profile-tabs/markets/NewMarketCard";

const Home = () => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <MainContainer>
      <div className="w-full max-w-4xl mt-5">
        <NewMarketCard></NewMarketCard>
      </div>
    </MainContainer>
  );
};

export default Home;
