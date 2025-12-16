import React from "react";
import { Navbar } from "./components/layout/navbar";
import { Hero } from "./components/sections/hero";
import { About } from "./components/sections/about";
import { Features } from "./components/sections/features";
import { Mission } from "./components/sections/mission";
import { CTA } from "./components/sections/cta";
import { Footer } from "./components/layout/footer";

console.log({ Navbar, Hero, About, Features, Mission, CTA, Footer });

function App() {
  return (
    <div className="min-h-screen bg-[#FFF5EB] font-sans selection:bg-[#F59E0B]/20 selection:text-[#B45309]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Mission />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
