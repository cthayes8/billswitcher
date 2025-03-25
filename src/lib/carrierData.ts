
export interface Carrier {
  id: string;
  name: string;
  logo: string; // Could be a path to an image
  description: string;
  pros: string[];
  cons: string[];
  plans: {
    name: string;
    price: number;
    data: string;
    features: string[];
  }[];
  coverage: {
    overall: number;
    data: number;
    voice: number;
    map: string; // Could be a path to a coverage map image
  };
}

export const carriers: Carrier[] = [
  {
    id: 'verizon',
    name: 'Verizon',
    logo: 'V',
    description: 'Verizon offers extensive coverage across the US with robust 5G infrastructure and reliable service.',
    pros: [
      'Excellent nationwide coverage',
      'Strong rural coverage',
      'Reliable 5G network',
      'Good customer service'
    ],
    cons: [
      'Higher priced plans',
      'Deprioritization on some plans',
      'International options cost extra'
    ],
    plans: [
      {
        name: 'Start Unlimited',
        price: 70,
        data: 'Unlimited',
        features: [
          '5G Nationwide access',
          'DVD-quality streaming',
          '6 months of Disney+, Apple Music, and discovery+'
        ]
      },
      {
        name: 'Play More Unlimited',
        price: 80,
        data: 'Unlimited',
        features: [
          '5G Ultra Wideband access',
          'HD streaming',
          'Disney+, Hulu, and ESPN+ included',
          '25GB premium mobile hotspot data'
        ]
      },
      {
        name: 'Get More Unlimited',
        price: 90,
        data: 'Unlimited',
        features: [
          '5G Ultra Wideband access',
          'HD streaming',
          'Disney+, Hulu, and ESPN+ included',
          '50GB premium mobile hotspot data',
          '600GB cloud storage'
        ]
      }
    ],
    coverage: {
      overall: 96,
      data: 95,
      voice: 97,
      map: '/coverage-maps/verizon.png'
    }
  },
  {
    id: 'att',
    name: 'AT&T',
    logo: 'A',
    description: 'AT&T provides solid nationwide coverage with competitive plans and entertainment bundle options.',
    pros: [
      'Good nationwide coverage',
      'HBO Max included with some plans',
      'Strong urban performance',
      'International options'
    ],
    cons: [
      'Coverage gaps in some rural areas',
      'Complex plan structure',
      'Inconsistent 5G availability'
    ],
    plans: [
      {
        name: 'Unlimited Starter',
        price: 65,
        data: 'Unlimited',
        features: [
          '5G access',
          'Standard definition streaming',
          'Unlimited talk, text, and data in Mexico and Canada'
        ]
      },
      {
        name: 'Unlimited Extra',
        price: 75,
        data: 'Unlimited',
        features: [
          '5G access',
          '50GB premium data',
          '15GB hotspot data per line',
          'Unlimited talk, text, and data in Mexico and Canada'
        ]
      },
      {
        name: 'Unlimited Elite',
        price: 85,
        data: 'Unlimited',
        features: [
          '5G access',
          'Unlimited premium data',
          'HBO Max included',
          '40GB hotspot data per line',
          'HD streaming'
        ]
      }
    ],
    coverage: {
      overall: 93,
      data: 92,
      voice: 95,
      map: '/coverage-maps/att.png'
    }
  },
  {
    id: 'tmobile',
    name: 'T-Mobile',
    logo: 'T',
    description: 'T-Mobile offers affordable plans with extensive 5G coverage and excellent urban performance.',
    pros: [
      'Extensive 5G coverage',
      'Competitive pricing',
      'Netflix included with some plans',
      'Excellent international options'
    ],
    cons: [
      'Coverage gaps in rural areas',
      'Indoor penetration issues',
      'Deprioritization during congestion'
    ],
    plans: [
      {
        name: 'Essentials',
        price: 60,
        data: 'Unlimited',
        features: [
          '5G access',
          'Standard definition streaming',
          'Unlimited talk, text, and data in Mexico and Canada',
          '50GB premium data'
        ]
      },
      {
        name: 'Magenta',
        price: 70,
        data: 'Unlimited',
        features: [
          '5G access',
          '100GB premium data',
          '5GB high-speed mobile hotspot data',
          'Netflix Basic with 2+ lines',
          'Unlimited talk, text, and data in Mexico and Canada'
        ]
      },
      {
        name: 'Magenta MAX',
        price: 85,
        data: 'Unlimited',
        features: [
          '5G access',
          'Truly unlimited premium data',
          '40GB high-speed mobile hotspot data',
          'Netflix Standard with 2+ lines',
          '4K UHD streaming',
          'Unlimited talk, text, and data in Mexico and Canada'
        ]
      }
    ],
    coverage: {
      overall: 91,
      data: 94,
      voice: 89,
      map: '/coverage-maps/tmobile.png'
    }
  },
  {
    id: 'visible',
    name: 'Visible',
    logo: 'Vi',
    description: 'Visible is a digital-first carrier owned by Verizon offering simple, affordable unlimited plans.',
    pros: [
      'Affordable unlimited plan',
      'Uses Verizon\'s network',
      'Simple pricing structure',
      'Unlimited mobile hotspot (limited to 5 Mbps)'
    ],
    cons: [
      'Deprioritized during congestion',
      'Limited customer service options',
      'No physical stores',
      'Limited international options'
    ],
    plans: [
      {
        name: 'Visible',
        price: 40,
        data: 'Unlimited',
        features: [
          '5G nationwide access',
          'Unlimited talk and text',
          'Unlimited mobile hotspot (limited to 5 Mbps)',
          'Taxes and fees included'
        ]
      },
      {
        name: 'Visible+',
        price: 45,
        data: 'Unlimited',
        features: [
          '5G Ultra Wideband access',
          '50GB premium data',
          'Unlimited mobile hotspot (limited to 5 Mbps)',
          'International calling to 30+ countries',
          'Taxes and fees included'
        ]
      }
    ],
    coverage: {
      overall: 92,
      data: 90,
      voice: 94,
      map: '/coverage-maps/visible.png'
    }
  },
  {
    id: 'mint',
    name: 'Mint Mobile',
    logo: 'M',
    description: 'Mint Mobile offers prepaid plans with bulk pricing for 3, 6, or 12 months of service upfront.',
    pros: [
      'Very affordable plans',
      'Uses T-Mobile\'s network',
      'Multi-month discounts',
      'Simple plan structure'
    ],
    cons: [
      'Requires upfront payment for several months',
      'Deprioritized during congestion',
      'Limited customer service options',
      'No physical stores'
    ],
    plans: [
      {
        name: '4GB Plan',
        price: 15,
        data: '4GB',
        features: [
          '5G • 4G LTE access',
          'Unlimited talk and text',
          'Free calls to Mexico and Canada',
          'Mobile hotspot included'
        ]
      },
      {
        name: '10GB Plan',
        price: 20,
        data: '10GB',
        features: [
          '5G • 4G LTE access',
          'Unlimited talk and text',
          'Free calls to Mexico and Canada',
          'Mobile hotspot included'
        ]
      },
      {
        name: 'Unlimited Plan',
        price: 30,
        data: 'Unlimited',
        features: [
          '5G • 4G LTE access',
          '35GB premium data',
          'Unlimited talk and text',
          'Free calls to Mexico and Canada',
          '5GB mobile hotspot data'
        ]
      }
    ],
    coverage: {
      overall: 88,
      data: 87,
      voice: 90,
      map: '/coverage-maps/mint.png'
    }
  }
];

export const getCurrentCarrier = (): { name: string; monthlyPrice: number } => {
  // This would normally come from bill analysis
  return {
    name: 'Big Mobile Inc.',
    monthlyPrice: 89.99
  };
};

export const getRecommendedCarriers = (usage: { 
  data: number; 
  calls: number; 
  texts: number; 
  international: boolean;
}) => {
  // Filter carriers based on usage needs
  // This is a simplified example
  return carriers.filter(carrier => {
    if (usage.data > 10 && carrier.id === 'mint') {
      // Only include Mint if the user doesn't need a lot of data
      return false;
    }
    return true;
  });
};
