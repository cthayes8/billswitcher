
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Smartphone, Laptop, Watch, DollarSign } from 'lucide-react';
import { LineData, Equipment } from '@/interfaces/BillTypes';

interface LineDetailsTableProps {
  lines: LineData[];
}

const LineDetailsTable: React.FC<LineDetailsTableProps> = ({ lines }) => {
  // Function to get equipment by type
  const getEquipmentByType = (equipment: Equipment[] | undefined, types: string[]) => {
    if (!equipment || equipment.length === 0) return [];
    return equipment.filter(item => types.includes(item.type));
  };

  const getDeviceIcon = (type: string) => {
    switch(type) {
      case 'Phone':
        return <Smartphone size={14} className="mr-1 text-primary" />;
      case 'Watch':
        return <Watch size={14} className="mr-1 text-purple-500" />;
      case 'Tablet':
        return <Laptop size={14} className="mr-1 text-green-500" />;
      default:
        return <Smartphone size={14} className="mr-1 text-primary" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone Number</TableHead>
            <TableHead>Line Type</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Data Usage</TableHead>
            <TableHead>Equipment & Installments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => {
            // Combine all equipment for better visibility
            const allEquipment = line.equipment || [];
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium text-blue-600">{line.phoneNumber}</TableCell>
                <TableCell>{line.lineType}</TableCell>
                <TableCell>{line.planName}</TableCell>
                <TableCell>{line.dataUsage.toFixed(2)} GB</TableCell>
                <TableCell>
                  {allEquipment.length > 0 ? (
                    <div className="space-y-3">
                      {allEquipment.map((eq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center mb-1">
                            {getDeviceIcon(eq.type)}
                            <span className="font-medium">{eq.deviceName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm pl-5">
                            <div className="text-gray-600">Monthly payment:</div>
                            <div className="font-medium">${eq.monthlyPayment.toFixed(2)}</div>
                            
                            <div className="text-gray-600">Remaining payments:</div>
                            <div className="font-medium">
                              {eq.remainingPayments} of {eq.type === 'Phone' || eq.type === 'Watch' ? '24' : '12'}
                            </div>
                            
                            <div className="text-gray-600">Balance:</div>
                            <div className="font-medium text-red-600">${eq.totalBalance.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LineDetailsTable;
