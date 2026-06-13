import React from 'react';
import Hero from '@/components/Hero';
import FAQs from '@/components/FAQs';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Features from '@/components/Features';
import Header from '@/components/Header';

export default function Page() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
}
