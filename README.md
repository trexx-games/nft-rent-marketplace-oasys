# NFT Rent Marketplace

## DEMO MARKETPLACE
[Click here to wach](https://www.youtube.com/watch?v=iIMwuaPCLWY)

## DEMO INTEGRATION WITH SINGULARITY SDK
[Click here to wach](https://youtu.be/_uxGyzoAbws)

This is a platform that allows users to rent their NFTs to other players. The platform is built using a microservices architecture, with each service running in its own Docker container. The services include:

- `API`: This is the backend API service that handles all the business logic.
- `EVENT WORKER`: This service listens for events on the blockchain and updates the application's database accordingly.
- `FRONT-END`: This is the frontend service that provides the user interface for the platform.
- `SMART CONTRACTS`: We have the Marketplace Smart Contract and a ERC-721 NFT Smart Contract.

## [Architecture Explained](docs/architecture.md)

![Hackathon Plan](https://github.com/trexx-games/nft-rent-marketplace-oasys/assets/133237806/d05af26f-79c8-426d-814d-b20ce4aa7896)

The NFTRentMarketplace is a robust and efficient platform for NFT rentals, built with a variety of technologies to ensure a seamless user experience. Here's a brief overview of what we have used to built the system:

- Lambda AWS + Api Gateway
- Elastic Container Service AWS
- AWS S3
- Oasys Blockchain

## [See the API Docs](docs/api/api.md)
Here you can find comprehensive documentation detailing the functionality and usage of the NFTRentMarketplace API.

## How to Test

To test the NFTRentMarketplace, follow these steps:

1. Ensure you have Node.js v18 installed. If you're using nvm, you can switch to v18 with the following command:

```bash
nvm use 18
```

2. Navigate to each service's directory and install the necessary dependencies:

```bash
cd ./api
npm install

cd ../client
npm install

cd ../workers
npm install
```

3. Copy the provided `.env.example` files to `.env` in each service's directory.

4. Publish the contracts on Oasys Blockchain

5. Start the services using Docker Compose:

```bash
docker-compose up
```

6. Navigate to localhost:3000 in your web browser. 

7. From here, you can add your items to a pool.

8. Switch to a different MetaMask account and rent an item from the pool.

Enjoy testing the NFTRentMarketplace!

## Contract Addresses deployed on Oasys Blockchain

### BoomBoogersNFTs 
```bash
0x7DEb7d43389Ec47ce00fa6d6293906faC756491f
```

### NFTRentMarketplace
```bash
0x66Dd2308c4Ce5d75Dc27dc550912266bcb2Ec951
```
