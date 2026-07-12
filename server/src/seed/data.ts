/**
 * Static content pools used by the database seed. Kept separate from the seed
 * runner so the runner stays focused on wiring relationships and timestamps.
 * All imagery references Unsplash CDN URLs (allow-listed in next.config) so the
 * frontend renders real, high-quality photos with zero placeholder content.
 */

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Exterior + interior real-estate photography pool. */
export const PROPERTY_IMAGES: string[] = [
  '1560518883-ce09059eeffa',
  '1512917774080-9991f1c4c750',
  '1570129477492-45c003edd2be',
  '1568605114967-8130f3a36994',
  '1580587771525-78b9dba3b914',
  '1600585154340-be6161a56a0c',
  '1600596542815-ffad4c1539a9',
  '1600607687939-ce8a6c25118c',
  '1600566753086-00f18fb6b3ea',
  '1600210492486-724fe5c67fb0',
  '1600047509807-ba8f99d2cdde',
  '1600585152220-90363fe7e115',
  '1449844908441-8829872d2607',
  '1502672260266-1c1ef2d93688',
  '1522708323590-d24dbb6b0267',
  '1493809842364-78817add7ffb',
  '1484154218962-a197022b5858',
  '1416331108676-a22ccb276e35',
  '1502005229762-cf1b2da7c5d6',
  '1554995207-c18c203602cb',
  '1560448204-e02f11c3d0e2',
  '1502672023488-70e25813eb80',
  '1560448075-bb485b067938',
  '1600566752355-35792bedcfea',
  '1600573472550-8090b5e0745e',
  '1600585153490-76fb20a32601',
  '1613490493576-7fde63acd811',
  '1512453979798-5ea266f8880c',
  '1600047509358-9dc75507daeb',
  '1600121848594-d8644e57abab',
];

/** Office / commercial photography pool. */
export const COMMERCIAL_IMAGES: string[] = [
  '1486406146926-c627a92ad1ab',
  '1497366754035-f200968a6e72',
  '1497366811353-6870744d04b2',
  '1524758631624-e2822e304c36',
  '1486312338219-ce68d2c6f44d',
  '1497215728101-856f4ea42174',
  '1431540015161-0bf868a2d407',
  '1462899006636-339e08d1844e',
];

/** Land / plot photography pool. */
export const LAND_IMAGES: string[] = [
  '1500382017468-9049fed747ef',
  '1416879595882-3373a0480b5b',
  '1510784722466-f2aa9c52fff6',
  '1441974231531-c6227db76b6e',
];

export const AVATARS: string[] = [
  '1500648767791-00dcc994a43e',
  '1494790108377-be9c29b29330',
  '1507003211169-0a1dd7228f2d',
  '1438761681033-6461ffad8d80',
  '1472099645785-5658abf4ff4e',
  '1544005313-94ddf0286df2',
  '1519345182560-3f2917c472ef',
  '1573497019940-1c28c88b4f3e',
  '1506794778202-cad84cf45f1d',
  '1534528741775-53994a69daeb',
  '1548142813-c348350df52b',
  '1557862921-37829c790f19',
];

export const BLOG_COVERS: string[] = [
  '1560518883-ce09059eeffa',
  '1560520653-9e0e4c89eb11',
  '1524758631624-e2822e304c36',
  '1567496898669-ee935f5f647a',
  '1600585154340-be6161a56a0c',
  '1554995207-c18c203602cb',
  '1512917774080-9991f1c4c750',
  '1497366216548-37526070297c',
  '1486406146926-c627a92ad1ab',
  '1449844908441-8829872d2607',
  '1580587771525-78b9dba3b914',
  '1512453979798-5ea266f8880c',
];

export const img = (id: string, w = 1600) => U(id, w);

export interface CityInfo {
  city: string;
  state: string;
  country: string;
  zip: string;
  lat: number;
  lng: number;
  neighborhoods: string[];
}

export const CITIES: CityInfo[] = [
  { city: 'New York', state: 'NY', country: 'USA', zip: '10001', lat: 40.7128, lng: -74.006, neighborhoods: ['SoHo', 'Tribeca', 'Upper East Side', 'Chelsea'] },
  { city: 'Los Angeles', state: 'CA', country: 'USA', zip: '90001', lat: 34.0522, lng: -118.2437, neighborhoods: ['Beverly Hills', 'Santa Monica', 'Bel Air', 'Venice'] },
  { city: 'Miami', state: 'FL', country: 'USA', zip: '33101', lat: 25.7617, lng: -80.1918, neighborhoods: ['South Beach', 'Brickell', 'Coral Gables', 'Coconut Grove'] },
  { city: 'Austin', state: 'TX', country: 'USA', zip: '73301', lat: 30.2672, lng: -97.7431, neighborhoods: ['Downtown', 'Zilker', 'Barton Hills', 'Mueller'] },
  { city: 'Seattle', state: 'WA', country: 'USA', zip: '98101', lat: 47.6062, lng: -122.3321, neighborhoods: ['Capitol Hill', 'Ballard', 'Queen Anne', 'Fremont'] },
  { city: 'Chicago', state: 'IL', country: 'USA', zip: '60601', lat: 41.8781, lng: -87.6298, neighborhoods: ['Lincoln Park', 'River North', 'Gold Coast', 'Wicker Park'] },
  { city: 'San Francisco', state: 'CA', country: 'USA', zip: '94102', lat: 37.7749, lng: -122.4194, neighborhoods: ['Nob Hill', 'Mission', 'Pacific Heights', 'SoMa'] },
  { city: 'Boston', state: 'MA', country: 'USA', zip: '02108', lat: 42.3601, lng: -71.0589, neighborhoods: ['Back Bay', 'Beacon Hill', 'South End', 'Seaport'] },
  { city: 'Denver', state: 'CO', country: 'USA', zip: '80202', lat: 39.7392, lng: -104.9903, neighborhoods: ['LoDo', 'Cherry Creek', 'Wash Park', 'Highlands'] },
  { city: 'Nashville', state: 'TN', country: 'USA', zip: '37201', lat: 36.1627, lng: -86.7816, neighborhoods: ['The Gulch', 'Germantown', 'East Nashville', '12 South'] },
];

export const STREETS = [
  'Maple Avenue', 'Oak Street', 'Sunset Boulevard', 'Park Lane', 'Highland Drive',
  'Lakeview Terrace', 'Riverside Road', 'Willow Court', 'Birchwood Lane', 'Grandview Street',
  'Harbor Way', 'Meadow Lane', 'Crestwood Drive', 'Elmwood Avenue', 'Bayshore Drive',
];

export interface TypeConfig {
  type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land' | 'office';
  label: string;
  categorySlug: string;
  saleMin: number;
  saleMax: number;
  rentMin: number;
  rentMax: number;
  areaMin: number;
  areaMax: number;
  bedMin: number;
  bedMax: number;
  bathMin: number;
  bathMax: number;
  rentable: boolean;
  images: string[];
}

export const TYPE_CONFIGS: TypeConfig[] = [
  { type: 'apartment', label: 'Apartment', categorySlug: 'apartment', saleMin: 250000, saleMax: 1200000, rentMin: 1500, rentMax: 6500, areaMin: 650, areaMax: 2200, bedMin: 1, bedMax: 4, bathMin: 1, bathMax: 3, rentable: true, images: PROPERTY_IMAGES },
  { type: 'house', label: 'House', categorySlug: 'house', saleMin: 400000, saleMax: 2500000, rentMin: 2500, rentMax: 9000, areaMin: 1500, areaMax: 4500, bedMin: 3, bedMax: 6, bathMin: 2, bathMax: 5, rentable: true, images: PROPERTY_IMAGES },
  { type: 'villa', label: 'Villa', categorySlug: 'villa', saleMin: 900000, saleMax: 6500000, rentMin: 6000, rentMax: 25000, areaMin: 3000, areaMax: 9000, bedMin: 4, bedMax: 8, bathMin: 4, bathMax: 8, rentable: true, images: PROPERTY_IMAGES },
  { type: 'commercial', label: 'Commercial Space', categorySlug: 'commercial', saleMin: 500000, saleMax: 8000000, rentMin: 4000, rentMax: 40000, areaMin: 2000, areaMax: 20000, bedMin: 0, bedMax: 0, bathMin: 2, bathMax: 6, rentable: true, images: COMMERCIAL_IMAGES },
  { type: 'land', label: 'Land Plot', categorySlug: 'land', saleMin: 150000, saleMax: 3000000, rentMin: 0, rentMax: 0, areaMin: 5000, areaMax: 60000, bedMin: 0, bedMax: 0, bathMin: 0, bathMax: 0, rentable: false, images: LAND_IMAGES },
  { type: 'office', label: 'Office Suite', categorySlug: 'office', saleMin: 600000, saleMax: 9000000, rentMin: 5000, rentMax: 45000, areaMin: 1200, areaMax: 15000, bedMin: 0, bedMax: 0, bathMin: 2, bathMax: 8, rentable: true, images: COMMERCIAL_IMAGES },
];

export const CATEGORIES = [
  { name: 'Apartment', slug: 'apartment', icon: 'Building', description: 'Stylish city apartments and condos with modern amenities and skyline views.' },
  { name: 'House', slug: 'house', icon: 'Home', description: 'Family homes with spacious living areas, private yards and quiet streets.' },
  { name: 'Villa', slug: 'villa', icon: 'Landmark', description: 'Luxury villas featuring pools, expansive grounds and premium finishes.' },
  { name: 'Commercial', slug: 'commercial', icon: 'Warehouse', description: 'Retail units, warehouses and mixed-use commercial spaces for growing businesses.' },
  { name: 'Land', slug: 'land', icon: 'TreePine', description: 'Prime residential and development land plots in high-growth locations.' },
  { name: 'Office', slug: 'office', icon: 'Briefcase', description: 'Grade-A office suites and coworking-ready floors in central business districts.' },
];

export const ADJECTIVES = [
  'Modern', 'Luxurious', 'Spacious', 'Elegant', 'Sunlit', 'Stunning',
  'Contemporary', 'Charming', 'Designer', 'Panoramic', 'Serene', 'Chic',
];

export const AMENITIES = [
  'Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Garden', 'Balcony',
  'Elevator', 'Air Conditioning', 'Central Heating', 'Pet Friendly',
  'High-Speed Internet', 'Solar Panels', 'Smart Home System', 'Backup Generator',
  'Play Area', 'Concierge', 'Rooftop Terrace', 'Walk-in Closet',
];

/** Realistic first/last name pools for agents and users. */
export const FIRST_NAMES = [
  'James', 'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia',
  'Mason', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander',
  'Amelia', 'Benjamin', 'Harper', 'Daniel', 'Evelyn', 'Michael', 'Grace',
  'Carter', 'Chloe', 'Owen', 'Layla', 'Gabriel', 'Zoe', 'Julian', 'Nora',
];

export const LAST_NAMES = [
  'Anderson', 'Bennett', 'Carter', 'Diaz', 'Edwards', 'Foster', 'Griffin',
  'Hughes', 'Ingram', 'Jenkins', 'Kelley', 'Lambert', 'Mitchell', 'Newton',
  'Owens', 'Patterson', 'Quinn', 'Reyes', 'Sullivan', 'Turner', 'Underwood',
  'Vaughn', 'Walsh', 'Young', 'Barnes', 'Coleman', 'Dawson', 'Ellison',
];

export const AGENT_TITLES = [
  'Senior Property Consultant', 'Luxury Sales Specialist', 'Commercial Advisor',
  'Residential Agent', 'Investment Advisor', 'Lettings Manager',
  'Principal Broker', 'Buyer\'s Agent',
];

export const REVIEW_COMMENTS = [
  'The property exceeded our expectations. Natural light floods every room and the finishes are immaculate.',
  'Fantastic location with everything within walking distance. The agent was responsive and professional throughout.',
  'Great value for the area. The kitchen and bathrooms have been beautifully renovated.',
  'We loved the layout and the outdoor space. Perfect for our growing family.',
  'A quiet, well-maintained building with excellent amenities. Highly recommend viewing in person.',
  'The virtual tour was accurate and the in-person visit sealed the deal. Smooth process from start to finish.',
  'Spacious rooms and thoughtful storage throughout. The neighborhood is safe and friendly.',
  'Modern design meets comfort. The smart-home features are a genuinely useful touch.',
  'Stunning views and a fantastic sense of privacy despite being close to the center.',
  'The team handled every detail. Move-in was seamless and the property was spotless.',
];

export const TESTIMONIALS = [
  { name: 'Rebecca Lawson', role: 'First-time Buyer', rating: 5, message: 'Estatein made buying my first apartment completely stress-free. My agent understood exactly what I wanted and found it within a week.' },
  { name: 'Marcus Feldman', role: 'Property Investor', rating: 5, message: 'I have closed four investment deals through Estatein. Their market data and off-market access are genuinely a step above the rest.' },
  { name: 'Priya Natarajan', role: 'Relocating Executive', rating: 5, message: 'Relocating across the country was daunting, but the team handled viewings remotely and negotiated a great price on my behalf.' },
  { name: 'Daniel O\'Brien', role: 'Home Seller', rating: 4, message: 'Sold my house 12% above asking in under three weeks. The photography and staging advice made a real difference.' },
  { name: 'Sofia Romano', role: 'Renter', rating: 5, message: 'Every listing I viewed matched its photos exactly. No wasted trips, no surprises — refreshingly honest service.' },
  { name: 'Aaron Whitfield', role: 'Commercial Tenant', rating: 5, message: 'Found the perfect office suite for our expanding team. The commercial advisor knew the district inside out.' },
  { name: 'Hannah Brooks', role: 'Downsizing Retiree', rating: 5, message: 'Patient, kind and never pushy. They helped us find a cozy home that fits our new lifestyle perfectly.' },
  { name: 'Victor Alvarez', role: 'Luxury Buyer', rating: 5, message: 'The concierge-level service for high-end villas is exceptional. Private viewings were arranged around my schedule.' },
  { name: 'Nina Kowalski', role: 'Landlord', rating: 4, message: 'Their lettings team keeps my units occupied with reliable tenants. Reporting is transparent and timely.' },
  { name: 'Terrence Blake', role: 'Second-home Buyer', rating: 5, message: 'Bought a lakeside villa entirely through their platform. The saved-search alerts flagged it the day it listed.' },
  { name: 'Elena Petrova', role: 'Young Professional', rating: 5, message: 'The app is beautiful and fast. I could compare properties side by side and book viewings in a couple of taps.' },
  { name: 'Gregory Sanders', role: 'Family Buyer', rating: 5, message: 'From mortgage guidance to closing, everything was handled with care. We felt supported at every step.' },
  { name: 'Maya Fischer', role: 'Investor', rating: 4, message: 'Solid analytics and honest advice on rental yields. Helped me avoid a couple of overpriced listings.' },
  { name: 'Julian Castellano', role: 'Corporate Client', rating: 5, message: 'We source all our regional office space through Estatein now. Consistent, professional and well-connected.' },
];

export interface BlogSeed {
  title: string;
  excerpt: string;
  tags: string[];
  paragraphs: string[];
}

export const BLOGS: BlogSeed[] = [
  {
    title: '10 Questions to Ask Before Buying Your First Home',
    excerpt: 'Buying your first property is exciting — and full of decisions. Here are the essential questions that separate a confident purchase from an expensive regret.',
    tags: ['Buying', 'First-time Buyers', 'Guides'],
    paragraphs: [
      'Purchasing your first home is one of the largest financial commitments you will ever make, and the difference between a great decision and a costly one often comes down to the questions you ask before signing anything.',
      'Start with the fundamentals: what is your true, all-in budget once taxes, insurance, maintenance and closing costs are included? Many first-time buyers anchor on the sticker price and are caught off guard by the ongoing cost of ownership.',
      'Investigate the neighborhood as thoroughly as the property itself. Visit at different times of day, check commute times during rush hour, and research planned developments that could change the character of the area.',
      'Finally, never skip the inspection. A few hundred dollars spent uncovering structural, electrical or plumbing issues can save you tens of thousands down the line — and gives you real leverage in negotiations.',
    ],
  },
  {
    title: 'How to Read a Property Listing Like a Professional',
    excerpt: 'Listings are marketing documents. Learn to decode the language, spot the red flags, and identify genuine value the way experienced agents do.',
    tags: ['Buying', 'Tips'],
    paragraphs: [
      'Every property listing is written to sell. Words like "cozy", "characterful" and "up-and-coming" carry meaning that experienced buyers learn to translate quickly.',
      'Pay close attention to what is not shown. A gallery that avoids the kitchen or bathroom, or photos taken exclusively with a wide-angle lens, can signal areas the seller would rather you did not scrutinize.',
      'Cross-reference the stated square footage against the room count and layout. Numbers that do not add up are worth a direct question before you invest time in a viewing.',
      'Above all, compare the asking price against recent sales of similar properties nearby. Data beats adjectives every time.',
    ],
  },
  {
    title: 'The Real Cost of Renting vs. Buying in 2026',
    excerpt: 'The rent-versus-buy question has no universal answer. We break down the math, the lifestyle trade-offs, and the break-even timeline.',
    tags: ['Finance', 'Renting', 'Buying'],
    paragraphs: [
      'The decision to rent or buy is rarely purely financial, but understanding the numbers gives you the confidence to make a choice that fits your life.',
      'Renting offers flexibility and predictable monthly costs, with no exposure to maintenance surprises or market downturns. For anyone likely to move within a few years, it often wins outright.',
      'Buying builds equity and hedges against rising rents, but the upfront and transaction costs mean you typically need to stay put for several years to come out ahead.',
      'Run your own break-even analysis using realistic assumptions about price growth, interest rates and how long you plan to stay. The answer is personal — but it should be based on math, not fear of missing out.',
    ],
  },
  {
    title: 'Staging Secrets That Sell Homes Faster',
    excerpt: 'Well-staged homes sell quicker and for more. These proven, low-cost staging techniques help buyers picture themselves living there.',
    tags: ['Selling', 'Staging'],
    paragraphs: [
      'Staging is not about expensive furniture — it is about helping buyers emotionally move in before they have made an offer.',
      'Declutter ruthlessly and depersonalize. Family photos and collections should make way for neutral, aspirational spaces that let the buyer project their own life onto the home.',
      'Light is your most powerful tool. Open every curtain, replace dim bulbs with warm-white LEDs, and clean the windows until they disappear.',
      'Finish with small sensory details: fresh flowers, a subtle scent, and perfectly made beds. These touches cost little but consistently lift both offer prices and speed of sale.',
    ],
  },
  {
    title: 'Understanding Mortgage Rates and How to Get the Best Deal',
    excerpt: 'A fraction of a percentage point can cost or save you tens of thousands over a loan\'s life. Here is how to secure the most competitive rate.',
    tags: ['Finance', 'Mortgages'],
    paragraphs: [
      'Your mortgage rate is determined by a mix of factors you control and factors you do not — and the ones you control are worth optimizing well before you apply.',
      'Your credit score is the single biggest lever. Paying down revolving balances and correcting report errors months in advance can move you into a better rate tier.',
      'A larger deposit reduces the lender\'s risk and unlocks lower rates. Where possible, crossing key loan-to-value thresholds can produce an outsized improvement.',
      'Finally, shop around and get quotes from multiple lenders on the same day. Rates move constantly, and loyalty to a single bank rarely pays.',
    ],
  },
  {
    title: 'Why Location Still Beats Everything Else',
    excerpt: 'You can renovate a kitchen, but you cannot move a house. Here is why location remains the most durable driver of property value.',
    tags: ['Investment', 'Guides'],
    paragraphs: [
      'The oldest cliché in real estate endures because it is true: location is the one variable you can never change after purchase.',
      'Proximity to good schools, transport links and employment hubs underpins demand — and demand underpins long-term value and liquidity when you come to sell.',
      'Look for early indicators of positive change: new transit lines, infrastructure investment, and the arrival of independent cafés and businesses often precede price growth.',
      'A modest home in a strong location will almost always outperform a spectacular home in a weak one. Buy the street first, the house second.',
    ],
  },
  {
    title: 'A Landlord\'s Guide to Attracting Reliable Tenants',
    excerpt: 'Great tenants make property investment effortless. These practical steps help you attract and retain the right people.',
    tags: ['Investment', 'Renting'],
    paragraphs: [
      'The best defense against void periods and payment problems is attracting quality tenants in the first place — and that starts long before anyone applies.',
      'Present the property professionally: clean, well-maintained and photographed properly. A home that signals care attracts tenants who will treat it with care.',
      'Screen thoroughly but fairly, with consistent criteria applied to every applicant. Reference checks and affordability assessments protect both parties.',
      'Once you have great tenants, keep them. Responsive maintenance and fair, transparent communication cost far less than the churn of finding replacements.',
    ],
  },
  {
    title: 'Smart Home Upgrades That Actually Add Value',
    excerpt: 'Not every gadget pays off at resale. We rank the smart-home investments buyers genuinely care about.',
    tags: ['Technology', 'Selling'],
    paragraphs: [
      'Smart-home technology has moved from novelty to expectation, but not every upgrade returns its cost when you sell.',
      'Energy efficiency wins consistently. Smart thermostats and efficient lighting appeal to buyers because they promise lower running costs from day one.',
      'Security features — video doorbells, smart locks and integrated cameras — offer peace of mind that translates into real perceived value.',
      'Avoid over-customizing around a single ecosystem. Buyers value flexible, widely compatible systems over locked-in setups they may not want to inherit.',
    ],
  },
  {
    title: 'The Complete Guide to Property Viewings',
    excerpt: 'A great viewing is part detective work, part gut check. Here is how to make every visit count.',
    tags: ['Buying', 'Guides'],
    paragraphs: [
      'A property viewing is your best chance to catch what photos and descriptions conceal, so approach it with a plan rather than pure enthusiasm.',
      'Engage all your senses: listen for traffic and noisy neighbors, note any damp smells, and check water pressure and how the home feels temperature-wise.',
      'Bring a checklist and take photos of anything that concerns you. It is easy to forget details after visiting several homes in a single day.',
      'Do not be afraid to ask direct questions about why the owner is selling, how long it has been on the market, and what is included. The answers are often revealing.',
    ],
  },
  {
    title: 'Investing in Commercial Real Estate: A Beginner\'s Primer',
    excerpt: 'Commercial property offers attractive yields and longer leases — but it plays by different rules. Start here.',
    tags: ['Investment', 'Commercial'],
    paragraphs: [
      'Commercial real estate can deliver stronger yields and longer, more stable leases than residential — but it demands a different kind of due diligence.',
      'Understand the lease structure before anything else. Terms like triple-net can shift maintenance, taxes and insurance onto the tenant, dramatically changing your net return.',
      'Tenant quality is paramount. A single well-established business on a long lease can be worth more than several short-term occupants in a higher-traffic location.',
      'Factor in longer void periods and higher fit-out costs. Commercial spaces can take months to re-let, so build a healthy cash reserve into your model.',
    ],
  },
  {
    title: 'How to Negotiate the Best Price on Any Property',
    excerpt: 'Negotiation is a skill, not a personality trait. These tactics help you buy well without losing the deal.',
    tags: ['Buying', 'Tips'],
    paragraphs: [
      'Successful negotiation begins with information. Know the property\'s history, the seller\'s motivation, and the true value of comparable homes before you make an offer.',
      'Lead with a rationale, not just a number. An offer backed by recent comparable sales and specific repair estimates is far harder to dismiss than a lowball figure.',
      'Keep emotion out of the conversation and be prepared to walk away. The party most willing to walk almost always holds the stronger position.',
      'Remember that price is only one lever. Flexible timelines, waived contingencies and a clean, ready-to-proceed offer can win a deal even when you are not the highest bidder.',
    ],
  },
  {
    title: 'Designing a Home Office That Boosts Productivity',
    excerpt: 'Remote work is here to stay. A well-designed home office adds both daily comfort and resale appeal.',
    tags: ['Lifestyle', 'Design'],
    paragraphs: [
      'With hybrid and remote work now permanent for many, a dedicated home office has shifted from luxury to genuine buying criterion.',
      'Prioritize natural light and a door that closes. Separation from the rest of the home is what makes a space feel like an office rather than a corner of the living room.',
      'Invest in ergonomics and cable management. A comfortable chair and a clutter-free desk pay dividends in both focus and long-term health.',
      'When it comes time to sell, a flexible, well-lit office that can double as a guest room or nursery broadens your pool of buyers considerably.',
    ],
  },
];

export const CONTACTS = [
  { name: 'Grace Holloway', subject: 'Question about scheduling a viewing', message: 'Hi, I would love to arrange a weekend viewing for one of your downtown apartments. What times do you have available this Saturday?' },
  { name: 'Marcus Webb', subject: 'Selling my property', message: 'I am considering listing my three-bedroom house and would like to understand your commission structure and marketing approach.' },
  { name: 'Aisha Rahman', subject: 'Commercial lease inquiry', message: 'Our startup is looking for around 3,000 sq ft of office space in the central business district. Can someone advise on current availability?' },
  { name: 'Tom Fletcher', subject: 'Mortgage guidance', message: 'Do you have a recommended mortgage advisor? I am pre-approved but would like a second opinion on rates before proceeding.' },
  { name: 'Isabelle Moreau', subject: 'International buyer', message: 'I am relocating from Paris next quarter and want to begin viewing family homes remotely. How do you support overseas clients?' },
  { name: 'Devon Clarke', subject: 'Feedback on the website', message: 'Just wanted to say the property comparison tool is excellent — made shortlisting so much easier. Keep it up!' },
  { name: 'Sandra Nguyen', subject: 'Rental application status', message: 'I submitted an application for a two-bedroom rental last week and wanted to check on the status. Thank you!' },
  { name: 'Raj Patel', subject: 'Investment portfolio review', message: 'I own several rental units and would like to explore consolidating or expanding. Could an investment advisor reach out?' },
  { name: 'Emily Sorensen', subject: 'Land purchase question', message: 'Are the development land plots you list zoned for residential construction? I am exploring a small build project.' },
  { name: 'Carlos Mendes', subject: 'General inquiry', message: 'What areas do your agents cover outside the major cities? I am interested in something a little more rural.' },
];

export const INQUIRY_MESSAGES = [
  'I am very interested in this property. Could we arrange a viewing this week?',
  'Is the asking price negotiable? I am a cash buyer ready to move quickly.',
  'Could you send me more details about the HOA fees and what they cover?',
  'Is this property still available? I would like to schedule a visit.',
  'What is the earliest possible move-in date for this listing?',
  'Are pets allowed in this building? I have a small, well-behaved dog.',
  'Could you confirm the parking arrangements included with the property?',
  'I would love a virtual tour before traveling to view in person. Is that possible?',
  'Has the property had any recent renovations or major repairs?',
  'What are the estimated monthly utility costs for a home this size?',
];
