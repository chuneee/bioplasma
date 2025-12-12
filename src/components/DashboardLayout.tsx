import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'admin' | 'receptionist';
  pageTitle: string;
  breadcrumb?: string[];
  onLogout: () => void;
}

export function DashboardLayout({
  children,
  currentView,
  onNavigate,
  userRole,
  pageTitle,
  breadcrumb,
  onLogout
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentView={currentView}
          onNavigate={onNavigate}
          userRole={userRole}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              currentView={currentView}
              onNavigate={(view) => {
                onNavigate(view);
                setIsMobileSidebarOpen(false);
              }}
              userRole={userRole}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <Header
          title={pageTitle}
          breadcrumb={breadcrumb}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          showMobileMenu={true}
        />

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
