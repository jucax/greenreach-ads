import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import greenreachLogo from '../../assets/greenreach-logo-1.png';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardNavbarProps {
  userName?: string;
  userEmail?: string;
  companyName?: string;
  position?: string;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userName,
  userEmail,
  companyName,
  position,
}) => {
  const { user, company, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Use auth data if available, otherwise fall back to props
  const displayName = userName || user?.name || 'User';
  const displayEmail = userEmail || user?.email || 'user@example.com';
  const displayCompany = companyName || company?.name || 'Company';
  const displayPosition = position || user?.position || 'Employee';

  const handleLogout = async () => {
    await signOut();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={greenreachLogo} 
              alt="GreenReach Ads" 
              className="h-12 w-auto"
            />
            <div>
              <div className="font-bold text-slate-900 text-lg">GreenReach</div>
              <div className="text-xs text-slate-500">{displayCompany}</div>
            </div>
          </Link>

          {/* Right Side - Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500">{displayPosition}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                {getInitials(displayName)}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-900">{displayName}</div>
                  <div className="text-xs text-slate-500">{displayEmail}</div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {/* No menu items - just logout */}
                </div>

                {/* Logout */}
                <div className="border-t border-slate-200 py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
