import NavLayout from "@/app/buzz-components/NavLayout";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface MainContainerProps {
  children: ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);
  return (
    <NavLayout>
      <div className="flex flex-1   ">
        {" "}
        {/* Adjust margin to match Sidebar width */}
        <div className="flex-1 flex justify-center   p-4 ">{children}</div>
      </div>
    </NavLayout>
  );
};

export default MainContainer;
