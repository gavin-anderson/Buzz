import MainContainer from "@/app/buzz-components/MainContainer";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";

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
      <div className="max-w-full p-8 text-center">
        <p className="text-xl p-3 shadow-xl border-2 rounded-3xl font-medium text-fuchsia-950">
          Home
        </p>
      </div>
    </MainContainer>
  );
};

export default Home;
