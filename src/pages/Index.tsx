
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { Upload, Search, DollarSign, BarChart4 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-semibold mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                A simple, three-step process to help you find the best carrier for your needs.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Upload}
                title="Upload Your Bill"
                description="Upload your current phone bill to analyze your usage patterns and current costs."
                delay={0.1}
              />
              <FeatureCard
                icon={BarChart4}
                title="Get Recommendations"
                description="We analyze your usage and compare it with all major carriers to find the best alternatives."
                delay={0.2}
              />
              <FeatureCard
                icon={DollarSign}
                title="Save Money"
                description="Switch to a better plan that meets your needs and save hundreds of dollars every year."
                delay={0.3}
              />
            </div>
          </div>
        </section>
        
        {/* Coverage Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">Check Coverage In Your Area</h2>
                <p className="text-gray-600 mb-8">
                  Don't compromise on coverage. Use our interactive coverage checker to ensure your new carrier provides reliable service where you live, work, and travel.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Compare coverage from all major carriers',
                    'View detailed coverage maps for your location',
                    'Get insights on 5G, 4G, and voice quality',
                    'See real-world performance data'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-1 mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <Link to="/coverage-checker">
                  <Button className="flex items-center" size="lg">
                    <Search size={18} className="mr-2" /> Check Coverage Now
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 relative">
                    {/* This would be a map image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 text-center">
                        <div className="text-lg font-semibold mb-2">Coverage Map Placeholder</div>
                        <div className="text-sm text-gray-700">Interactive coverage maps would display here</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  animate={{ y: ['-5%', '0%', '-5%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shadow-lg"
                >
                  <div className="text-blue-600 font-bold">95%</div>
                  <div className="text-xs text-blue-600">Coverage</div>
                </motion.div>
                
                <motion.div
                  animate={{ y: ['0%', '-8%', '0%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-lg"
                >
                  <div className="text-green-600 font-bold">4G/5G</div>
                  <div className="text-xs text-green-600">Ready</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Start Saving?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-blue-100 max-w-2xl mx-auto mb-8"
            >
              The average American family saves $360 per year by switching carriers. 
              Upload your bill now and see how much you could save.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/bill-analysis">
                <Button size="lg" variant="secondary" className="mr-4">
                  <Upload size={18} className="mr-2" /> Upload Your Bill
                </Button>
              </Link>
              <Link to="/coverage-checker">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  <Search size={18} className="mr-2" /> Check Coverage
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">BillSwitcher</h3>
              <p className="text-gray-400 text-sm">
                Find the perfect carrier for your needs and save money on your monthly bill.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold uppercase mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/bill-analysis" className="text-gray-400 hover:text-white transition-colors">Bill Analysis</Link></li>
                <li><Link to="/coverage-checker" className="text-gray-400 hover:text-white transition-colors">Coverage Checker</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold uppercase mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold uppercase mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@billswitcher.com" className="text-gray-400 hover:text-white transition-colors">support@billswitcher.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} BillSwitcher. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
