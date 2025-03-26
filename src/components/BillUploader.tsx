import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Sparkles, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BillData, LineData, Equipment } from '@/interfaces/BillTypes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BillUploaderProps {
  onUploadComplete: (fileName: string, analyzedData?: BillData) => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | undefined;

    if (uploadStatus === 'uploading') {
      setIndeterminate(false);
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 300);
    } else if (uploadStatus === 'analyzing') {
      setIndeterminate(true);
      setUploadProgress(95);
    } else if (uploadStatus === 'success') {
      setIndeterminate(false);
      setUploadProgress(100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [uploadStatus]);

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
    setErrorMessage(null);
    setUploadProgress(0);
    processBillWithN8n(file);
  };

  const determineLineType = (planName: string): string => {
    const planNameLower = planName.toLowerCase();
    if (planNameLower.includes("watch") || planNameLower.includes("wearable") || planNameLower.includes("digits")) {
      return "Watch";
    } else if (planNameLower.includes("tablet") || planNameLower.includes("mobile internet")) {
      return "Tablet";
    } else {
      return "Voice";
    }
  };

  const processBillWithN8n = async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      setTimeout(() => {
        setUploadStatus('analyzing');
      }, 2000);
      
      try {
        const res = await fetch("https://meliora.app.n8n.cloud/webhook/analyze-bill", {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}: ${await res.text()}`);
        }
        
        const result = await res.json();
        console.log("AI extracted bill data:", result);
        
        // Transform the received data into our expected BillData format
        if (result) {
          // Check the structure of the received data
          if (result.account_summary && result.phones) {
            // Calculate total data usage from all phones
            const totalDataUsage = result.phones.reduce(
              (acc: number, phone: any) => {
                const usageValue = phone.data_usage_gb && phone.data_usage_gb !== 'N/A' && phone.data_usage_gb !== 'unknown'
                  ? parseFloat(phone.data_usage_gb) || 0
                  : 0;
                return acc + usageValue;
              }, 0);
            
            // Transform the data into our BillData format
            const transformedData: BillData = {
              carrier: result.account_summary?.carrier || "T-Mobile", // Default to T-Mobile if not specified
              accountNumber: result.account_summary?.account_number || "Unknown",
              billDate: result.account_summary?.bill_date || "Unknown",
              totalAmount: parseFloat(result.account_summary?.total_monthly_bill?.replace(/[$,]/g, '') || "0"),
              dueDate: result.account_summary?.due_date || "Unknown",
              planCosts: parseFloat(result.account_summary?.plan_costs?.replace(/[$,]/g, '') || "0"),
              equipmentCosts: parseFloat(result.account_summary?.equipment_costs?.replace(/[$,]/g, '') || "0"),
              servicesCosts: parseFloat(result.account_summary?.services_and_fees?.replace(/[$,]/g, '') || "0"),
              lines: result.phones.filter((phone: any) => phone.phone_number).map((phone: any) => {
                // Determine the line type from plan name
                const lineType = determineLineType(phone.plan?.name || "");
                
                // Extract data usage safely
                let dataUsage = 0;
                if (phone.data_usage_gb && phone.data_usage_gb !== 'N/A' && phone.data_usage_gb !== 'unknown') {
                  try {
                    dataUsage = parseFloat(phone.data_usage_gb);
                  } catch (e) {
                    console.warn(`Could not parse data usage: ${phone.data_usage_gb}`);
                  }
                }
                
                // Transform each phone line
                const lineData: LineData = {
                  phoneNumber: phone.phone_number || "Unknown",
                  deviceName: phone.equipment && phone.equipment.length > 0 
                    ? phone.equipment.find((eq: any) => ['Phone', 'Tablet', 'Watch', 'Wearable'].includes(eq.type))?.model || "Unknown Device"
                    : "Unknown Device",
                  lineType: lineType,
                  planName: phone.plan?.name || "Unknown Plan",
                  monthlyCharge: parseFloat(phone.plan?.charge?.replace(/[$,]/g, '') || "0"),
                  dataUsage: dataUsage,
                  earlyTerminationFee: 0, // Assuming no ETF for now
                  equipment: phone.equipment?.map((eq: any) => {
                    // Normalize the equipment type
                    let normalizedType: 'Phone' | 'Watch' | 'Tablet' | 'Accessory' = 'Accessory';
                    const eqType = eq.type?.toLowerCase() || '';
                    
                    if (eqType.includes('phone')) normalizedType = 'Phone';
                    else if (eqType.includes('watch') || eqType.includes('wearable')) normalizedType = 'Watch';
                    else if (eqType.includes('tablet')) normalizedType = 'Tablet';
                    
                    // Extract remaining payments from installment info
                    let remainingPayments = 0;
                    if (eq.installment_info?.installment) {
                      const installmentParts = eq.installment_info.installment.split(' of ');
                      if (installmentParts.length === 2) {
                        const current = parseInt(installmentParts[0], 10);
                        const total = parseInt(installmentParts[1], 10);
                        if (!isNaN(current) && !isNaN(total)) {
                          remainingPayments = total - current;
                        }
                      }
                    }
                    
                    // Extract monthly payment
                    let monthlyPayment = 0;
                    if (eq.installment_info?.monthly_payment) {
                      const paymentStr = eq.installment_info.monthly_payment.replace(/[$,]/g, '');
                      monthlyPayment = parseFloat(paymentStr) || 0;
                    }
                    
                    // Extract total balance
                    let totalBalance = 0;
                    if (eq.installment_info?.balance && eq.installment_info.balance !== 'N/A' && eq.installment_info.balance !== 'unknown') {
                      const balanceStr = eq.installment_info.balance.replace(/[$,]/g, '');
                      totalBalance = parseFloat(balanceStr) || 0;
                    } else if (remainingPayments > 0 && monthlyPayment > 0) {
                      // Calculate balance if not provided
                      totalBalance = remainingPayments * monthlyPayment;
                    }
                    
                    return {
                      id: crypto.randomUUID(),
                      deviceName: eq.model || "Unknown Device",
                      monthlyPayment: monthlyPayment,
                      remainingPayments: remainingPayments,
                      totalBalance: totalBalance,
                      associatedPhoneNumber: phone.phone_number || "Unknown",
                      type: normalizedType,
                    };
                  })
                };
                return lineData;
              })
            };
            
            setUploadStatus('success');
            onUploadComplete(file.name, transformedData);
            
            toast({
              title: "Bill analysis complete",
              description: `Successfully analyzed your bill`,
            });
          } else {
            throw new Error("Unexpected data format from the analysis service");
          }
        } else {
          throw new Error("No data received from the analysis service");
        }
      } catch (error) {
        console.error("Error processing bill:", error);
        setUploadStatus('error');
        
        const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
        setErrorMessage(`Analysis failed: ${errorMsg}`);
        
        toast({
          title: "Analysis failed",
          description: "We couldn't process your bill. Please try again or use a different file.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadStatus('error');
      
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(`Upload failed: ${errorMsg}`);
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage(null);
    setIndeterminate(false);
  };

  const renderProgressStatus = () => {
    if (uploadStatus === 'analyzing') {
      return (
        <div className="flex items-center">
          <span className="mr-1">Analyzing bill with AI</span>
          <Sparkles size={14} className="text-amber-500 animate-pulse" />
        </div>
      );
    } else if (uploadStatus === 'success') {
      return "Analysis complete!";
    } else if (uploadStatus === 'error') {
      return "Upload failed";
    } else {
      return `Uploading... ${uploadProgress}%`;
    }
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
            <Progress 
              value={uploadProgress} 
              className="h-2" 
              indeterminate={indeterminate}
              indicatorColor={uploadStatus === 'analyzing' ? 'bg-amber-500' : undefined}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{renderProgressStatus()}</span>
              {!indeterminate && <span>{uploadProgress}%</span>}
            </div>
          </div>
          
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
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
