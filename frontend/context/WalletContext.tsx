"use client";

declare global {
  interface Window {
    ethereum: any;
  }
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { NFT_CONTRACT_ADDRESS, AUCTION_CONTRACT_ADDRESS } from '@/lib/constants';
import NFT_ABI from '@/lib/abis/NFT_ABI.json';
import AUCTION_ABI from '@/lib/abis/AUCTION_ABI.json';

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  nftContract: ethers.Contract | null;
  auctionContract: ethers.Contract | null;
  chainId: number | null;
  isScrollSepolia: boolean;
  switchToScrollSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  provider: null,
  signer: null,
  nftContract: null,
  auctionContract: null,
  chainId: null,
  isScrollSepolia: false,
  switchToScrollSepolia: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [auctionContract, setAuctionContract] = useState<ethers.Contract | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const { toast } = useToast();

  // Scroll Sepolia Chain ID
  const SCROLL_SEPOLIA_CHAIN_ID = 534351;
  const isScrollSepolia = chainId === SCROLL_SEPOLIA_CHAIN_ID;

  // Initialize contracts when signer is available
  useEffect(() => {
    if (signer && isScrollSepolia) {
      try {
        const nftContractInstance = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFT_ABI,
          signer
        );
        
        const auctionContractInstance = new ethers.Contract(
          AUCTION_CONTRACT_ADDRESS,
          AUCTION_ABI,
          signer
        );
        
        setNftContract(nftContractInstance);
        setAuctionContract(auctionContractInstance);
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    } else {
      setNftContract(null);
      setAuctionContract(null);
    }
  }, [signer, isScrollSepolia]);

  // Handle chain changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        if (newChainId !== SCROLL_SEPOLIA_CHAIN_ID) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Scroll Sepolia testnet",
            variant: "destructive",
          });
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Get initial chain ID
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainIdHex: string) => {
          setChainId(parseInt(chainIdHex, 16));
        })
        .catch(console.error);

      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [toast]);

  // Handle account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== address) {
          setAddress(accounts[0]);
          toast({
            title: "Account changed",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [address, toast]);

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            setAddress(accounts[0].address);
            setProvider(provider);
            setSigner(signer);
            
            // Get chain ID
            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const switchToScrollSepolia = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: 'Scroll Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia-rpc.scroll.io/'],
                blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Scroll Sepolia network:', addError);
        }
      } else {
        console.error('Error switching to Scroll Sepolia network:', switchError);
      }
    }
  };

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const accounts = await provider.listAccounts();
      const signer = await provider.getSigner();
      
      setAddress(accounts[0].address);
      setProvider(provider);
      setSigner(signer);
      
      // Get chain ID
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);
      
      // Check if on Scroll Sepolia
      if (currentChainId !== SCROLL_SEPOLIA_CHAIN_ID) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Scroll Sepolia testnet",
          variant: "destructive",
        });
      }
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].address.substring(0, 6)}...${accounts[0].address.substring(38)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setNftContract(null);
    setAuctionContract(null);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        connect,
        disconnect,
        isConnecting,
        provider,
        signer,
        nftContract,
        auctionContract,
        chainId,
        isScrollSepolia,
        switchToScrollSepolia,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};