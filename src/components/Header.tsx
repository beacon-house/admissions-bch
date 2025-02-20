import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onEvaluation: () => void;
}

export function Header({ onEvaluation }: HeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
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
          </a>

          {/* Navigation - Desktop only */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Why Choose Us', href: '#why-us' },
              { name: 'Success Rates', href: '#success-rates' },
              { name: 'Our Process', href: '#process' },
              { name: 'Services', href: '#services' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.slice(1))}
                className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button - Show on all screens */}
          <button
            onClick={onEvaluation}
            className="inline-flex bg-accent text-primary px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-all duration-300 text-sm sm:text-base"
          >
            Request an Evaluation
          </button>
        </div>
      </div>
    </header>
  );
}