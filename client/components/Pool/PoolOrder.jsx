import {
  Heading,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  useDisclosure,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useSigner } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { darken } from '@chakra-ui/theme-tools';
import React, { useState } from 'react';
import {
  NFT_RENT_MARKETPLACE_ADDRESS,
  NFT_ADDRESS,
} from '../../const/addresses';
import NFTCard from '../NFT/NFTCard';
import { ethers } from 'ethers';

export default function PoolOrder({ pool }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const signer = useSigner();
  const toast = useToast();
  let sdk;
  if (signer) {
    sdk = ThirdwebSDK.fromSigner(signer);
  }
  const [isLoading, setIsLoading] = useState(false);
  const [nft, setNft] = useState(null);
  const [poolUSDPrice, setPoolUSDPrice] = useState(0);
  const [poolMATICPrice, setPoolMATICPrice] = useState(0);
  const [poolMATICFormatedPrice, setPoolMATICFormatedPrice] = useState(0);
  const [rentDays, setRentDays] = useState(1);

  const handleRentDaysChange = async (value) => {
    setRentDays(value)
    const contract = await sdk.getContract(NFT_RENT_MARKETPLACE_ADDRESS);
    const price = await contract.call('getRentQuote', [pool.CATEGORYID, value]);
    if (price?.rentQuoteDollar._hex) {
      const poolUSDPriceBigNumber = ethers.BigNumber.from(price.rentQuoteDollar._hex);
      const poolMATICPriceBigNumber = ethers.BigNumber.from(price.rentQuoteMatic._hex);
      setPoolUSDPrice(ethers.utils.formatUnits(poolUSDPriceBigNumber));
      setPoolMATICFormatedPrice(ethers.utils.formatUnits(poolMATICPriceBigNumber));
      setPoolMATICPrice(price.rentQuoteMatic);
    } else {
      console.error('No quote has returned');
    }
  };
  const rentItem = async () => {
    setIsLoading(true);
    try {
      const contract = await sdk.getContract(NFT_RENT_MARKETPLACE_ADDRESS);
      const result = await contract.call('startRent', [pool.CATEGORYID, rentDays], { value: poolMATICPrice });
      const nftId = result.receipt.events[1].args.itemNftId.toNumber();
      const nft = await getNft(nftId);
      setNft(nft);
      onOpen();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to rent from pool',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNft = async (nftId) => {
    const contract = await sdk.getContract(NFT_ADDRESS);
    const nft = await contract.erc721.get(nftId);
    return nft;
  };

  return (
    <VStack spacing={6} align="stretch" padding={'10px'}>
      <Box marginTop={'20%'}>
        <Heading fontFamily={'Bayon'} size="xl" mt={2}>
          {pool.CATEGORYTYPE} Pool
        </Heading>
        <Text
          fontSize={20}
          fontFamily={'Big Shoulders Text'}
          fontWeight={'bold'}
        >
          Rarity: {pool.RARITY}
        </Text>
      </Box>
      <Box>
        <Image src={pool.IMAGEURL} alt={pool.NAME} borderRadius={'6px'} />
      </Box>
      <Box>
        <Text fontSize={20} fontFamily={'Bayon'} fontWeight={'bold'}>
          Description:
        </Text>
        <Text fontFamily={'Big Shoulders Text'}>{pool.DESCRIPTION}</Text>
        <Box>
          <Text fontSize={20} fontFamily={'Bayon'} fontWeight={'bold'} mt={2}>
            Rent for:
          </Text>
          <NumberInput
            size='lg'
            maxW={32}
            defaultValue={1}
            min={1}
            value={rentDays}
            onChange={handleRentDaysChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize={20} fontFamily={'Bayon'} fontWeight={'bold'} mt={2}>
            Price:
          </Text>
          <Text fontFamily={'Big Shoulders Text'}>USD {Number(poolUSDPrice).toFixed(2)}</Text>
          <Text fontFamily={'Big Shoulders Text'}>MATIC {poolMATICFormatedPrice}</Text>
        </Box>
        <Button
          letterSpacing={0.5}
          _hover={{
            bg: darken('#FBAA0B', 15),
            transition: 'background-color 0.2s',
          }}
          _active={{
            transform: 'scale(0.98)',
          }}
          backgroundColor={'#FBAA0B'}
          fontFamily={'Bayon'}
          isLoading={isLoading}
          color={'white'}
          size="md"
          mt={4}
          onClick={rentItem}
        >
          Rent Item
        </Button>
      </Box>
      {nft && (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent padding={20}>
            <ModalHeader
              fontSize="xl"
              fontWeight="bold"
              fontFamily={'Bayon'}
              mb={1}
            >
              Check your Rented Item, Play with it!
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <NFTCard nft={nft} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
}
