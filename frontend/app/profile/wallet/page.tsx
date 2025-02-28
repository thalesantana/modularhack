"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Copy, 
  Check, 
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WalletPage() {
  const router = useRouter();
  const { address, disconnect } = useWallet();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isChangingWallet, setIsChangingWallet] = useState(false);

  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleChangeWallet = async () => {
    if (!newWalletAddress || !newWalletAddress.startsWith('0x') || newWalletAddress.length !== 42) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsChangingWallet(true);

    try {
      // In a real application, this would:
      // 1. Verify ownership of the new wallet (e.g., via signature)
      // 2. Update the wallet address in the database
      // 3. Transfer any NFTs or assets to the new wallet
      // 4. Update authentication credentials

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Disconnect current wallet
      disconnect();

      // Update the address (in a real app, this would be handled by the wallet context)
      // For demo purposes, we'll just simulate connecting to the new wallet
      toast({
        title: "Wallet changed successfully",
        description: "Your profile is now linked to the new wallet address",
      });

      // Close the dialog and reset form
      setIsWalletDialogOpen(false);
      setNewWalletAddress("");

      // Redirect to login page to connect with new wallet
      router.push('/register');
    } catch (error) {
      console.error("Error changing wallet:", error);
      toast({
        title: "Error changing wallet",
        description: "There was an error linking your new wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingWallet(false);
    }
  };

  if (!address) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <Wallet className="h-12 w-12 text-[#277928]" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[#277928]">{t('profile.wallet.connect')}</h1>
          <p className="text-gray-600 mb-8">
            {t('profile.wallet.connectMessage')}
          </p>
          <div className="flex flex-col space-y-4">
            <Link href="/register">
              <Button className="w-full bg-[#277928] hover:bg-[#1d5b1e] text-white">
                {t('home.hero.register')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-[#277928] hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('profile.backToProfile')}
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-[#277928]">{t('profile.wallet.title')}</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-[#277928]" />
              {t('profile.wallet.details')}
            </CardTitle>
            <CardDescription>
              {t('profile.wallet.detailsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="wallet-address">{t('profile.wallet.address')}</Label>
              <div className="flex items-center mt-2">
                <div className="bg-gray-50 p-3 rounded-md flex-grow font-mono text-sm break-all">
                  {address}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-10 w-10" 
                  onClick={copyAddressToClipboard}
                >
                  {copiedAddress ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{t('profile.wallet.network')}</Label>
                <p className="mt-2 font-medium">Ethereum Mainnet</p>
              </div>
              <div>
                <Label>{t('profile.wallet.connected')}</Label>
                <p className="mt-2 font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <a 
                href={`https://etherscan.io/address/${address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#277928] hover:underline flex items-center"
              >
                {t('profile.wallet.viewEtherscan')}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-[#277928]" />
              {t('profile.wallet.changeTitle')}
            </CardTitle>
            <CardDescription>
              {t('profile.wallet.changeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">{t('profile.wallet.important')}</AlertTitle>
              <AlertDescription className="text-amber-700">
                {t('profile.wallet.warningMessage')}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-wallet">{t('profile.wallet.current')}</Label>
                <Input 
                  id="current-wallet" 
                  value={address} 
                  disabled 
                  className="font-mono text-sm mt-2"
                />
              </div>
              
              <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-[#277928] hover:bg-[#1d5b1e] text-white"
                    onClick={() => setIsWalletDialogOpen(true)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('profile.wallet.change')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t('profile.wallet.changeTitle')}</DialogTitle>
                    <DialogDescription>
                      {t('profile.wallet.changeDialogDesc')}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Alert className="my-4 bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700">{t('profile.wallet.important')}</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      {t('profile.wallet.warningMessage')}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-wallet">{t('profile.wallet.current')}</Label>
                      <Input 
                        id="current-wallet" 
                        value={address} 
                        disabled 
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-wallet">{t('profile.wallet.new')}</Label>
                      <Input 
                        id="new-wallet" 
                        placeholder="0x..." 
                        value={newWalletAddress}
                        onChange={(e) => setNewWalletAddress(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        {t('profile.wallet.newWalletDesc')}
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsWalletDialogOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                      onClick={handleChangeWallet}
                      disabled={isChangingWallet}
                    >
                      {isChangingWallet ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          {t('common.processing')}
                        </>
                      ) : (
                        t('profile.wallet.confirm')
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}