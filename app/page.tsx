import Header from "./_components/Header";
import AnchorLinkBtn from "./_components/AnchorLinkBtn";
import HomePageScene from "./_components/HomePageScene";

import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      <main className="relative h-[calc(100vh-80px)]">
        <HomePageScene />

        <div
          className="absolute left-1/2 top-1/2 -translate-1/2 text-center md:space-y-6 space-y-3 w-full md:w-fit
          px-5"
        >
          <h1 className="text-secondary text-2xl w-full font-bold md:text-4xl md:leading-tight selection:bg-hover">
            Crafting hyper-realistic 3D worlds and digital assets for the future
            of design. Visualize. Create. Transform.
          </h1>

          <AnchorLinkBtn
            href="/"
            styles="inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-gold
            text-lg hover:bg-hover px-6 font-semibold duration-200 transition-colors"
          >
            Get Started
            <span className="inline-flex items-center justify-center">
              <ArrowRight size={15} />
            </span>
            it&apos;s free
          </AnchorLinkBtn>
        </div>
      </main>

      {/* rest of the site */}
      <div></div>
    </>
  );
}
