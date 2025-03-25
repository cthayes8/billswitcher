
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import BillUploader from '@/components/BillUploader';
import CarrierComparison from '@/components/CarrierComparison';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentCarrier } from '@/lib/carrierData';

const BillAnalysis = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analyzingBill, setAnalyzingBill] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const handleUploadComplete = (fileName: string) => {
    setFileName(fileName);
    setUploadComplete(true);
    
    // Simulate bill analysis
    setAnalyzingBill(true);
    setTimeout(() => {
      setAnalyzingBill(false);
      setAnalysisComplete(true);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <AnimatedTransition className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">Bill Analysis</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Upload your current phone bill and we'll analyze it to find better alternatives that could save you money.
            </p>
          </div>
          
          {!uploadComplete ? (
            <BillUploader onUploadComplete={handleUploadComplete} />
          ) : (
            <div className="space-y-12">
              {analyzingBill ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center animate-pulse">
                    <Info size={24} className="text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Analyzing Your Bill</h2>
                  <p className="text-gray-600">
                    We're processing {fileName} to extract your usage patterns, current plan details, and monthly costs.
                  </p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Your Monthly Usage</h3>
                        <div className="text-2xl font-bold">8.2 GB</div>
                        <div className="text-sm text-gray-600">of data</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Talk Time</h3>
                        <div className="text-2xl font-bold">320 mins</div>
                        <div className="text-sm text-gray-600">monthly average</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Text Messages</h3>
                        <div className="text-2xl font-bold">842</div>
                        <div className="text-sm text-gray-600">monthly average</div>
                      </div>
                    </div>
                  </div>
                  
                  <CarrierComparison currentCarrier={getCurrentCarrier()} />
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default BillAnalysis;
