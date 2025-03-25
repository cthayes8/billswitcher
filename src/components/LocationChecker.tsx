
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Briefcase, Check, Loader } from 'lucide-react';

const locationSchema = z.object({
  homeZip: z.string().min(5, "Please enter a valid zip code").max(5, "Zip code must be 5 digits"),
  workZip: z.string().min(5, "Please enter a valid zip code").max(5, "Zip code must be 5 digits"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationCheckerProps {
  onComplete: (homeZip: string, workZip: string, coverageMap: any) => void;
}

const LocationChecker: React.FC<LocationCheckerProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      homeZip: '',
      workZip: '',
    },
  });
  
  const onSubmit = async (data: LocationFormValues) => {
    setIsChecking(true);
    
    // Simulate checking coverage for the entered zip codes
    setTimeout(() => {
      // This would normally come from an API with real coverage data
      const coverageMap = {
        verizon: { homeZip: 95, workZip: 92 },
        att: { homeZip: 91, workZip: 88 },
        tmobile: { homeZip: 89, workZip: 93 },
        visible: { homeZip: 90, workZip: 85 },
        mint: { homeZip: 80, workZip: 75 },
      };
      
      toast({
        title: "Coverage check complete",
        description: "We've analyzed coverage at your locations",
      });
      
      setIsChecking(false);
      onComplete(data.homeZip, data.workZip, coverageMap);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Check Coverage at Your Locations</h2>
      <p className="text-gray-600 mb-6">
        Enter your home and work zip codes so we can check carrier coverage before recommending alternatives.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="homeZip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>Home Zip Code</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter home zip code" {...field} maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workZip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center space-x-2">
                      <Briefcase size={16} />
                      <span>Work Zip Code</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter work zip code" {...field} maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isChecking} className="w-full mt-4">
            {isChecking ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Checking Coverage...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Check Coverage
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LocationChecker;
