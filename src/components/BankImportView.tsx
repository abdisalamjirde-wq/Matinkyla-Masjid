import React, { useState } from 'react';
import { Member, BankStatementItem } from '../types';
import {
  UploadCloud,
  Check,
  XCircle,
  HelpCircle,
  UserCheck,
  Search,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface BankImportViewProps {
  members: Member[];
  onReconcileMemberPayment: (memberId: string, amount: number, details: string) => void;
  onReconcileExpense: (amount: number, description: string, payee: string) => void;
}

export default function BankImportView({
  members,
  onReconcileMemberPayment,
  onReconcileExpense
}: BankImportViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [reconciledIds, setReconciledIds] = useState<string[]>([]);
  const [manualMatchSelections, setManualMatchSelections] = useState<Record<string, string>>({});
  const [isUploaded, setIsUploaded] = useState(true); // Default loaded for instant premium rich experience!
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Base premium mock statement data
  const [statementItems, setStatementItems] = useState<BankStatementItem[]>([
    {
      id: 'stmt-001',
      date: 'Oct 23, 2023',
      rawTransferText: 'Neste Matinkylä Ref: 441029',
      amount: -45.00,
      suggestedMatch: 'Expense',
      confidence: 100
    },
    {
      id: 'stmt-002',
      date: 'Oct 22, 2023',
      rawTransferText: 'Nordea Siirto PAY Ahmed Al-Farsi Ref: 1024',
      amount: 50.00,
      suggestedMatch: 'Member',
      matchedMemberId: '#M-2024-001', // Ahmed Hassan
      confidence: 98
    },
    {
      id: 'stmt-003',
      date: 'Oct 22, 2023',
      rawTransferText: 'OP-Pankki K-Market Jäsenmaksu Omar F.',
      amount: 50.00,
      suggestedMatch: 'Member',
      matchedMemberId: '#M-2024-042', // Omar Farooq
      confidence: 94
    },
    {
      id: 'stmt-004',
      date: 'Oct 21, 2023',
      rawTransferText: 'Viite Jäsenmaksu Fatima Zahra Ref: 88291',
      amount: 50.00,
      suggestedMatch: 'Member',
      matchedMemberId: '#M-2024-089', // Fatima Zahra
      confidence: 99
    },
    {
      id: 'stmt-005',
      date: 'Oct 20, 2023',
      rawTransferText: 'Fortum Oyj Sähkönsiirto Bill Ref: 9021',
      amount: -128.50,
      suggestedMatch: 'Expense',
      confidence: 100
    },
    {
      id: 'stmt-006',
      date: 'Oct 19, 2023',
      rawTransferText: 'Käteistalletus ATM Tapiola Espoo',
      amount: 250.00,
      suggestedMatch: 'None',
      confidence: 0
    }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate file reading and uploading feedback successfully!
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileName = e.dataTransfer.files[0].name;
      setUploadSuccessMsg(`Successfully processed bank export sheet: ${fileName}`);
      setIsUploaded(true);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadSuccessMsg(`Successfully processed bank export sheet: ${fileName}`);
      setIsUploaded(true);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    }
  };

  const handleReconcile = (item: BankStatementItem) => {
    if (reconciledIds.includes(item.id)) return;

    if (item.suggestedMatch === 'Member') {
      const memberId = item.matchedMemberId || manualMatchSelections[item.id];
      if (!memberId) {
        alert('Please manually select a matching Member first!');
        return;
      }
      onReconcileMemberPayment(memberId, item.amount, item.rawTransferText);
    } else if (item.suggestedMatch === 'Expense') {
      onReconcileExpense(item.amount, item.rawTransferText, 'Nordea Nord-OP Link');
    } else {
      // None match, check if manual member is selected
      const memberId = manualMatchSelections[item.id];
      if (memberId) {
        onReconcileMemberPayment(memberId, item.amount, item.rawTransferText);
      } else {
        onReconcileExpense(item.amount, item.rawTransferText, 'Cash ATM');
      }
    }

    setReconciledIds(prev => [...prev, item.id]);
  };

  return (
    <div className="space-y-xl">
      {/* Bank Import Informative Header */}
      <section className="bg-white p-md rounded-xl border border-outline-variant shadow-sm">
        <h2 className="text-display-lg font-bold text-primary tracking-tight mb-xs">
          Bank Statement Import
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Upload and reconcile bank exports (.CSV, .TXT) with member accounts and utility expenses automatically.
        </p>
      </section>

      {/* Drag & Drop Upload Zone */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4 bg-white border border-outline-variant p-md rounded-xl shadow-sm space-y-md flex flex-col justify-between">
          <h3 className="text-headline-sm font-bold text-primary">
            Uploader
          </h3>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-md text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${
              isDragging
                ? 'border-secondary bg-secondary/5'
                : 'border-outline-variant hover:border-secondary hover:bg-surface-container-low'
            }`}
          >
            <UploadCloud className="h-12 w-12 text-on-surface-variant mb-xs" />
            <p className="text-body-md font-bold text-primary">
              Drag & Drop Bank Leak Sheet
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Supports FinTS Nordea, OP, S-Pankki (.csv, .xlsx)
            </p>
            
            <label className="mt-md bg-secondary text-white text-xs px-md py-2 rounded-lg font-bold hover:opacity-90 block cursor-pointer transition-opacity">
              Select File
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-surface-container-low p-sm rounded-lg flex gap-sm items-start text-xs text-on-surface-variant">
            <AlertCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary block">How matching works:</span>
              We analyze reference Numbers (viitenumero) and names inside bank transfer details to accurately match recorded mosque members.
            </div>
          </div>
        </div>

        {/* Reconciliation Center Table */}
        <div className="md:col-span-8 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-md border-b border-outline-variant">
            <h3 className="text-headline-sm font-bold text-primary">
              Reconciliation Ledger
            </h3>
            <p className="text-body-md text-on-surface-variant">
              Cross-reference matched entries instantly with a single button.
            </p>
          </div>

          {uploadSuccessMsg && (
            <div className="mx-md mt-sm bg-green-50 border border-green-200 text-green-800 p-sm rounded-lg text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {uploadSuccessMsg}
            </div>
          )}

          {isUploaded ? (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Details / Raw Line
                    </th>
                    <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Type & Matching Hint
                    </th>
                    <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                      Amount
                    </th>
                    <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {statementItems.map((item) => {
                    const isReconciled = reconciledIds.includes(item.id);
                    const isExpense = item.amount < 0;
                    
                    // Get actual matching member labels
                    let matchLabel = '';
                    if (item.suggestedMatch === 'Member') {
                      const matchedMember = members.find(m => m.id === item.matchedMemberId);
                      matchLabel = matchedMember 
                        ? `Matched to ${matchedMember.name} (Conf: ${item.confidence}%)`
                        : 'No matched member detected';
                    } else if (item.suggestedMatch === 'Expense') {
                      matchLabel = `Auto-Matched to Utilities/Cost (Conf: ${item.confidence}%)`;
                    } else {
                      matchLabel = 'No clear match found';
                    }

                    return (
                      <tr key={item.id} className={`hover:bg-surface-container-lowest transition-colors ${isReconciled ? 'opacity-60 bg-green-50/20' : ''}`}>
                        <td className="px-md py-md">
                          <p className="text-xs font-mono text-primary font-bold break-all max-w-[280px]">
                            {item.rawTransferText}
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-1">
                            Date: {item.date}
                          </p>
                        </td>

                        <td className="px-md py-md whitespace-nowrap">
                          {isReconciled ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <Check className="h-3 w-3" />
                              Reconciled
                            </span>
                          ) : item.suggestedMatch === 'Member' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100/60 text-blue-800">
                              <UserCheck className="h-3 w-3" />
                              {matchLabel}
                            </span>
                          ) : item.suggestedMatch === 'Expense' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-warm-gray text-on-surface-variant border border-outline-variant">
                              {matchLabel}
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 w-max">
                                {matchLabel}
                              </span>
                              <select
                                value={manualMatchSelections[item.id] || ''}
                                onChange={(e) => setManualMatchSelections(prev => ({ ...prev, [item.id]: e.target.value }))}
                                className="text-xs border border-outline-variant rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-secondary mt-1 max-w-[170px]"
                              >
                                <option value="">-- Manual Pair --</option>
                                {members.map(m => (
                                  <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                                ))}</select>
                            </div>
                          )}
                        </td>

                        <td className={`px-md py-md text-right font-mono font-bold whitespace-nowrap ${
                          isExpense ? 'text-error' : 'text-green-700'
                        }`}>
                          {isExpense ? '-' : '+'}€{Math.abs(item.amount).toFixed(2)}
                        </td>

                        <td className="px-md py-md text-right whitespace-nowrap">
                          <button
                            onClick={() => handleReconcile(item)}
                            disabled={isReconciled}
                            className={`text-xs px-3 py-1.5 rounded font-bold transition-all shadow-sm cursor-pointer ${
                              isReconciled
                                ? 'bg-green-50 text-green-500 border border-green-200 pointer-events-none'
                                : 'bg-primary text-white hover:bg-primary-container'
                            }`}
                          >
                            {isReconciled ? 'Logged' : 'Verify Match'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-xl text-center text-on-surface-variant">
              Please upload or drag a Nordea/OP bank export statement to start reconciliation workflow.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
