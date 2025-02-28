"use client";

import React, { useState } from 'react';
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
import { Beef, Upload, Calendar, Info, Tag, Shield, Dna, Gavel } from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { address } = useWallet();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Basic Info
    nome: '',
    raca: '',
    tipogado: '',
    cor: '',
    nascimento: '',
    
    // Lineage
    filiacaopai: '',
    filiacaomae: '',
    
    // Health & Care
    vacinas: '',
    alimentacao: '',
    
    // Identification
    rfid: '',
    proprietario: '',
    
    // Auction Details
    startingPrice: '',
    reservePrice: '',
    auctionDuration: '7',
    description: '',
    
    // Image
    fotoURI: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would:
      // 1. Upload the image to IPFS
      // 2. Create metadata and upload to IPFS
      // 3. Mint the NFT with the metadata URI
      // 4. Create the auction in the smart contract
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Listing created successfully!",
        description: "Your cattle has been minted as an NFT and listed for auction",
      });
      
      // Redirect to the auctions page
      router.push('/auctions');
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error creating listing",
        description: "There was an error creating your listing. Please try again.",
        variant: "destructive",
      });
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
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#277928]">Create NFT Auction Listing</h1>
        
        {!address ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <Beef className="h-12 w-12 text-[#277928]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
                <p className="text-gray-600 text-center mb-6">
                  To create an NFT auction listing, you need to connect your Ethereum wallet first.
                </p>
                <Button 
                  className="bg-[#277928] hover:bg-[#1d5b1e] text-white"
                  onClick={() => window.location.href = '/register'}
                >
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
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
                            onChange={(e) => {
                              // In a real app, this would upload to IPFS and set the URI
                              setFormData(prev => ({ 
                                ...prev, 
                                fotoURI: e.target.files?.[0]?.name || '' 
                              }));
                            }}
                          />
                          <div className="border rounded-md p-2 flex-grow">
                            <label htmlFor="fotoURI" className="flex items-center justify-center gap-2 cursor-pointer py-2">
                              <Upload className="h-5 w-5 text-[#277928]" />
                              <span>{formData.fotoURI || "Upload cattle image"}</span>
                            </label>
                          </div>
                        </div>
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
                            value={formData.proprietario || address.substring(0, 6) + '...' + address.substring(38)}
                            onChange={handleInputChange}
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
                        <li>An NFT will be minted on the Ethereum blockchain</li>
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
      </div>
    </div>
  );
}