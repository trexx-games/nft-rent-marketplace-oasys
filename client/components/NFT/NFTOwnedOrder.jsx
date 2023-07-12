import {
  Box,
  Heading,
  Container,
  Flex,
  SimpleGrid,
  Button,
  Stack,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { darken } from '@chakra-ui/theme-tools';
import { ThirdwebNftMedia } from '@thirdweb-dev/react';
import { useSigner } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import {
  NFT_RENT_MARKETPLACE_ADDRESS,
  NFT_RENT_MARKETPLACE_ABI,
  NFT_BBG_ADDRESS,
  NFT_BBG_ABI,
  NFT_CS_ADDRESS,
  NFT_CS_ABI,
} from '../../const/addresses';
import { ethers } from 'ethers';
import React, { useState } from 'react';

export default function NFTOwnedOrder({ nft }) {
  const toast = useToast();
  const signer = useSigner();
  let sdk;
  if (signer) {
    sdk = ThirdwebSDK.fromSigner(signer);
  }
  const [isLoading, setIsLoading] = useState(false);
  const provider = new ethers.providers.JsonRpcProvider(OASYS_CONNECTION.rpc);
  const nftCsContract = new ethers.Contract(
    NFT_CS_ADDRESS,
    NFT_CS_ABI,
    provider,
  );
  const nftBbgContract = new ethers.Contract(
    NFT_BBG_ADDRESS,
    NFT_BBG_ABI,
    provider,
  );
  const nftRentMarketplaceContract = new ethers.Contract(
    NFT_RENT_MARKETPLACE_ADDRESS,
    NFT_RENT_MARKETPLACE_ABI,
    provider,
  );

  const addItemToPool = async () => {
    setIsLoading(true);
    try {
      let nftContract;
      if (nft.contract === NFT_CS_ADDRESS) {
        nftContract = await sdk.getContract(NFT_CS_ADDRESS, 'nft-collection');
      } else if (nft.contract === NFT_BBG_ADDRESS) {
        nftContract = await sdk.getContract(NFT_BBG_ADDRESS, 'nft-collection');
      } else {
        throw new Error('Unknown NFT contract address');
      }

      let unsignedApproveTxn = await nftContract.populateTransaction.approve([
        NFT_RENT_MARKETPLACE_ADDRESS,
        parseInt(nft.metadata.id),
      ]);
      await window.SingularityEvent.signAndSendTransaction(unsignedApproveTxn);

      let unsignedAddItemToPoolTxn =
        await nftRentMarketplaceContract.populateTransaction.addItemToPool([
          parseInt(nft.metadata.id),
          nft.contract,
        ]);
      await window.SingularityEvent.signAndSendTransaction(
        unsignedAddItemToPoolTxn,
      );
      toast({
        title: 'Success',
        description: 'Your item is in pool for rent!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to add item to pool.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error adding item to pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack align="stretch" padding={'10px'} columns={2} spacing={6}>
      <Box marginTop={'10%'}>
        <Heading textAlign={'center'} fontFamily={'Manrope'} size="xl" mt={2}>
          {nft.metadata.name}
        </Heading>
      </Box>
      <Stack spacing={'20px'}>
        <Box borderRadius={'6px'} overflow={'hidden'}>
          <ThirdwebNftMedia
            metadata={nft.metadata}
            width="100%"
            height="100%"
          />
        </Box>
        <Button
          _hover={{
            bg: darken('#66E383', 15),
            transition: 'background-color 0.2s',
          }}
          _active={{
            transform: 'scale(0.98)',
          }}
          backgroundColor={'#66E383'}
          fontFamily={'Manrope'}
          fontSize={20}
          letterSpacing={0.5}
          isLoading={isLoading}
          color={'white'}
          size="md"
          mt={4}
          onClick={addItemToPool}
        >
          Add Item to Pool
        </Button>
        <Box>
          <Text fontFamily={'Manrope'} fontSize={20} fontWeight={'bold'}>
            Description:
          </Text>
          <Text fontFamily={'Manrope'} mb={1} fontSize={16}>
            {nft.metadata.description}
          </Text>
        </Box>
        <Box>
          <Text
            marginBottom={4}
            fontFamily={'Manrope'}
            fontSize={20}
            fontWeight={'bold'}
          >
            Traits:
          </Text>
          <SimpleGrid columns={2} spacing={4}>
            {Object.entries(nft?.metadata?.attributes || {}).map(
              ([key, value]) => (
                <Flex
                  key={key}
                  direction={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  borderWidth={1}
                  p={'8px'}
                  borderRadius={'4px'}
                >
                  <Text
                    letterSpacing={0.3}
                    fontSize={'small'}
                    fontFamily={'Manrope'}
                    fontWeight={'bold'}
                    textTransform={'capitalize'}
                  >
                    {value.trait_type}
                  </Text>
                  <Text
                    fontFamily={'Dela Gothic One'}
                    fontSize={'medium'}
                    textTransform={'uppercase'}
                  >
                    {value.value}
                  </Text>
                </Flex>
              ),
            )}
          </SimpleGrid>
        </Box>
      </Stack>
    </VStack>
  );
}

export const getStaticProps = async (context) => {
  const tokenId = context.params?.tokenId;
  const sdk = new ThirdwebSDK('avalanche-fuji');

  const contractCS = await sdk.getContract(NFT_CS_ADDRESS);
  const nftCS = await contractCS.erc721.get(tokenId);

  const contractBBG = await sdk.getContract(NFT_BBG_ADDRESS);
  const nftBBG = await contractBBG.erc721.get(tokenId);

  return {
    props: {
      nftCS,
      nftBBG,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const sdk = new ThirdwebSDK('avalanche-fuji');

  const contractAddresses = [NFT_CS_ADDRESS, NFT_BBG_ADDRESS];

  let paths = [];

  for (const contractAddress of contractAddresses) {
    const contract = await sdk.getContract(contractAddress, 'nft-collection');
    const nfts = await contract.getAll();

    const contractPaths = nfts.map((nft) => {
      return {
        params: {
          contractAddress: contractAddress,
          tokenId: nft.metadata.id,
        },
      };
    });

    paths = [...paths, ...contractPaths];
  }

  return {
    paths,
    fallback: 'blocking',
  };
};
