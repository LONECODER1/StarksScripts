import React from 'react';
import Hero from '@/components/Hero';
import FAQs from '@/components/FAQs';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Features from '@/components/Features';
import Header from '@/components/Header';
import { auth } from '@/app/lib/auth';

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <Header session={session} />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
}
