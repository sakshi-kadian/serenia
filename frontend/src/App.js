import React from "react";
import { Navbar } from "./components/layout/navbar";
import { Hero } from "./components/sections/hero";
import { Features } from "./components/sections/features";
import { LiveDemo } from "./components/sections/live-demo";
import { Ethics } from "./components/sections/ethics";
import { Footer } from "./components/layout/footer";

function App() {
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-sans selection:bg-[#E11D48]/20 selection:text-[#E11D48]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <LiveDemo />
        <Ethics />
      </main>
      <Footer />
    </div>
  );
}

export default App;
