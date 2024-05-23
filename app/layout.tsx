import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "next-flowbite-react-landing",
//   description: "Nextjs Flowbite React Starter | Saas Landing",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ThemeModeScript></ThemeModeScript>
      {children}
    </div>
  );
}
