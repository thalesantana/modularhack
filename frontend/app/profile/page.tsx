"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Wallet, 
  Gavel, 
  History, 
  Settings, 
  LogOut, 
  Copy, 
  Check, 
  Beef, 
  Edit, 
  Save, 
  X, 
  ExternalLink,
  RefreshCw,
  AlertTriangle
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

// Mock user data
const mockUserData = {
  name: "John Rancher",
  email: "john.rancher@example.com",
  location: "Austin, TX",
  company: "Rancher Farms",
  joinedDate: "January 2023",
  userType: "Auctioneer",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

// Mock auction data
const mockAuctions = [
  {
    id: 1,
    name: "Premium Angus Bull",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    currentBid: 2.5,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active",
    tokenId: "12345",
    isOwner: true
  },
  {
    id: 2,
    name: "Hereford Heifer",
    image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRbv9-eh3N7k4CCDlekwFRX2RZwmSlFsaROS3Q2NKaHCiV7imc01_mPMP2Rbm7aTGmb0HWXrHH5yJvMjG_vOysdRg",
    currentBid: 1.8,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active",
    tokenId: "23456",
    isOwner: true
  },
  {
    id: 3,
    name: "Holstein Dairy Cow",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/640px-Cow_female_black_white.jpg",
    currentBid: 2.1,
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "ended",
    tokenId: "34567",
    isOwner: true
  }
];

// Mock bid history
const mockBidHistory = [
  {
    id: 1,
    auctionName: "Brahman Bull",
    auctionId: 3,
    amount: 3.2,
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: "highest"
  },
  {
    id: 2,
    auctionName: "Charolais Bull",
    auctionId: 5,
    amount: 3.6,
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "outbid"
  },
  {
    id: 3,
    auctionName: "Simmental Heifer",
    auctionId: 6,
    amount: 2.1,
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: "won"
  }
];

// Mock NFT collection
const mockNFTCollection = [
  {
    id: 1,
    name: "Simmental Heifer",
    image: "https://images.unsplash.com/photo-1597424216809-3ba9864aeb18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    tokenId: "67890",
    acquiredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

export default function ProfilePage() {
  const router = useRouter();
  const { address, disconnect, connect } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(mockUserData);
  const [auctions, setAuctions] = useState(mockAuctions);
  const [bidHistory, setBidHistory] = useState(mockBidHistory);
  const [nftCollection, setNftCollection] = useState(mockNFTCollection);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(mockUserData);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isChangingWallet, setIsChangingWallet] = useState(false);

  useEffect(() => {
    // Simulate loading user data from blockchain/backend
    if (!address) {
      router.push('/register');
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [address, router]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedUserData(userData);
  };

  const handleSaveProfile = () => {
    setUserData(editedUserData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUserData(userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({ ...prev, [name]: value }));
  };

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

  const handleLogout = () => {
    disconnect();
    router.push('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="rounded-full bg-gray-300 h-16 w-16"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-300 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <User className="h-12 w-12 text-[#277928]" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[#277928]">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-8">
            Please connect your wallet or register to view your profile.
          </p>
          <div className="flex flex-col space-y-4">
            <Link href="/register">
              <Button className="w-full bg-[#277928] hover:bg-[#1d5b1e] text-white">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-[#277928]">
              <AvatarImage src={userData.profileImage} alt={userData.name} />
              <AvatarFallback className="bg-[#6daf6f] text-white text-xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-[#277928]">{userData.name}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <Badge variant="outline" className="mr-2">{userData.userType}</Badge>
                <span>Member since {userData.joinedDate}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-[#277928] text-[#277928] hover:bg-[#277928] hover:text-white"
              onClick={handleEditProfile}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="overview">
              <User className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="myAuctions">
              <Gavel className="h-4 w-4 mr-2" />
              My Auctions
            </TabsTrigger>
            <TabsTrigger value="bidHistory">
              <History className="h-4 w-4 mr-2" />
              Bid History
            </TabsTrigger>
            <TabsTrigger value="nftCollection">
              <Beef className="h-4 w-4 mr-2" />
              NFT Collection
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#277928]" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your personal and business information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={editedUserData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={editedUserData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company/Farm Name</Label>
                          <Input 
                            id="company" 
                            name="company" 
                            value={editedUserData.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={editedUserData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                          onClick={handleSaveProfile}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{userData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Company/Farm Name</p>
                          <p className="font-medium">{userData.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{userData.location}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Wallet Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-[#277928]" />
                    Wallet Information
                  </CardTitle>
                  <CardDescription>
                    Your blockchain wallet details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <div className="flex items-center mt-1">
                      <p className="font-mono text-sm truncate">
                        {address}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-8 w-8 p-0" 
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
                  <div>
                    <p className="text-sm text-gray-500">Network</p>
                    <p className="font-medium">Ethereum Mainnet</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium">{userData.userType}</p>
                  </div>
                  <div className="pt-4">
                    <a 
                      href={`https://etherscan.io/address/${address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#277928] hover:underline flex items-center text-sm"
                    >
                      View on Etherscan
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2 text-[#277928]" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your recent auctions and bids
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auctions.slice(0, 2).map(auction => (
                      <div key={auction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                            <img 
                              src={auction.image} 
                              alt={auction.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{auction.name}</p>
                            <p className="text-xs text-gray-500">Listed for auction</p>
                          </div>
                        </div>
                        <Link href={`/auctions/${auction.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {bidHistory.slice(0, 2).map(bid => (
                      <div key={bid.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#6daf6f] rounded-md flex items-center justify-center text-white mr-3">
                            <Gavel className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{bid.auctionName}</p>
                            <p className="text-xs text-gray-500">
                              Bid {bid.amount} ETH - {bid.status === 'highest' ? 'Highest Bid' : bid.status === 'outbid' ? 'Outbid' : 'Won'}
                            </p>
                          </div>
                        </div>
                        <Link href={`/auctions/${bid.auctionId}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" className="w-full" onClick={() => (document.querySelector('[data-value="bidHistory"]') as HTMLElement)?.click()}>
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* My Auctions Tab */}
          <TabsContent value="myAuctions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Gavel className="h-5 w-5 mr-2 text-[#277928]" />
                    My Auctions
                  </CardTitle>
                  <Link href="/create-listing">
                    <Button className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                      Create New Listing
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Manage your active and past auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map(auction => (
                      <div key={auction.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={auction.image} 
                          alt={auction.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-[#277928]">{auction.name}</h3>
                            <Badge 
                              className={auction.status === 'active' ? 'bg-[#6daf6f]' : 'bg-gray-500'} 
                            >
                              {auction.status === 'active' ? 'Active' : 'Ended'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
                            <div>Token ID: <span className="font-medium">{auction.tokenId}</span></div>
                            <div>Current Bid: <span className="font-medium">{auction.currentBid} ETH</span></div>
                            <div>
                              {auction.status === 'active' ? 'Ends in:' : 'Ended on:'} 
                              <span className="font-medium">
                                {auction.status === 'active' ? formatTimeRemaining(auction.endTime) : formatDate(auction.endTime)}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Link href={`/auctions/${auction.id}`}>
                              <Button size="sm" className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Gavel className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
                    <p className="text-gray-500 mb-4">You haven't created any auctions yet</p>
                    <Link href="/create-listing">
                      <Button className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                        Create Your First Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Bid History Tab */}
          <TabsContent value="bidHistory">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-[#277928]" />
                  Bid History
                </CardTitle>
                <CardDescription>
                  Track your bids on cattle auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bidHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Auction</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Bid Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bidHistory.map(bid => (
                          <tr key={bid.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{bid.auctionName}</td>
                            <td className="py-3 px-4 font-medium">{bid.amount} ETH</td>
                            <td className="py-3 px-4 text-gray-500">{formatDate(bid.time)}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                className={
                                  bid.status === 'highest' ? 'bg-[#6daf6f]' : 
                                  bid.status === 'outbid' ? 'bg-amber-500' : 
                                  'bg-blue-500'
                                }
                              >
                                {bid.status === 'highest' ? 'Highest Bid' : 
                                 bid.status === 'outbid' ? 'Outbid' : 'Won'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Link href={`/auctions/${bid.auctionId}`}>
                                <Button size="sm" variant="outline">
                                  View Auction
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <History className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bid history</h3>
                    <p className="text-gray-500 mb-4">You haven't placed any bids yet</p>
                    <Link href="/auctions">
                      <Button className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                        Browse Auctions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* NFT Collection Tab */}
          <TabsContent value="nftCollection">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Beef className="h-5 w-5 mr-2 text-[#277928]" />
                  NFT Collection
                </CardTitle>
                <CardDescription>
                  Your owned cattle NFTs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {nftCollection.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftCollection.map(nft => (
                      <div key={nft.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={nft.image} 
                          alt={nft.name} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-[#277928]">{nft.name}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
                            <div>Token ID: <span className="font-medium">{nft.tokenId}</span></div>
                            <div>Acquired: <span className="font-medium">{formatDate(nft.acquiredDate)}</span></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                              Transfer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Beef className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs in collection</h3>
                    <p className="text-gray-500 mb-4">You don't own any cattle NFTs yet</p>
                    <Link href="/auctions">
                      <Button className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                        Browse Auctions
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-[#277928]" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <input 
                        type="checkbox" 
                        id="email-notifications" 
                        className="toggle toggle-primary" 
                        defaultChecked 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bid-alerts">Bid Alerts</Label>
                      <input 
                        type="checkbox" 
                        id="bid-alerts" 
                        className="toggle toggle-primary" 
                        defaultChecked 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auction-ending">Auction Ending Reminders</Label>
                      <input 
                        type="checkbox" 
                        id="auction-ending" 
                        className="toggle toggle-primary" 
                        defaultChecked 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Wallet Management</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Wallet className="h-5 w-5 text-[#277928]" />
                        </div>
                        <div className="ml-3 flex-grow">
                          <h3 className="text-sm font-medium text-gray-900">Current Wallet</h3>
                          <p className="text-xs text-gray-500 mt-1 font-mono">
                            {address}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setIsWalletDialogOpen(true)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Change Linked Wallet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Change Linked Wallet</DialogTitle>
                          <DialogDescription>
                            Link a new wallet to your HoofLedger profile. This will transfer your profile data to the new wallet.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Alert className="my-4 bg-amber-50 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <AlertTitle className="text-amber-700">Important</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            You must have access to both wallets to complete this process. All your NFTs and assets will need to be transferred separately.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-wallet">Current Wallet</Label>
                            <Input 
                              id="current-wallet" 
                              value={address} 
                              disabled 
                              className="font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-wallet">New Wallet Address</Label>
                            <Input 
                              id="new-wallet" 
                              placeholder="0x..." 
                              value={newWalletAddress}
                              onChange={(e) => setNewWalletAddress(e.target.value)}
                              className="font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500">
                              Enter the Ethereum address of your new wallet
                            </p>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsWalletDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                            onClick={handleChangeWallet}
                            disabled={isChangingWallet}
                          >
                            {isChangingWallet ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Change Wallet"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Deleting your account will remove all your data and cannot be undone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}