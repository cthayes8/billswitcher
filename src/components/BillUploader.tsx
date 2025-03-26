
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BillData, Equipment } from '@/interfaces/BillTypes';

interface BillUploaderProps {
  onUploadComplete: (fileName: string, analyzedData?: BillData) => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    const fileType = file.type.toLowerCase();
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'];
    
    if (!validTypes.includes(fileType)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file (.jpg, .png, .heic)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          analyzeDocument(file);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const analyzeDocument = (file: File) => {
    setUploadStatus('analyzing');
    
    setTimeout(() => {
      const mockEquipmentData: Equipment[] = [
        {
          id: "iphone16pro-1876",
          deviceName: "iPhone 16 Pro - White Titanium - 256GB",
          monthlyPayment: 45.84,
          remainingPayments: 4,
          totalBalance: 962.47,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Phone" // Now using literal type instead of string
        },
        {
          id: "airpods4-1876",
          deviceName: "Apple AirPods 4 with Active Noise Cancellation",
          monthlyPayment: 15.00,
          remainingPayments: 4,
          totalBalance: 134.99,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory" // Now using literal type instead of string
        },
        {
          id: "screenprotector-1876",
          deviceName: "GoTo™ Tempered Glass Screen Protector for Apple iPhone 16 Pro",
          monthlyPayment: 3.34,
          remainingPayments: 4,
          totalBalance: 29.97,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory" // Now using literal type instead of string
        },
        {
          id: "clearcase-1876",
          deviceName: "Apple Clear Case with MagSafe for Apple iPhone 16 Pro",
          monthlyPayment: 4.17,
          remainingPayments: 3,
          totalBalance: 41.65,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory" // Now using literal type instead of string
        },
        {
          id: "siliconecase-1876",
          deviceName: "Apple Silicone Case with MagSafe for Apple iPhone 16 Pro Max",
          monthlyPayment: 4.17,
          remainingPayments: 3,
          totalBalance: 41.65,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory" // Now using literal type instead of string
        },
        {
          id: "watchcharger-1876",
          deviceName: "Apple Watch Magnetic Fast Charger to USB-C Cable, 1m",
          monthlyPayment: 2.50,
          remainingPayments: 3,
          totalBalance: 24.99,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory" // Now using literal type instead of string
        },
        
        {
          id: "iphone16promax-1781",
          deviceName: "iPhone 16 Pro Max - Natural Titanium - 256GB",
          monthlyPayment: 50.00,
          remainingPayments: 4,
          totalBalance: 1049.99,
          associatedPhoneNumber: "(720) 394-1781",
          type: "Phone" // Now using literal type instead of string
        },
        
        {
          id: "watchseries8-2478",
          deviceName: "Watch Series 8 41mm",
          monthlyPayment: 20.84,
          remainingPayments: 20,
          totalBalance: 166.53,
          associatedPhoneNumber: "(954) 393-2478",
          type: "Watch" // Now using literal type instead of string
        },
        
        {
          id: "ipadpro-7874",
          deviceName: "iPad Pro 13-inch (M4)",
          monthlyPayment: 30.00,
          remainingPayments: 11,
          totalBalance: 330.00,
          associatedPhoneNumber: "(754) 262-7874",
          type: "Tablet" // Now using literal type instead of string
        },
        
        {
          id: "watchultra-2341",
          deviceName: "Watch Ultra 49mm",
          monthlyPayment: 33.34,
          remainingPayments: 20,
          totalBalance: 166.53,
          associatedPhoneNumber: "(954) 393-2341",
          type: "Watch" // Now using literal type instead of string
        }
      ];

      const phoneNumberToDataUsage = {
        "(720) 935-9692": 27.29,
        "(908) 764-1876": 18.42,
        "(720) 394-1781": 11.13,
        "(720) 998-3263": 4.61,
        "(754) 249-8647": 1.97,
        "(720) 935-9642": 1.80,
        "(954) 393-2478": 0.04,
        "(754) 262-7874": 0.00,
        "(954) 393-2341": 0.00
      };

      const phoneNumberToLineCosts = {
        "Account": { plans: 42.50, equipment: 0, services: 0.00, total: 42.50 },
        "(720) 935-9692": { plans: 11.25, equipment: 45.84, services: 0, total: 57.09 },
        "(908) 764-1876": { plans: 11.25, equipment: 50.00, services: 0, total: 61.25 },
        "(720) 394-1781": { plans: 11.25, equipment: 0, services: 0, total: 11.25 },
        "(720) 998-3263": { plans: 11.25, equipment: 0, services: 0, total: 11.25 },
        "(754) 249-8647": { plans: 5.00, equipment: 0, services: 0, total: 5.00 },
        "(720) 935-9642": { plans: 0, equipment: 0, services: 0, total: 0.00 },
        "(954) 393-2478": { plans: 3.75, equipment: 20.84, services: 0, total: 24.59 },
        "(754) 262-7874": { plans: 6.25, equipment: 30.00, services: 0, total: 36.25 },
        "(954) 393-2341": { plans: 1.87, equipment: 33.34, services: 0, total: 35.21 }
      };

      const allPhoneNumbers = Object.keys(phoneNumberToDataUsage);
      
      const allLines = allPhoneNumbers.map((phoneNumber) => {
        const phoneEquipment = mockEquipmentData.find(eq => 
          eq.associatedPhoneNumber === phoneNumber && 
          (eq.type === 'Phone' || eq.type === 'Watch' || eq.type === 'Tablet')
        );
        
        let lineType = "Voice";
        if (phoneNumber === "(754) 262-7874" || phoneNumber === "(754) 249-8647") {
          lineType = "Mobile Internet";
        } else if (phoneNumber === "(954) 393-2341" || phoneNumber === "(954) 393-2478") {
          lineType = "Wearable";
        }

        let planName = "Magenta MAX";
        if (lineType === "Mobile Internet") {
          planName = "Mobile Internet 2.0GB";
        } else if (lineType === "Wearable") {
          planName = "Wearable 1.0GB";
        }

        const lineCosts = phoneNumberToLineCosts[phoneNumber] || { plans: 0, equipment: 0, services: 0, total: 0 };

        const lineEquipment = mockEquipmentData.filter(eq => eq.associatedPhoneNumber === phoneNumber);

        return {
          phoneNumber: phoneNumber,
          deviceName: phoneEquipment?.deviceName || "None",
          lineType: lineType,
          planName: planName,
          monthlyCharge: lineCosts.plans,
          dataUsage: phoneNumberToDataUsage[phoneNumber] || 0,
          equipment: lineEquipment,
          earlyTerminationFee: 0
        };
      });

      const mockAnalyzedData: BillData = {
        carrier: "T-Mobile",
        accountNumber: "123456789",
        billDate: "3/7/25",
        totalAmount: 242.52,
        dueDate: "3/25/25",
        planCosts: 93.12,
        equipmentCosts: 130.14,
        servicesCosts: 19.26,
        lines: allLines
      };

      setUploadStatus('success');
      onUploadComplete(file.name, mockAnalyzedData);

      toast({
        title: "Bill analysis complete",
        description: `Found ${mockAnalyzedData.lines.length} lines on your ${mockAnalyzedData.carrier} account`,
      });
    }, 3000);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {uploadStatus === 'idle' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div
            onDragEnter={handleDrag}
            className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
            }`}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png,.heic"
            />
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload your phone bill</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop your bill here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Accepted formats: PDF, JPG, PNG, HEIC (max 10MB)
              </p>
            </div>
          </div>
          {dragActive && (
            <div
              className="absolute inset-0 w-full h-full"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            ></div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border rounded-xl p-6 bg-white"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
              <File size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file?.name}</p>
              <p className="text-xs text-gray-500">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
            </div>
            {uploadStatus === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
            )}
            {uploadStatus === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
            )}
          </div>
          
          <div className="mb-4">
            <Progress value={uploadProgress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>
                {uploadStatus === 'analyzing' 
                  ? 'Analyzing bill with AI...' 
                  : uploadStatus === 'success' 
                  ? 'Analysis complete!' 
                  : uploadStatus === 'error'
                  ? 'Upload failed'
                  : `Uploading... ${uploadProgress}%`
                }
              </span>
              <span>{uploadStatus === 'analyzing' ? <Sparkles size={14} className="inline text-amber-500 animate-pulse" /> : `${uploadProgress}%`}</span>
            </div>
          </div>
          
          {uploadStatus === 'success' ? (
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Upload another bill
              </Button>
              <Button size="sm">Continue</Button>
            </div>
          ) : uploadStatus === 'analyzing' ? (
            <div className="flex items-center justify-center p-2 bg-amber-50 rounded-md text-amber-700 text-sm">
              <Sparkles size={14} className="mr-2 animate-pulse" />
              AI is analyzing your bill to extract line information...
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={resetUpload}>
              Cancel
            </Button>
          )}
        </motion.div>
      )}
      
      <div className="mt-8 text-center">
        <h4 className="text-base font-medium text-gray-700 mb-2">
          What happens to my bill?
        </h4>
        <p className="text-sm text-gray-500">
          We use AI to automatically extract information about your usage and charges to recommend better plans.
          Your personal details remain secure and your bill is deleted after analysis.
        </p>
      </div>
    </div>
  );
};

export default BillUploader;
