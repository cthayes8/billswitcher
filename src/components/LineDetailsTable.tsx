
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Smartphone, Laptop, Watch } from 'lucide-react';
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone Number</TableHead>
            <TableHead>Line Type</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Data Usage</TableHead>
            <TableHead>Handset</TableHead>
            <TableHead>Accessories</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => {
            const handsets = getEquipmentByType(line.equipment, ['Phone', 'Watch', 'Tablet']);
            const accessories = getEquipmentByType(line.equipment, ['Accessory']);
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{line.phoneNumber}</TableCell>
                <TableCell>{line.lineType}</TableCell>
                <TableCell>{line.planName}</TableCell>
                <TableCell>{line.dataUsage.toFixed(2)} GB</TableCell>
                <TableCell>
                  {handsets.length > 0 ? (
                    <div className="space-y-1">
                      {handsets.map((eq, i) => (
                        <div key={i} className="flex items-center text-sm">
                          {eq.type === 'Phone' ? (
                            <Smartphone size={12} className="mr-1 text-primary" />
                          ) : eq.type === 'Watch' ? (
                            <Watch size={12} className="mr-1 text-purple-500" />
                          ) : (
                            <Laptop size={12} className="mr-1 text-green-500" />
                          )}
                          <span className="mr-2">{eq.deviceName}</span>
                          <span className="font-medium ml-auto text-green-700">${eq.totalBalance.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {accessories.length > 0 ? (
                    <div className="space-y-1">
                      {accessories.map((acc, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <span className="mr-2 truncate" title={acc.deviceName}>
                            {acc.deviceName.length > 25 
                              ? acc.deviceName.substring(0, 25) + '...' 
                              : acc.deviceName}
                          </span>
                          <span className="font-medium ml-auto text-green-700">${acc.totalBalance.toFixed(2)}</span>
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
