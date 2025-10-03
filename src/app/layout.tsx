import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import greenreachLogo from '../assets/greenreach-logo-1.png';

export const Layout: React.FC = () => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home with hash
      window.location.href = `/#${sectionId}`;
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={greenreachLogo} 
                alt="GreenReach Ads" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-slate-900">GreenReach Ads</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#solution" className="text-slate-600 hover:text-emerald-600 transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-slate-600 hover:text-emerald-600 transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-slate-600 hover:text-emerald-600 transition-colors">
                About Us
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="ghost" size="md">
                  Log In
                </Button>
              </Link>
              <button
                onClick={() => scrollToSection('choose-path')}
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 px-4 py-2 text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={greenreachLogo} 
                  alt="GreenReach Ads" 
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-slate-900">GreenReach Ads</span>
              </div>
              <p className="text-slate-600 mb-4">
                AI-powered advertising platform that reduces energy consumption by 60% while delivering better results.
              </p>
              <p className="text-sm text-slate-500">
                © 2025 GreenReach Ads. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-slate-600 hover:text-emerald-600">Features</Link></li>
                <li><Link to="/pricing" className="text-slate-600 hover:text-emerald-600">Pricing</Link></li>
                <li><Link to="/dashboard" className="text-slate-600 hover:text-emerald-600">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-slate-600 hover:text-emerald-600">About Us</Link></li>
                <li><Link to="/#solution" className="text-slate-600 hover:text-emerald-600">Features</Link></li>
                <li><Link to="/pricing" className="text-slate-600 hover:text-emerald-600">Pricing</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

