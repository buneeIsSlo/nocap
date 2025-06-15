import { MessageCard } from "@/components/message-card";
import React from "react";
import { Marquee } from "@/components/marquee";

interface Item {
  question: string;
  name: string;
  time: string;
  avatarSrc?: string;
}

const questions: Item[] = [
  {
    question: "What's your absolute dream job, no limitations?",
    name: "Anonymous",
    time: "1h",
  },
  {
    question: "If you could have one superpower, what would it be and why?",
    name: "Anonymous",
    time: "30m",
  },
  {
    question: "What's a skill you wish you had, but haven't learned yet?",
    name: "Anonymous",
    time: "15m",
  },
  {
    question:
      "If you could give your younger self one piece of advice, what would it be?",
    name: "Anonymous",
    time: "5m",
  },
  {
    question: "What's one song you can't stop listening to right now?",
    name: "Anonymous",
    time: "10m",
  },
  {
    question:
      "If you could live anywhere in the world for a year, where would it be?",
    name: "Anonymous",
    time: "8m",
  },
];

const firstRowQuestions = questions.slice(0, questions.length / 2);
const secondRowQuestions = questions.slice(questions.length / 2);

export default function QnA() {
  return (
    <section className="relative bg-black px-4 py-32">
      <div className="z-10 mx-auto max-w-6xl text-center">
        <h2 className="text-main-gradient mx-auto max-w-4xl text-5xl leading-32 font-black text-balance md:text-8xl lg:text-9xl">
          Answer questions
        </h2>
        <div className="relative overflow-hidden py-24">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRowQuestions.map((item, idx) => (
              <MessageCard key={idx} {...item} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRowQuestions.map((item, idx) => (
              <MessageCard key={idx} {...item} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
        </div>
      </div>
    </section>
  );
}
