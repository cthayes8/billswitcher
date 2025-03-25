
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface BillUploaderProps {
  onUploadComplete: (fileName: string, analyzedData?: any) => void;
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
      const mockAnalyzedData = {
        carrier: "Big Mobile Inc.",
        accountNumber: "123456789",
        billDate: "2023-08-15",
        totalAmount: 242.52,
        dueDate: "2023-09-01",
        lines: [
          {
            phoneNumber: "(908) 764-1876",
            deviceName: "iPhone 14 Pro",
            lineType: "Voice",
            planName: "Unlimited Plus",
            monthlyPayment: 46.47,
            remainingPayments: 18,
            earlyTerminationFee: 150,
          },
          {
            phoneNumber: "(720) 935-9642",
            deviceName: "Samsung Galaxy S23",
            lineType: "Voice",
            planName: "Unlimited Basic",
            monthlyPayment: 0,
            remainingPayments: 0,
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(720) 394-1781",
            deviceName: "Google Pixel 7",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyPayment: 16.25,
            remainingPayments: 12,
            earlyTerminationFee: 75,
          },
          {
            phoneNumber: "(720) 935-9692",
            deviceName: "iPhone 13",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyPayment: 0,
            remainingPayments: 0,
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(720) 998-3263",
            deviceName: "iPhone SE",
            lineType: "Voice",
            planName: "Basic Voice Plan",
            monthlyPayment: 0,
            remainingPayments: 0,
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(954) 393-2341",
            deviceName: "Apple Watch Series 8",
            lineType: "Wearable",
            planName: "Wearable Plan",
            monthlyPayment: 24.96,
            remainingPayments: 24,
            earlyTerminationFee: 75,
          },
          {
            phoneNumber: "(954) 393-2478",
            deviceName: "Samsung Galaxy Watch 5",
            lineType: "Wearable",
            planName: "Wearable Plan",
            monthlyPayment: 12.46,
            remainingPayments: 12,
            earlyTerminationFee: 50,
          },
          {
            phoneNumber: "(754) 249-8647",
            deviceName: "Tablet",
            lineType: "Mobile Internet",
            planName: "Mobile Internet Plan",
            monthlyPayment: 0,
            remainingPayments: 0,
            earlyTerminationFee: 0,
          },
          {
            phoneNumber: "(754) 262-7874",
            deviceName: "Mobile Hotspot",
            lineType: "Mobile Internet",
            planName: "Mobile Internet Plan",
            monthlyPayment: 30.00,
            remainingPayments: 24,
            earlyTerminationFee: 100,
          }
        ]
      };

      // Success! Send the data back
      setUploadStatus('success');
      onUploadComplete(file.name, mockAnalyzedData);

      toast({
        title: "Bill analysis complete",
        description: `Found ${mockAnalyzedData.lines.length} lines on your account`,
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
