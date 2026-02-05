"use client"
import React from 'react';
import { animationVariants, bubbles } from '../data/constants';
const Hero = () => {

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">

      {/* Animated Dark Blobs */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gray-700 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gray-700 rounded-full blur-3xl opacity-30 animate-blob animation-delay-3000"></div>
      </div>

      {/* 🌐 Network Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.5" />
              <line x1="20" y1="20" x2="40" y2="20" stroke="white" strokeWidth="0.8" opacity="0.5" />
              <line x1="20" y1="20" x2="20" y2="40" stroke="white" strokeWidth="0." opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: bubble.top,
              left: bubble.left,
              animationDelay: `${bubble.delay}ms`
            }}
          >
            {/* 1. Outer div handles the vertical "Rise" 
          2. Inner div handles the "Revolve/Rotate" 
      */}
            <div className={`${animationVariants[index % 3]} flex items-center justify-center`}>
              <div className={`${bubble.size} rounded-full overflow-hidden border-4 ${bubble.border} shadow-2xl ring-4 ring-black/40 bg-gradient-to-br ${bubble.bg} flex items-center justify-center animate-revolve`}>
                <img src={bubble.src} alt={bubble.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 🔥 MAIN CONTENT RESTORED */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">Trusted by 50,000+ Developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight">
            Code Smarter,
            <span className="block bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent">
              Build Faster
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
            The ultimate platform for developers to collaborate, learn, and ship amazing projects. Join our community of innovators today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-1000">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-2xl hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105">
              <span className="relative z-10">Start Coding Free</span>
              <span className="relative z-10 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>

            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:border-white/50">
              View Documentation
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-1500">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70 text-sm">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-white/70 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70 text-sm">Uptime</div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent"></div>

      <style jsx global>{`
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(40px,-60px) scale(1.1); }
          66% { transform: translate(-30px,40px) scale(0.9); }
        }

        @keyframes bubble-rise {
          0% { transform: translateY(110vh) scale(.9); opacity:0; }
          10% { opacity:1; }
          90% { opacity:1; }
          100% { transform: translateY(-120vh) scale(1.1); opacity:0; }
        }

        .animate-blob { animation: blob 10s infinite ease-in-out; }
        .animate-bubble-rise-slow { animation: bubble-rise 18s linear infinite; }
        .animate-bubble-rise-medium { animation: bubble-rise 14s linear infinite; }
        .animate-bubble-rise-fast { animation: bubble-rise 11s linear infinite; }

        @keyframes fade-in { from {opacity:0} to {opacity:1} }
        @keyframes fade-in-up { from {opacity:0; transform:translateY(20px)} to {opacity:1; transform:translateY(0)} }

        .animate-fade-in { animation: fade-in 1s ease-out both; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out both; }

        .animation-delay-500 { animation-delay:.5s; }
        .animation-delay-1000 { animation-delay:1s; }
        .animation-delay-1500 { animation-delay:1.5s; }
        .animation-delay-2000 { animation-delay:2s; }
        .animation-delay-3000 { animation-delay:3s; }
        .animation-delay-4000 { animation-delay:4s; }

        /* Continuous, subtle rotation for character bubbles */
        @keyframes revolve {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.03); }
          50% { transform: rotate(180deg) scale(1.06); }
          75% { transform: rotate(270deg) scale(1.03); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .animate-revolve {
          animation: revolve 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Hero;
