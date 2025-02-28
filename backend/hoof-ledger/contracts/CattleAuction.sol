// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CattleNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CattleAuction
 * @dev Contract for auctioning cattle NFTs
 */
contract CattleAuction is Ownable, ReentrancyGuard, IERC721Receiver {
    // Enum for auction status
    enum AuctionStatus { Active, Ended, Canceled }
    
    // Structure for auction
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 reservePrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        AuctionStatus status;
    }
    
    // The NFT contract
    CattleNFT public cattleNFT;
    
    // Mapping from token ID to auction
    mapping(uint256 => Auction) public auctions;
    
    // Mapping from address to their total bids
    mapping(address => uint256) public pendingReturns;
    
    // Events
    event AuctionCreated(uint256 indexed tokenId, address seller, uint256 startingPrice, uint256 reservePrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);
    event AuctionCanceled(uint256 indexed tokenId);
    event WithdrawalSuccessful(address indexed withdrawer, uint256 amount);
    
    /**
     * @dev Constructor
     * @param _cattleNFT Address of the CattleNFT contract
     */
    constructor(address _cattleNFT) Ownable(msg.sender) {
        cattleNFT = CattleNFT(_cattleNFT);
    }
    
    /**
     * @dev Implements IERC721Receiver
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    /**
     * @dev Creates a new auction
     * @param tokenId The token ID of the cattle to be auctioned
     * @param startingPrice The starting price for the auction
     * @param reservePrice The reserve price (minimum acceptable price)
     * @param duration The duration of the auction in seconds
     */
    function createAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 duration
    ) external {
        require(cattleNFT.ownerOf(tokenId) == msg.sender, "Must be the owner of the cattle");
        require(duration > 0, "Duration must be greater than 0");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(reservePrice >= startingPrice, "Reserve price must be >= starting price");
        
        // Transfer the NFT to this contract
        cattleNFT.safeTransferFrom(msg.sender, address(this), tokenId);
        
        // Create the auction
        uint256 endTime = block.timestamp + duration;
        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            reservePrice: reservePrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: endTime,
            status: AuctionStatus.Active
        });
        
        emit AuctionCreated(tokenId, msg.sender, startingPrice, reservePrice, endTime);
    }
    
    /**
     * @dev Places a bid on an auction
     * @param tokenId The token ID of the cattle being auctioned
     */
    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        
        require(auction.status == AuctionStatus.Active, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.sender != auction.seller, "Seller cannot bid");
        
        uint256 bidAmount = msg.value;
        
        // If this is the first bid, it must be at least the starting price
        if (auction.highestBid == 0) {
            require(bidAmount >= auction.startingPrice, "Bid must be >= starting price");
        } else {
            // Otherwise, it must be higher than the current highest bid
            require(bidAmount > auction.highestBid, "Bid must be higher than current highest bid");
            
            // Add the current highest bid to pendingReturns
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }
        
        // Update the auction with the new highest bid
        auction.highestBid = bidAmount;
        auction.highestBidder = msg.sender;
        
        emit BidPlaced(tokenId, msg.sender, bidAmount);
    }
    
    /**
     * @dev Ends an auction
     * @param tokenId The token ID of the cattle being auctioned
     */
    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        
        require(auction.status == AuctionStatus.Active, "Auction is not active");
        require(block.timestamp >= auction.endTime, "Auction has not yet ended");
        
        auction.status = AuctionStatus.Ended;
        
        // If there was no bid or the highest bid is less than the reserve price
        if (auction.highestBidder == address(0) || auction.highestBid < auction.reservePrice) {
            // Return the NFT to the seller
            cattleNFT.safeTransferFrom(address(this), auction.seller, tokenId);
            
            // If there was a bid, but it didn't meet the reserve price, return the bid
            if (auction.highestBidder != address(0)) {
                pendingReturns[auction.highestBidder] += auction.highestBid;
            }
            
            emit AuctionEnded(tokenId, address(0), 0);
        } else {
            // Transfer the NFT to the highest bidder
            cattleNFT.safeTransferFrom(address(this), auction.highestBidder, tokenId);
            
            // Transfer the funds to the seller
            (bool success, ) = auction.seller.call{value: auction.highestBid}("");
            require(success, "Transfer to seller failed");
            
            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        }
    }
    
    /**
     * @dev Cancels an auction
     * @param tokenId The token ID of the cattle being auctioned
     */
    function cancelAuction(uint256 tokenId) external {
        Auction storage auction = auctions[tokenId];
        
        require(auction.status == AuctionStatus.Active, "Auction is not active");
        require(msg.sender == auction.seller || msg.sender == owner(), "Only seller or owner can cancel");
        
        auction.status = AuctionStatus.Canceled;
        
        // Return the NFT to the seller
        cattleNFT.safeTransferFrom(address(this), auction.seller, tokenId);
        
        // If there was a bid, return it
        if (auction.highestBidder != address(0)) {
            pendingReturns[auction.highestBidder] += auction.highestBid;
        }
        
        emit AuctionCanceled(tokenId);
    }
    
    /**
     * @dev Withdraws pending returns
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        pendingReturns[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit WithdrawalSuccessful(msg.sender, amount);
    }
    
    /**
     * @dev Gets an auction by token ID
     * @param tokenId The token ID
     * @return The auction
     */
    function getAuction(uint256 tokenId) external view returns (Auction memory) {
        return auctions[tokenId];
    }
    
    /**
     * @dev Gets the current highest bid for an auction
     * @param tokenId The token ID
     * @return The highest bid
     */
    function getHighestBid(uint256 tokenId) external view returns (uint256) {
        return auctions[tokenId].highestBid;
    }
    
    /**
     * @dev Gets the current highest bidder for an auction
     * @param tokenId The token ID
     * @return The highest bidder
     */
    function getHighestBidder(uint256 tokenId) external view returns (address) {
        return auctions[tokenId].highestBidder;
    }
    
    /**
     * @dev Gets the time remaining for an auction
     * @param tokenId The token ID
     * @return The time remaining in seconds
     */
    function getTimeRemaining(uint256 tokenId) external view returns (uint256) {
        Auction storage auction = auctions[tokenId];
        if (auction.status != AuctionStatus.Active || block.timestamp >= auction.endTime) {
            return 0;
        }
        return auction.endTime - block.timestamp;
    }
} 