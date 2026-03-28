export const CARD_TEMPLATES = [
  {
    id: 'amex_gold',
    name: 'Amex Gold Card',
    issuer: 'amex',
    annualFee: 325,
    renewalMonth: 1,
    rewardType: 'membership_rewards',
    earnRates: [
      { category: 'Dining', rate: 4, cap: 50000, region: 'US', description: '4x at restaurants worldwide, on up to $50K in purchases' },
      { category: 'Groceries', rate: 4, cap: 25000, region: 'US', description: '4x on groceries at U.S. supermarkets on up to $25,000 per year' },
      { category: 'Flights', rate: 3, region: 'US', description: '3x on flights booked directly with airlines' },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'Dining Credit', amount: 120, frequency: 'monthly', description: '$10/month at Chipotle, Grubhub, The Cheesecake Factory, etc.' },
      { name: 'Uber Cash', amount: 120, frequency: 'monthly', description: '$10/month for Uber Eats or Uber rides' },
      { name: 'Resy Credit', amount: 100, frequency: 'quarterly', description: '$100/quarter at Resy restaurants' },
      { name: 'Dunkin Credit', amount: 84, frequency: 'monthly', description: '$7/month at Dunkin locations' }
    ],
    benefits: [
      'American Express Preferred Seating',
      'ShopRunner Membership',
      'Purchase Protection',
      'Extended Warranty'
    ],
    annualCreditsValue: 524,
    imageColor: '#e6c87a',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'amex_platinum',
    name: 'Amex Platinum Card',
    issuer: 'amex',
    annualFee: 895,
    renewalMonth: 1,
    rewardType: 'membership_rewards',
    earnRates: [
      { category: 'Flights', rate: 5, region: 'US', description: '5x on flights booked directly with airlines' },
      { category: 'Hotels', rate: 5, region: 'US', description: '5x on hotels booked directly' },
      { category: 'Prepaid Hotels', rate: 5, region: 'US', description: '5x on prepaid hotels booked through AmexTravel' },
      { category: 'Other Travel', rate: 1, region: 'US' },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'Resy Credit', amount: 400, frequency: 'quarterly', description: '$100/quarter at Resy restaurants' },
      { name: 'Lululemon Credit', amount: 300, frequency: 'quarterly', description: '$75/quarter at Lululemon' },
      { name: 'Oura Ring Credit', amount: 200, frequency: 'annual', description: '$200 credit for Oura Ring purchases' },
      { name: 'Uber One Credit', amount: 120, frequency: 'monthly', description: '$10/month Uber One membership credit' },
      { name: 'Hotel Credit', amount: 600, frequency: 'semi-annual', description: '$600 at Fine Hotels & Resorts (biannual)' },
      { name: 'Digital Entertainment', amount: 300, frequency: 'monthly', description: '$25/month for select subscriptions' },
      { name: 'Saks', amount: 100, frequency: 'annual', description: '$50 at saks.com or Saks Fifth Avenue (biannual)' },
      { name: 'Global Entry', amount: 100, frequency: 'every_4_years', description: 'Up to $100 application fee credit' }
    ],
    benefits: [
      'Centurion Lounge Access',
      'Priority Pass Select',
      'Delta Sky Club (10 visits/year)',
      'Hilton Honors Gold Status',
      'Marriott Bonvoy Gold Elite',
      'Fine Hotels & Resorts Access',
      'Car Rental Status',
      'Global Lounge Collection',
      'Purchase Protection',
      'Extended Warranty',
      'Trip Cancellation Insurance'
    ],
    annualCreditsValue: 2885,
    imageColor: '#1a1a1a',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'chase',
    annualFee: 95,
    renewalMonth: 5,
    rewardType: 'ultimate_rewards',
    earnRates: [
      { category: 'Dining', rate: 3 },
      { category: 'Travel', rate: 3 },
      { category: 'Streaming', rate: 3 },
      { category: 'Online Grocery', rate: 3 },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'DoorDash Benefits', amount: 60, frequency: 'annual', description: '$5/month DoorDash credit' },
      { name: 'Instacart', amount: 84, frequency: 'annual', description: '$7/month Instacart credit' }
    ],
    benefits: [
      'Priority Pass Select Lounge Access',
      'Chase Travel Portal 25% bonus',
      'Primary Auto Rental Insurance',
      'Trip Cancellation Insurance',
      'Purchase Protection',
      'Extended Warranty'
    ],
    annualCreditsValue: 144,
    imageColor: '#0066b2',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'chase_sapphire_reserve',
    name: 'Chase Sapphire Reserve',
    issuer: 'chase',
    annualFee: 795,
    renewalMonth: 5,
    rewardType: 'ultimate_rewards',
    earnRates: [
      { category: 'Chase Travel', rate: 8, description: '8x on Chase Travel bookings' },
      { category: 'Direct Flights', rate: 4, description: '4x on direct bookings with airlines' },
      { category: 'Hotels', rate: 4, description: '4x on hotel bookings' },
      { category: 'Other Travel', rate: 1, description: '1x on other travel purchases' },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'Travel Credit', amount: 300, frequency: 'annual', description: '$300 automatic travel credit' },
      { name: 'The Edit Hotels', amount: 500, frequency: 'annual', description: '$500 at The Edit hotels' },
      { name: 'Dining Credit', amount: 300, frequency: 'annual', description: '$300 dining credit' },
      { name: 'StubHub Credit', amount: 300, frequency: 'annual', description: '$300 StubHub credit' },
      { name: 'Apple Services', amount: 250, frequency: 'annual', description: '$250 Apple Services credit' },
      { name: 'DoorDash', amount: 120, frequency: 'annual', description: '$10/month DoorDash credit' },
      { name: 'Instacart', amount: 120, frequency: 'annual', description: '$10/month Instacart credit' }
    ],
    benefits: [
      'Priority Pass Select Lounge Access',
      'Chase Sapphire Lounges',
      'Chase Travel Portal 50% bonus',
      'Primary Auto Rental Insurance',
      'Trip Cancellation Insurance',
      'Purchase Protection',
      'Extended Warranty',
      'Global Entry Credit'
    ],
    annualCreditsValue: 2190,
    imageColor: '#002244',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'bilt_palladium',
    name: 'Bilt Palladium Card',
    issuer: 'bilt',
    annualFee: 495,
    renewalMonth: 3,
    rewardType: 'bilt_points',
    earnRates: [
      { category: 'Rent', rate: 1, description: 'Earn points on rent (up to 100k/year)' },
      { category: 'Everyday Spend', rate: 2, description: '2x on everyday spending' },
      { category: 'Travel', rate: 3, description: '3x on travel (no foreign fees)' },
      { category: 'Dining', rate: 2, description: '2x at restaurants' },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'Bilt Travel Hotel Credit', amount: 400, frequency: 'annual', description: '$400 credit on Bilt Travel hotel bookings' },
      { name: 'Bilt Cash Option', amount: 0, frequency: 'included', description: '4% back as Bilt Cash on dining' },
      { name: 'Anytime Pay', amount: 0, frequency: 'included', description: 'No fees for Anytime Pay' },
      { name: 'Bilt Collection', amount: 0, frequency: 'included', description: 'Access to exclusive properties' }
    ],
    benefits: [
      'World Elite Mastercard Benefits',
      'Bilt Collection (exclusive properties)',
      'No foreign transaction fees',
      'Cell phone protection',
      'Travel protections',
      'Hyatt Discoverist Status'
    ],
    annualCreditsValue: 400,
    imageColor: '#00b5e2',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'hilton_surpass',
    name: 'Hilton Honors Surpass Card',
    issuer: 'amex',
    annualFee: 150,
    renewalMonth: 7,
    rewardType: 'hilton_points',
    earnRates: [
      { category: 'Hilton Hotels', rate: 12 },
      { category: 'Gas', rate: 6 },
      { category: 'Dining', rate: 6 },
      { category: 'Supermarkets', rate: 6 },
      { category: 'Online Shopping', rate: 4 },
      { category: 'Other', rate: 3 }
    ],
    credits: [
      { name: 'Hilton Credit', amount: 200, frequency: 'quarterly', description: '$50/quarter on Hilton purchases' },
      { name: 'Gold Status', amount: 0, frequency: 'included', description: 'Hilton Honors Gold status' },
      { name: 'National Status', amount: 0, frequency: 'included', description: 'National Car Rental Emerald Club Executive' },
      { name: 'Free Night', amount: 0, frequency: 'annual', description: 'Free weekend night after $15K spend' }
    ],
    benefits: [
      'Hilton Honors Gold Status',
      'Earn Diamond with $40K spend',
      '6th Night Free on award stays',
      'No foreign transaction fees',
      'Purchase Protection',
      'Extended Warranty'
    ],
    annualCreditsValue: 200,
    imageColor: '#003087',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'chase_freedom_flex',
    name: 'Chase Freedom Flex',
    issuer: 'chase',
    annualFee: 0,
    renewalMonth: 5,
    rewardType: 'ultimate_rewards',
    earnRates: [
      { category: 'Rotating Categories', rate: 5, cap: 1500, description: '5x on rotating categories (up to $1,500/quarter)' },
      { category: 'Dining', rate: 3 },
      { category: 'Drugstores', rate: 3 },
      { category: 'Travel', rate: 3 },
      { category: 'Other', rate: 1 }
    ],
    credits: [],
    benefits: [
      'Purchase Protection',
      'Extended Warranty'
    ],
    annualCreditsValue: 0,
    imageColor: '#00aeef',
    lastUpdated: '2026-03-27'
  },
  {
    id: 'citi_strata_premier',
    name: 'Citi Strata Premier',
    issuer: 'citi',
    annualFee: 195,
    renewalMonth: 4,
    rewardType: 'thankyou_points',
    earnRates: [
      { category: 'Travel', rate: 3 },
      { category: 'Dining', rate: 3 },
      { category: 'Supermarkets', rate: 3 },
      { category: 'Other', rate: 1 }
    ],
    credits: [
      { name: 'Hotel Credit', amount: 150, frequency: 'annual', description: '$150 off hotel bookings of $500+ through Citi Travel' }
    ],
    benefits: [
      'No Foreign Transaction Fees',
      'Trip Protection',
      'Purchase Protection'
    ],
    annualCreditsValue: 150,
    imageColor: '#003087',
    lastUpdated: '2026-03-27'
  }
];

export const CARD_ISSUERS = [
  { id: 'amex', name: 'American Express', color: '#006fcf', logo: '💳' },
  { id: 'chase', name: 'Chase', color: '#0066b2', logo: '🏦' },
  { id: 'citi', name: 'Citibank', color: '#003b70', logo: '🏛️' },
  { id: 'bilt', name: 'Bilt', color: '#00b5e2', logo: '🏠' },
  { id: 'capital_one', name: 'Capital One', color: '#d03027', logo: '💰' },
  { id: 'us_bank', name: 'US Bank', color: '#0068a0', logo: '🇺🇸' },
  { id: 'wells_fargo', name: 'Wells Fargo', color: '#d71e28', logo: '🏧' },
  { id: 'discover', name: 'Discover', color: '#ff6600', logo: '🔵' },
  { id: 'barclays', name: 'Barclays', color: '#00a0af', logo: '🇬🇧' },
  { id: 'other', name: 'Other', color: '#6b7280', logo: '💳' }
];

export const REWARD_TYPES = [
  { id: 'membership_rewards', name: 'Amex Membership Rewards', color: '#006fcf' },
  { id: 'ultimate_rewards', name: 'Chase Ultimate Rewards', color: '#0066b2' },
  { id: 'thankyou_points', name: 'Citi ThankYou Points', color: '#003b70' },
  { id: 'bilt_points', name: 'Bilt Points', color: '#00b5e2' },
  { id: 'capital_one_miles', name: 'Capital One Miles', color: '#d03027' },
  { id: 'hilton_points', name: 'Hilton Honors Points', color: '#003087' },
  { id: 'marriott_points', name: 'Marriott Bonvoy Points', color: '#a50034' },
  { id: 'delta_miles', name: 'Delta SkyMiles', color: '#003366' },
  { id: 'united_miles', name: 'United MileagePlus', color: '#002244' },
  { id: 'cash_back', name: 'Cash Back', color: '#22c55e' }
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CREDIT_FREQUENCIES = {
  monthly: { label: 'Monthly', periodsPerYear: 12, periodLabel: 'month' },
  quarterly: { label: 'Quarterly', periodsPerYear: 4, periodLabel: 'quarter' },
  'semi-annual': { label: 'Semi-Annual', periodsPerYear: 2, periodLabel: '6 months' },
  annual: { label: 'Annual', periodsPerYear: 1, periodLabel: 'year' },
  'every_4_years': { label: 'Every 4 Years', periodsPerYear: 0.25, periodLabel: '4 years' }
};

export const CARD_DATA_URL = 'https://gist.githubusercontent.com/himanshu-sao/0a228cd6d5a2f95d52a59c6a7586233a/raw/card-data.json';

export const getIssuerById = (id) => {
  return CARD_ISSUERS.find(issuer => issuer.id === id) || CARD_ISSUERS[CARD_ISSUERS.length - 1];
};

export const getRewardTypeById = (id) => {
  return REWARD_TYPES.find(type => type.id === id) || REWARD_TYPES[0];
};

export const getCardTemplate = (templateId) => {
  return CARD_TEMPLATES.find(card => card.id === templateId);
};

export const calculateBreakEven = (card) => {
  const netFee = card.annualFee - card.annualCreditsValue;
  return {
    annualFee: card.annualFee,
    totalCreditsValue: card.annualCreditsValue,
    netAnnualFee: netFee,
    isBreakEven: card.annualCreditsValue >= card.annualFee,
    valueRating: netFee <= 0 ? 'excellent' : netFee <= card.annualFee * 0.3 ? 'good' : netFee <= card.annualFee * 0.6 ? 'fair' : 'poor'
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const fetchCardData = async () => {
  try {
    const response = await fetch(CARD_DATA_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch card data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching card data:', error);
    return null;
  }
};

export const getCreditPeriodAmount = (credit) => {
  if (credit.frequency === 'included') return 0;
  if (credit.frequency === 'every_4_years') return credit.amount / 4;
  return credit.amount;
};
