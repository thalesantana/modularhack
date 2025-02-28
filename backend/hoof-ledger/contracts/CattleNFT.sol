// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CattleNFT
 * @dev Contract for representing cattle as NFTs
 */
contract CattleNFT is ERC721, ERC721URIStorage, Ownable {
    // Replace Counters with a simple counter variable
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to cattle metadata
    mapping(uint256 => CattleData) public cattleData;
    
    // Structure to store cattle-specific data
    struct CattleData {
        string name;
        string breed;
        uint256 weight;
        string color;
        string vaccines;
        string feeding;
        bool isForSale;
    }
    
    // Events
    event CattleMinted(uint256 indexed tokenId, address owner, string name, string breed);
    event CattleListedForSale(uint256 indexed tokenId, bool isForSale);
    
    constructor() ERC721("CattleNFT", "CTLNFT") Ownable(msg.sender) {}
    
    /**
     * @dev Creates a new cattle NFT
     * @param recipient The address that will own the minted NFT
     * @param tokenURI The token URI for the NFT metadata
     * @param name Name of the cattle
     * @param breed Breed of the cattle
     * @param weight Weight of the cattle in kg
     * @param color Color of the cattle
     * @param vaccines Vaccination information
     * @param feeding Feeding information
     * @return The token ID of the newly minted NFT
     */
    function mintCattle(
        address recipient,
        string memory tokenURI,
        string memory name,
        string memory breed,
        uint256 weight,
        string memory color,
        string memory vaccines,
        string memory feeding
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        cattleData[newTokenId] = CattleData({
            name: name,
            breed: breed,
            weight: weight,
            color: color,
            vaccines: vaccines,
            feeding: feeding,
            isForSale: false
        });
        
        emit CattleMinted(newTokenId, recipient, name, breed);
        
        return newTokenId;
    }
    
    /**
     * @dev Sets whether a cattle is available for sale
     * @param tokenId The token ID of the cattle
     * @param forSale Whether the cattle is for sale
     */
    function setCattleForSale(uint256 tokenId, bool forSale) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Caller is not owner or approved");
        cattleData[tokenId].isForSale = forSale;
        emit CattleListedForSale(tokenId, forSale);
    }
    
    /**
     * @dev Returns whether a cattle is listed for sale
     * @param tokenId The token ID of the cattle
     * @return Whether the cattle is for sale
     */
    function isCattleForSale(uint256 tokenId) external view returns (bool) {
        return cattleData[tokenId].isForSale;
    }
    
    /**
     * @dev Returns the cattle data for a given token ID
     * @param tokenId The token ID of the cattle
     * @return The cattle data
     */
    function getCattleData(uint256 tokenId) external view returns (CattleData memory) {
        require(_exists(tokenId), "CattleNFT: Query for nonexistent token");
        return cattleData[tokenId];
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId uint256 ID of the token to check
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
} 