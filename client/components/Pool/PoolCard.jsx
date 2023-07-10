import React from 'react';
import {
  Image,
  Box,
  Flex,
  Text,
  Divider,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { MdShield } from 'react-icons/md';
import { LuSword } from 'react-icons/lu';
import { GiVisoredHelm } from 'react-icons/gi';

export default function PoolCard({ pool }) {
  const rarityColors = {
    1: '#523b26',
    2: '#265eed',
    3: '#523b26',
    5: '#f2521e',
    6: '#2a8303',
    4: '#3198d6',
  };
  const boxShadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.5)',
    'rgba(255, 255, 255, 0.5)',
  );
  const hoverTransition = 'all 0.25s ease-in-out';

  const icons = {
    1: LuSword,
    2: LuSword,
    3: MdShield,
    4: GiVisoredHelm,
    5: GiVisoredHelm,
    6: GiVisoredHelm,
  };

  const icon = icons[pool.categoryId];

  const background = rarityColors[pool.categoryId] || 'black';
  const gameLogos = {
    1: 'logos/logo_bbg.png',
    2: 'logos/logo_cursed_stone.png',
  };
  const gameLogo = gameLogos[pool.gameId];
  return (
    <Flex
      overflow={'hidden'}
      borderRadius={'10px'}
      border={'0px'}
      background={background}
      direction={'column'}
      maxWidth={250}
      justifyContent={'center'}
      boxShadow={`0px 10px 15px ${boxShadowColor}`}
      transition={hoverTransition}
      _hover={{
        transform: 'scale(1.05)',
      }}
    >
      <Box backgroundColor={'white'} position="relative">
        <Image
          src={pool.imageUrl}
          alt={pool.categoryId}
          width={'100%'}
          transition={hoverTransition}
        />
        <Image
          src={gameLogo}
          alt="game logo"
          position="absolute"
          top={2}
          right={2}
          boxSize={10}
        />
      </Box>
      <Box textAlign="center" p={4}>
        <Icon boxSize={6} as={icon} color={'white'} />
        <Text
          color={'white'}
          fontSize={20}
          fontWeight="bold"
          fontFamily={'Manrope'}
          mb={1}
        >
          {pool.categoryName}
        </Text>
        <Text
          color={'white'}
          fontSize={25}
          fontFamily={'Dela Gothic One'}
          mb={1}
        >
          {pool.rarityName}
        </Text>
      </Box>
    </Flex>
  );
}
