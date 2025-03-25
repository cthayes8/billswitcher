
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface BillUploaderProps {
  onUploadComplete: (fileName: string) => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ onUploadComplete }) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

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
          setUploadStatus('success');
          onUploadComplete(file.name);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
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
                {uploadStatus === 'success' 
                  ? 'Upload complete!' 
                  : uploadStatus === 'error'
                  ? 'Upload failed'
                  : `Uploading... ${uploadProgress}%`
                }
              </span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
          
          {uploadStatus === 'success' ? (
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Upload another bill
              </Button>
              <Button size="sm">Continue</Button>
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
          We only extract information about your usage and charges to recommend better plans.
          Your personal details remain secure and your bill is deleted after analysis.
        </p>
      </div>
    </div>
  );
};

export default BillUploader;
