import React from "react";
import { Link, ToggleLeft, MessageSquare } from "lucide-react";
import { Squircle } from "@squircle-js/react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Share Your Link",
    description:
      "Get your unique profile link and share it with friends and followers",
    icon: <Link className="h-8 w-8 text-white" />,
  },
  {
    title: "Enable Messages",
    description:
      "Toggle on to start receiving anonymous messages from your audience",
    icon: <ToggleLeft className="h-8 w-8 text-white" />,
  },
  {
    title: "Read Messages",
    description: "Receive and read anonymous messages in real-time",
    icon: <MessageSquare className="h-8 w-8 text-white" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative min-h-screen bg-black px-4 pt-44 pb-32">
      <div className="z-10 mx-auto max-w-6xl text-center">
        <h2 className="text-main-gradient mx-auto max-w-4xl text-5xl leading-32 font-black text-balance md:text-8xl lg:text-9xl">
          How It Works
        </h2>

        <div className="grid grid-cols-1 gap-8 py-24 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`group relative rounded-3xl bg-zinc-900 p-8 transition-all hover:scale-105 ${
                idx % 2 === 0 ? "rotate-2" : "-rotate-2"
              }`}
            >
              <Squircle
                asChild
                cornerRadius={20}
                cornerSmoothing={1}
                className="mb-6 inline-block"
              >
                <div className="bg-main-gradient p-4">{step.icon}</div>
              </Squircle>
              <h3 className="mb-4 text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="text-balance text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
