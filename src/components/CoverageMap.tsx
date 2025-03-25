
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Wifi, WifiOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const carriers = [
  { id: 'verizon', name: 'Verizon', color: 'bg-red-500' },
  { id: 'att', name: 'AT&T', color: 'bg-blue-500' },
  { id: 'tmobile', name: 'T-Mobile', color: 'bg-pink-500' },
];

const CoverageMap: React.FC = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [coverageResults, setCoverageResults] = useState<{
    [key: string]: { overall: number; data: number; voice: number }
  }>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter an address to check coverage",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call to get coverage data
    setTimeout(() => {
      // Simulated coverage data
      setCoverageResults({
        verizon: {
          overall: 95,
          data: 98,
          voice: 92
        },
        att: {
          overall: 90,
          data: 92,
          voice: 88
        },
        tmobile: {
          overall: 85,
          data: 87,
          voice: 83
        }
      });
      
      setIsSearching(false);
      setHasSearched(true);
      
      toast({
        title: "Coverage data loaded",
        description: `Results for ${address} are ready`,
      });
    }, 2000);
  };

  const getCoverageStatus = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'text-green-500' };
    if (percentage >= 70) return { label: 'Good', color: 'text-yellow-500' };
    return { label: 'Fair', color: 'text-orange-500' };
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Check Carrier Coverage</h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Enter your address, city, or zip code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Check Coverage'}
                {!isSearching && <Search size={16} className="ml-2" />}
              </Button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="p-4 border-r border-gray-100">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Select Carrier</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCarrier === 'all' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCarrier('all')}
                  >
                    Show All
                  </Button>
                  
                  {carriers.map((carrier) => (
                    <Button
                      key={carrier.id}
                      variant={selectedCarrier === carrier.id ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCarrier(carrier.id)}
                    >
                      <div className={`w-3 h-3 rounded-full ${carrier.color} mr-2`}></div>
                      {carrier.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {hasSearched && (
                <div>
                  <h3 className="font-medium mb-2">Coverage Quality</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Excellent (90-100%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Good (70-89%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span>Fair (0-69%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-span-3">
              {!hasSearched ? (
                <div className="p-12 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Enter your location</h3>
                  <p className="text-gray-500 max-w-md">
                    Search for your address, city, or zip code to see carrier coverage in your area
                  </p>
                </div>
              ) : isSearching ? (
                <div className="p-12 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-pulse">
                    <Search size={24} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Checking coverage...</h3>
                  <p className="text-gray-500">Analyzing network data for your location</p>
                </div>
              ) : (
                <div className="p-6">
                  <h3 className="font-medium mb-4">Coverage Results for: {address}</h3>
                  
                  <div className="space-y-6">
                    {(selectedCarrier === 'all' ? carriers : carriers.filter(c => c.id === selectedCarrier)).map((carrier) => (
                      <motion.div
                        key={carrier.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-4 h-4 rounded-full ${carrier.color} mr-2`}></div>
                          <h4 className="font-medium">{carrier.name}</h4>
                          
                          <div className="ml-auto flex items-center">
                            <span className="text-sm mr-2">Overall:</span>
                            <span className={`font-semibold ${getCoverageStatus(coverageResults[carrier.id]?.overall || 0).color}`}>
                              {getCoverageStatus(coverageResults[carrier.id]?.overall || 0).label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center text-sm">
                                <Wifi size={14} className="mr-1" /> Data
                              </div>
                              <span className="text-sm font-medium">
                                {coverageResults[carrier.id]?.data || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${carrier.color} h-2 rounded-full`}
                                style={{ width: `${coverageResults[carrier.id]?.data || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center text-sm">
                                <WifiOff size={14} className="mr-1" /> Voice
                              </div>
                              <span className="text-sm font-medium">
                                {coverageResults[carrier.id]?.voice || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${carrier.color} h-2 rounded-full`}
                                style={{ width: `${coverageResults[carrier.id]?.voice || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="text-sm">
                            {coverageResults[carrier.id]?.overall >= 90 ? (
                              <div className="flex items-center text-green-600">
                                <Check size={16} className="mr-1" />
                                Excellent coverage for your location
                              </div>
                            ) : coverageResults[carrier.id]?.overall >= 70 ? (
                              <div className="flex items-center text-yellow-600">
                                <Check size={16} className="mr-1" />
                                Good coverage, but may have some limitations
                              </div>
                            ) : (
                              <div className="flex items-center text-orange-600">
                                <WifiOff size={16} className="mr-1" />
                                Limited coverage, may experience issues
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-sm text-center text-gray-500">
                    Coverage data is an estimate based on reported carrier coverage maps.
                    Actual coverage may vary based on terrain, buildings, and other factors.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageMap;
