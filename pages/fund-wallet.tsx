"use client";
import type { FC } from "react";

const CreateWallet: FC = function ({}) {
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
        <h1>FUND</h1>
      </div>
    </div>
  );
};

export default CreateWallet;
