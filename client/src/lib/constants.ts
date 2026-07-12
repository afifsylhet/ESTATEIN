export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' },
  { value: 'office', label: 'Office' },
] as const;

export const PROPERTY_PURPOSES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
] as const;

export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
] as const;

export const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-furnished' },
  { value: 'furnished', label: 'Furnished' },
] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const;

export const AMENITIES_LIST = [
  'Swimming Pool',
  'Gym',
  '24/7 Security',
  'Parking',
  'Garden',
  'Balcony',
  'Elevator',
  'Air Conditioning',
  'Central Heating',
  'Pet Friendly',
  'Furnished',
  'High-Speed Internet',
  'Solar Panels',
  'Smart Home System',
  'Backup Generator',
  'Play Area',
];

export const ROLES = { USER: 'user', ADMIN: 'admin' } as const;

// These must match the accounts created by `npm run seed:admin` in the server.
// Demo user is a fixed, low-privilege account. Demo admin uses the SEED_ADMIN_* env
// values from the server's .env — update this if you changed those defaults.
export const DEMO_CREDENTIALS = {
  user: { email: 'demo.user@estatein.com', password: 'DemoUser123!' },
  admin: { email: 'admin@estatein.com', password: 'ChangeMe123!' },
};
