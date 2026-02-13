import React from 'react';
import Hero from '../components/Hero';
import FAQs from '../components/FAQs';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import Features from '../components/Features';
import Header from '../components/Header';

const HomePage = () => {
    return (
        <div className='text-amber-300'>
            <Header/>
            <Hero />
            <Features />
            <Testimonials />
            <Pricing />
            <FAQs />
            <Footer />
        </div>
    );
}
export default HomePage;
