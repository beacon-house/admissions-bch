import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { trackPixelEvent, PIXEL_EVENTS } from '@/lib/pixel';

interface HeaderProps {
  onEvaluation?: () => void;
  showCTA?: boolean;
}

export function Header({ onEvaluation, showCTA = true }: HeaderProps) {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    trackPixelEvent({
      name: PIXEL_EVENTS.CTA_HEADER,
      options: { button: 'header_request_evaluation' }
    });
    
    navigate('/application-form');
  };

  const scrollToSection = (sectionId: string) => {
    // If we're on the landing page, scroll to the section
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on a different page, navigate to the landing page with hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            {/* Mobile: Show favicon */}
            <img 
              src="/bh ig logo.png"
              alt="Beacon House"
              className="h-8 w-auto sm:hidden"
            />
            {/* Tablet and up: Show full logo */}
            <img
              src="/bh ig logo.png"
              alt="Beacon House"
              className="hidden sm:block h-12 w-auto"
            />
          </Link>

          {/* Navigation - Desktop only */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Why Choose Us', href: 'why-us' },
              { name: 'Success Rates', href: 'success-rates' },
              { name: 'Our Process', href: 'process' },
              { name: 'Services', href: 'services' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button - Show conditionally */}
          {showCTA && (
            <button
              onClick={handleCTAClick}
              className="inline-flex bg-accent text-primary px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-all duration-300 text-sm sm:text-base"
            >
              Request an Evaluation
            </button>
          )}
        </div>
      </div>
    </header>
  );
}