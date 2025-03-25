
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
import { Plus, Minus, Smartphone, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const lineSchema = z.object({
  lines: z.array(z.object({
    deviceName: z.string().min(1, "Device name is required"),
    remainingPayments: z.number().min(0, "Must be 0 or greater"),
    monthlyPayment: z.number().min(0, "Must be 0 or greater"),
    earlyTerminationFee: z.number().min(0, "Must be 0 or greater"),
  })),
});

type LineFormValues = z.infer<typeof lineSchema>;

interface LineDetailsFormProps {
  onComplete: (lineDetails: LineFormValues) => void;
}

const LineDetailsForm: React.FC<LineDetailsFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  
  const form = useForm<LineFormValues>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      lines: [
        {
          deviceName: '',
          remainingPayments: 0,
          monthlyPayment: 0,
          earlyTerminationFee: 0,
        }
      ]
    },
  });
  
  // Use useFieldArray hook for managing the array of lines
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  
  const addLine = () => {
    append({
      deviceName: '',
      remainingPayments: 0,
      monthlyPayment: 0,
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Enter Line Details</h2>
      <p className="text-gray-600 mb-6">
        Tell us about each line on your bill, including device payment plans and any early termination fees.
        This helps us calculate the true cost of switching.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Line {index + 1}</h3>
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
            Save Line Details
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LineDetailsForm;
