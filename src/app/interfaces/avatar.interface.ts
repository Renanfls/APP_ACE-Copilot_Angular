export type AvatarCategory = 'male' | 'female' | 'neutral';
export type AvatarType = 'free' | 'premium' | 'custom';

export interface Avatar {
  id: string;
  image: string;
  category: AvatarCategory;
  style: string;
  type: AvatarType;
  price?: number;
  accessories?: string[];
}

export interface UserAvatar extends Avatar {
  purchasedAt: Date;
}

// Free avatars - one for each gender
export const FREE_AVATARS: Avatar[] = [
  // Male Avatar
  {
    id: 'free-1',
    image: './assets/avatars/free-1.svg',
    category: 'male',
    style: 'adventurer',
    type: 'free'
  },
  {
    id: 'free-2',
    image: './assets/avatars/free-2.svg',
    category: 'male',
    style: 'adventurer',
    type: 'free'
  },
  {
    id: 'free-3',
    image: './assets/avatars/free-3.svg',
    category: 'male',
    style: 'adventurer',
    type: 'free'
  },
  // Female Avatar
  {
    id: 'free-4',
    image: './assets/avatars/free-4.svg',
    category: 'female',
    style: 'adventurer',
    type: 'free'
  },
  {
    id: 'free-5',
    image: './assets/avatars/free-5.svg',
    category: 'female',
    style: 'adventurer',
    type: 'free'
  },
  {
    id: 'free-6',
    image: './assets/avatars/free-6.svg',
    category: 'female',
    style: 'adventurer',
    type: 'free'
  },
];

// Premium avatars
export const PREMIUM_AVATARS: Avatar[] = [
  // Male Premium Avatars
  {
    id: 'premium-1',
    image: './assets/avatars/premium/premium-1.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-2',
    image: './assets/avatars/premium/premium-2.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-3',
    image: './assets/avatars/premium/premium-3.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 100
  },
  {
    id: 'premium-4',
    image: './assets/avatars/premium/premium-4.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  // Female Premium Avatars
  {
    id: 'premium-5',
    image: './assets/avatars/premium/premium-5.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-6',
    image: './assets/avatars/premium/premium-6.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-7',
    image: './assets/avatars/premium/premium-7.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 100
  },
  {
    id: 'premium-8',
    image: './assets/avatars/premium/premium-8.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-9',
    image: './assets/avatars/premium/premium-9.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-10',
    image: './assets/avatars/premium/premium-10.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-11',
    image: './assets/avatars/premium/premium-11.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
  {
    id: 'premium-12',
    image: './assets/avatars/premium/premium-12.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 75
  },
];

// Custom avatars (special/limited)
export const CUSTOM_AVATARS: Avatar[] = [
  // Male Custom Avatars
  {
    id: 'custom-1',
    image: './assets/avatars/custom/custom-1.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-2',
    image: './assets/avatars/custom/custom-2.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-3',
    image: './assets/avatars/custom/custom-3.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-6',
    image: './assets/avatars/custom/custom-6.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-7',
    image: './assets/avatars/custom/custom-7.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 50
  },
  {
    id: 'custom-8',
    image: './assets/avatars/custom/custom-8.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 50
  },
  {
    id: 'custom-9',
    image: './assets/avatars/custom/custom-9.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 50
  },
  // Female Custom Avatars
  {
    id: 'custom-4',
    image: './assets/avatars/custom/custom-4.svg',
    category: 'female',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-5',
    image: './assets/avatars/custom/custom-5.svg',
    category: 'female',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
  {
    id: 'custom-6',
    image: './assets/avatars/custom/custom-6.svg',
    category: 'female',
    style: 'adventurer',
    type: 'custom',
    price: 25
  },
];

// All available avatars
export const ALL_AVATARS: Avatar[] = [
  ...FREE_AVATARS,
  ...CUSTOM_AVATARS,
  ...PREMIUM_AVATARS,
]; 