import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnimatedTransition from '@/components/AnimatedTransition';
import BillUploader from '@/components/BillUploader';
import LocationChecker from '@/components/LocationChecker';
import LineDetailsForm from '@/components/LineDetailsForm';
import CarrierComparison from '@/components/CarrierComparison';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, DollarSign, Smartphone, Phone, Receipt, Database, Laptop, Watch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentCarrier, getRecommendedCarriers } from '@/lib/carrierData';

interface Equipment {
  id: string;
  deviceName: string;
  monthlyPayment: number;
  remainingPayments: number;
  totalBalance: number;
  associatedPhoneNumber: string;
  type: 'Phone' | 'Watch' | 'Tablet' | 'Accessory';
}

interface LineData {
  phoneNumber: string;
  deviceName: string;
  lineType: string;
  planName: string;
  monthlyCharge: number;
  dataUsage: number;
  equipment?: Equipment[];
  earlyTerminationFee: number;
}

interface BillData {
  carrier: string;
  accountNumber: string;
  billDate: string;
  totalAmount: number;
  dueDate: string;
  planCosts: number;
  equipmentCosts: number;
  servicesCosts: number;
  lines: LineData[];
}

const BillAnalysis = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
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
        lines: analyzedData.lines.map((line: LineData) => {
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
      
      const totalDevicePayments = analyzedData.lines.reduce((sum: number, line: LineData) => {
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
    }
    setUploadComplete(true);
  };
  
  const handleLocationCheckComplete = (homeZip: string, workZip: string, coverageMap: any) => {
    setHomeZip(homeZip);
    setWorkZip(workZip);
    setCoverageData(coverageMap);
    setLocationCheckComplete(true);
    
    if (aiAnalyzedData) {
      setLineDetailsComplete(true);
      setAnalyzingBill(true);
      setTimeout(() => {
        setAnalyzingBill(false);
        setAnalysisComplete(true);
      }, 3000);
    }
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
    
    return aiAnalyzedData.lines.reduce((total: number, line: LineData) => {
      return total + (line.dataUsage || 0);
    }, 0).toFixed(1);
  };

  const getEquipmentByType = (equipment: Equipment[] | undefined, types: string[]) => {
    if (!equipment || equipment.length === 0) return [];
    return equipment.filter(item => types.includes(item.type));
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
          ) : !locationCheckComplete ? (
            <LocationChecker onComplete={handleLocationCheckComplete} />
          ) : !lineDetailsComplete ? (
            <LineDetailsForm onComplete={handleLineDetailsComplete} initialData={aiAnalyzedData?.lines} />
          ) : (
            <div className="space-y-12">
              {!analyzingBill && (
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
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Line Type</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Data Usage</TableHead>
                                <TableHead>Handset</TableHead>
                                <TableHead>Accessories</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {aiAnalyzedData.lines.map((line, index) => {
                                const handsets = getEquipmentByType(line.equipment, ['Phone', 'Watch', 'Tablet']);
                                const accessories = getEquipmentByType(line.equipment, ['Accessory']);
                                
                                return (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{line.phoneNumber}</TableCell>
                                    <TableCell>{line.lineType}</TableCell>
                                    <TableCell>{line.planName}</TableCell>
                                    <TableCell>{line.dataUsage.toFixed(2)} GB</TableCell>
                                    <TableCell>
                                      {handsets.length > 0 ? (
                                        <div className="space-y-1">
                                          {handsets.map((eq, i) => (
                                            <div key={i} className="flex items-center text-sm">
                                              {eq.type === 'Phone' ? (
                                                <Smartphone size={12} className="mr-1 text-primary" />
                                              ) : eq.type === 'Watch' ? (
                                                <Watch size={12} className="mr-1 text-purple-500" />
                                              ) : (
                                                <Laptop size={12} className="mr-1 text-green-500" />
                                              )}
                                              <span className="mr-2">{eq.deviceName}</span>
                                              <span className="font-medium ml-auto text-green-700">${eq.totalBalance.toFixed(2)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">None</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {accessories.length > 0 ? (
                                        <div className="space-y-1">
                                          {accessories.map((acc, i) => (
                                            <div key={i} className="flex items-center text-sm">
                                              <span className="mr-2 truncate" title={acc.deviceName}>
                                                {acc.deviceName.length > 25 
                                                  ? acc.deviceName.substring(0, 25) + '...' 
                                                  : acc.deviceName}
                                              </span>
                                              <span className="font-medium ml-auto text-green-700">${acc.totalBalance.toFixed(2)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">None</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
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
                  </div>
                  
                  <CarrierComparison 
                    currentCarrier={aiAnalyzedData ? { name: aiAnalyzedData.carrier, monthlyPrice: aiAnalyzedData.totalAmount } : getCurrentCarrier()} 
                    coverageData={coverageData}
                    homeZip={homeZip}
                    workZip={workZip}
                    switchingCosts={switchingCosts}
                  />
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

