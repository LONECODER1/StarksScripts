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
