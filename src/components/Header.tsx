import React from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { useState } from 'react';
import { navigationItems } from '../config/navigation';
import { Button } from './ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/#home" className="flex items-center group cursor-pointer">
            <Scissors className="h-8 w-8 text-amber-700 transform group-hover:rotate-45 transition-transform duration-300" />
            <span className="ml-2 text-2xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300">Cutting Edge</span>
          </a>
          
          <div className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-amber-700 relative group transition-colors duration-300"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="hover:rotate-180 transition-transform duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-gray-600 hover:text-amber-700 hover:pl-4 hover:bg-amber-50 rounded-lg p-2 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}