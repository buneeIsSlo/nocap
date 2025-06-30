"use client";

import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";
import { motion } from "motion/react";
import { useState } from "react";
import { SignInDialog } from "@/components/sign-in-dialog";

const ConnectionsSection = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  return (
    <section className="relative min-h-screen bg-black px-4 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.68, -0.6, 0.32, 1.6] }}
          viewport={{ once: true }}
          className="text-main-gradient mb-12 text-5xl leading-32 font-black md:text-8xl lg:text-9xl"
        >
          Make <em>real</em>
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
            <span className="text-main-gradient">Connections</span>
          </motion.span>
        </motion.h2>
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
          <Squircle
            asChild
            cornerRadius={25}
            cornerSmoothing={1}
            className="w-[300px] lg:w-[500px]"
          >
            <Button
              size="lg"
              className="transform bg-white p-10 text-2xl font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-white hover:brightness-110"
              onClick={() => setShowSignIn(true)}
            >
              Let's go!
            </Button>
          </Squircle>
        </motion.div>
      </div>
      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </section>
  );
};

export default ConnectionsSection;
