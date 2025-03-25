
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

// Define the schema for equipment items
const equipmentSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
  type: z.enum(['Phone', 'Watch', 'Tablet', 'Accessory']),
  monthlyPayment: z.number().min(0, "Must be 0 or greater"),
  remainingPayments: z.number().min(0, "Must be 0 or greater"),
  totalBalance: z.number().min(0, "Must be 0 or greater"),
});

// Define the schema for a line
const lineSchema = z.object({
  phoneNumber: z.string().optional(),
  lineType: z.string().optional(),
  planName: z.string().optional(),
  equipment: z.array(equipmentSchema).optional(),
});

// Define the form values type
const formSchema = z.object({
  lines: z.array(lineSchema),
});

type LineFormValues = z.infer<typeof formSchema>;

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
    lines: initialData ? initialData.map(line => ({
      phoneNumber: line.phoneNumber || '',
      lineType: line.lineType || '',
      planName: line.planName || '',
      equipment: line.equipment || [],
    })) : [
      {
        phoneNumber: '',
        lineType: '',
        planName: '',
        equipment: [
          {
            deviceName: '',
            type: 'Phone' as const,
            monthlyPayment: 0,
            remainingPayments: 0,
            totalBalance: 0,
          }
        ],
      }
    ]
  };
  
  const form = useForm<LineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Use useFieldArray hook for managing the array of lines
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });
  
  // Helper function to add equipment to a line
  const addEquipment = (lineIndex: number) => {
    const currentEquipment = form.getValues().lines[lineIndex].equipment || [];
    form.setValue(`lines.${lineIndex}.equipment`, [
      ...currentEquipment,
      {
        deviceName: '',
        type: 'Accessory' as const,
        monthlyPayment: 0,
        remainingPayments: 0,
        totalBalance: 0,
      }
    ]);
  };
  
  // Helper function to remove equipment from a line
  const removeEquipment = (lineIndex: number, equipmentIndex: number) => {
    const currentEquipment = form.getValues().lines[lineIndex].equipment || [];
    if (currentEquipment.length > 1) {
      form.setValue(`lines.${lineIndex}.equipment`, currentEquipment.filter((_, i) => i !== equipmentIndex));
    } else {
      toast({
        title: "Cannot remove equipment",
        description: "You need at least one equipment item per line",
        variant: "destructive",
      });
    }
  };
  
  const addLine = () => {
    append({
      phoneNumber: '',
      lineType: '',
      planName: '',
      equipment: [
        {
          deviceName: '',
          type: 'Phone' as const,
          monthlyPayment: 0,
          remainingPayments: 0,
          totalBalance: 0,
        }
      ],
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

  const getDeviceIcon = (deviceType: string = 'Phone') => {
    switch (deviceType) {
      case 'Watch':
        return <Watch size={16} className="mr-1 text-purple-600" />;
      case 'Tablet':
        return <Laptop size={16} className="mr-1 text-green-600" />;
      case 'Accessory':
        return <DollarSign size={16} className="mr-1 text-amber-600" />;
      default:
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
          Tell us about each line on your bill, including device payment plans.
          This helps us calculate the true cost of switching.
        </p>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, lineIndex) => (
            <div key={field.id} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium">Line {lineIndex + 1}</h3>
                  
                  {form.getValues().lines[lineIndex].phoneNumber && (
                    <div className="text-sm text-blue-600 flex items-center">
                      <Phone size={14} className="mr-1" />
                      {form.getValues().lines[lineIndex].phoneNumber}
                    </div>
                  )}
                  
                  {form.getValues().lines[lineIndex].lineType && (
                    <Badge className={`${getLineTypeColor(form.getValues().lines[lineIndex].lineType)}`}>
                      {form.getValues().lines[lineIndex].lineType}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeLine(lineIndex)}
                  disabled={fields.length === 1}
                >
                  <Minus size={16} className="mr-1" />
                  Remove Line
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FormField
                  control={form.control}
                  name={`lines.${lineIndex}.phoneNumber`}
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
                  name={`lines.${lineIndex}.lineType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Line Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Voice, Wearable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`lines.${lineIndex}.planName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Unlimited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Equipment & Installments</h4>
                
                {/* Equipment fields */}
                {form.getValues().lines[lineIndex].equipment?.map((_, equipmentIndex) => (
                  <div key={equipmentIndex} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-medium flex items-center">
                        {getDeviceIcon(form.getValues().lines[lineIndex].equipment?.[equipmentIndex]?.type || 'Phone')}
                        Equipment {equipmentIndex + 1}
                      </h5>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipment(lineIndex, equipmentIndex)}
                        disabled={(form.getValues().lines[lineIndex].equipment?.length || 0) <= 1}
                      >
                        <Minus size={14} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`lines.${lineIndex}.equipment.${equipmentIndex}.deviceName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. iPhone 14 Pro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`lines.${lineIndex}.equipment.${equipmentIndex}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Type</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                              >
                                <option value="Phone">Phone</option>
                                <option value="Watch">Watch</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Accessory">Accessory</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`lines.${lineIndex}.equipment.${equipmentIndex}.monthlyPayment`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Payment</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                {...field}
                                onChange={e => {
                                  field.onChange(Number(e.target.value));
                                  // Auto-calculate balance based on monthly payment and remaining payments
                                  const remainingPayments = form.getValues().lines[lineIndex].equipment?.[equipmentIndex]?.remainingPayments || 0;
                                  if (remainingPayments > 0) {
                                    const balance = Number(e.target.value) * remainingPayments;
                                    form.setValue(`lines.${lineIndex}.equipment.${equipmentIndex}.totalBalance`, balance);
                                  }
                                }}
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`lines.${lineIndex}.equipment.${equipmentIndex}.remainingPayments`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remaining Payments</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={e => {
                                  field.onChange(Number(e.target.value));
                                  // Auto-calculate balance based on monthly payment and remaining payments
                                  const monthlyPayment = form.getValues().lines[lineIndex].equipment?.[equipmentIndex]?.monthlyPayment || 0;
                                  if (monthlyPayment > 0) {
                                    const balance = monthlyPayment * Number(e.target.value);
                                    form.setValue(`lines.${lineIndex}.equipment.${equipmentIndex}.totalBalance`, balance);
                                  }
                                }}
                                min="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`lines.${lineIndex}.equipment.${equipmentIndex}.totalBalance`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <DollarSign size={16} className="mr-1 text-red-600" />
                              <span>Total Balance</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="text-red-600 font-medium"
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
                  size="sm"
                  onClick={() => addEquipment(lineIndex)}
                  className="w-full mt-2"
                >
                  <Plus size={14} className="mr-1" />
                  Add Another Device or Accessory
                </Button>
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
