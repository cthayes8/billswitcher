import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

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
          id: "20241205110531258",
          deviceName: "iPhone 16 Pro - White Titanium - 256GB",
          monthlyPayment: 45.84,
          remainingPayments: 20,
          totalBalance: 916.80,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Phone"
        },
        {
          id: "20241205110531193",
          deviceName: "iPhone 16 Pro Max - Natural Titanium - 256GB",
          monthlyPayment: 50.00,
          remainingPayments: 20,
          totalBalance: 1000.00,
          associatedPhoneNumber: "(720) 394-1781",
          type: "Phone"
        },
        {
          id: "20230715110544754",
          deviceName: "Watch Ultra 49mm",
          monthlyPayment: 33.34,
          remainingPayments: 4,
          totalBalance: 133.36,
          associatedPhoneNumber: "(954) 393-2341",
          type: "Watch"
        },
        {
          id: "20230715110544754",
          deviceName: "Watch Series 8 41mm",
          monthlyPayment: 20.84,
          remainingPayments: 4,
          totalBalance: 83.36,
          associatedPhoneNumber: "(954) 393-2478",
          type: "Watch"
        },
        {
          id: "20240710110862253",
          deviceName: "iPad Pro 13-inch (M4)",
          monthlyPayment: 30.00,
          remainingPayments: 11,
          totalBalance: 330.00,
          associatedPhoneNumber: "(754) 262-7874",
          type: "Tablet"
        },
        {
          id: "20241205110531258",
          deviceName: "Apple AirPods 4 with Active Noise Cancellation",
          monthlyPayment: 15.00,
          remainingPayments: 8,
          totalBalance: 120.00,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory"
        },
        {
          id: "20241205110531258",
          deviceName: "GoTo™ Tempered Glass Screen Protector for Apple iPhone 16 Pro",
          monthlyPayment: 3.34,
          remainingPayments: 8,
          totalBalance: 26.72,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory"
        },
        {
          id: "20250104110953267",
          deviceName: "Apple Silicone Case with MagSafe for Apple iPhone 16 Pro Max",
          monthlyPayment: 4.17,
          remainingPayments: 9,
          totalBalance: 37.53,
          associatedPhoneNumber: "(720) 394-1781",
          type: "Accessory"
        },
        {
          id: "20250104110953267",
          deviceName: "Apple Clear Case with MagSafe for Apple iPhone 16 Pro",
          monthlyPayment: 4.17,
          remainingPayments: 9,
          totalBalance: 37.53,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory"
        },
        {
          id: "20250104110953267",
          deviceName: "Apple Watch Magnetic Fast Charger to USB-C Cable, 1m",
          monthlyPayment: 2.50,
          remainingPayments: 9,
          totalBalance: 22.50,
          associatedPhoneNumber: "(954) 393-2341",
          type: "Accessory"
        }
      ];

      const equipmentByPhoneNumber: Record<string, Equipment[]> = {};
      mockEquipmentData.forEach(equipment => {
        if (!equipmentByPhoneNumber[equipment.associatedPhoneNumber]) {
          equipmentByPhoneNumber[equipment.associatedPhoneNumber] = [];
        }
        equipmentByPhoneNumber[equipment.associatedPhoneNumber].push(equipment);
      });

      const allPhoneNumbers = [
        "(908) 764-1876",
        "(720) 394-1781",
        "(954) 393-2341",
        "(954) 393-2478",
        "(754) 262-7874",
        "(212) 555-1234",
        "(312) 555-6789",
        "(415) 555-7890",
        "(305) 555-4321"
      ];

      const allLines: LineData[] = allPhoneNumbers.map((phoneNumber, index) => {
        const phoneEquipment = equipmentByPhoneNumber[phoneNumber]?.find(eq => 
          eq.type === 'Phone' || eq.type === 'Watch' || eq.type === 'Tablet'
        );

        const lineType = phoneNumber.includes("555") ? "Voice" : 
                        phoneEquipment?.type === "Watch" ? "Wearable" : 
                        phoneEquipment?.type === "Tablet" ? "Mobile Internet" : "Voice";

        return {
          phoneNumber: phoneNumber,
          deviceName: phoneEquipment?.deviceName || "Bring Your Own Device",
          lineType: lineType,
          planName: lineType === "Voice" ? "Magenta MAX" : 
                    lineType === "Wearable" ? "Wearable Plan" : "Mobile Internet Plan",
          monthlyCharge: lineType === "Voice" ? 85.00 : 
                        lineType === "Wearable" ? 10.00 : 20.00,
          dataUsage: lineType === "Voice" ? Math.random() * 10 + 2 : 
                    lineType === "Wearable" ? Math.random() * 0.5 : 
                    Math.random() * 5 + 1,
          equipment: equipmentByPhoneNumber[phoneNumber] || [],
          earlyTerminationFee: 0
        };
      });

      const mockAnalyzedData: BillData = {
        carrier: "T-Mobile",
        accountNumber: "123456789",
        billDate: "2023-08-15",
        totalAmount: 542.52,
        dueDate: "2023-09-01",
        planCosts: 340.00,
        equipmentCosts: 185.17,
        servicesCosts: 17.35,
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
