
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary/10 rounded-full"
            >
              Save money on your phone bill
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            >
              Find the <span className="text-primary">perfect carrier</span> for your needs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
            >
              Upload your current bill, discover better alternatives, and check coverage in your area. All in one simple, easy-to-use tool.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
            >
              <Link to="/bill-analysis">
                <Button size="lg" className="w-full sm:w-auto">
                  Upload Your Bill
                </Button>
              </Link>
              <Link to="/coverage-checker">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Check Coverage
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl glass">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-blue-50/50 backdrop-blur-sm"></div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="relative z-10 p-6"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Current Carrier</h3>
                          <p className="text-gray-500 text-sm">Big Mobile Inc.</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary">$89.99 /mo</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Data plan</span>
                        <span className="font-medium">10GB</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Unlimited talk & text</span>
                        <span className="font-medium">Included</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contract</span>
                        <span className="font-medium">2 years</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4">
                    <div className="font-medium mb-2">Suggested Alternative</div>
                    <div className="flex justify-between items-center">
                      <div className="text-green-600 font-medium">Better Wireless</div>
                      <div className="text-lg font-bold text-green-600">$54.99 /mo</div>
                    </div>
                    <div className="text-sm text-green-600 mt-1">Save $35.00/month ($420.00/year)</div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="absolute -z-10 top-1/3 right-0 w-72 h-72 bg-blue-400/30 rounded-full filter blur-3xl"></div>
            <div className="absolute -z-10 bottom-1/3 left-0 w-72 h-72 bg-indigo-300/20 rounded-full filter blur-3xl"></div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute -z-10 bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white pointer-events-none"></div>
    </div>
  );
};

export default Hero;
