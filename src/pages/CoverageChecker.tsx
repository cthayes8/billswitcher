
import React from 'react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import CoverageMap from '@/components/CoverageMap';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoverageChecker = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <AnimatedTransition className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">Coverage Checker</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Enter your address to check coverage for all major carriers in your area before switching.
            </p>
          </div>
          
          <CoverageMap />
          
          <div className="mt-12 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Understanding Coverage Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-2">Coverage Types</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><span className="font-medium">Data Coverage:</span> Indicates where you can access data services (4G, 5G).</li>
                  <li><span className="font-medium">Voice Coverage:</span> Areas where you can make and receive calls.</li>
                  <li><span className="font-medium">Overall Coverage:</span> Combined assessment of service quality.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Factors Affecting Coverage</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><span className="font-medium">Geography:</span> Hills, mountains, and valleys can affect signal strength.</li>
                  <li><span className="font-medium">Buildings:</span> Dense urban areas with tall buildings may have signal issues.</li>
                  <li><span className="font-medium">Network Congestion:</span> Heavy usage in your area can affect speeds.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default CoverageChecker;
