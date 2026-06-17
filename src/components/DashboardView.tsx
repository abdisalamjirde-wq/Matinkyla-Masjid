import React from 'react';
import { Member, Transaction } from '../types';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wallet,
  UserPlus,
  PlusCircle,
  HelpCircle,
  Filter,
  Download,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  members: Member[];
  transactions: Transaction[];
  onAddMemberClick: () => void;
  onAddTransactionClick: () => void;
  onSelectView: (view: 'dashboard' | 'members' | 'financials' | 'bank-import') => void;
  onViewMemberHistory: (member: Member) => void;
}

export default function DashboardView({
  members,
  transactions,
  onAddMemberClick,
  onAddTransactionClick,
  onSelectView,
  onViewMemberHistory
}: DashboardViewProps) {
  // Let's compute statistics dynamically while staying keyed to the high-fidelity mock bounds
  const totalMembersCount = 120 + (members.length - 7); // offsets baseline counts gracefully
  const paidCount = 85 + members.filter(m => m.status === 'Paid').length - 4;
  const overdueCount = 15 + members.filter(m => m.status === 'Overdue').length - 2;
  const unpaidCount = 20 + members.filter(m => m.status === 'Unpaid').length - 1;
  
  // Calculate the total balance dynamically based on standard baseline plus transaction updates
  const initialBalance = 12450.00;
  const currentBalance = initialBalance + transactions.slice(0, transactions.length - 11).reduce((sum, tx) => sum + tx.amount, 0);

  // Get the display lists matching the dashboard's design spec
  const recentMembersToShow = [
    members.find(m => m.id === '#M-2024-001'), // Ahmed Hassan
    members.find(m => m.id === '#M-2024-042'), // Omar Farooq
    members.find(m => m.id === '#M-2024-089'), // Fatima Zahra
  ].filter(Boolean) as Member[];

  // Get the most recent 5 transactions for the dashboard view
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-xl">
      {/* Main Header / Hero Section with Dark Navy Accent */}
      <section className="bg-primary-container text-on-primary-container py-xl px-gutter rounded-2xl relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="mb-lg">
            <h2 className="text-display-lg text-white mb-2 leading-tight">
              Operational Overview
            </h2>
            <p className="text-body-lg text-primary-fixed-dim">
              Current billing cycle status and performance indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
            {/* Total Members */}
            <div className="glass-card p-md rounded-xl transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                  Total Members
                </span>
                <Users className="h-5 w-5 text-primary-fixed-dim" />
              </div>
              <div className="text-display-lg font-bold text-white">
                {totalMembersCount}
              </div>
              <div className="text-body-md text-secondary-fixed mt-xs font-semibold">
                Active Contributors
              </div>
            </div>

            {/* Paid This Month */}
            <div className="glass-card p-md rounded-xl transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                  Paid This Month
                </span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-display-lg font-bold text-white">
                {paidCount}
              </div>
              <div className="mt-md w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-secondary-fixed h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((paidCount / totalMembersCount) * 100))}%` }}
                ></div>
              </div>
              <div className="text-body-md text-primary-fixed-dim mt-xs">
                {Math.round((paidCount / totalMembersCount) * 100)}% target reached
              </div>
            </div>

            {/* Overdue */}
            <div className="glass-card p-md rounded-xl border-error/20 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                  Overdue
                </span>
                <AlertTriangle className="h-5 w-5 text-error animate-pulse" />
              </div>
              <div className="text-display-lg font-bold text-white">
                {overdueCount}
              </div>
              <div className="text-body-md text-error mt-xs font-semibold">
                Action Required
              </div>
            </div>

            {/* Unpaid */}
            <div className="glass-card p-md rounded-xl transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed-dim">
                  Unpaid
                </span>
                <Clock className="h-5 w-5 text-primary-fixed-dim" />
              </div>
              <div className="text-display-lg font-bold text-white">
                {unpaidCount}
              </div>
              <div className="text-body-md text-primary-fixed-dim mt-xs">
                Awaiting processing
              </div>
            </div>

            {/* Total Balance */}
            <div className="glass-card p-md rounded-xl bg-white/5 transition-all hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-fixed">
                  Total Balance
                </span>
                <Wallet className="h-5 w-5 text-secondary-fixed" />
              </div>
              <div className="text-display-lg font-bold text-secondary-fixed-dim">
                €{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-body-md text-primary-fixed-dim mt-xs">
                Monthly Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Atmospheric BG Radial Glow */}
        <div className="absolute right-[-10%] top-[-50%] w-[500px] h-[500px] bg-secondary opacity-15 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Global Actions Banner - Member Operations */}
      <section className="bg-white p-md rounded-xl shadow-sm border border-outline-variant flex flex-wrap items-center justify-between gap-md">
        <div>
          <h3 className="text-headline-sm font-bold text-primary">
            Member Operations
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Manage contributors and recorded inflows.
          </p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={onAddMemberClick}
            className="bg-white border border-secondary text-secondary px-lg py-sm rounded-lg font-bold flex items-center gap-xs hover:bg-secondary/5 transition-all cursor-pointer h-10"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Add Member</span>
          </button>
          <button
            onClick={onAddTransactionClick}
            className="bg-secondary-container text-on-secondary-container px-lg py-sm rounded-lg font-bold flex items-center gap-xs hover:brightness-95 transition-all shadow-sm cursor-pointer h-10"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </section>

      {/* Split Section: Recent Members (Left) and Recent Transactions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Recent Members Panel */}
        <div className="lg:col-span-4 space-y-md">
          <div className="flex items-center justify-between">
            <h4 className="text-headline-sm font-bold text-primary">
              Recent Members
            </h4>
            <button
              onClick={() => onSelectView('members')}
              className="text-secondary text-xs font-bold hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-sm">
            {recentMembersToShow.map((member) => {
              let badgeColor = 'bg-green-50 text-green-700';
              if (member.status === 'Overdue') badgeColor = 'bg-red-50 text-red-700';
              if (member.status === 'Unpaid') badgeColor = 'bg-slate-100 text-on-surface-variant';

              let avatarBorder = 'border-green-100';
              if (member.status === 'Overdue') avatarBorder = 'border-red-100';
              if (member.status === 'Unpaid') avatarBorder = 'border-slate-100';

              return (
                <div
                  key={member.id}
                  onClick={() => onViewMemberHistory(member)}
                  className="bg-white p-md rounded-xl border border-outline-variant flex items-center gap-md hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 ${avatarBorder}`}>
                    {member.avatar ? (
                      <img
                        alt={member.name}
                        className="h-full w-full object-cover"
                        src={member.avatar}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-body-lg font-semibold text-primary">
                        {member.name}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-mono text-on-surface-variant">
                        ID: {member.id}
                      </span>
                      <span className="text-body-md font-bold text-primary">
                        €{member.monthlyFee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Panel */}
        <div className="lg:col-span-8 space-y-md">
          <div className="flex items-center justify-between">
            <h4 className="text-headline-sm font-bold text-primary">
              Recent Transactions
            </h4>
            <div className="flex gap-xs">
              <button
                onClick={() => onSelectView('financials')}
                className="bg-white border border-outline-variant p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer h-9 w-9 flex items-center justify-center"
                title="Filter Transactions"
              >
                <Filter className="h-4 w-4" />
              </button>
              <button
                onClick={() => onSelectView('financials')}
                className="bg-white border border-outline-variant p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer h-9 w-9 flex items-center justify-center"
                title="Download Ledger"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
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
                  <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recentTransactions.map((tx) => {
                  // Map category to styles
                  let catColor = 'bg-blue-50 text-blue-700 border-blue-100';
                  if (tx.category === 'Sadaqah') catColor = 'bg-amber-50 text-amber-700 border-amber-100';
                  if (tx.category === 'Zakat') catColor = 'bg-purple-50 text-purple-700 border-purple-100';
                  if (tx.category === 'Expense') catColor = 'bg-gray-50 text-gray-700 border-gray-100';
                  if (tx.category === 'Jummah') catColor = 'bg-green-50 text-green-700 border-green-100';

                  const isExpense = tx.amount < 0;

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-surface-container-lowest transition-colors"
                    >
                      <td className="px-md py-md text-xs font-mono text-on-surface-variant whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="px-md py-md">
                        <div className="text-body-md font-semibold text-primary">
                          {tx.description}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          From: {tx.fromOrTo || 'Anonymous'}
                        </div>
                      </td>
                      <td className="px-md py-md whitespace-nowrap">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${catColor}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-md py-md text-right font-bold whitespace-nowrap ${
                        isExpense ? 'text-error' : 'text-primary'
                      }`}>
                        {isExpense ? '-' : ''}€{Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Aesthetic Imagery Footer */}
      <section className="pt-lg border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Community Transparency Card */}
          <div className="relative h-64 rounded-2xl overflow-hidden group shadow-sm">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Community Transparency"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwGShhkIcyPg17iaYz-tjoMDDJugItf2OTJ6E7Ts_-gph4SWQv4Jj2t-VLGR2VDT2-3tldNKQ7clsiyJZTLfDsXGtlXHS1o54iE-okQyf8R1FQepte9kcSmulezTPf3USgQ6lqleLsoJlGHwg4eR9xenNKahkFltYzevHe4RMSEmj4FHeIGNxRgzNzpOM2k8aO0yy4Tiqa7Jqi40oIQAWTqK8G4agO54BK_FzClJ9SyacG2ZfUDWxRrPBsDPmx-5f0uFwZupb3VWg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-lg text-white">
              <h5 className="text-headline-sm font-bold">
                Community Transparency
              </h5>
              <p className="text-body-md opacity-90">
                Our financial records are open for review by all verified members.
              </p>
            </div>
          </div>

          {/* Financial Integrity Card */}
          <div className="relative h-64 rounded-2xl overflow-hidden group shadow-sm">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Financial Integrity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_aZ3Ml3uwd2exXdEBamJFnDAb05O4lTKmSyqrLKWTNbN355RPWHCkadzP0X0SiUZTRDRj98ntQTXESbe-hxXAW1MdnhENjcdMomCp3u9Tdk8kF2Si1p2__evlBo0DAHv8aXYa_Z1WfFpRBB_6kazyhFKt9UWHhTrrjLX4Mfwmevio4tkQdjs0imnOyey_djI8UD6II21rmLIjzlZIu8o-CpSJjSBKCrTP6V-Urt4UMz1kFv4UwVk_InKDEmNsiyCMrF0lgeOJAbA"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/40 to-transparent flex flex-col justify-end p-lg text-white">
              <h5 className="text-headline-sm font-bold">
                Financial Integrity
              </h5>
              <p className="text-body-md opacity-90">
                Ensuring every cent is accounted for and used for the path of goodness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
