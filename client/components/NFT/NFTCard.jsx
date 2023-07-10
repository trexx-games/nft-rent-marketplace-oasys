import React from 'react';
import { ThirdwebNftMedia } from '@thirdweb-dev/react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

export default function NFTCard({ nft }) {
  const boxShadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.5)',
    'rgba(255, 255, 255, 0.5)',
  );
  const rarityColors = {
    1: '#523b26',
    2: '#265eed',
    3: '#523b26',
    5: '#f2521e',
    6: '#2a8303',
    4: '#3198d6',
  };

  const categoryAttribute = Object.entries(
    nft?.metadata?.attributes || {},
  ).find(([_, value]) => value.trait_type === 'categoryId');
  const categoryId = categoryAttribute ? categoryAttribute[1].value : null;
  const background = rarityColors[categoryId] || '#000000';
  return (
    <Flex
      overflow={'hidden'}
      borderRadius={'10px'}
      border={'1px'}
      direction={'column'}
      maxWidth={200}
      justifyContent={'center'}
      transition="0.3s"
      boxShadow={`0px 10px 15px ${boxShadowColor}`}
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Box>
        <ThirdwebNftMedia
          width="200px"
          height="150px"
          style={{}}
          metadata={nft.metadata}
        />
      </Box>
      <Box textAlign={'center'} background={background} p={4}>
        <Text
          fontSize="sm"
          color={'white'}
          fontWeight="bold"
          fontFamily={'Manrope'}
          mb={1}
        >
          {nft.metadata.name}
        </Text>
      </Box>
    </Flex>
  );
}
