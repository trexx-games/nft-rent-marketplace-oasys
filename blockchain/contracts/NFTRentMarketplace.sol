// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTRentMarketplace is ConfirmedOwner, IERC721Receiver {
  //Marketplace
  using Counters for Counters.Counter;
  using SafeMath for uint256;
  Counters.Counter private _itemIds;
  Counters.Counter private _rentsIds;

  struct Item {
    uint256 id;
    uint256 nftId;
    bool isRented;
    uint256 categoryId;
    address payable owner;
    address rentee;
    address nftContractAddress;
    bool isInPool;
  }

  struct Pool {
    uint256 categoryId;
    bool isActive;
    uint256 basePrice;
    uint256[] availableItems;
    uint256[] rentedItems;
  }

  struct Rent {
    uint256 id;
    uint256 initDate;
    uint256 expirationDate;
    uint256 finishDate;
    uint256 price;
    address owner;
    address rentee;
    uint256 poolId;
    uint256 randomNumber;
    uint256 itemId;
    RentStatus status;
  }

  enum RentStatus {
    ACTIVE,
    FINISHED
  }

  //Mappings
  mapping(uint256 => Pool) private pools;
  mapping(uint256 => Item) private items;
  mapping(uint256 => Rent) public rents;
  mapping(address => mapping(uint256 => uint256)) private nftContractToNftIdToItemId;
  mapping(address => uint256[]) private renteeNFTs;

  //Rent Events
  event RentStarted(
    uint256 indexed rentId,
    uint256 poolId,
    address rentee,
    uint256 itemId,
    uint256 initDate,
    uint256 expirationDate,
    uint256 price,
    address owner
  );
  event RentFinished(uint256 indexed rentId, uint256 itemId, uint256 finishDate);

  //Pool Events
  event PoolEnabled(uint256 poolId);
  event PoolDisabled(uint256 poolId);
  event PoolCreated(uint256 indexed poolId, uint256 basePrice);

  //Item Events
  event ItemAddedToPool(uint256 indexed itemId, uint256 indexed nftId, uint256 poolId);
  event ItemRemovedFromPool(uint256 indexed itemId, uint256 indexed nftId, uint256 poolId);
  event ItemCreated(
    uint256 indexed itemId,
    uint256 indexed nftId,
    uint256 categoryId,
    address owner,
    address nftContractAddress
  );

  constructor() ConfirmedOwner(msg.sender) {}

  modifier onlyNftOwner(uint256 _itemNftId, address _nftContractAddress) {
    ERC721 erc721 = ERC721(_nftContractAddress);
    require(msg.sender == erc721.ownerOf(_itemNftId), "Only the NFT owner can perform this operation");
    _;
  }

  modifier onlyItemOwnerOrContractOwner(uint256 _itemNftId, address _nftContractAddress) {
    uint256 itemId = nftContractToNftIdToItemId[_nftContractAddress][_itemNftId];
    Item storage item = items[itemId];
    require(
      msg.sender == item.owner || msg.sender == owner(),
      "Only the item owner or the contract owner can perform this operation"
    );
    _;
  }

  modifier onlyRenteeOrContractOwner(uint256 _rentId) {
    Rent storage rent = rents[_rentId];
    require(
      msg.sender == rent.rentee || msg.sender == owner(),
      "Only the Rentee or the contract owner can perform this operation"
    );
    _;
  }

  function createPool(uint256 _categoryId, uint256 _basePrice) public onlyOwner {
    require(_categoryId > 0, "category ID must be greater than 0");
    require(pools[_categoryId].categoryId == 0, "Pool with this category ID already exists");

    Pool storage newPool = pools[_categoryId];
    newPool.categoryId = _categoryId;
    newPool.basePrice = _basePrice;
    newPool.isActive = true;

    emit PoolCreated(_categoryId, newPool.basePrice);
  }

  function disablePool(uint256 _categoryId) public onlyOwner {
    require(pools[_categoryId].isActive, "Pool already inactive");
    pools[_categoryId].isActive = false;
    emit PoolDisabled(_categoryId);
  }

  function enablePool(uint256 _categoryId) public onlyOwner {
    require(pools[_categoryId].isActive == false, "Pool already inactive");
    pools[_categoryId].isActive = true;
    emit PoolEnabled(_categoryId);
  }

  function createItem(
    uint256 _nftId,
    uint256 _categoryId,
    address _nftContractAddress
  ) public onlyNftOwner(_nftId, _nftContractAddress) {
    require(nftContractToNftIdToItemId[_nftContractAddress][_nftId] == 0, "Item with this NFT ID already exists");

    _itemIds.increment();
    uint256 newItemId = _itemIds.current();

    items[newItemId] = Item({
      id: newItemId,
      nftId: _nftId,
      owner: payable(msg.sender),
      categoryId: _categoryId,
      rentee: address(0),
      isRented: false,
      nftContractAddress: _nftContractAddress,
      isInPool: false
    });
    nftContractToNftIdToItemId[_nftContractAddress][_nftId] = newItemId;
    emit ItemCreated(newItemId, _nftId, _categoryId, msg.sender, _nftContractAddress);
  }

  function getRent(uint256 _rentId) public view returns (Rent memory) {
    return rents[_rentId];
  }

  function getItem(uint256 _itemId) public view returns (Item memory) {
    return items[_itemId];
  }

  function getPool(uint256 _categoryId) public view returns (Pool memory) {
    return pools[_categoryId];
  }

  function getRentQuote(uint256 _categoryId, uint256 _rentTime) public view returns (uint256) {
    Pool storage pool = pools[_categoryId];
    require(pool.isActive, "Pool with the given category ID does not exist or is not active");

    uint256 basePrice = pool.basePrice;

    uint256 rentQuote = calculateRentPrice(basePrice, _rentTime);
    return rentQuote;
  }

  function getItemByNftId(uint256 _nftId, address _nftContractAddress) public view returns (Item memory) {
    uint256 itemId = nftContractToNftIdToItemId[_nftContractAddress][_nftId];
    require(itemId != 0, "Item with the given NFT ID does not exist");
    return items[itemId];
  }

  function addItemToPool(uint256 _nftId, address _nftContractAddress) public onlyNftOwner(_nftId, _nftContractAddress) {
    uint256 itemId = nftContractToNftIdToItemId[_nftContractAddress][_nftId];
    Item storage item = items[itemId];
    Pool storage pool = pools[item.categoryId];

    require(item.id != 0, "Item does not exist");
    require(pool.isActive, "Pool with the given category ID does not exist or is not active");
    require(items[item.id].isInPool == false, "Item is already in a pool");

    // Update the owner of the item if the current owner is not the sender
    if (item.owner != msg.sender) {
      item.owner = payable(msg.sender);
    }

    ERC721 erc721 = ERC721(_nftContractAddress);
    erc721.safeTransferFrom(msg.sender, address(this), item.nftId);
    pools[item.categoryId].availableItems.push(item.id);
    item.isInPool = true;
    emit ItemAddedToPool(item.id, item.nftId, item.categoryId);
  }

  function removeItemFromPool(
    uint256 _nftId,
    address _nftContractAddress
  ) public onlyItemOwnerOrContractOwner(_nftId, _nftContractAddress) {
    uint256 itemId = nftContractToNftIdToItemId[_nftContractAddress][_nftId];
    Item storage item = items[itemId];
    uint256 poolId = item.categoryId;
    Pool storage pool = pools[poolId];

    require(item.id != 0, "Item does not exist");
    require(item.isRented == false, "Item is rented and cannot be removed from pool");
    require(item.isInPool == true, "Item is not in Pool");

    uint256 availableIndex = findIndex(pool.availableItems, item.id);
    pool.availableItems[availableIndex] = pool.availableItems[pool.availableItems.length - 1];
    pool.availableItems.pop();
    ERC721 erc721 = ERC721(_nftContractAddress);
    erc721.safeTransferFrom(address(this), msg.sender, item.nftId);
    item.isInPool = false;
    emit ItemRemovedFromPool(item.id, item.nftId, poolId);
  }

  function onERC721Received(address, address, uint256, bytes calldata) public pure override returns (bytes4) {
    return this.onERC721Received.selector;
  }

  function startRent(uint256 _categoryId, uint256 _duration) public payable {
    Pool storage pool = pools[_categoryId];
    require(pool.isActive, "Pool with the given category ID does not exist or is not active");
    require(pool.availableItems.length > 0, "Pool with the given category ID has no available items to rent");

    //check if the pool is made by items of the sender
    bool allItemsSameOwner = checkAllItemsSameOwner(msg.sender, _categoryId);
    require(!allItemsSameOwner, "All items belong to the same owner");

    uint256 rentPrice = calculateRentPrice(pool.basePrice, _duration);

    require(msg.value == rentPrice, "The price must be equal to the quote. Get quote again!");

    (Item storage item, uint256 itemRandomIndex, uint256 randomNumber) = getRandomItemNotOwnedBy(
      msg.sender,
      _categoryId
    );
    item.isRented = true;
    item.rentee = msg.sender;
    renteeNFTs[msg.sender].push(item.nftId);
    updatePoolAfterRent(pool, item.id, itemRandomIndex);
    createNewRent(_categoryId, _duration, rentPrice, randomNumber, item);
  }

  function createNewRent(
    uint256 _categoryId,
    uint256 _duration,
    uint256 _rentPrice,
    uint256 _randomNumber,
    Item storage item
  ) private {
    _rentsIds.increment();
    uint256 newRentId = _rentsIds.current();

    Rent memory newRent = Rent({
      id: newRentId,
      initDate: block.timestamp,
      expirationDate: block.timestamp + (_duration * 86400),
      finishDate: 0,
      owner: item.owner,
      rentee: msg.sender,
      price: _rentPrice,
      poolId: _categoryId,
      itemId: item.id,
      randomNumber: _randomNumber,
      status: RentStatus.ACTIVE
    });

    rents[newRentId] = newRent;
    emit RentStarted(
      newRentId,
      _categoryId,
      msg.sender,
      item.nftId,
      newRent.initDate,
      newRent.expirationDate,
      _rentPrice,
      item.owner
    );
  }

  function checkAllItemsSameOwner(address _owner, uint256 _categoryId) private view returns (bool) {
    Pool storage pool = pools[_categoryId];

    for (uint256 i = 0; i < pool.availableItems.length; i++) {
      if (items[pool.availableItems[i]].owner != _owner) {
        return false;
      }
    }
    return true;
  }

  function getRandomItemNotOwnedBy(
    address _owner,
    uint256 _categoryId
  ) private view returns (Item storage item, uint256 itemRandomIndex, uint256 randomNumber) {
    Pool storage pool = pools[_categoryId];
    uint256 selectedItemId;
    uint256 attempts = 0;
    do {
      randomNumber = getRandomNumber();
      itemRandomIndex = randomNumber % pool.availableItems.length;
      selectedItemId = pool.availableItems[itemRandomIndex];
      item = items[selectedItemId];
    } while (item.owner == _owner);
    return (item, itemRandomIndex, randomNumber);
  }

  function getRandomNumber() private view returns (uint256) {
    uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
    return random;
  }

  function updatePoolAfterRent(Pool storage pool, uint256 _selectedItemId, uint256 _index) private {
    pool.rentedItems.push(_selectedItemId);
    pool.availableItems[_index] = pool.availableItems[pool.availableItems.length - 1];
    pool.availableItems.pop();
  }

  function finishRent(uint256 _rentId) public onlyRenteeOrContractOwner(_rentId) {
    require(rents[_rentId].status == RentStatus.ACTIVE, "This Rent is not Active");
    Rent storage rent = rents[_rentId];
    Item storage item = items[rent.itemId];
    Pool storage pool = pools[rent.poolId];

    require(item.isRented, "Item is not currently rented");

    uint256 rentedIndex = findIndex(pool.rentedItems, item.id);
    pool.rentedItems[rentedIndex] = pool.rentedItems[pool.rentedItems.length - 1];
    pool.rentedItems.pop();
    pool.availableItems.push(item.id);
    item.isRented = false;
    item.rentee = address(0);
    rent.status = RentStatus.FINISHED;
    rent.finishDate = block.timestamp;
    (bool success, ) = payable(item.owner).call{value: rent.price}("");
    require(success, "Transfer failed.");
    _removeRentedNFT(msg.sender, item.nftId);
    emit RentFinished(rent.id, item.id, rent.finishDate);
  }

  function _removeRentedNFT(address _rentee, uint256 _nftId) private {
    uint256[] storage rentedNFTs = renteeNFTs[_rentee];
    for (uint256 i = 0; i < rentedNFTs.length; i++) {
      if (rentedNFTs[i] == _nftId) {
        rentedNFTs[i] = rentedNFTs[rentedNFTs.length - 1];
        rentedNFTs.pop();
        break;
      }
    }
  }

  function getRentedNFTsForRentee(address _rentee) public view returns (uint256[] memory) {
    return renteeNFTs[_rentee];
  }

  function calculateRentPrice(uint256 _basePrice, uint256 _rentTime) internal pure returns (uint256) {
    uint256 timeAdjustedPrice = _basePrice.mul(_rentTime) / 10 ** 18;
    return timeAdjustedPrice;
  }

  function findIndex(uint256[] storage _array, uint256 _value) internal view returns (uint256) {
    for (uint256 i = 0; i < _array.length; i++) {
      if (_array[i] == _value) {
        return i;
      }
    }
    revert("Value not found in the array");
  }

  fallback() external payable {
    revert("Contract does not accept Ether directly.");
  }
}
