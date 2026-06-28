export const headerNavItems = [
  { label: 'HOME', id: 'home' },
  { label: 'FEATURES', id: 'features' },
  { label: 'TESTIMONIALS', id: 'testimonials' },
  { label: 'PRICING', id: 'pricing' },
  { label: 'FAQs', id: 'faqs' },
  { label: 'CONTACTS', id: 'contact' },
] as const;

export const headerItems = headerNavItems.map((item) => item.label);

export type NavSectionId = typeof headerNavItems[number]['id'];

export const featuresData = [
  {
    col: 'left',
    cards: [
      {
        icon: '⚡',
        title: 'Arc Reactor Core',
        description: 'Infinite clean energy powering every script with near-zero latency and maximum throughput.',
        tag: 'Performance',
        tagColor: '#dc2626',
      },
      {
        icon: '🛡️',
        title: 'Vibranium Shield',
        description: 'Enterprise-grade security protocols wrapping every API call and data transaction.',
        tag: 'Security',
        tagColor: '#2563eb',
      },
    ],
  },
  {
    col: 'center',
    cards: [
      {
        icon: '🤖',
        title: 'J.A.R.V.I.S. Intelligence',
        description: "An AI-powered assistant that learns your workflow, predicts bottlenecks, and auto-resolves issues before they surface — just like having Stark's AI on your team.",
        tag: 'AI Engine',
        tagColor: '#dc2626',
        tall: true,
      },
    ],
  },
  {
    col: 'right',
    cards: [
      {
        icon: '🌐',
        title: 'Global Deployment',
        description: 'Deploy to 40+ edge regions instantly with automated rollback and zero-downtime upgrades.',
        tag: 'Infrastructure',
        tagColor: '#059669',
      },
      {
        icon: '📡',
        title: 'Real-time Signals',
        description: 'Live telemetry and observability dashboards that surface anomalies the moment they occur.',
        tag: 'Monitoring',
        tagColor: '#7c3aed',
      },
    ],
  },
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