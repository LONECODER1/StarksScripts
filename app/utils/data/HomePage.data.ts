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
