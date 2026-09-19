'use client';

import { AboutSection } from "@/components/AboutSection";
import { ContributeModal } from "@/components/ContributeModal";
import { Footer } from "@/components/Footer";
import {Header} from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { useState } from "react";


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return ( 
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header onOpenContributeModal={() => setIsModalOpen(true)} />
      
      <Hero />
      <AboutSection />
      <HowItWorksSection />
      
      <Footer onOpenContributeModal={() => setIsModalOpen(true)} />
      
      <ContributeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
