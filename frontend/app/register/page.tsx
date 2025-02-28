"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Beef, Gavel, User } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { address, connect } = useWallet();
  const { toast } = useToast();
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    name: 'John Rancher',
    email: 'john.rancher@example.com',
    company: 'Rancher Farms',
    location: 'Austin, TX',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend or smart contract
    // For now, we'll just simulate a successful registration
    
    toast({
      title: "Registration successful!",
      description: `You are now registered as a ${userType}`,
    });
    
    // Redirect to profile page after successful registration
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#277928]">Join HoofLedger</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Register as a buyer or auctioneer to start using HoofLedger
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!address ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <User className="h-12 w-12 text-[#277928]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 text-center mb-6">
                  To register on HoofLedger, you need to connect your Ethereum wallet first.
                </p>
                <Button 
                  onClick={connect} 
                  className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="buyer" onValueChange={(value) => setUserType(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="buyer" className="flex items-center justify-center">
                      <User className="h-4 w-4 mr-2" />
                      Buyer
                    </TabsTrigger>
                    <TabsTrigger value="auctioneer" className="flex items-center justify-center">
                      <Gavel className="h-4 w-4 mr-2" />
                      Auctioneer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buyer">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Enter your full name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            placeholder="City, State/Province, Country" 
                            value={formData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Beef className="h-5 w-5 text-[#277928]" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Wallet Connected</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {address ? `${address.substring(0, 6)}...${address.substring(38)}` : "Not connected"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="auctioneer">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Enter your full name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Farm Name</Label>
                          <Input 
                            id="company" 
                            name="company" 
                            placeholder="Enter your company or farm name" 
                            value={formData.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            placeholder="City, State/Province, Country" 
                            value={formData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <Beef className="h-5 w-5 text-[#277928]" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Wallet Connected</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {address ? `${address.substring(0, 6)}...${address.substring(38)}` : "Not connected"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            )}
          </CardContent>
          
          {address && (
            <CardFooter>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-[#277928] hover:bg-[#1d5b1e] text-white"
              >
                Complete Registration
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By registering, you agree to HoofLedger's{' '}
            <a href="/terms" className="text-[#277928] hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#277928] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}