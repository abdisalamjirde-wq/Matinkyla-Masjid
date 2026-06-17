import React, { useState } from 'react';
import { Member } from '../types';
import {
  Search,
  Filter,
  UserPlus,
  Grid,
  List,
  Phone,
  Calendar,
  Euro,
  Eye,
  Trash2,
  Receipt
} from 'lucide-react';

interface MembersViewProps {
  members: Member[];
  onAddMemberClick: () => void;
  onViewMemberHistory: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export default function MembersView({
  members,
  onAddMemberClick,
  onViewMemberHistory,
  onDeleteMember
}: MembersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid' | 'Overdue'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic on members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-xl">
      {/* Directory Management Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md bg-white p-md rounded-xl border border-outline-variant shadow-sm">
        <div className="space-y-xs">
          <h2 className="text-display-lg font-bold text-primary tracking-tight">
            Members Directory
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Manage {members.length} registered congregation contributors.
          </p>
        </div>

        <button
          onClick={onAddMemberClick}
          className="bg-secondary-container text-on-secondary-container px-lg py-sm rounded-lg font-bold flex items-center gap-xs hover:brightness-95 transition-all shadow-sm cursor-pointer self-start md:self-auto h-10"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ Add Member</span>
        </button>
      </section>

      {/* Filters & Tools bar */}
      <section className="flex flex-col sm:flex-row gap-sm items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-sm w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          {/* Status filter selection */}
          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 pl-3 pr-8 bg-white border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent cursor-pointer font-medium h-10"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid Only</option>
              <option value="Unpaid">Unpaid Only</option>
              <option value="Overdue">Overdue Only</option>
            </select>
          </div>
        </div>

        {/* Grid / List Switching controls */}
        <div className="flex gap-xs border border-outline-variant p-1 rounded-lg bg-surface-container-low shrink-0 h-10 items-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Card Grid"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Standard List"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Main Members Display view split based on currentViewMode */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white p-xl text-center rounded-xl border border-outline-variant shadow-sm">
          <p className="text-body-lg text-on-surface-variant">
            No members found matching "{searchQuery}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
            className="mt-sm text-secondary font-bold text-sm hover:underline cursor-pointer"
          >\
            Reset Search Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredMembers.map(member => {
            // Custom colors depending on payment states
            let badgeColor = 'bg-green-50 text-green-700 border-green-100';
            if (member.status === 'Overdue') badgeColor = 'bg-red-50 text-red-700 border-red-100';
            if (member.status === 'Unpaid') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
            if (member.status === 'Inactive') badgeColor = 'bg-gray-100 text-gray-700 border-gray-200';

            return (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-md space-y-md">
                  <div className="flex items-center gap-md">
                    <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-outline-variant bg-surface-container">
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
                    <div className="truncate flex-1">
                      <h4 className="text-body-lg font-bold text-primary truncate">{member.name}</h4>
                      <span className="text-xs font-mono text-on-surface-variant">{member.id}</span>
                    </div>
                  </div>

                  <div className="space-y-xs text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold">Status</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${badgeColor}`}>
                        {member.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold">Monthly Fee</span>
                      <span className="text-body-md font-bold text-primary">€{member.monthlyFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold">Last Payment</span>
                      <span className="text-body-md font-medium text-primary">{member.lastPaymentDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold">Phone</span>
                      <span className="text-body-md font-mono text-primary">{member.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-md border-t border-outline-variant bg-surface-container-low flex justify-between gap-sm">
                  <button
                    onClick={() => onViewMemberHistory(member)}
                    className="flex-1 flex items-center justify-center gap-1 border border-outline bg-white text-primary text-xs font-bold py-1.5 rounded hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    Ledger Log
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="border border-red-200 text-error p-1.5 rounded hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer h-8 w-8 flex items-center justify-center"
                    title="Remove Contributor"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monthly Obligation</th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Contribution</th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-md py-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredMembers.map(member => {
                let badgeColor = 'bg-green-50 text-green-700 border-green-100';
                if (member.status === 'Overdue') badgeColor = 'bg-red-50 text-red-700 border-red-100';
                if (member.status === 'Unpaid') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';

                return (
                  <tr key={member.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="h-8 w-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-xs font-bold shrink-0">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-body-md font-bold text-primary">{member.name}</p>
                          <p className="text-[10px] font-mono text-on-surface-variant">ID: {member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-xs font-mono text-primary">{member.phone}</td>
                    <td className="px-md py-md text-body-md font-bold text-primary">€{member.monthlyFee.toFixed(2)}</td>
                    <td className="px-md py-md text-body-md text-on-surface-variant">{member.lastPaymentDate || 'Never'}</td>
                    <td className="px-md py-md whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${badgeColor}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-md py-md text-right">
                      <div className="flex gap-sm justify-end">
                        <button
                          onClick={() => onViewMemberHistory(member)}
                          className="flex items-center gap-xs text-xs font-bold text-secondary hover:underline cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          Ledger
                        </button>
                        <button
                          onClick={() => onDeleteMember(member.id)}
                          className="text-error hover:text-red-700 cursor-pointer text-center flex items-center justify-center h-8 w-8 rounded-lg hover:bg-red-50"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
