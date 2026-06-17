import React, { useState } from 'react';
import { Member, Transaction } from '../types';
import { X, Calendar, User, Phone, DollarSign, ListFilter, HelpCircle, History, Check } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Omit<Member, 'paymentHistory'>) => void;
}

export function AddMemberModal({ isOpen, onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fee, setFee] = useState('50');
  const [status, setStatus] = useState<Member['status']>('Paid');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onAdd({
      id: `#MM-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      phone,
      monthlyFee: Number(fee) || 0,
      status,
      lastPaymentDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    });
    setName('');
    setPhone('');
    setFee('50');
    setStatus('Paid');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="text-headline-sm font-bold text-primary">Add New Member</h3>
          <button onClick={onClose} className="hover:bg-surface-container-high p-1 rounded-full text-on-surface-variant cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-md space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
              <input
                type="text"
                required
                placeholder="e.g. Ahmed Al-Farsi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
              <input
                type="tel"
                required
                placeholder="e.g. +358 40 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Monthly Fee (€)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-body-md font-bold text-on-surface-variant">€</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Member['status'])}
                className="w-full py-2 px-3 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-md border-t border-outline-variant flex gap-sm justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-lg py-2 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:brightness-95 transition-all shadow-sm cursor-pointer"
            >
              Create Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  members: Member[];
}

export function AddTransactionModal({ isOpen, onClose, onAdd, members }: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<Transaction['category']>('Membership');
  const [description, setDescription] = useState('');
  const [fromOrTo, setFromOrTo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Transaction['status']>('Completed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    const signedAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    
    onAdd({
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      description,
      category,
      amount: signedAmount,
      status,
      fromOrTo: fromOrTo || (type === 'income' ? 'Anonymous Contributor' : 'Internal Ops')
    });
    
    setDescription('');
    setFromOrTo('');
    setAmount('');
    setCategory('Membership');
    setStatus('Completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="text-headline-sm font-bold text-primary">Record Financial Transaction</h3>
          <button onClick={onClose} className="hover:bg-surface-container-high p-1 rounded-full text-on-surface-variant cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-md space-y-4">
          <div className="flex gap-sm p-1 bg-surface-container rounded-lg">
            <button
              type="button"
              onClick={() => { setType('income'); setCategory('Membership'); setStatus('Completed'); }}
              className={`flex-1 py-1.5 rounded-md font-bold text-sm cursor-pointer transition-all ${
                type === 'income'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Income (Collection / Donation)
            </button>
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory('Expense'); setStatus('Paid'); }}
              className={`flex-1 py-1.5 rounded-md font-bold text-sm cursor-pointer transition-all ${
                type === 'expense'
                  ? 'bg-white text-error shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Expense (Bills / Maintenance)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Transaction['category'])}
                className="w-full py-2 px-3 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {type === 'income' ? (
                  <>
                    <option value="Membership">Monthly Membership</option>
                    <option value="Sadaqah">Sadaqah & Charity</option>
                    <option value="Zakat">Zakat al-Maal</option>
                    <option value="Jummah">Friday Collection (Jummah)</option>
                  </>
                ) : (
                  <>
                    <option value="Expense">Ops & Utilities</option>
                    <option value="Sadaqah">Sadaqah disbursement</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Amount (€)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-body-md font-bold text-on-surface-variant">€</span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Description / Source</label>
            <input
              type="text"
              required
              placeholder={type === 'income' ? "e.g. Monthly Donation" : "e.g. Helen Sähköverkko Electricity Bill"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
              {type === 'income' ? "From (Contributor Name)" : "To (Payee Name)"}
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? "e.g. Ali Khan" : "e.g. Helen Oy"}
              value={fromOrTo}
              onChange={(e) => setFromOrTo(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Transaction['status'])}
              className="w-full py-2 px-3 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="Completed">Completed / Cleared</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending / Awaiting</option>
            </select>
          </div>

          <div className="pt-md border-t border-outline-variant flex gap-sm justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-md py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-lg py-2 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:brightness-95 transition-all shadow-sm cursor-pointer"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MemberHistoryModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onLogPayment: (memberId: string, amount: number) => void;
}

export function MemberHistoryModal({ isOpen, member, onClose, onLogPayment }: MemberHistoryModalProps) {
  const [paymentAmount, setPaymentAmount] = useState('');

  if (!isOpen || !member) return null;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(paymentAmount);
    if (isNaN(parsed) || parsed <= 0) return;
    onLogPayment(member.id, parsed);
    setPaymentAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-outline-variant w-full max-w-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-headline-sm font-bold text-primary">{member.name}</h3>
              <span className="text-data-mono text-xs text-on-surface-variant">{member.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-surface-container-high p-1 rounded-full text-on-surface-variant cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-md space-y-md">
          {/* Profile Quick Stats */}
          <div className="grid grid-cols-3 gap-sm p-sm bg-surface-container-low rounded-xl text-center">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Phone</p>
              <p className="text-sm text-primary font-medium mt-1">{member.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Monthly Obligation</p>
              <p className="text-sm text-primary font-bold mt-1">€{member.monthlyFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                member.status === 'Paid'
                  ? 'bg-green-100 text-green-800'
                  : member.status === 'Overdue'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {member.status}
              </span>
            </div>
          </div>

          {/* Log direct payment for this user */}
          <div>
            <form onSubmit={handlePaymentSubmit} className="flex items-end gap-sm p-sm border border-outline-variant bg-surface rounded-xl">
              <div className="flex-1">
                <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Log Member Contribution (€)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-body-md font-bold text-on-surface-variant">€</span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder={member.monthlyFee.toString()}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-background border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-lg py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1 cursor-pointer h-10"
              >
                <Check className="h-4 w-4" />
                Post
              </button>
            </form>
          </div>

          {/* Contribution Logs list */}
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-sm flex items-center gap-1">
              <History className="h-4 w-4" />
              Payment History Ledger
            </h4>
            <div className="border border-outline-variant rounded-xl divide-y divide-outline-variant max-h-48 overflow-y-auto scrollbar-hide">
              {member.paymentHistory && member.paymentHistory.length > 0 ? (
                member.paymentHistory.map((h, i) => (
                  <div key={i} className="p-sm flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <div>
                      <p className="text-body-md font-semibold text-primary">{h.description}</p>
                      <p className="text-[10px] text-on-surface-variant">{h.date} • {h.category}</p>
                    </div>
                    <p className="text-body-md font-bold text-green-700">+€{h.amount.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="p-xl text-center text-on-surface-variant text-body-md">
                  No logged contribution history recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-md border-t border-outline-variant flex justify-end bg-surface-container-low">
          <button
            onClick={onClose}
            className="px-md py-2 bg-primary text-white rounded-lg hover:opacity-90 font-medium cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
