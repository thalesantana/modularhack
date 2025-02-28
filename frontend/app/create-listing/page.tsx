"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Beef, Upload, Calendar, Info, Tag, Shield, Dna, Gavel, AlertTriangle, User } from 'lucide-react';
import { uploadToIPFS } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ethers } from 'ethers';

export default function CreateListingPage() {
  const router = useRouter();
  const { address, nftContract, auctionContract, isScrollSepolia, switchToScrollSepolia, connect } = useWallet();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Basic Info
    nome: 'Premium Angus Bull',
    raca: 'angus',
    tipogado: 'beef',
    cor: 'black',
    nascimento: '2022-05-15',
    
    // Lineage
    filiacaopai: 'Black Diamond (Reg #BD123)',
    filiacaomae: 'Royal Lady (Reg #RL456)',
    
    // Health & Care
    vacinas: 'Brucellosis: 01/15/2023, Anthrax: 03/20/2023, BVD: 05/10/2023',
    alimentacao: 'Grass-fed with premium grain supplements. Daily mineral supplements and fresh water access.',
    
    // Identification
    rfid: 'AB123456789',
    proprietario: '',
    
    // Auction Details
    startingPrice: '2.5',
    reservePrice: '3.0',
    auctionDuration: '7',
    description: '3 years old, 1200 lbs, excellent genetics. Perfect for breeding programs.',
    
    // Image
    fotoURI: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    imageFile: null as File | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mintingStep, setMintingStep] = useState<'idle' | 'uploading' | 'minting' | 'listing' | 'complete'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  useEffect(() => {
    if (address) {
      setFormData(prev => ({
        ...prev,
        proprietario: address
      }));
    }
  }, [address]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ 
        ...prev, 
        fotoURI: URL.createObjectURL(e.target.files![0]),
        imageFile: e.target.files![0]
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a listing",
        variant: "destructive",
      });
      return;
    }
    
    if (!isScrollSepolia) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Scroll Sepolia testnet",
        variant: "destructive",
      });
      await switchToScrollSepolia();
      return;
    }
    
    if (!nftContract || !auctionContract) {
      toast({
        title: "Contract not available",
        description: "Please make sure you're connected to the correct network",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields
    const requiredFields = ['nome', 'raca', 'cor', 'vacinas', 'alimentacao', 'startingPrice'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.fotoURI) {
      toast({
        title: "Missing image",
        description: "Please upload an image of the cattle",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setMintingStep('uploading');
    
    try {
      // 1. Prepare metadata
      const metadata = {
        name: formData.nome,
        description: formData.description || `${formData.raca} ${formData.tipogado}, ${formData.cor}`,
        image: formData.fotoURI, // In a real app, you would upload this to IPFS first
        attributes: [
          { trait_type: "Breed", value: formData.raca },
          { trait_type: "Type", value: formData.tipogado },
          { trait_type: "Color", value: formData.cor },
          { trait_type: "Birth Date", value: formData.nascimento },
          { trait_type: "RFID", value: formData.rfid },
          { trait_type: "Sire", value: formData.filiacaopai },
          { trait_type: "Dam", value: formData.filiacaomae },
          { trait_type: "Vaccinations", value: formData.vacinas },
          { trait_type: "Feeding", value: formData.alimentacao }
        ]
      };
      
      // 2. Upload metadata to IPFS
      const metadataURI = await uploadToIPFS(metadata);
      
      // 3. Mint NFT
      setMintingStep('minting');
      const mintTx = await nftContract.safeMint(address, metadataURI);
      setTransactionHash(mintTx.hash);
      
      // Wait for transaction to be mined
      const mintReceipt = await mintTx.wait();
      
      // Extract tokenId from the mint event
      const mintEvent = mintReceipt.logs.find(
        (log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      
      if (!mintEvent) {
        throw new Error("Could not find mint event in transaction receipt");
      }
      
      const tokenIdBigInt = ethers.toBigInt(mintEvent.topics[3]);
      const newTokenId = tokenIdBigInt.toString();
      setTokenId(newTokenId);
      
      // 4. Create auction
      setMintingStep('listing');
      const startingPriceWei = ethers.parseEther(formData.startingPrice);
      const durationInDays = parseInt(formData.auctionDuration);
      
      // Approve the auction contract to transfer the NFT
      const approveTx = await nftContract.approve(auctionContract.target, newTokenId);
      await approveTx.wait();
      
      // Create the auction
      const auctionTx = await auctionContract.createAuction(
        newTokenId,
        startingPriceWei,
        durationInDays * 24 * 60 * 60 // Convert days to seconds
      );
      
      await auctionTx.wait();
      
      setMintingStep('complete');
      
      toast({
        title: "Listing created successfully!",
        description: "Your cattle has been minted as an NFT and listed for auction",
      });
      
      // Redirect to the auctions page after a delay
      setTimeout(() => {
        router.push('/auctions');
      }, 3000);
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error creating listing",
        description: error.message || "There was an error creating your listing. Please try again.",
        variant: "destructive",
      });
      setMintingStep('idle');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cattle breed options
  const breedOptions = [
    { value: 'angus', label: 'Angus' },
    { value: 'hereford', label: 'Hereford' },
    { value: 'brahman', label: 'Brahman' },
    { value: 'holstein', label: 'Holstein' },
    { value: 'charolais', label: 'Charolais' },
    { value: 'simmental', label: 'Simmental' },
    { value: 'nelore', label: 'Nelore' },
    { value: 'gir', label: 'Gir' },
    { value: 'jersey', label: 'Jersey' },
    { value: 'limousin', label: 'Limousin' },
  ];
  
  // Cattle type options
  const typeOptions = [
    { value: 'beef', label: 'Beef Cattle' },
    { value: 'dairy', label: 'Dairy Cattle' },
    { value: 'dual', label: 'Dual Purpose' },
    { value: 'breeding', label: 'Breeding Stock' },
  ];
  
  // Color options
  const colorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'brown', label: 'Brown' },
    { value: 'red', label: 'Red' },
    { value: 'spotted', label: 'Spotted' },
    { value: 'brindle', label: 'Brindle' },
    { value: 'roan', label: 'Roan' },
  ];
  
  // Auction duration options
  const durationOptions = [
    { value: '3', label: '3 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '7 days' },
    { value: '10', label: '10 days' },
    { value: '14', label: '14 days' },
  ];
  
  if (mintingStep === 'uploading' || mintingStep === 'minting' || mintingStep === 'listing') {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center py-8">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  {mintingStep === 'uploading' && <Upload className="h-12 w-12 text-[#277928] animate-pulse" />}
                  {mintingStep === 'minting' && <Beef className="h-12 w-12 text-[#277928] animate-pulse" />}
                  {mintingStep === 'listing' && <Gavel className="h-12 w-12 text-[#277928] animate-pulse" />}
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {mintingStep === 'uploading' && "Uploading Metadata..."}
                  {mintingStep === 'minting' && "Minting NFT..."}
                  {mintingStep === 'listing' && "Creating Auction..."}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {mintingStep === 'uploading' && "Preparing your cattle data for the blockchain..."}
                  {mintingStep === 'minting' && "Creating your cattle NFT on the blockchain..."}
                  {mintingStep === 'listing' && "Setting up the auction for your cattle NFT..."}
                </p>
                
                {transactionHash && (
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500">Transaction Hash:</p>
                    <a 
                      href={`https://sepolia.scrollscan.com/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#277928] hover:underline break-all"
                    >
                      {transactionHash}
                    </a>
                  </div>
                )}
                
                <div className="w-full mt-8">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-[#277928] rounded-full transition-all duration-500"
                      style={{ 
                        width: mintingStep === 'uploading' ? '33%' : 
                               mintingStep === 'minting' ? '66%' : '90%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (mintingStep === 'complete') {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center py-8">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-[#6daf6f] p-6 rounded-full mb-6">
                  <Beef className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">NFT Created Successfully!</h3>
                <p className="text-gray-600 text-center mb-6">
                  Your cattle has been minted as an NFT and listed for auction.
                </p>
                
                {tokenId && (
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500">Token ID:</p>
                    <p className="font-medium">{tokenId}</p>
                  </div>
                )}
                
                {transactionHash && (
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500">Transaction Hash:</p>
                    <a 
                      href={`https://sepolia.scrollscan.com/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#277928] hover:underline break-all"
                    >
                      {transactionHash}
                    </a>
                  </div>
                )}
                
                <div className="flex space-x-4 mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/auctions`)}
                  >
                    View All Auctions
                  </Button>
                  <Button 
                    className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                    onClick={() => router.push('/create-listing')}
                  >
                    Create Another
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#277928]">Create NFT Auction Listing</h1>
        
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
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="health">Health & Care</TabsTrigger>
                    <TabsTrigger value="auction">Auction Settings</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Info Tab */}
                  <TabsContent value="basic">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Beef className="h-5 w-5 mr-2 text-[#277928]" />
                          Basic Information
                        </CardTitle>
                        <CardDescription>
                          Enter the basic details about your cattle
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nome">Name/Identifier *</Label>
                            <Input 
                              id="nome" 
                              name="nome" 
                              placeholder="Enter cattle name or identifier" 
                              value={formData.nome}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="raca">Breed *</Label>
                            <Select 
                              value={formData.raca} 
                              onValueChange={(value) => handleSelectChange('raca', value)}
                            >
                              <SelectTrigger id="raca">
                                <SelectValue placeholder="Select breed" />
                              </SelectTrigger>
                              <SelectContent>
                                {breedOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="tipogado">Type</Label>
                            <Select 
                              value={formData.tipogado} 
                              onValueChange={(value) => handleSelectChange('tipogado', value)}
                            >
                              <SelectTrigger id="tipogado">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {typeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cor">Color *</Label>
                            <Select 
                              value={formData.cor} 
                              onValueChange={(value) => handleSelectChange('cor', value)}
                            >
                              <SelectTrigger id="cor">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="nascimento">Date of Birth</Label>
                            <Input 
                              id="nascimento" 
                              name="nascimento" 
                              type="date" 
                              value={formData.nascimento}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="fotoURI">Image Upload</Label>
                            <div className="flex items-center gap-2">
                              <Input 
                                id="fotoURI" 
                                name="fotoURI" 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <div className="border rounded-md p-2 flex-grow">
                                <label htmlFor="fotoURI" className="flex items-center justify-center gap-2 cursor-pointer py-2">
                                  <Upload className="h-5 w-5 text-[#277928]" />
                                  <span>{formData.imageFile ? formData.imageFile.name : "Upload cattle image"}</span>
                                </label>
                              </div>
                            </div>
                            {formData.fotoURI && (
                              <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden">
                                <img 
                                  src={formData.fotoURI} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              Upload a clear image of the cattle. This will be displayed in the NFT.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => (document.querySelector('[data-value="details"]') as HTMLElement)?.click()}
                          className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                        >
                          Next: Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Details Tab */}
                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Info className="h-5 w-5 mr-2 text-[#277928]" />
                          Detailed Information
                        </CardTitle>
                        <CardDescription>
                          Enter lineage and ownership details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium flex items-center">
                            <Dna className="h-5 w-5 mr-2 text-[#277928]" />
                            Lineage Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="filiacaopai">Sire (Father)</Label>
                              <Input 
                                id="filiacaopai" 
                                name="filiacaopai" 
                                placeholder="Enter sire name/registration" 
                                value={formData.filiacaopai}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="filiacaomae">Dam (Mother)</Label>
                              <Input 
                                id="filiacaomae" 
                                name="filiacaomae" 
                                placeholder="Enter dam name/registration" 
                                value={formData.filiacaomae}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium flex items-center">
                            <Tag className="h-5 w-5 mr-2 text-[#277928]" />
                            Identification
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="rfid">RFID Tag</Label>
                              <Input 
                                id="rfid" 
                                name="rfid" 
                                placeholder="Enter RFID tag number" 
                                value={formData.rfid}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="proprietario">Current Owner</Label>
                              <Input 
                                id="proprietario" 
                                name="proprietario" 
                                placeholder="Enter current owner name" 
                                value={address ? `${address.substring(0, 6)}...${address.substring(38)}` : ""}
                                disabled
                              />
                              <p className="text-xs text-gray-500">
                                This will be automatically set to your wallet address
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => (document.querySelector('[data-value="basic"]') as HTMLElement)?.click()}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => (document.querySelector('[data-value="health"]') as HTMLElement)?.click()}
                          className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                        >
                          Next: Health & Care
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Health & Care Tab */}
                  <TabsContent value="health">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-[#277928]" />
                          Health & Care Information
                        </CardTitle>
                        <CardDescription>
                          Enter health records and care details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="vacinas">Vaccination Records *</Label>
                          <Textarea 
                            id="vacinas" 
                            name="vacinas" 
                            placeholder="Enter vaccination history and dates" 
                            value={formData.vacinas}
                            onChange={handleInputChange}
                            rows={4}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            List all vaccinations with dates (e.g., "Brucellosis: 01/15/2023, Anthrax: 03/20/2023")
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="alimentacao">Feeding Regimen *</Label>
                          <Textarea 
                            id="alimentacao" 
                            name="alimentacao" 
                            placeholder="Describe feeding practices and nutrition" 
                            value={formData.alimentacao}
                            onChange={handleInputChange}
                            rows={4}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Describe diet, supplements, and feeding schedule
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => (document.querySelector('[data-value="details"]') as HTMLElement)?.click()}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          onClick={() => (document.querySelector('[data-value="auction"]') as HTMLElement)?.click()}
                          className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                        >
                          Next: Auction Settings
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Auction Settings Tab */}
                  <TabsContent value="auction">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Gavel className="h-5 w-5 mr-2 text-[#277928]" />
                          Auction Settings
                        </CardTitle>
                        <CardDescription>
                          Configure your NFT auction parameters
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Alert className="bg-amber-50 border-amber-200 mb-4">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <AlertTitle className="text-amber-700">Important</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            Make sure you're connected to the Scroll Sepolia testnet. Your NFT will be minted on this network.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startingPrice">Starting Price (ETH) *</Label>
                            <Input 
                              id="startingPrice" 
                              name="startingPrice" 
                              type="number" 
                              step="0.01" 
                              min="0.01"
                              placeholder="Enter starting bid amount" 
                              value={formData.startingPrice}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reservePrice">Reserve Price (ETH)</Label>
                            <Input 
                              id="reservePrice" 
                              name="reservePrice" 
                              type="number" 
                              step="0.01" 
                              min="0.01"
                              placeholder="Enter minimum acceptable price" 
                              value={formData.reservePrice}
                              onChange={handleInputChange}
                            />
                            <p className="text-xs text-gray-500">
                              Optional. If set, the auction will only complete if bids reach this amount.
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="auctionDuration">Auction Duration</Label>
                            <Select 
                              value={formData.auctionDuration} 
                              onValueChange={(value) => handleSelectChange('auctionDuration', value)}
                            >
                              <SelectTrigger id="auctionDuration">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                {durationOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Auction Description</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Enter additional details about this auction" 
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                          />
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">NFT Creation Summary</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            When you submit this form, the following will happen:
                          </p>
                          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
                            <li>Your cattle data will be stored as metadata</li>
                            <li>An NFT will be minted on the Scroll Sepolia blockchain</li>
                            <li>The NFT will be listed for auction with your specified parameters</li>
                            <li>You will remain the owner until the auction completes</li>
                          </ol>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => (document.querySelector('[data-value="health"]') as HTMLElement)?.click()}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Creating NFT..." : "Create NFT & List for Auction"}
                        </Button>
                      </CardFooter>
                    </Card>
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