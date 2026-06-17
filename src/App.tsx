import React, { useState } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS
} from './data';
import { Member, Transaction } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FinancialsView from './components/FinancialsView';
import MembersView from './components/MembersView';
import BankImportView from './components/BankImportView';
import {
  AddMemberModal,
  AddTransactionModal,
  MemberHistoryModal
} from './components/Modals';
import {
  Menu,
  X,
  Bell,
  User,
  Globe,
  Heart,
  CheckCircle,
  Coins
} from 'lucide-react';

export default function App() {
  // Core States
  const [currentView, setCurrentView] = useState<'dashboard' | 'members' | 'financials' | 'bank-import'>('dashboard');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  // Modal Toggles
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Mobile Drawer Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toasters & Feedback States
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Add Member
  const handleAddMember = (newMemberData: Omit<Member, 'paymentHistory'>) => {
    const newMember: Member = {
      ...newMemberData,
      paymentHistory: [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          amount: newMemberData.monthlyFee,
          category: 'Membership',
          description: 'Initial Membership Deposit Paid'
        }
      ]
    };
    
    // Create matching transaction
    if (newMember.status === 'Paid') {
      const companionTx: Transaction = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: newMember.lastPaymentDate,
        description: `Membership registration fee: ${newMember.name}`,
        category: 'Membership',
        amount: newMember.monthlyFee,
        status: 'Completed',
        fromOrTo: newMember.name
      };
      setTransactions(prev => [companionTx, ...prev]);
    }
    
    setMembers(prev => [newMember, ...prev]);
    showToast(`Successfully registered ${newMember.name} (#MM-${newMember.id.slice(-4)})!`);
  };

  // 2. Add raw Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Financial transaction of €${Math.abs(newTx.amount).toFixed(2)} posted successfully!`);
  };

  // 3. Log a payment directly for a member
  const handleLogMemberPayment = (memberId: string, amount: number) => {
    const todayString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    let chosenMemberName = '';
    
    setMembers(prevMembers => 
      prevMembers.map(m => {
        if (m.id === memberId) {
          chosenMemberName = m.name;
          const updatedHistory = [
            {
              date: todayString,
              amount,
              category: 'Membership' as const,
              description: `Monthly Membership Support - €${amount}`
            },
            ...(m.paymentHistory || [])
          ];
          return {
            ...m,
            status: 'Paid' as const,
            lastPaymentDate: todayString,
            paymentHistory: updatedHistory
          };
        }
        return m;
      })
    );

    const companionTx: Transaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: todayString,
      description: 'Membership Automated Contribution',
      category: 'Membership',
      amount,
      status: 'Completed',
      fromOrTo: chosenMemberName || 'Registered member'
    };

    setTransactions(prev => [companionTx, ...prev]);
    showToast(`Payment of €${amount.toFixed(2)} posted for member ${chosenMemberName}!`);
    
    // Sync active dynamic modal selection back if open
    setSelectedMember(prev => {
      if (prev && prev.id === memberId) {
        return {
          ...prev,
          status: 'Paid',
          lastPaymentDate: todayString,
          paymentHistory: [
            {
              date: todayString,
              amount,
              category: 'Membership',
              description: `Monthly Membership Support - €${amount}`
            },
            ...(prev.paymentHistory || [])
          ]
        };
      }
      return prev;
    });
  };

  // 4. Remove a member
  const handleDeleteMember = (memberId: string) => {
    const target = members.find(m => m.id === memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    if (target) {
      showToast(`Removed contributor record for ${target.name}.`);
    }
  };

  // 5. Reconcile matched bank items
  const handleReconcileMemberPayment = (memberId: string, amount: number, details: string) => {
    const todayString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
    
    let matchedName = '';
    setMembers(prevMembers =>
      prevMembers.map(m => {
        if (m.id === memberId) {
          matchedName = m.name;
          return {
            ...m,
            status: 'Paid',
            lastPaymentDate: todayString,
            paymentHistory: [
              {
                date: todayString,
                amount,
                category: 'Membership',
                description: `Bank Wire Reconciled: ${details}`
              },
              ...(m.paymentHistory || [])
            ]
          };
        }
        return m;
      })
    );

    const companionTx: Transaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: todayString,
      description: `Reconciled: ${details}`,
      category: 'Membership',
      amount,
      status: 'Completed',
      fromOrTo: matchedName || 'Matched Contributor'
    };
    
    setTransactions(prev => [companionTx, ...prev]);
    showToast(`Successfully matched & reconciled bank wire of €${amount.toFixed(2)} to member ${matchedName}!`);
  };

  // 6. Reconcile expense logs
  const handleReconcileExpense = (amount: number, description: string, payee: string) => {
    const todayString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const companionTx: Transaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: todayString,
      description: `Bank Reconciled: ${description}`,
      category: 'Expense',
      amount,
      status: 'Completed',
      fromOrTo: payee
    };
    setTransactions(prev => [companionTx, ...prev]);
    showToast(`Successfully recorded utility outflow of €${Math.abs(amount).toFixed(2)}!`);
  };

  const handleExportDummy = (type: 'PDF' | 'Excel') => {
    // Formulate CSV strings representing accurate transactions data
    const headers = 'Transaction ID,Date,Description,Category,Amount,Status,From/To\n';
    const rows = transactions.map(tx => 
      `"${tx.id}","${tx.date}","${tx.description.replace(/"/g, '""')}","${tx.category}","${tx.amount}","${tx.status}","${tx.fromOrTo || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mosque_billing_ledger_${type.toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Formulated financial ledger. Downloaded billing_${type.toLowerCase()}_export.csv successfully!`);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface flex">
      
      {/* Fixed Desktop Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => { setCurrentView(view); setIsMobileMenuOpen(false); }}
        onExportClick={() => handleExportDummy('Excel')}
      />

      {/* Right Side Content Canvas wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Responsive Navbar Header */}
        <header className="bg-white border-b border-outline-variant h-16 shrink-0 flex items-center justify-between px-gutter sticky top-0 z-30">
          <div className="flex items-center gap-sm">
            {/* Mobile Sidebar Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden hover:bg-surface-container p-1 rounded text-primary transition-colors cursor-pointer h-10 w-10 flex items-center justify-center border border-outline-variant"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-xs text-xs font-bold text-secondary uppercase tracking-widest bg-secondary-container/50 px-3 py-1 rounded-full">
              <Globe className="h-3.5 w-3.5 text-secondary" />
              <span>Matinkylä Mosque</span>
            </div>
          </div>

          {/* Right Header Controls Desk widgets */}
          <div className="flex items-center gap-md">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-primary block">Masjid Board General Admin</span>
              <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="h-9 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              MA
            </div>
          </div>
        </header>

        {/* Mobile Flyout Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-64 h-full p-md flex flex-col gap-md border-r border-outline-variant animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-headline-sm font-bold text-primary">Matinkylä Mosque</h2>
                  <span className="text-xs text-on-surface-variant">General Board Portal</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-surface-container rounded cursor-pointer border border-outline-variant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-2 pt-md">
                {([
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'members', label: 'Members' },
                  { id: 'financials', label: 'Financials' },
                  { id: 'bank-import', label: 'Bank Import' }
                ] as const).map(nav => (
                  <button
                    key={nav.id}
                    onClick={() => { setCurrentView(nav.id); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left py-2 px-md rounded-lg font-bold text-sm cursor-pointer border-l-4 transition-all ${
                      currentView === nav.id
                        ? 'bg-secondary-container text-on-secondary-container border-secondary'
                        : 'text-on-surface-variant border-transparent hover:bg-surface-container-low'
                    }`}
                  >
                    {nav.label}
                  </button>
                ))}
              </nav>
              
              <div className="border-t border-outline-variant pt-md space-y-2">
                <button 
                  onClick={() => { handleExportDummy('Excel'); setIsMobileMenuOpen(false); }}
                  className="w-full bg-secondary text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  Export Reports
                </button>
                <p className="text-[10px] text-center text-on-surface-variant">v1.2.0 • ESP Espoo General Division</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Work Area Canvas with negative spacing limits */}
        <div className="flex-1 p-gutter max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {currentView === 'dashboard' && (
            <DashboardView
              members={members}
              transactions={transactions}
              onAddMemberClick={() => setIsAddMemberOpen(true)}
              onAddTransactionClick={() => setIsAddTransactionOpen(true)}
              onSelectView={setCurrentView}
              onViewMemberHistory={setSelectedMember}
            />
          )}

          {currentView === 'financials' && (
            <FinancialsView
              transactions={transactions}
              onExportPDF={() => handleExportDummy('PDF')}
              onExportExcel={() => handleExportDummy('Excel')}
            />
          )}

          {currentView === 'members' && (
            <MembersView
              members={members}
              onAddMemberClick={() => setIsAddMemberOpen(true)}
              onViewMemberHistory={setSelectedMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {currentView === 'bank-import' && (
            <BankImportView
              members={members}
              onReconcileMemberPayment={handleReconcileMemberPayment}
              onReconcileExpense={handleReconcileExpense}
            />
          )}
        </div>
      </div>

      {/* Interactive Helper Toast notification box */}
      {toastMessage && (
        <div className="fixed bottom-md right-md z-50 bg-inverse-surface text-inverse-on-surface py-sm px-md rounded-xl shadow-lg border border-outline/20 font-medium text-sm flex items-center gap-xs animate-in slide-in-from-bottom duration-300">
          <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Modals Forms list */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
      />

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onAdd={handleAddTransaction}
        members={members}
      />

      <MemberHistoryModal
        isOpen={selectedMember !== null}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onLogPayment={handleLogMemberPayment}
      />
    </main>
  );
}
