"use client";

import { MessageCard } from "@/components/message-card";
import React, { useEffect, useState, useRef } from "react";
import { AnimatedList } from "@/components/animated-list";
import { Squircle } from "@squircle-js/react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";

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
  const [showList, setShowList] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) setShowList(true);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black px-4 pb-32"
    >
      <div className="z-10 mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
          viewport={{ once: true }}
          className="text-main-gradient mx-auto max-w-4xl text-5xl font-black text-balance md:text-8xl md:leading-32 lg:text-9xl"
        >
          Ask for
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
            <span className="text-main-gradient">Opinions</span>
          </motion.span>
        </motion.h2>
        <div className="mx-auto flex max-w-lg flex-col justify-between py-16 md:py-24 lg:max-w-none lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.68, -0.6, 0.32, 1.6],
              delay: 0.3,
            }}
            viewport={{ once: true }}
            className="relative self-center py-8"
          >
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
              className="absolute top-0 right-0 bg-white px-4 py-2 md:top-10 md:-right-35"
            >
              <span className="font-nunito text-lg font-bold text-black">
                Fresh cut. What do you think?
              </span>
            </Squircle>
          </motion.div>
          <AnimatePresence>
            {showList && (
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3, ease: [0.68, -0.6, 0.32, 1.6] }}
                className="relative flex h-[500px] flex-col overflow-hidden p-2"
              >
                <AnimatedList>
                  {opinions.map((item, idx) => (
                    <MessageCard key={idx} {...item} />
                  ))}
                </AnimatedList>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/12 rounded-lg bg-gradient-to-t from-black"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
