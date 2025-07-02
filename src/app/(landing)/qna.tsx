"use client";

import { MessageCard } from "@/components/message-card";
import React from "react";
import { Marquee } from "@/components/marquee";
import { motion } from "motion/react";

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
    <section className="relative bg-black px-4 pb-32">
      <div className="z-10 mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
          viewport={{ once: true }}
          className="text-main-gradient mx-auto max-w-4xl text-5xl font-black md:text-8xl md:leading-32 lg:text-9xl"
        >
          Answer
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.68, -0.6, 0.32, 1.6],
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="text-main-gradient">Questions</span>
          </motion.span>
        </motion.h2>
        <div className="relative overflow-hidden py-16 md:py-24">
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-black md:w-1/4"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-black md:w-1/4"></div>
        </div>
      </div>
    </section>
  );
}
