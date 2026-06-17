import React from 'react';
import {
  LayoutDashboard,
  Users,
  Euro,
  FileDown,
  HelpCircle,
  LogOut,
  UploadCloud
} from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'members' | 'financials' | 'bank-import';
  onSelectView: (view: 'dashboard' | 'members' | 'financials' | 'bank-import') => void;
  onExportClick?: () => void;
}

export default function Sidebar({
  currentView,
  onSelectView,
  onExportClick
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline py-lg px-sm gap-xs z-40">
      {/* Top Brand Banner */}
      <div className="px-sm mb-lg">
        <h1 className="text-headline-sm font-bold text-primary dark:text-primary-fixed tracking-tight">
          Admin Portal
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Financial Management
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onSelectView('dashboard')}
          className={`w-full flex items-center gap-sm px-sm py-xs text-left rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98] shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-label-bold font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onSelectView('members')}
          className={`w-full flex items-center gap-sm px-sm py-xs text-left rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
            currentView === 'members'
              ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98] shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-label-bold font-medium">Members</span>
        </button>

        <button
          onClick={() => onSelectView('financials')}
          className={`w-full flex items-center gap-sm px-sm py-xs text-left rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
            currentView === 'financials'
              ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98] shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
          }`}
        >
          <Euro className="h-5 w-5" />
          <span className="text-label-bold font-medium">Financials</span>
        </button>

        <button
          onClick={() => onSelectView('bank-import')}
          className={`w-full flex items-center gap-sm px-sm py-xs text-left rounded-lg transition-all duration-150 ease-in-out cursor-pointer ${
            currentView === 'bank-import'
              ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98] shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
          }`}
        >
          <UploadCloud className="h-5 w-5" />
          <span className="text-label-bold font-medium">Bank Import</span>
        </button>
      </nav>

      {/* Bottom Option Actions & Links */}
      <div className="mt-auto border-t border-outline-variant pt-md space-y-1">
        {/* Only shown when user can export general statements */}
        {onExportClick && (
          <button
            onClick={onExportClick}
            className="w-full text-left flex items-center gap-sm px-sm py-2 mx-auto rounded-lg bg-secondary text-white hover:opacity-90 transition-opacity font-medium shadow-sm cursor-pointer mb-2 justify-center"
          >
            <FileDown className="h-4 w-4" />
            <span className="text-sm">Export Reports</span>
          </button>
        )}

        <button className="w-full text-left flex items-center gap-sm px-sm py-xs text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors rounded-lg cursor-pointer">
          <HelpCircle className="h-5 w-5 text-on-surface-variant" />
          <span className="text-label-bold font-medium">Help Center</span>
        </button>

        <button className="w-full text-left flex items-center gap-sm px-sm py-xs text-error hover:bg-red-50/50 transition-colors rounded-lg cursor-pointer">
          <LogOut className="h-5 w-5 text-error" />
          <span className="text-label-bold font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
