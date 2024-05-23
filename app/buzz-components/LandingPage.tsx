"use client";
import { on } from "events";
import buzz from "../../public/buzz.svg";
import {
  Alert,
  Button,
  Tooltip,
  Navbar,
  Hero,
  Dropdown,
  Footer,
  Card,
} from "flowbite-react";
import type { FC } from "react";
import { signIn, useSession } from "next-auth/react";

const LandingPage: FC = function () {
  return (
    <div
      className="relative min-h-screen flex justify-center items-center p-4"
      style={{
        background: `url('/bg.svg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-6xl bg-fuchsia-50 p-12 rounded-3xl   shadow-xl border-fuchsia-950">
        <div className="flex justify-center">
          <img
            className="h-24  bg-gradient-to-tl from-fuchsia-200 to-fuchsia-600 rounded-3xl"
            src="/buzz2.png"
            alt="image description"
          />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fuchsia-950">
            Invest in creators and{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-tl from-fuchsia-400 to-fuchsia-600">
              play in their markets
            </span>
          </h1>
        </div>

        <div className="mt-5 text-center shadow-md rounded-3xl p-6">
          <p className="text-lg md:text-xl text-gray-600 dark:text-neutral-400">
            Every action is a market. From daily routines to viral trends, shape
            investments with your life's events. Bet on outcomes, turn insights
            into gains, and engage deeply with the creator economy.
          </p>
        </div>

        <div className="mt-8 gap-3 flex justify-center">
          {/* <a
            className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-base font-medium rounded-md py-4 px-6"
            href="#"
          >
            Sign In With Google
          </a> */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-800 hover:to-fuchsia-900 border border-transparent text-white text-base font-medium rounded-full py-4 px-6"
          >
            <img
              src="/google.svg"
              alt="Google Icon"
              className="h-6 w-6 rounded-full bg-fuchsia-50 p-0.5"
            />
            Sign In With Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
