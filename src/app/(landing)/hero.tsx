import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";

const HeroSection = () => {
  return (
    <section className="bg-main-gradient relative flex min-h-screen items-center justify-center overflow-hidden rounded-b-[6rem] px-4 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute top-20 left-8 text-6xl">👋</div>
        <div className="animate-bounce-gentle absolute top-32 right-12 text-5xl">
          💖
        </div>
        <div
          className="animate-float absolute bottom-40 left-12 text-4xl"
          style={{ animationDelay: "1s" }}
        >
          💭
        </div>
        <div
          className="animate-pulse-scale absolute top-1/2 right-8 text-5xl"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>
        <div
          className="animate-float absolute right-20 bottom-32 text-6xl"
          style={{ animationDelay: "0.5s" }}
        >
          🫧
        </div>
      </div>

      <div className="z-10 mx-auto max-w-4xl text-center">
        <h1 className="mb-12 text-5xl leading-32 font-black text-white md:text-8xl lg:text-9xl">
          No cap
          <br />
          <span className="text-gradient">Spill the tea</span>
        </h1>
        <Squircle asChild cornerRadius={25} cornerSmoothing={1}>
          <Button
            size="lg"
            className="shadow-glow transform bg-black p-10 text-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:brightness-105"
          >
            Start receiving Questions
          </Button>
        </Squircle>
      </div>
    </section>
  );
};

export default HeroSection;
