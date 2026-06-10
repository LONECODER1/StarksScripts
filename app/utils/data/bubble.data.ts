export const Bubbles = [
    { antman: "/assets/ant.png" },
    { hawkeye: "/assets/hawkeye.png" },
    { shield: "/assets/shield.png" },
    { spiderman: "/assets/spiderman.png" },
    { strange: "/assets/strange.png" },
    { ironMan: "/assets/ironman.png" },
    { ironCore: "/assets/ironcore.png" },
    { captainAmerica: "/assets/cap.png" },
    { thor: "/assets/thor.png" },
    { hulk: "/assets/hulk.png" },
    { blackPanther: "/assets/blackpanther.png" },
    { wolverine: "/assets/wolverine.png" },
];

export const animationVariants = ['animate-bubble-rise-slow'];

export const bubbles = [
    { name: "Iron Man", src: "/assets/ironman.png", border: "border-red-900/70", bg: "from-gray-900/40 to-black/40", delay: 0, size: "w-24 h-24" },
    { name: "Captain America", src: "/assets/cap.png", border: "border-blue-900/70", bg: "from-gray-900/40 to-black/40", delay: 1500, size: "w-28 h-28" },
    { name: "Thor", src: "/assets/thor.png", border: "border-blue-900/70", bg: "from-gray-900/40 to-black/40", delay: 3000, size: "w-24 h-24" },
    { name: "Hulk", src: "/assets/hulk.png", border: "border-green-900/70", bg: "from-gray-900/40 to-black/40", delay: 4500, size: "w-32 h-32" },

    { name: "Black Panther", src: "/assets/blackpanther.png", border: "border-gray-800/70", bg: "from-gray-900/40 to-black/40", delay: 600, size: "w-28 h-28" },
    { name: "Spider-Man", src: "/assets/spiderman.png", border: "border-red-800/70", bg: "from-gray-900/40 to-black/40", delay: 2100, size: "w-24 h-24" },
    { name: "Iron Man", src: "/assets/ironman.png", border: "border-red-900/70", bg: "from-gray-900/40 to-black/40", delay: 500, size: "w-20 h-20" },
    { name: "Doctor Strange", src: "/assets/strange.png", border: "border-orange-900/70", bg: "from-gray-900/40 to-black/40", delay: 3600, size: "w-32 h-32" },


    { name: "Ant-Man", src: "/assets/ant.png", border: "border-red-900/70", bg: "from-gray-900/40 to-black/40", delay: 2700, size: "w-20 h-20" },
    { name: "Hawkeye", src: "/assets/hawkeye.png", border: "border-purple-900/70", bg: "from-gray-900/40 to-black/40", delay: 4200, size: "w-20 h-20" },
    { name: "Iron Core", src: "/assets/ironcore.png", border: "border-red-900/70", bg: "from-gray-900/40 to-black/40", delay: 900, size: "w-20 h-20" },
    { name: "S.H.I.E.L.D", src: "/assets/shield.png", border: "border-gray-700/70", bg: "from-gray-900/40 to-black/40", delay: 2400, size: "w-28 h-28" },
    { name: "Wolverine", src: "/assets/wolverine.png", border: "border-yellow-900/70", bg: "from-gray-900/40 to-black/40", delay: 1200, size: "w-28 h-28" },
    // duplicates for more density

    { name: "Thor", src: "/assets/thor.png", border: "border-blue-900/70", bg: "from-gray-900/40 to-black/40", delay: 1800, size: "w-24 h-24" },
    { name: "Hulk", src: "/assets/hulk.png", border: "border-green-900/70", bg: "from-gray-900/40 to-black/40", delay: 2600, size: "w-28 h-28" },
    { name: "Spider-Man", src: "/assets/spiderman.png", border: "border-red-800/70", bg: "from-gray-900/40 to-black/40", delay: 3400, size: "w-20 h-20" },
    { name: "Doctor Strange", src: "/assets/strange.png", border: "border-orange-900/70", bg: "from-gray-900/40 to-black/40", delay: 4100, size: "w-24 h-24" },
    { name: "Black Panther", src: "/assets/blackpanther.png", border: "border-gray-800/70", bg: "from-gray-900/40 to-black/40", delay: 1200, size: "w-20 h-20" },
];

type Testimonial = {
    name: string;
    role: string;
    description: string;
};
export const testimonialsData: Testimonial[] = [
    { name: "Teesta Mukherjee", role: "Heart Recipient", description: "Thanks to organ donation, I got a second chance at life. Now I can watch my children grow up." },
    { name: "Arun Verma", role: "Kidney Recipient", description: "Dialysis was draining my life, but the transplant gave me the freedom to live again." },
    { name: "Nisha Kapoor", role: "Liver Donor (Living)", description: "Donating part of my liver to my father was the best decision of my life. He's healthier than ever." },
    { name: "Ravi Subramanian", role: "Donor's Brother", description: "Losing my sister was heartbreaking, but knowing she saved four lives gives me peace." },
    { name: "Fatima Khan", role: "Cornea Recipient", description: "I was blind for over a decade. Now I can see my grandchildren's faces thanks to someone's gift." },
    { name: "Devansh Rathi", role: "Awareness Volunteer", description: "Talking to people about organ donation changed my perspective—and theirs too." },
    { name: "Megha Chatterjee", role: "Mother of Recipient", description: "My son was just 8 when he got a liver transplant. That anonymous donor saved his childhood." },
    { name: "Prakash Iyer", role: "Transplant Surgeon", description: "Every successful transplant I perform reminds me of the deep humanity in donation." },
    { name: "Ananya Roy", role: "Tissue Recipient", description: "After a major accident, donated skin helped me recover without severe scarring." },
    { name: "Mohit Sharma", role: "Donor (Living Kidney)", description: "I donated a kidney to my cousin. We both lead healthy lives today." },
    { name: "Sharanya Pillai", role: "Social Worker", description: "I work with donor families, and their strength in loss never fails to move me." },
    { name: "Yusuf Ali", role: "Father of Donor", description: "My daughter died too soon, but her organs saved six lives. Her kindness lives on." },
];