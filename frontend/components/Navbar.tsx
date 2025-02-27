"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { 
  Menu, 
  X, 
  Beef, 
  Gavel, 
  User, 
  LogOut, 
  LogIn, 
  Home, 
  ShoppingBag, 
  PlusCircle 
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, connect, disconnect } = useWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#277928] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Beef className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">HoofLedger</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </div>
            </Link>
            <Link href="/auctions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <Gavel className="h-4 w-4 mr-1" />
                Auctions
              </div>
            </Link>
            <Link href="/marketplace" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Marketplace
              </div>
            </Link>
            
            {address ? (
              <>
                <Link href="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6daf6f] transition-colors">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </div>
                </Link>
                <Link href="/create-listing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6daf6f] transition-colors">
                  <div className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Listing
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white hover:bg-white hover:text-[#277928]"
                  onClick={disconnect}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="bg-transparent border-white hover:bg-white hover:text-[#277928]"
                onClick={connect}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#6daf6f] focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#277928] pb-3 px-4">
          <div className="flex flex-col space-y-2">
            <Link href="/" className="px-3 py-2 rounded-md text-base font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>
            <Link href="/auctions" className="px-3 py-2 rounded-md text-base font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <Gavel className="h-5 w-5 mr-2" />
                Auctions
              </div>
            </Link>
            <Link href="/marketplace" className="px-3 py-2 rounded-md text-base font-medium hover:bg-[#6daf6f] transition-colors">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Marketplace
              </div>
            </Link>
            
            {address ? (
              <>
                <Link href="/profile" className="px-3 py-2 rounded-md text-base font-medium hover:bg-[#6daf6f] transition-colors">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </div>
                </Link>
                <Link href="/create-listing" className="px-3 py-2 rounded-md text-base font-medium hover:bg-[#6daf6f] transition-colors">
                  <div className="flex items-center">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Listing
                  </div>
                </Link>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white hover:bg-white hover:text-[#277928] w-full justify-start"
                  onClick={disconnect}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="bg-transparent border-white hover:bg-white hover:text-[#277928] w-full justify-start"
                onClick={connect}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;