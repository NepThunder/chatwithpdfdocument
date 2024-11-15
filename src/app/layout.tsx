import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import NavBar from "./components/NavBar";
import Providers from "./components/Providers";
import "react-loading-skeleton/dist/skeleton.css"
import { Toaster } from "@/components/ui/toaster";
import "simplebar-react/dist/simplebar.min.css"
import { constructMetadata } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className
          )}
        >
          <Toaster/>
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
