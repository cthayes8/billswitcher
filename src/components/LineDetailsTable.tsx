
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
  // Function to get device icon based on type
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

  // Filter equipment by type and associated phone number
  const getHandsets = (equipment: Equipment[] | undefined, phoneNumber: string) => {
    if (!equipment || equipment.length === 0) return [];
    
    // Make sure to only include equipment specifically associated with this phone number
    return equipment.filter(item => 
      ['Phone', 'Watch', 'Tablet'].includes(item.type) && 
      item.associatedPhoneNumber === phoneNumber
    );
  };

  const getAccessories = (equipment: Equipment[] | undefined, phoneNumber: string) => {
    if (!equipment || equipment.length === 0) return [];
    
    // Make sure to only include accessories specifically associated with this phone number
    return equipment.filter(item => 
      item.type === 'Accessory' && 
      item.associatedPhoneNumber === phoneNumber
    );
  };

  // Calculate the total balance for all equipment items
  const calculateTotalBalance = (equipment: Equipment[] | undefined) => {
    if (!equipment || equipment.length === 0) return 0;
    return equipment.reduce((total, item) => total + item.totalBalance, 0);
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
            <TableHead>Handsets</TableHead>
            <TableHead>Accessories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => {
            // Get equipment specific to this line
            const handsets = getHandsets(line.equipment, line.phoneNumber);
            const accessories = getAccessories(line.equipment, line.phoneNumber);
            
            // Calculate balances
            const handsetsBalance = calculateTotalBalance(handsets);
            const accessoriesBalance = calculateTotalBalance(accessories);
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium text-blue-600">{line.phoneNumber}</TableCell>
                <TableCell>{line.lineType}</TableCell>
                <TableCell>{line.planName}</TableCell>
                <TableCell>{line.dataUsage.toFixed(2)} GB</TableCell>
                
                {/* Handsets Column */}
                <TableCell>
                  {handsets.length > 0 ? (
                    <div className="space-y-3">
                      {handsets.map((eq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center mb-1">
                            {getDeviceIcon(eq.type)}
                            <span className="font-medium">{eq.deviceName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm pl-5">
                            <div className="text-gray-600">Monthly payment:</div>
                            <div className="font-medium">${eq.monthlyPayment.toFixed(2)}</div>
                            
                            <div className="text-gray-600">Installment:</div>
                            <div className="font-medium">
                              {eq.remainingPayments} of {eq.type === 'Phone' ? '24' : eq.type === 'Watch' ? '24' : '12'}
                            </div>
                            
                            <div className="text-gray-600">Balance:</div>
                            <div className="font-medium text-red-600">${eq.totalBalance.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                      
                      {handsets.length > 0 && (
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                            <div className="text-gray-700">Total handset balance:</div>
                            <div className="text-red-600">${handsetsBalance.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </TableCell>
                
                {/* Accessories Column */}
                <TableCell>
                  {accessories.length > 0 ? (
                    <div className="space-y-3">
                      {accessories.map((eq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center mb-1">
                            <DollarSign size={14} className="mr-1 text-amber-500" />
                            <span className="font-medium">{eq.deviceName}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm pl-5">
                            <div className="text-gray-600">Monthly payment:</div>
                            <div className="font-medium">${eq.monthlyPayment.toFixed(2)}</div>
                            
                            <div className="text-gray-600">Installment:</div>
                            <div className="font-medium">
                              {eq.remainingPayments} of 12
                            </div>
                            
                            <div className="text-gray-600">Balance:</div>
                            <div className="font-medium text-red-600">${eq.totalBalance.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                      
                      {accessories.length > 0 && (
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                            <div className="text-gray-700">Total accessory balance:</div>
                            <div className="text-red-600">${accessoriesBalance.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
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
