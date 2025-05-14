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
    id: 'm1',
    image: 'assets/avatars/adventurer-avatar-m1.svg',
    category: 'male',
    style: 'adventurer',
    type: 'free'
  },
  // Female Avatar
  {
    id: 'f1',
    image: 'assets/avatars/adventurer-avatar-f1.svg',
    category: 'female',
    style: 'adventurer',
    type: 'free'
  },
  // Neutral Avatar
  {
    id: 'n1',
    image: 'assets/avatars/adventurer-avatar-n1.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'free'
  }
];

// Premium avatars
export const PREMIUM_AVATARS: Avatar[] = [
  // Male Premium Avatars
  {
    id: 'm2',
    image: 'assets/avatars/premium/adventurer-avatar-m2.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 40
  },
  {
    id: 'm3',
    image: 'assets/avatars/premium/adventurer-avatar-m3.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 45
  },
  {
    id: 'm4',
    image: 'assets/avatars/premium/adventurer-avatar-m4.svg',
    category: 'male',
    style: 'adventurer',
    type: 'premium',
    price: 50
  },
  // Female Premium Avatars
  {
    id: 'f2',
    image: 'assets/avatars/premium/adventurer-avatar-f2.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 40
  },
  {
    id: 'f3',
    image: 'assets/avatars/premium/adventurer-avatar-f3.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 45
  },
  {
    id: 'f4',
    image: 'assets/avatars/premium/adventurer-avatar-f4.svg',
    category: 'female',
    style: 'adventurer',
    type: 'premium',
    price: 50
  },
  // Neutral Premium Avatars
  {
    id: 'n2',
    image: 'assets/avatars/premium/adventurer-avatar-n2.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'premium',
    price: 40
  },
  {
    id: 'n3',
    image: 'assets/avatars/premium/adventurer-avatar-n3.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'premium',
    price: 45
  },
  {
    id: 'n4',
    image: 'assets/avatars/premium/adventurer-avatar-n4.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'premium',
    price: 50
  }
];

// Custom avatars (special/limited)
export const CUSTOM_AVATARS: Avatar[] = [
  // Male Custom Avatars
  {
    id: 'cm1',
    image: 'assets/avatars/custom/adventurer-avatar-cm1.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 100
  },
  {
    id: 'cm2',
    image: 'assets/avatars/custom/adventurer-avatar-cm2.svg',
    category: 'male',
    style: 'adventurer',
    type: 'custom',
    price: 150
  },
  // Female Custom Avatars
  {
    id: 'cf1',
    image: 'assets/avatars/custom/adventurer-avatar-cf1.svg',
    category: 'female',
    style: 'adventurer',
    type: 'custom',
    price: 100
  },
  {
    id: 'cf2',
    image: 'assets/avatars/custom/adventurer-avatar-cf2.svg',
    category: 'female',
    style: 'adventurer',
    type: 'custom',
    price: 150
  },
  // Neutral Custom Avatars
  {
    id: 'cn1',
    image: 'assets/avatars/custom/adventurer-avatar-cn1.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'custom',
    price: 100
  },
  {
    id: 'cn2',
    image: 'assets/avatars/custom/adventurer-avatar-cn2.svg',
    category: 'neutral',
    style: 'adventurer',
    type: 'custom',
    price: 150
  }
];

// All available avatars
export const ALL_AVATARS: Avatar[] = [
  ...FREE_AVATARS,
  ...PREMIUM_AVATARS,
  ...CUSTOM_AVATARS
]; 