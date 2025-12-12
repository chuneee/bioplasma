import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';

interface HeaderProps {
  title: string;
  breadcrumb?: string[];
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function Header({ title, breadcrumb, onMenuClick, showMobileMenu = false }: HeaderProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Obtener fecha actual en español
  const now = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentDate = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {showMobileMenu && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        )}

        <div>
          <h1 className="text-[var(--color-text)]" style={{ fontSize: '24px' }}>
            {title}
          </h1>
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
                      /
                    </span>
                  )}
                  <span
                    className={index === breadcrumb.length - 1 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}
                    style={{ fontSize: '14px' }}
                  >
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search - Desktop */}
        <div className="hidden md:block">
          <div
            className={`relative transition-all duration-300 ${
              searchExpanded ? 'w-64' : 'w-10'
            }`}
          >
            {searchExpanded ? (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) {
                      setSearchExpanded(false);
                    }
                  }}
                  placeholder="Buscar..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(139,115,85,0.1)] outline-none transition-all"
                />
                <Search
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchExpanded(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchExpanded(true)}
                className="w-10 h-10 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="w-10 h-10 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all relative">
            <Bell size={20} strokeWidth={1.5} />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-error)] text-white rounded-full flex items-center justify-center" style={{ fontSize: '11px' }}>
              3
            </span>
          </button>
        </div>

        {/* Date - Desktop only */}
        <div className="hidden lg:flex items-center px-4 py-2 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)]" style={{ fontSize: '14px' }}>
            {currentDate}
          </p>
        </div>
      </div>
    </header>
  );
}
