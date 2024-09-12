import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import NextLink from 'next/link';
import { HiHome } from 'react-icons/hi';
import { FaWallet } from 'react-icons/fa';
import {
  Link,
  Icon,
  Text,
  Box,
  Flex,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [activeTab, setActiveTab] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const address = useAddress();

  useEffect(() => {
    checkLogin();
  }, []);

  const login = async () => {
    try {
      const loggedIn = await checkLogin();

      if (!loggedIn) await window.SingularityEvent.open();
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const checkLogin = async () => {
    try {
      console.log('checking login');
      const tempUser = await window.SingularityEvent.getConnectUserInfo();
      setUser(tempUser);

      if (tempUser && tempUser.metaData) {
        console.log('user is logged in, user details: ', tempUser.metaData);
        setLoggedIn(true);
        return true;
      }
    } catch (err) {
      console.error(err);
    }

    return false;
  };

  const logout = async () => {
    try {
      await window.SingularityEvent.logout();
      setLoggedIn(false);
    } catch (err) {
      console.error(err);
      window.alert('Some error occured');
    }
  };

  const showAccount = async () => {
    try {
      const loggedIn = await checkLogin();
      if (loggedIn) await window.SingularityEvent.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box maxW={'85%'} m={'auto'} py={'14px'} px={'35px'}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Flex direction={'row'}>
          <Link
            as={NextLink}
            href={'/'}
            mx={2.5}
            fontFamily={'Manrope'}
            fontSize={'22'}
            color={activeTab === '/' ? '#66E383' : undefined}
            textDecoration={activeTab === '/' ? 'underline' : undefined}
            onClick={() => setActiveTab('/')}
            _hover={{
              color: '#66E383',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
          >
            <Icon as={HiHome} boxSize={7} />
          </Link>
          <Link
            as={NextLink}
            color={activeTab === '/pools' ? '#66E383' : undefined}
            textDecoration={activeTab === '/pools' ? 'underline' : undefined}
            onClick={() => setActiveTab('/pools')}
            href={'/pools'}
            mx={2.5}
            fontFamily={'Manrope'}
            fontSize={'22'}
            _hover={{
              color: '#66E383',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
          >
            <Text>Pools</Text>
          </Link>
          <Link
            as={NextLink}
            color={activeTab === '/inventory' ? '#66E383' : undefined}
            textDecoration={
              activeTab === '/inventory' ? 'underline' : undefined
            }
            onClick={() => setActiveTab('/inventory')}
            href={'/inventory'}
            mx={2.5}
            fontFamily={'Manrope'}
            fontSize={'22'}
            _hover={{
              color: '#66E383',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
          >
            <Text>Inventory</Text>
          </Link>
        </Flex>
        <Flex direction={'row'} alignItems={'center'}>
          {loggedIn ? (
            <>
              <Button
                style={{ fontFamily: 'Manrope' }}
                marginRight={3}
                onClick={logout}
              >
                Logout
              </Button>
              <Button style={{ color: 'green' }} onClick={showAccount}>
                <Icon as={FaWallet} boxSize={7} marginRight={2} />
                {user.metaData.userMetaData.name}
              </Button>
            </>
          ) : (
            <Button style={{ fontFamily: 'Manrope' }} onClick={login}>
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
