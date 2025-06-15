import { Button } from "@/components/ui/button";
import { Squircle } from "@squircle-js/react";

const ConnectionsSection = () => {
  return (
    <section className="relative min-h-screen bg-black px-4 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-main-gradient mb-12 text-5xl leading-32 font-black md:text-8xl lg:text-9xl">
          Make <em>real</em>
          <br />
          <span className="text-gradient">Connections</span>
        </h2>
        <Squircle
          asChild
          cornerRadius={25}
          cornerSmoothing={1}
          className="w-[300px] lg:w-[500px]"
        >
          <Button
            size="lg"
            className="transform bg-white p-10 text-2xl font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-white hover:brightness-110"
          >
            Let's go!
          </Button>
        </Squircle>
      </div>
    </section>
  );
};

export default ConnectionsSection;
