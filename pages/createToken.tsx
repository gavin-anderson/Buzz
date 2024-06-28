import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";

const CreateToken: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const checkUserAndTokenExistence = async () => {
    if (user && user.wallet) {
      try {
        const response = await fetch(
          `/api/check-user-token?privy_id=${user.id}&walletAddress=${user.wallet.address}`
        );
        const result = await response.json();

        if (result.userExists && result.tokenExists) {
          router.push("/home");
          return true;
        }
      } catch (error) {
        console.error("Error checking user and token existence:", error);
      }
    }
    return false;
  };

  useEffect(() => {
    if (ready && authenticated) {
      checkUserAndTokenExistence();
    }
  }, [ready, authenticated, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (user && user.wallet && (user.email || user.google)) {
      const exists = await checkUserAndTokenExistence();
      if (exists) return;

      try {
        const _email = user.email?.address ?? user.google?.email;
        const _profileName = username.replace(/^@/, "");

        // Create user
        const userResponse = await fetch("/api/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: user.wallet.address,
            privy_id: user.id,
            username,
            profileName: _profileName,
            createdAt: new Date(),
            email: _email,
            tokensOwned: [],
          }),
        });

        const userResult = await userResponse.json();
        if (userResponse.ok) {
          // Create token
          const tokenResponse = await fetch("/api/create-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: user.wallet.address,
              totalSupply: 0,
              priceETH: 0,
              priceUSD: 0,
              curveConstant: 0,
              curveSupply: 0,
              marketSupply: 0,
              curveETH: 0,
              totalTrades: 0,
              volume: 0,
              totalUserFees: 0,
              totalProtocolFees: 0,
              totalNonMarketHolders: 0,
              tokenHolders: [],
            }),
          });

          const tokenResult = await tokenResponse.json();
          if (tokenResponse.ok) {
            setMessage("Token created successfully!");
            router.push("/home");
          } else {
            setMessage(`Token creation failed: ${tokenResult.error}`);
          }
        } else {
          setMessage(`User creation failed: ${userResult.error}`);
        }
      } catch (error) {
        setMessage(`Error: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen flex justify-center items-center p-4"
      style={{
        background: `url('/bg.svg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-6xl bg-fuchsia-50 p-12 rounded-3xl shadow-xl border-fuchsia-950">
        <div className="flex justify-center">
          <img
            className="h-24 bg-gradient-to-tl from-fuchsia-200 to-fuchsia-600 rounded-3xl"
            src="/buzz2.png"
            alt="image description"
          />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fuchsia-950">
            Buy your friends' tokens{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-tl from-fuchsia-400 to-fuchsia-600">
              and bet on their lives.
            </span>
          </h1>
        </div>

        <div className="mt-5 text-center shadow-md rounded-3xl p-6">
          <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-400">
            The SocialFi platform with unlimited upside.
          </p>
        </div>

        <div className="mt-8 gap-3 flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Create a Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.startsWith("@") ? e.target.value : "@" + e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        {message && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
