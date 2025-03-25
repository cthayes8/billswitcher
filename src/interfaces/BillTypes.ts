
export interface Equipment {
  id: string;
  deviceName: string;
  monthlyPayment: number;
  remainingPayments: number;
  totalBalance: number;
  associatedPhoneNumber: string;
  type: 'Phone' | 'Watch' | 'Tablet' | 'Accessory';
}

export interface LineData {
  phoneNumber: string;
  deviceName: string;
  lineType: string;
  planName: string;
  monthlyCharge: number;
  dataUsage: number;
  equipment?: Equipment[];
  earlyTerminationFee: number;
}

export interface BillData {
  carrier: string;
  accountNumber: string;
  billDate: string;
  totalAmount: number;
  dueDate: string;
  planCosts: number;
  equipmentCosts: number;
  servicesCosts: number;
  lines: LineData[];
}
