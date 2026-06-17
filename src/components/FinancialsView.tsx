import React, { useState } from 'react';
import { Member, Transaction } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  FileText,
  Table2,
  Filter,
  Trash2
} from 'lucide-react';

interface FinancialsViewProps {
  transactions: Transaction[];
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export default function FinancialsView({
  transactions,
  onExportPDF,
  onExportExcel
}: FinancialsViewProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Outcome'>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Months list for switcher tracking
  const months = ['October 2023', 'November 2023', 'December 2023'];
  const currentMonthName = months[(monthOffset + months.length * 10) % months.length];

  // We'll compute baseline financials dynamically while varying slightly with month switching to feel lived in!
  const monthlyBudgets: Array<{ income: number; outcome: number }> = [
    { income: 12450.00, outcome: 4120.45 },
    { income: 14200.00, outcome: 3890.10 },
    { income: 11100.00, outcome: 5200.00 }
  ];
  const activeBudgetIndex = (monthOffset + months.length * 10) % months.length;
  const baseIncome = monthlyBudgets[activeBudgetIndex].income;
  const baseOutcome = monthlyBudgets[activeBudgetIndex].outcome;
  
  // Factor in user added transactions
  const extraTransactions = transactions.slice(0, transactions.length - 11);
  const extraIncome = extraTransactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const extraOutcome = Math.abs(extraTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0));

  const calculatedIncome = baseIncome + extraIncome;
  const calculatedOutcome = baseOutcome + extraOutcome;
  const netBalance = calculatedIncome - calculatedOutcome;

  // Filter and Paginate ledger
  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'Income') return tx.amount > 0;
    if (filterType === 'Outcome') return tx.amount < 0;
    return true;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-xl">
      {/* Top Controls & Monthly Switcher */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="text-display-lg font-bold text-primary tracking-tight mb-xs">
            Financial Tracking
          </h2>
          <div className="flex items-center gap-sm text-on-surface-variant">
            <button
              onClick={() => { setMonthOffset(prev => prev - 1); setCurrentPage(1); }}
              className="p-1.5 hover:bg-surface-container-high rounded transition-colors cursor-pointer h-9 w-9 flex items-center justify-center border border-outline-variant"
            >
              <ChevronLeft className="h-4 w-4 text-primary" />
            </button>
            <span className="text-headline-sm font-semibold px-md border-x border-outline-variant min-w-[150px] text-center text-primary">
              {currentMonthName}
            </span>
            <button
              onClick={() => { setMonthOffset(prev => prev + 1); setCurrentPage(1); }}
              className="p-1.5 hover:bg-surface-container-high rounded transition-colors cursor-pointer h-9 w-9 flex items-center justify-center border border-outline-variant"
            >
              <ChevronRight className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <button
            onClick={onExportPDF}
            className="flex items-center gap-xs border border-outline text-primary px-md py-sm rounded font-bold text-sm hover:bg-surface-container-low transition-colors cursor-pointer h-10"
          >
            <FileText className="h-4 w-4 text-primary" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={onExportExcel}
            className="flex items-center gap-xs bg-secondary text-white px-md py-sm rounded font-bold text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer h-10"
          >
            <Table2 className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </section>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Total Income */}
        <div className="bg-white border border-outline-variant p-md rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Income
            </span>
            <span className="text-green-600 bg-green-50 p-1.5 rounded-full">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="text-display-lg font-bold text-primary">
            €{calculatedIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-xs text-xs text-on-surface-variant">
            <span className="text-green-600 font-bold">+12%</span> vs last month
          </div>
        </div>

        {/* Total Outcome */}
        <div className="bg-white border border-outline-variant p-md rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Outcome
            </span>
            <span className="text-error bg-error-container/40 p-1.5 rounded-full">
              <TrendingDown className="h-4 w-4 text-error" />
            </span>
          </div>
          <div className="text-display-lg font-bold text-primary">
            €{calculatedOutcome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-xs text-xs text-on-surface-variant">
            <span className="text-error font-bold font-sans">+2.4%</span> vs last month
          </div>
        </div>

        {/* Net Balance (Dark Slate Piggy-themed Banner) */}
        <div className="bg-primary text-on-primary p-md rounded-xl shadow-[0_4px_12px_rgba(0,12,36,0.12)] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-sm">
              <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider">
                Net Balance
              </span>
              <Wallet className="h-5 w-5 text-secondary-container" />
            </div>
            <div className="text-display-lg font-bold text-white">
              €{netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-xs text-xs text-primary-fixed">
              Current Monthly Surplus
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 text-secondary-container pointer-events-none">
            <PiggyBank className="h-28 w-28" />
          </div>
        </div>
      </div>

      {/* Side-by-Side: Categories Breakdown & Operational Cost Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Income Sources Weights */}
        <div className="lg:col-span-6 bg-white border border-outline-variant p-md rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="text-headline-sm font-bold text-primary mb-md">
              Income Sources
            </h3>
            <div className="space-y-md">
              {/* Sadaqa Progress */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary">Sadaqa & Donations</span>
                  <span className="text-xs font-bold">€7,200 (58%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>

              {/* Memberships Progress */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary">Monthly Memberships</span>
                  <span className="text-xs font-bold">€4,800 (38.5%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5">
                  <div className="bg-secondary h-2.5 rounded-full" style={{ width: '38.5%' }}></div>
                </div>
              </div>

              {/* Waqf Progress */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary">Project Waqf</span>
                  <span className="text-xs font-bold">€450 (3.5%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5">
                  <div className="bg-on-tertiary-container h-2.5 rounded-full" style={{ width: '3.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-lg pt-md border-t border-outline-variant">
            <button className="w-full text-center text-primary font-bold text-sm hover:underline cursor-pointer">
              View All Categories
            </button>
          </div>
        </div>

        {/* Operational Costs Pie Ring Diagram */}
        <div className="lg:col-span-6 bg-white border border-outline-variant p-md rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] overflow-hidden">
          <h3 className="text-headline-sm font-bold text-primary mb-md">
            Operational Costs
          </h3>
          <div className="relative h-44 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Ring chart using raw CSS radial divisions & rotating slices */}
              <div className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-inner group">
                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Utility circle segments: utilities (45%) -> red, rent (35%) -> primary, maint (20%) -> gold */}
                  {/* Utilities (16.2 length, 0 offset) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#ba1a1a"
                    strokeWidth="2.8"
                    strokeDasharray="45 55"
                    strokeDashoffset="0"
                    className="transition-all duration-300 hover:stroke-[3.5]"
                  />
                  {/* Rent (12.6 length, -45 offset) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#000c24"
                    strokeWidth="2.8"
                    strokeDasharray="35 65"
                    strokeDashoffset="-45"
                    className="transition-all duration-300 hover:stroke-[3.5]"
                  />
                  {/* Maintenance (7.2 length, -80 offset) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#765b00"
                    strokeWidth="2.8"
                    strokeDasharray="20 80"
                    strokeDashoffset="-80"
                    className="transition-all duration-300 hover:stroke-[3.5]"
                  />
                </svg>
                {/* Centered Ring Text Labels */}
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                  <span className="text-xs font-bold text-primary">Bills</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">€1,830</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-sm mt-md">
            <div className="flex items-center gap-xs justify-center text-center">
              <div className="w-3 h-3 rounded-full bg-error shrink-0"></div>
              <span className="text-[11px] font-bold text-primary truncate">Utilities (45%)</span>
            </div>
            <div className="flex items-center gap-xs justify-center text-center">
              <div className="w-3 h-3 rounded-full bg-primary shrink-0"></div>
              <span className="text-[11px] font-bold text-primary truncate">Rent (35%)</span>
            </div>
            <div className="flex items-center gap-xs justify-center text-center">
              <div className="w-3 h-3 rounded-full bg-secondary shrink-0"></div>
              <span className="text-[11px] font-bold text-primary truncate">Maint. (20%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Ledger List */}
      <section className="bg-white border border-outline-variant rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] flex flex-col">
        <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-md">
          <h3 className="text-headline-sm font-bold text-primary">
            Transaction Ledger
          </h3>
          <div className="flex items-center gap-sm">
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value as any); setCurrentPage(1); }}
              className="text-xs font-bold border border-outline-variant rounded-lg bg-surface py-1 px-3 focus:ring-secondary focus:border-transparent cursor-pointer h-9"
            >
              <option value="All">All Types</option>
              <option value="Income">Income Only</option>
              <option value="Outcome">Outcome Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Description
                </th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Category
                </th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paginatedTransactions.map((tx) => {
                let catColor = 'bg-surface-container text-on-surface-variant';
                if (tx.category === 'Sadaqah') catColor = 'bg-amber-100/50 text-amber-800';
                if (tx.category === 'Zakat') catColor = 'bg-purple-100/50 text-purple-800';
                if (tx.category === 'Membership') catColor = 'bg-blue-100/50 text-blue-800';
                if (tx.category === 'Jummah') catColor = 'bg-green-100/50 text-green-800';

                const isExpense = tx.amount < 0;

                let statusBadge = '';
                if (tx.status === 'Completed' || tx.status === 'Paid') {
                  statusBadge = 'text-green-700 bg-green-100/80';
                } else {
                  statusBadge = 'text-primary bg-primary-fixed';
                }

                return (
                  <tr key={tx.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-md py-md text-xs font-mono text-on-surface-variant whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="px-md py-md">
                      <div className="text-body-md font-semibold text-primary">
                        {tx.description}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {tx.fromOrTo ? `Source/To: ${tx.fromOrTo}` : ''} {tx.ref ? `• Ref: ${tx.ref}` : ''}
                      </div>
                    </td>
                    <td className="px-md py-md whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${catColor}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-md py-md whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isExpense ? 'bg-error' : 'bg-green-500'}`}></span>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-md py-md text-right font-bold whitespace-nowrap ${
                      isExpense ? 'text-error' : 'text-green-700'
                    }`}>
                      {isExpense ? '-' : '+'}€{Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer & Pagination */}
        <div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-md">
          <span className="text-xs text-on-surface-variant">
            Showing {paginatedTransactions.length} of {filteredTransactions.length} entries
          </span>
          {totalPages > 1 && (
            <div className="flex gap-xs">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-outline-variant rounded bg-white hover:bg-surface-container-low transition-colors text-xs font-bold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1.5 border rounded text-xs font-bold transition-all cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white hover:bg-surface-container-low border-outline-variant'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-outline-variant rounded bg-white hover:bg-surface-container-low transition-colors text-xs font-bold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
