import { VStack, Flex, Box, Image, Text } from '@chakra-ui/react';
import { Fade } from 'react-awesome-reveal';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';

export default function Home() {
  return (
    <Box>
      <VStack
        bgGradient="linear(to-r, #000000, #0C4200)"
        backgroundImage={'images/abstract.png'}
        minH="100vh"
        justify="center"
        align="center"
      >
        <Fade direction="up" triggerOnce>
          <Text
            fontSize="7xl"
            fontFamily={'Dela Gothic One'}
            color={'#FFFFFF'}
            fontWeight="bold"
            textAlign="center"
          >
            Unleash the power of
          </Text>
        </Fade>
        <Fade direction="down" delay={500} triggerOnce>
          <Text
            fontSize="8xl"
            fontFamily={'Dela Gothic One'}
            color={'#FFFFFF'}
            textAlign="center"
          >
            NFTs
          </Text>
        </Fade>
      </VStack>
      <VStack marginTop={'80px'} minH={'50vh'}>
        <Flex
          direction={['column', 'row']}
          justify="center"
          align="center"
          p={10}
          color="white"
        >
          <Box flex="1" p={5}>
            <Image
              src="images/casino.jpg"
              alt="NFT Image"
              height={'480px'}
              borderRadius="40"
              sx={{ filter: 'grayscale(100%)' }}
            />
          </Box>
          <Box flex="1" p={5}>
            <Text
              fontSize="4xl"
              fontFamily={'Dela Gothic One'}
              fontWeight="bold"
              color={'black'}
            >
              Dive into pool-based NFT renting
            </Text>
            <Text
              marginTop={'15px'}
              fontFamily={'Manrope'}
              fontSize="xl"
              color={'black'}
            >
              Put your NFTs into our specially curated pools, making them
              available for rent by fellow gamers looking to unlock new
              experiences.
            </Text>
          </Box>
        </Flex>
      </VStack>
      <VStack minH={'50vh'} marginBottom={'80px'}>
        <Flex
          direction={['column', 'row']}
          justify="center"
          align="center"
          p={10}
          color="white"
        >
          <Box flex="1" p={5}>
            <Text
              fontSize="4xl"
              fontFamily={'Dela Gothic One'}
              fontWeight="bold"
              color={'black'}
            >
              Improve your in-game performance
            </Text>
            <Text
              marginTop={'15px'}
              fontFamily={'Manrope'}
              fontSize="xl"
              color={'black'}
            >
              Rent NFTs from our platform and amplify your in-game prowess with
              unparalleled access to the item you have always wanted.
            </Text>
          </Box>
          <Box flex="1" p={5}>
            <Image
              sx={{ filter: 'grayscale(100%)' }}
              src="images/playing.jpg"
              alt="Playing game"
              height={'480px'}
              borderRadius="40"
            />
          </Box>
        </Flex>
      </VStack>
      <FAQ />
      <Footer />
    </Box>
  );
}
