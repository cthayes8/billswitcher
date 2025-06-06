import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import BillUploader from '@/components/BillUploader';
import LocationChecker from '@/components/LocationChecker';
import LineDetailsForm from '@/components/LineDetailsForm';
import CarrierComparison from '@/components/CarrierComparison';
import LineDetailsTable from '@/components/LineDetailsTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, DollarSign, Smartphone, Phone, Receipt, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentCarrier, getRecommendedCarriers } from '@/lib/carrierData';
import { BillData } from '@/interfaces/BillTypes';

const BillAnalysis = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showCoverageCheck, setShowCoverageCheck] = useState(false);
  const [locationCheckComplete, setLocationCheckComplete] = useState(false);
  const [lineDetailsComplete, setLineDetailsComplete] = useState(false);
  const [analyzingBill, setAnalyzingBill] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [fileName, setFileName] = useState('');
  const [coverageData, setCoverageData] = useState<any>(null);
  const [homeZip, setHomeZip] = useState('');
  const [workZip, setWorkZip] = useState('');
  const [lineDetails, setLineDetails] = useState<any>(null);
  const [switchingCosts, setSwitchingCosts] = useState<any>(null);
  const [aiAnalyzedData, setAiAnalyzedData] = useState<BillData | null>(null);
  
  const handleUploadComplete = (fileName: string, analyzedData?: BillData) => {
    setFileName(fileName);
    if (analyzedData) {
      setAiAnalyzedData(analyzedData);
      
      const lineFormData = {
        lines: analyzedData.lines.map((line) => {
          const phoneEquipment = line.equipment?.find(eq => eq.type === 'Phone' || eq.type === 'Watch' || eq.type === 'Tablet');
          
          return {
            deviceName: line.deviceName,
            phoneNumber: line.phoneNumber,
            lineType: line.lineType,
            remainingPayments: phoneEquipment?.remainingPayments || 0,
            monthlyPayment: phoneEquipment?.monthlyPayment || 0,
            totalBalance: phoneEquipment?.totalBalance || 0,
          };
        })
      };
      
      setLineDetails(lineFormData);
      
      const totalDevicePayments = analyzedData.lines.reduce((sum, line) => {
        if (!line.equipment || line.equipment.length === 0) return sum;
        
        return sum + line.equipment.reduce((lineSum, eq) => {
          return lineSum + eq.totalBalance;
        }, 0);
      }, 0);
      
      setSwitchingCosts({
        devicePayments: totalDevicePayments,
        terminationFees: 0, // No ETF for T-Mobile
        total: totalDevicePayments,
        lineCount: analyzedData.lines.length
      });
      
      setAnalysisComplete(true);
    }
    setUploadComplete(true);
  };
  
  const handleLocationCheckComplete = (homeZip: string, workZip: string, coverageMap: any) => {
    setHomeZip(homeZip);
    setWorkZip(workZip);
    setCoverageData(coverageMap);
    setLocationCheckComplete(true);
  };
  
  const handleLineDetailsComplete = (data: any) => {
    setLineDetails(data);
    setLineDetailsComplete(true);
    
    const totalDevicePayments = data.lines.reduce((sum: number, line: any) => {
      return sum + (line.totalBalance || (line.monthlyPayment * line.remainingPayments));
    }, 0);
    
    setSwitchingCosts({
      devicePayments: totalDevicePayments,
      terminationFees: 0, // No ETF for T-Mobile
      total: totalDevicePayments,
      lineCount: data.lines.length
    });
    
    setAnalyzingBill(true);
    setTimeout(() => {
      setAnalyzingBill(false);
      setAnalysisComplete(true);
    }, 3000);
  };
  
  const getLineCountByType = () => {
    if (!lineDetails) return {};
    
    return lineDetails.lines.reduce((acc: any, line: any) => {
      const type = line.lineType || 'Unknown';
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
      return acc;
    }, {});
  };

  const getTotalDataUsage = () => {
    if (!aiAnalyzedData) return 0;
    
    const total = aiAnalyzedData.lines.reduce((total: number, line) => {
      return total + (line.dataUsage || 0);
    }, 0);
    
    return total.toFixed(1);
  };

  const handleNextStep = () => {
    setShowCoverageCheck(true);
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
              Upload your current phone bill and we'll automatically analyze it to find better alternatives with good coverage.
              Our AI will extract line details so you don't have to enter them manually.
            </p>
          </div>
          
          {!uploadComplete ? (
            <BillUploader onUploadComplete={handleUploadComplete} />
          ) : !showCoverageCheck ? (
            <div className="space-y-12">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Receipt size={20} className="mr-2 text-primary" />
                  Analysis Results
                  {aiAnalyzedData && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {aiAnalyzedData.carrier} Account
                    </span>
                  )}
                </h2>
                
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-4">Account Summary</h3>
                  
                  {aiAnalyzedData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs text-gray-500">Total Monthly Bill</div>
                        <div className="flex items-center mt-1">
                          <DollarSign size={16} className="text-primary mr-1" />
                          <span className="text-lg font-semibold">${aiAnalyzedData.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs text-gray-500">Plan Costs</div>
                        <div className="flex items-center mt-1">
                          <DollarSign size={16} className="text-gray-400 mr-1" />
                          <span className="text-lg font-semibold">${aiAnalyzedData.planCosts.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs text-gray-500">Equipment Costs</div>
                        <div className="flex items-center mt-1">
                          <DollarSign size={16} className="text-gray-400 mr-1" />
                          <span className="text-lg font-semibold">${aiAnalyzedData.equipmentCosts.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs text-gray-500">Services & Fees</div>
                        <div className="flex items-center mt-1">
                          <DollarSign size={16} className="text-gray-400 mr-1" />
                          <span className="text-lg font-semibold">${aiAnalyzedData.servicesCosts.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium flex items-center">
                        <Phone size={16} className="mr-2 text-blue-600" />
                        Line Count by Type
                      </div>
                      <div className="mt-2 space-y-1">
                        {Object.entries(getLineCountByType()).map(([type, count]: [string, any]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span>{type}:</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                        <div className="border-t pt-1 flex justify-between text-sm font-semibold">
                          <span>Total Lines:</span>
                          <span>{switchingCosts?.lineCount || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Data Usage</h3>
                      <div className="text-2xl font-bold">{getTotalDataUsage()} GB</div>
                      <div className="text-sm text-gray-600">across all lines</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Bill Date</h3>
                      <div className="text-xl font-bold">{aiAnalyzedData?.billDate || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Due: {aiAnalyzedData?.dueDate || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                {aiAnalyzedData && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Database size={16} className="mr-2 text-primary" />
                      Line Details
                    </h3>
                    <LineDetailsTable lines={aiAnalyzedData.lines} />
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-medium mb-2">Switching Costs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="text-xs text-gray-500">Number of Lines</div>
                      <div className="flex items-center mt-1">
                        <Smartphone size={16} className="text-gray-400 mr-1" />
                        <span className="text-lg font-semibold">{switchingCosts?.lineCount || 0}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="text-xs text-gray-500">Device & Accessory Payments</div>
                      <div className="flex items-center mt-1">
                        <DollarSign size={16} className="text-gray-400 mr-1" />
                        <span className="text-lg font-semibold">${switchingCosts?.devicePayments.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="text-xs text-gray-500">Total to Switch</div>
                      <div className="flex items-center mt-1">
                        <DollarSign size={16} className="text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-red-600">${switchingCosts?.total.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNextStep} className="flex items-center">
                    Find Better Alternatives
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ) : !locationCheckComplete ? (
            <LocationChecker onComplete={handleLocationCheckComplete} />
          ) : (
            <CarrierComparison 
              currentCarrier={aiAnalyzedData ? { name: aiAnalyzedData.carrier, monthlyPrice: aiAnalyzedData.totalAmount } : getCurrentCarrier()} 
              coverageData={coverageData}
              homeZip={homeZip}
              workZip={workZip}
              switchingCosts={switchingCosts}
            />
          )}
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default BillAnalysis;
