import {
  Container,
  Heading,
  Text,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  SimpleGrid,
  Skeleton,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Spacer,
} from '@chakra-ui/react';
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  useNFT,
} from '@thirdweb-dev/react';
import React from 'react';
import NFTGrid from '../components/NFT/NFTGrid';
import NFTCard from '../components/NFT/NFTCard';
import NFTRentedOrder from '../components/NFT/NFTRentedOrder';
import { NFT_BBG_ADDRESS, NFT_CS_ADDRESS } from '../const/addresses';
import useSWR from 'swr';
import NextLink from 'next/link';
import { URLS } from '../config/urls';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function RentedNFT({ nftId, rentData }) {
  const nftAddresses = {
    1: NFT_BBG_ADDRESS,
    2: NFT_CS_ADDRESS,
  }
  const nftAddress = nftAddresses[rentData.gameid]
  const { contract: nftCollection } = useContract(nftAddress);
  const { data: rentedNft } = useNFT(nftCollection, nftId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return rentedNft ? (
    <>
      <div onClick={onOpen}>
        <NFTCard key={rentedNft.metadata.id} nft={rentedNft} />
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <NFTRentedOrder nft={rentedNft} rentId={rentData.id} nftAddress={nftAddress} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  ) : null;
}
export default function Inventory() {
  const address = useAddress();
  const { contract: nftCollectionBBG } = useContract(NFT_BBG_ADDRESS);
  const { data: ownedNftsBBG, isLoading: isLoadingBBG } = useOwnedNFTs(
    nftCollectionBBG,
    address,
  );
  const ownedNftsBBGWithContract = ownedNftsBBG?.map(nft => ({ ...nft, contract: NFT_BBG_ADDRESS })) || [];

  const ownedNfts = [...ownedNftsBBGWithContract];

  const isLoading = isLoadingBBG;
  const { data: rentedItems, isLoading: rentedItemsLoading } = useSWR(
    `${URLS.RENTS}/get-active-by-rentee/${address}`,
    fetcher,
  );
  return (
    <Container maxW={'90%'} p={5}>
      <Accordion defaultIndex={[0]} allowToggle>
        <AccordionItem>
          <AccordionButton
            _hover={{
              bg: '#66E383',
              transition: 'background-color 0.2s',
              color: 'white',
            }}
            padding={10}
          >
            <Flex alignItems={'center'} textAlign="left">
              <Box minW={280}>
                <Heading fontSize={40} fontFamily={'Manrope'}>
                  Your Owned Items
                </Heading>
              </Box>
              <Box marginLeft={10}>
                <AccordionIcon boxSize={8} />
              </Box>
            </Flex>
          </AccordionButton>
          <AccordionPanel paddingLeft={10} pb={4}>
            {isLoading ? (
              <></>
            ) : ownedNfts?.length > 0 ? (
              <Text fontSize={25} fontFamily={'Manrope'}>
                These are the game items you own. Put them in a pool and start
                generating income!
              </Text>
            ) : (
              <div>
                <Text fontSize={25} fontFamily={'Manrope'}>
                  You do not have any Items! Check the available Pools and rent
                  some items to play!
                </Text>
                <Button
                  letterSpacing={0.5}
                  marginTop={5}
                  size={'lg'}
                  as={NextLink}
                  colorScheme="teal"
                  href="/pools"
                  color={'white'}
                >
                  Rent incredible Items
                </Button>
              </div>
            )}
            <NFTGrid isLoading={isLoading} data={ownedNfts} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton
            _hover={{
              bg: '#66E383',
              transition: 'background-color 0.2s',
              color: 'white',
            }}
            padding={10}
          >
            <Flex alignItems={'center'} textAlign="left">
              <Box minW={280}>
                <Heading fontSize={40} fontFamily={'Manrope'}>
                  Your Rented Items
                </Heading>
              </Box>
              <Box marginLeft={10}>
                <AccordionIcon boxSize={8} />
              </Box>
            </Flex>
          </AccordionButton>
          <AccordionPanel paddingLeft={10} pb={4}>
            {rentedItems?.rents?.length > 0 ? (
              <Text fontSize={25} fontFamily={'Manrope'}>
                These are the items you are currently renting from other players
                for use in the game.
              </Text>
            ) : (
              <></>
            )}
            <SimpleGrid
              justifyItems="center"
              justifyContent="center"
              columns={[1, 2, 5]}
              spacing={2}
              maxW={'100%'}
              padding={2}
              my={5}
            >
              {rentedItemsLoading ? (
                [...Array(3)].map((_, index) => (
                  <Skeleton key={index} height={'150px'} width={'250px'} />
                ))
              ) : rentedItems?.rents?.length > 0 ? (
                rentedItems?.rents?.map((rentedItem) => (
                  <RentedNFT
                    key={rentedItem.nftid}
                    nftId={rentedItem.nftid}
                    rentData={rentedItem}
                  />
                ))
              ) : (
                <Text fontSize={24} fontFamily={'Manrope'}>
                  0 items found
                </Text>
              )}
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
}
