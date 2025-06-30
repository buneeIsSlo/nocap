"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { motion } from "motion/react";

export default function HeroSection() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <section className="bg-main-gradient relative flex min-h-screen items-center justify-center overflow-hidden rounded-b-[6rem] px-4 py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.68, -0.6, 0.32, 1.6] }}
        viewport={{ once: true }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-20 left-8 text-6xl">👋</div>
        <div className="absolute top-32 right-12 text-5xl">💖</div>
        <div className="absolute top-80 left-20 text-5xl">😜</div>
        <div className="absolute bottom-40 left-12 text-4xl">💭</div>
        <div className="absolute top-1/2 right-8 text-5xl">✨</div>
        <div className="absolute right-20 bottom-32 text-6xl">🫧</div>
      </motion.div>

      <div className="z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
          viewport={{ once: true }}
          className="mb-12 text-5xl leading-32 font-black text-white md:text-8xl lg:text-9xl"
        >
          No cap
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.68, -0.6, 0.32, 1.6],
              delay: 0.25,
            }}
            viewport={{ once: true }}
            className="inline-block"
          >
            Spill the tea
          </motion.span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.68, -0.6, 0.32, 1.6],
            delay: 0.3,
          }}
          viewport={{ once: true }}
        >
          <Squircle asChild cornerRadius={25} cornerSmoothing={1}>
            <Button
              size="lg"
              className="shadow-glow transform bg-black p-10 text-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:brightness-105"
              onClick={() => setShowSignIn(true)}
            >
              Start receiving Questions
            </Button>
          </Squircle>
        </motion.div>
      </div>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </section>
  );
}
