export interface PaymentHistoryItem {
  date: string;
  amount: number;
  description: string;
  category: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  monthlyFee: number;
  status: 'Paid' | 'Overdue' | 'Unpaid' | 'Inactive';
  lastPaymentDate: string;
  avatar?: string;
  paymentHistory: PaymentHistoryItem[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Membership' | 'Sadaqah' | 'Zakat' | 'Expense' | 'Jummah';
  amount: number;
  status: 'Completed' | 'Paid' | 'Pending';
  ref?: string;
  fromOrTo?: string;
}

export interface BankStatementItem {
  id: string;
  date: string;
  bankDescription?: string;
  matchingLogic?: 'ID MATCH' | 'NAME FUZZY MATCH' | 'NO MATCH FOUND';
  mappedMemberId?: string | null;
  amount: number;
  confidence?: number;
  suggestedMatch?: 'Member' | 'Expense' | 'None';
  rawTransferText?: string;
  matchedMemberId?: string;
}
