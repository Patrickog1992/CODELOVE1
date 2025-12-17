import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MockupSection } from './components/MockupSection';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { LoveDeclaration } from './components/LoveDeclaration';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BuilderWizard } from './components/builder/BuilderWizard';
import { GiftViewer } from './components/GiftViewer';
import { SocialProofPopup } from './components/SocialProofPopup';
import { BuilderData } from './types';

function App() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  // State to handle return from payment
  const [startAtSuccess, setStartAtSuccess] = useState(false);
  const [restoredData, setRestoredData] = useState<Partial<BuilderData> | undefined>(undefined);

  const [giftData, setGiftData] = useState<Partial<BuilderData> | null>(null);

  useEffect(() => {
    // 1. Check for gift data in URL (Viewer Mode)
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
        return; // If viewing a gift, ignore payment checks
      } catch (e) {
        console.error("Error parsing gift data", e);
      }
    }

    // 2. Check for Payment Success (Return from Kirvano)
    // Kirvano usually appends ?status=paid or similar. Check your integration settings.
    const statusParam = params.get('status'); 
    
    if (statusParam === 'paid' || statusParam === 'success' || params.get('payment') === 'approved') {
        const savedData = localStorage.getItem('codelove_pending_gift');
        
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                
                // Reconstruct data from compressed format if needed, or use directly if saved as full object
                // Based on BuilderWizard, we save compressed data
                const reconstructedData: Partial<BuilderData> = {
                    title: parsed.t,
                    message: parsed.m,
                    date: parsed.d,
                    music: parsed.mu,
                    musicUrl: parsed.muu,
                    background: parsed.bg,
                    photoMode: parsed.pm,
                    photos: parsed.p,
                    selectedPlan: parsed.sp
                };

                setRestoredData(reconstructedData);
                setStartAtSuccess(true);
                setIsBuilderOpen(true);
                
                // Clear storage to prevent re-opening on refresh
                localStorage.removeItem('codelove_pending_gift');
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("Error restoring gift data", e);
            }
        }
    }

  }, []);

  const openBuilder = () => {
    setIsBuilderOpen(true);
    setStartAtSuccess(false);
    setRestoredData(undefined);
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
    return (
        <BuilderWizard 
            onClose={closeBuilder} 
            initialData={restoredData}
            startFinished={startAtSuccess}
        />
    );
  }

  // Default Landing Page
  return (
    <div className="font-poppins text-gray-800 antialiased selection:bg-christmas-red selection:text-white">
      <Header onOpenBuilder={openBuilder} />
      <SocialProofPopup />
      <main>
        <Hero onOpenBuilder={openBuilder} />
        <MockupSection />
        <HowItWorks />
        <Features />
        <Pricing onOpenBuilder={openBuilder} />
        <Testimonials />
        <LoveDeclaration onOpenBuilder={openBuilder} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;