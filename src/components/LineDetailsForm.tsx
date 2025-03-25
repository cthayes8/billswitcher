
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Plus, Minus, Smartphone, DollarSign, Sparkles, Phone, Laptop, Watch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const lineSchema = z.object({
  lines: z.array(z.object({
    deviceName: z.string().min(1, "Device name is required"),
    phoneNumber: z.string().optional(),
    lineType: z.string().optional(),
    remainingPayments: z.number().min(0, "Must be 0 or greater"),
    monthlyPayment: z.number().min(0, "Must be 0 or greater"),
    totalBalance: z.number().min(0, "Must be 0 or greater"),
    earlyTerminationFee: z.number().min(0, "Must be 0 or greater"),
  })),
});

type LineFormValues = z.infer<typeof lineSchema>;

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

interface LineDetailsFormProps {
  onComplete: (lineDetails: LineFormValues) => void;
  initialData?: LineData[];
}

const LineDetailsForm: React.FC<LineDetailsFormProps> = ({ onComplete, initialData }) => {
  const { toast } = useToast();
  
  // Prepare initial values
  const defaultValues = {
    lines: initialData ? initialData.map(line => {
      // Get the phone equipment if any
      const phoneEquipment = line.equipment?.find(eq => eq.type === 'Phone' || eq.type === 'Watch' || eq.type === 'Tablet');
      
      return {
        deviceName: line.deviceName || '',
        phoneNumber: line.phoneNumber || '',
        lineType: line.lineType || '',
        remainingPayments: phoneEquipment?.remainingPayments || 0,
        monthlyPayment: phoneEquipment?.monthlyPayment || 0,
        totalBalance: phoneEquipment?.totalBalance || 0,
        earlyTerminationFee: line.earlyTerminationFee || 0,
      };
    }) : [
      {
        deviceName: '',
        phoneNumber: '',
        lineType: '',
        remainingPayments: 0,
        monthlyPayment: 0,
        totalBalance: 0,
        earlyTerminationFee: 0,
      }
    ]
  };
  
  const form = useForm<LineFormValues>({
    resolver: zodResolver(lineSchema),
    defaultValues,
  });
  
  // Use useFieldArray hook for managing the array of lines
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  
  const addLine = () => {
    append({
      deviceName: '',
      phoneNumber: '',
      lineType: '',
      remainingPayments: 0,
      monthlyPayment: 0,
      totalBalance: 0,
      earlyTerminationFee: 0,
    });
  };
  
  const removeLine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast({
        title: "Cannot remove line",
        description: "You need at least one line on your account",
        variant: "destructive",
      });
    }
  };
  
  const onSubmit = (data: LineFormValues) => {
    toast({
      title: "Line details saved",
      description: `${data.lines.length} lines processed for analysis`,
    });
    
    onComplete(data);
  };

  const getLineTypeColor = (lineType: string = '') => {
    switch(lineType.toLowerCase()) {
      case 'voice':
        return 'bg-blue-100 text-blue-800';
      case 'wearable':
        return 'bg-purple-100 text-purple-800';
      case 'mobile internet':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device: string = '') => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('watch')) {
      return <Watch size={16} className="mr-1 text-purple-600" />;
    } else if (deviceLower.includes('ipad') || deviceLower.includes('tablet')) {
      return <Laptop size={16} className="mr-1 text-green-600" />;
    } else {
      return <Smartphone size={16} className="mr-1 text-primary" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Confirm Line Details</h2>
      
      {initialData ? (
        <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
          <Sparkles size={20} className="text-green-600 mr-3 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-medium">AI-detected line details</p>
            <p className="text-sm text-green-700">
              We've automatically extracted {initialData.length} lines from your bill. 
              Please review and confirm the information below.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">
          Tell us about each line on your bill, including device payment plans and any early termination fees.
          This helps us calculate the true cost of switching.
        </p>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium">Line {index + 1}</h3>
                  
                  {form.getValues().lines[index].phoneNumber && (
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone size={14} className="mr-1" />
                      {form.getValues().lines[index].phoneNumber}
                    </div>
                  )}
                  
                  {form.getValues().lines[index].lineType && (
                    <Badge className={`${getLineTypeColor(form.getValues().lines[index].lineType)}`}>
                      {form.getValues().lines[index].lineType}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeLine(index)}
                  disabled={fields.length === 1}
                >
                  <Minus size={16} className="mr-1" />
                  Remove Line
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`lines.${index}.phoneNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center space-x-2">
                          <Phone size={16} />
                          <span>Phone Number</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`lines.${index}.deviceName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center space-x-2">
                          <Smartphone size={16} />
                          <span>Device</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. iPhone 14 Pro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`lines.${index}.remainingPayments`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Payments</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`lines.${index}.monthlyPayment`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} />
                          <span>Monthly Payment</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          step="0.01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`lines.${index}.totalBalance`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} />
                          <span>Total Balance</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          step="0.01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`lines.${index}.earlyTerminationFee`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} />
                          <span>Early Termination Fee</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          step="0.01"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addLine}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Add Another Line
          </Button>
          
          <Button type="submit" className="w-full">
            {initialData ? 'Confirm Line Details' : 'Save Line Details'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LineDetailsForm;
