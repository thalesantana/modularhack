"use client";

import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { SCROLL_SEPOLIA_CHAIN_ID } from '@/lib/constants';

const NetworkSwitcher = () => {
  const { chainId, switchToScrollSepolia } = useWallet();
  
  // Check if user is on Scroll Sepolia
  const isScrollSepolia = chainId === SCROLL_SEPOLIA_CHAIN_ID;
  
  if (isScrollSepolia) {
    return null; // Don't show anything if already on the correct network
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={switchToScrollSepolia}
        className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2 shadow-lg"
      >
        <AlertTriangle className="h-4 w-4" />
        Switch to Scroll Sepolia
      </Button>
    </div>
  );
};

export default NetworkSwitcher;