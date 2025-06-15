import { MessageCard } from "@/components/message-card";
import React from "react";
import { AnimatedList } from "@/components/animated-list";
import { Squircle } from "@squircle-js/react";
import Image from "next/image";

interface Item {
  question: string;
  name: string;
  time: string;
  avatarSrc?: string;
}

const opinions: Item[] = [
  {
    question: "Bro that fade is clean af! 🔥",
    name: "Anonymous",
    time: "15m",
  },
  {
    question: "Oh no no, look at the top of his head XD",
    name: "Anonymous",
    time: "10m",
  },
  {
    question: "What's the name of this cut? Need to show my barber",
    name: "Anonymous",
    time: "5m",
  },
  {
    question: "Yeah, that's a wrap. We can't talk anymore.",
    name: "Anonymous",
    time: "2m",
  },
  {
    question: "Can i kick? 🥰😘",
    name: "Anonymous",
    time: "1m",
  },
];

export default function Opinions() {
  return (
    <section className="relative min-h-screen bg-black px-4 py-32">
      <div className="z-10 mx-auto max-w-6xl text-center">
        <h2 className="text-main-gradient mx-auto max-w-4xl text-5xl leading-32 font-black text-balance md:text-8xl lg:text-9xl">
          Ask for Opinions
        </h2>
        <div className="flex w-full flex-row justify-between py-24">
          <div className="relative py-8">
            <Squircle
              asChild
              cornerRadius={30}
              cornerSmoothing={1}
              className="-rotate-5 transform overflow-hidden"
            >
              <div className="bg-main-gradient relative h-100 w-80 p-1">
                <div className="relative h-full w-full overflow-hidden rounded-[1.8rem]">
                  <Image
                    src="/football-hairstyle.webp"
                    alt="Football"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </Squircle>
            <Squircle
              asChild
              cornerRadius={40}
              cornerSmoothing={1}
              className="absolute top-10 -right-35 bg-white px-4 py-2"
            >
              <span className="font-nunito text-lg font-bold text-black">
                Fresh cut. What do you think?
              </span>
            </Squircle>
          </div>
          <div className="relative flex h-[500px] flex-col overflow-hidden p-2">
            <AnimatedList>
              {opinions.map((item, idx) => (
                <MessageCard key={idx} {...item} />
              ))}
            </AnimatedList>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/12 rounded-lg bg-gradient-to-t from-black"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
