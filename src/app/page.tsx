import HeroSection from "./(landing)/hero";
import HowItWorks from "./(landing)/how-it-works";
import Opinions from "./(landing)/opinions";
import QnA from "./(landing)/qna";
import ConnectionsSection from "./(landing)/connections";
import StickyFooter from "@/app/(landing)/sticky-footer";

export default function Home() {
  return (
    <div className="relative">
      <main className="z-10 bg-black">
        <HeroSection />
        <HowItWorks />
        <QnA />
        <Opinions />
        <ConnectionsSection />
      </main>
      <StickyFooter />
    </div>
  );
}
