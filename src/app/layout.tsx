import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/react-query-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "No Cap | %s",
    default: "No Cap",
  },
  description: "Send and receive messages anonymously",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono} ${nunito.variable} bg-black antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <Toaster containerStyle={{ top: 40 }} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
