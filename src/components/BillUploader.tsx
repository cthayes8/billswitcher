
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
  type: 'Phone' | 'Accessory';
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
    // Check if the file is a PDF or image (common bill formats)
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
    
    // Check file size (max 10MB)
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
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Start AI analysis after upload completes
          analyzeDocument(file);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const analyzeDocument = (file: File) => {
    setUploadStatus('analyzing');
    
    // Simulate AI analysis of the document
    setTimeout(() => {
      // Mock data extraction - in a real implementation, this would be done by AI
      const mockEquipmentData: Equipment[] = [
        {
          id: "PHN-001",
          deviceName: "iPhone 14 Pro",
          monthlyPayment: 33.34,
          remainingPayments: 18,
          totalBalance: 600.12,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Phone"
        },
        {
          id: "ACC-001",
          deviceName: "Apple Watch Series 8",
          monthlyPayment: 20.84,
          remainingPayments: 12,
          totalBalance: 250.08,
          associatedPhoneNumber: "(908) 764-1876",
          type: "Accessory"
        },
        {
          id: "PHN-002",
          deviceName: "Samsung Galaxy S23",
          monthlyPayment: 29.17,
          remainingPayments: 24,
          totalBalance: 700.08,
          associatedPhoneNumber: "(720) 935-9642",
          type: "Phone"
        },
        {
          id: "ACC-002",
          deviceName: "Samsung Galaxy Watch 5",
          monthlyPayment: 12.50,
          remainingPayments: 12,
          totalBalance: 150.00,
          associatedPhoneNumber: "(720) 935-9642",
          type: "Accessory"
        },
        {
          id: "PHN-003",
          deviceName: "Google Pixel 7",
          monthlyPayment: 25.00,
          remainingPayments: 12,
          totalBalance: 300.00,
          associatedPhoneNumber: "(720) 394-1781",
          type: "Phone"
        },
        {
          id: "PHN-009",
          deviceName: "Mobile Hotspot",
          monthlyPayment: 10.00,
          remainingPayments: 18,
          totalBalance: 180.00,
          associatedPhoneNumber: "(754) 262-7874",
          type: "Phone"
        }
      ];

      // Organize equipment by phone number for the lines
      const equipmentByPhoneNumber: Record<string, Equipment[]> = {};
      mockEquipmentData.forEach(equipment => {
        if (!equipmentByPhoneNumber[equipment.associatedPhoneNumber]) {
          equipmentByPhoneNumber[equipment.associatedPhoneNumber] = [];
        }
        equipmentByPhoneNumber[equipment.associatedPhoneNumber].push(equipment);
      });

      const mockAnalyzedData: BillData = {
        carrier: "AT&T",
        accountNumber: "123456789",
        billDate: "2023-08-15",
        totalAmount: 242.52,
        dueDate: "2023-09-01",
        planCosts: 140.00,
        equipmentCosts: 85.17,
        servicesCosts: 17.35,
        lines: [
          {
            phoneNumber: "(908) 764-1876",
            deviceName: "iPhone 14 Pro",
            lineType: "Voice",
            planName: "Unlimited Plus",
            monthlyCharge: 55.00,
            dataUsage: 9.8,
            equipment: equipmentByPhoneNumber["(908) 764-1876"] || [],
            earlyTerminationFee: 150,
          },
          {
            phoneNumber: "(720) 935-9642",
            deviceName: "Samsung Galaxy S23",
            lineType: "Voice",
            planName: "Unlimited Basic",
            monthlyCharge: 45.00,
            dataUsage: 6.2,
            equipment: equipmentByPhoneNumber["(720) 935-9642"] || [],
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(720) 394-1781",
            deviceName: "Google Pixel 7",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyCharge: 40.00,
            dataUsage: 4.5,
            equipment: equipmentByPhoneNumber["(720) 394-1781"] || [],
            earlyTerminationFee: 75,
          },
          {
            phoneNumber: "(720) 935-9692",
            deviceName: "iPhone 13",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyCharge: 40.00,
            dataUsage: 3.2,
            equipment: [],
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(720) 998-3263",
            deviceName: "iPhone SE",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyCharge: 40.00,
            dataUsage: 2.1,
            equipment: [],
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(954) 393-2341",
            deviceName: "Apple Watch Series 8",
            lineType: "Wearable",
            planName: "Wearable Plan",
            monthlyCharge: 10.00,
            dataUsage: 0.3,
            equipment: [],
            earlyTerminationFee: 75,
          },
          {
            phoneNumber: "(954) 393-2478",
            deviceName: "Samsung Galaxy Watch 5",
            lineType: "Wearable",
            planName: "Wearable Plan",
            monthlyCharge: 10.00,
            dataUsage: 0.2,
            equipment: [],
            earlyTerminationFee: 50,
          },
          {
            phoneNumber: "(754) 249-8647",
            deviceName: "Tablet",
            lineType: "Mobile Internet",
            planName: "Mobile Internet Plan",
            monthlyCharge: 20.00,
            dataUsage: 1.8,
            equipment: [],
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(754) 262-7874",
            deviceName: "Mobile Hotspot",
            lineType: "Mobile Internet",
            planName: "Mobile Internet Plan",
            monthlyCharge: 20.00,
            dataUsage: 5.7,
            equipment: equipmentByPhoneNumber["(754) 262-7874"] || [],
            earlyTerminationFee: 100,
          }
        ]
      };

      // Success! Send the data back
      setUploadStatus('success');
      onUploadComplete(file.name, mockAnalyzedData);

      toast({
        title: "Bill analysis complete",
        description: `Found ${mockAnalyzedData.lines.length} lines on your ${mockAnalyzedData.carrier} account`,
      });
    }, 3000); // Simulate 3 seconds of AI processing
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
