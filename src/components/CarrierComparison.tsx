
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Info, ArrowRight, ExternalLink, MapPin, Briefcase } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Carrier {
  id: string;
  name: string;
  logo: string;
  monthlyPrice: number;
  data: string;
  coverage: number;
  features: string[];
  savings: {
    monthly: number;
    yearly: number;
  };
  locationCoverage?: {
    home: number;
    work: number;
    average: number;
  };
}

interface CarrierComparisonProps {
  currentCarrier: {
    name: string;
    monthlyPrice: number;
  };
  coverageData?: any;
  homeZip?: string;
  workZip?: string;
}

const CarrierComparison: React.FC<CarrierComparisonProps> = ({ 
  currentCarrier, 
  coverageData = null,
  homeZip = '',
  workZip = ''
}) => {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'coverage' | 'locationCoverage'>('price');

  useEffect(() => {
    // Simulate API call to get carrier data
    setTimeout(() => {
      let alternativeCarriers: Carrier[] = [
        {
          id: 'tmobile',
          name: 'T-Mobile',
          logo: 'T',
          monthlyPrice: 65,
          data: 'Unlimited',
          coverage: 94,
          features: ['5G access', 'Mobile hotspot', 'International texting', 'Netflix subscription'],
          savings: {
            monthly: currentCarrier.monthlyPrice - 65,
            yearly: (currentCarrier.monthlyPrice - 65) * 12
          }
        },
        {
          id: 'verizon',
          name: 'Verizon',
          logo: 'V',
          monthlyPrice: 70,
          data: 'Unlimited',
          coverage: 96,
          features: ['5G access', 'Mobile hotspot', 'International roaming', 'Disney+ subscription'],
          savings: {
            monthly: currentCarrier.monthlyPrice - 70,
            yearly: (currentCarrier.monthlyPrice - 70) * 12
          }
        },
        {
          id: 'att',
          name: 'AT&T',
          logo: 'A',
          monthlyPrice: 75,
          data: 'Unlimited',
          coverage: 95,
          features: ['5G access', 'Mobile hotspot', 'International texting', 'HBO Max subscription'],
          savings: {
            monthly: currentCarrier.monthlyPrice - 75,
            yearly: (currentCarrier.monthlyPrice - 75) * 12
          }
        },
        {
          id: 'visible',
          name: 'Visible',
          logo: 'Vi',
          monthlyPrice: 40,
          data: 'Unlimited',
          coverage: 92,
          features: ['5G access', 'Mobile hotspot', 'Unlimited talk & text'],
          savings: {
            monthly: currentCarrier.monthlyPrice - 40,
            yearly: (currentCarrier.monthlyPrice - 40) * 12
          }
        },
        {
          id: 'mint',
          name: 'Mint Mobile',
          logo: 'M',
          monthlyPrice: 30,
          data: '10GB',
          coverage: 88,
          features: ['5G access', 'Mobile hotspot', 'Free calls to Mexico & Canada'],
          savings: {
            monthly: currentCarrier.monthlyPrice - 30,
            yearly: (currentCarrier.monthlyPrice - 30) * 12
          }
        }
      ];
      
      // Add location coverage data if available
      if (coverageData) {
        alternativeCarriers = alternativeCarriers.map(carrier => {
          if (coverageData[carrier.id.toLowerCase()]) {
            const homeScore = coverageData[carrier.id.toLowerCase()].homeZip;
            const workScore = coverageData[carrier.id.toLowerCase()].workZip;
            return {
              ...carrier,
              locationCoverage: {
                home: homeScore,
                work: workScore,
                average: Math.round((homeScore + workScore) / 2)
              }
            };
          }
          return carrier;
        });
      }
      
      setCarriers(alternativeCarriers);
      setIsLoading(false);
    }, 1500);
  }, [currentCarrier, coverageData]);

  const sortedCarriers = [...carriers].sort((a, b) => {
    if (sortBy === 'price') {
      return a.monthlyPrice - b.monthlyPrice;
    } else if (sortBy === 'coverage') {
      return b.coverage - a.coverage;
    } else if (sortBy === 'locationCoverage' && a.locationCoverage && b.locationCoverage) {
      return b.locationCoverage.average - a.locationCoverage.average;
    } 
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recommended Alternatives</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={sortBy === 'price' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Sort by Price
            </Button>
            <Button 
              variant={sortBy === 'coverage' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('coverage')}
            >
              Sort by Coverage
            </Button>
            {coverageData && (
              <Button 
                variant={sortBy === 'locationCoverage' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSortBy('locationCoverage')}
              >
                Sort by Your Locations
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Carrier</h3>
              <div className="text-lg font-semibold">{currentCarrier.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Monthly Plan</div>
              <div className="text-xl font-bold">${currentCarrier.monthlyPrice}/mo</div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="animate-pulse bg-gray-100 rounded-xl p-6 h-32"
              ></div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {sortedCarriers.map((carrier, index) => (
                <motion.div
                  key={carrier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-4 md:mb-0 md:w-1/4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 font-semibold">
                        {carrier.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold">{carrier.name}</h3>
                        <div className="text-sm text-gray-600">{carrier.data} data</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:w-2/4">
                      <div>
                        <div className="text-sm text-gray-600">Monthly</div>
                        <div className="font-semibold">${carrier.monthlyPrice}/mo</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600">Coverage</div>
                        <div className="font-semibold">{carrier.coverage}%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600">Savings</div>
                        <div className="text-green-600 font-semibold">
                          ${carrier.savings.monthly}/mo
                        </div>
                        <div className="text-xs text-green-500">
                          ${carrier.savings.yearly}/yr
                        </div>
                      </div>
                    </div>
                    
                    {carrier.locationCoverage && (
                      <div className="mt-4 mb-4 md:mt-0 md:mb-0 md:ml-4 py-1 px-3 rounded-full bg-gray-100 flex items-center">
                        <div className="text-xs md:text-sm">
                          <span className="font-medium">Your Locations:</span> 
                          <span className={`ml-1 ${
                            carrier.locationCoverage.average >= 90 
                            ? 'text-green-600' 
                            : carrier.locationCoverage.average >= 75 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                          }`}>
                            {carrier.locationCoverage.average}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 md:mt-0 md:ml-auto">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Info size={14} className="mr-1" /> Details
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Plan Features</h4>
                              <ul className="space-y-1">
                                {carrier.features.map((feature, i) => (
                                  <li key={i} className="flex items-center text-sm">
                                    <Check size={14} className="text-green-500 mr-2" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {carrier.locationCoverage && (
                              <div>
                                <h4 className="font-medium mb-2">Coverage at Your Locations</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                      <MapPin size={14} className="mr-1" />
                                      <span>Home ({homeZip}):</span>
                                    </div>
                                    <span className={`font-medium ${
                                      carrier.locationCoverage.home >= 90 
                                      ? 'text-green-600' 
                                      : carrier.locationCoverage.home >= 75 
                                      ? 'text-yellow-600' 
                                      : 'text-red-600'
                                    }`}>
                                      {carrier.locationCoverage.home}%
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                      <Briefcase size={14} className="mr-1" />
                                      <span>Work ({workZip}):</span>
                                    </div>
                                    <span className={`font-medium ${
                                      carrier.locationCoverage.work >= 90 
                                      ? 'text-green-600' 
                                      : carrier.locationCoverage.work >= 75 
                                      ? 'text-yellow-600' 
                                      : 'text-red-600'
                                    }`}>
                                      {carrier.locationCoverage.work}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      
                      <Button size="sm">
                        Visit Carrier <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-sm text-gray-500 mb-4">
          Prices, plan details, and coverage information are estimates based on your inputs.
          Visit the carrier's website for the most up-to-date information.
        </p>
        <Button variant="outline">
          Compare More Carriers <ExternalLink size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CarrierComparison;
