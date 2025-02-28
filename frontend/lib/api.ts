import axios from 'axios';
import { SCROLLSCAN_API_URL, SCROLLSCAN_API_KEY, IPFS_GATEWAY } from './constants';

// Function to fetch NFT metadata from IPFS
export async function fetchNFTMetadata(tokenURI: string) {
  try {
    // If the tokenURI is an IPFS URI, convert it to HTTP URL
    let url = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      const ipfsHash = tokenURI.replace('ipfs://', '');
      url = `${IPFS_GATEWAY}${ipfsHash}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}

// Function to fetch transaction details from ScrollScan API
export async function fetchTransaction(txHash: string) {
  try {
    const response = await axios.get(SCROLLSCAN_API_URL, {
      params: {
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: txHash,
        apikey: SCROLLSCAN_API_KEY
      }
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

// Function to fetch NFT transfer events for a specific token
export async function fetchNFTTransferEvents(tokenId: string) {
  try {
    const response = await axios.get(SCROLLSCAN_API_URL, {
      params: {
        module: 'account',
        action: 'tokennfttx',
        contractaddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
        tokenid: tokenId,
        apikey: SCROLLSCAN_API_KEY
      }
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching NFT transfer events:', error);
    return [];
  }
}

// Function to upload metadata to IPFS (in a real app, you would use a service like Pinata or nft.storage)
export async function uploadToIPFS(metadata: any) {
  // This is a mock function - in a real app, you would use a service like Pinata or nft.storage
  // For now, we'll just return a fake IPFS hash
  console.log('Uploading metadata to IPFS:', metadata);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a fake IPFS URI
  const fakeIpfsHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  return fakeIpfsHash;
}

// Function to format ETH value with proper decimals
export function formatEthValue(value: string | number) {
  const valueInEth = typeof value === 'string' 
    ? parseFloat(value) / 1e18 
    : value / 1e18;
  
  return valueInEth.toFixed(4);
}