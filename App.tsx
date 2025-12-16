import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MockupSection } from './components/MockupSection';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BuilderWizard } from './components/builder/BuilderWizard';
import { GiftViewer } from './components/GiftViewer';
import { BuilderData } from './types';

function App() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [giftData, setGiftData] = useState<Partial<BuilderData> | null>(null);

  useEffect(() => {
    // Check for gift data in URL on mount
    const params = new URLSearchParams(window.location.search);
    const giftParam = params.get('gift');

    if (giftParam) {
      try {
        // Decode: Base64 -> URI Component -> JSON
        const jsonString = decodeURIComponent(escape(atob(giftParam)));
        const parsed = JSON.parse(jsonString);

        // Decompress Data (Support short keys for URL size optimization)
        const reconstructedData: Partial<BuilderData> = {
            title: parsed.t || parsed.title,
            message: parsed.m || parsed.message,
            date: parsed.d || parsed.date,
            music: parsed.mu || parsed.music,
            musicUrl: parsed.muu || parsed.musicUrl,
            background: parsed.bg || parsed.background,
            photoMode: parsed.pm || parsed.photoMode,
            photos: parsed.p || parsed.photos
        };

        setGiftData(reconstructedData);
      } catch (e) {
        console.error("Error parsing gift data", e);
      }
    }
  }, []);

  const openBuilder = () => {
    setIsBuilderOpen(true);
    window.scrollTo(0, 0);
  };

  const closeBuilder = () => {
    setIsBuilderOpen(false);
  };

  // If viewing a gift, show the Viewer ONLY
  if (giftData) {
    return <GiftViewer data={giftData} />;
  }

  // If builder is open, show builder
  if (isBuilderOpen) {
    return <BuilderWizard onClose={closeBuilder} />;
  }

  // Default Landing Page
  return (
    <div className="font-poppins text-gray-800 antialiased selection:bg-christmas-red selection:text-white">
      <Header onOpenBuilder={openBuilder} />
      <main>
        <Hero onOpenBuilder={openBuilder} />
        <MockupSection />
        <HowItWorks />
        <Features />
        <Pricing onOpenBuilder={openBuilder} />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;