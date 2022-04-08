import React, {useMemo, useContext, useState} from 'react';
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  IconButton,
  Button,
  MoonIcon,
  SunIcon,
  Text,
  useColorMode,
  VStack,
  Stack,
  Input,
  Icon,
  ArrowBackIcon,
} from 'native-base';
import {AppContext} from '../../contexts/app.context';
import ScanView from './components/ScanView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Mode = 'none' | 'bluetooth' | 'wifi';

const SectionButton = props => (
  <Button style={{width: '30%', margin: 10}} {...props} />
);

const BluetoothView = () => {
  const {event} = useContext(AppContext);

  return event.enabled ? (
    <ScanView />
  ) : (
    <VStack>
      <Center>
        <Center height="full">
          <Text>Please Enable Bluetooth in order to use the app</Text>
        </Center>
      </Center>
    </VStack>
  );
};

const WifiView = () => {
  return (
    <Stack
      h="full"
      space={4}
      w="100%"
      alignItems="center"
      justifyContent="center">
      <Input
        w={{
          base: '75%',
          md: '25%',
        }}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="person" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Name"
      />
      <Input
        w={{
          base: '75%',
          md: '25%',
        }}
        InputRightElement={
          <Icon
            as={<MaterialIcons name="visibility-off" />}
            size={5}
            mr="2"
            color="muted.400"
          />
        }
        placeholder="Password"
      />
    </Stack>
  );
};

const ViewChooser = ({mode, setMode}) => {
  switch (mode) {
    case 'wifi':
      return <WifiView />;
    case 'bluetooth':
      return <BluetoothView />;
    case 'none':
    default:
      return (
        <Box flex={1} flexGrow={1} alignItems="center" justifyContent="center">
          <HStack>
            <SectionButton
              leftIcon={<Icon as={<MaterialIcons name="bluetooth" />} />}
              onPress={() => setMode('bluetooth')}>
              Bluetooth
            </SectionButton>
            <SectionButton
              leftIcon={<Icon as={<MaterialIcons name="wifi" />} />}
              onPress={() => setMode('wifi')}>
              wifi
            </SectionButton>
          </HStack>
        </Box>
      );
  }
};

function Home() {
  const {colorMode, toggleColorMode} = useColorMode();
  const [mode, setMode] = useState('none');

  const ThemeIcon = useMemo(
    () => (colorMode === 'dark' ? SunIcon : MoonIcon),
    [colorMode],
  );

  return (
    <Box pt={6} h="full">
      <HStack alignItems="center" space={6} py={4} px={3} mx={2}>
        <Heading p={3} pl={0} style={{flexGrow: 1}}>
          IOT Controller
        </Heading>
        {mode !== 'none' && (
          <IconButton
            icon={<ArrowBackIcon />}
            onPress={() => setMode('none')}
          />
        )}
        <IconButton icon={<ThemeIcon />} onPress={toggleColorMode} />
      </HStack>
      <Divider opacity={colorMode == 'dark' ? '0.4' : '1'} />
      <ViewChooser mode={mode} setMode={setMode} />
      <Center>
        <Text fontSize={11} pb={2}>
          Hadi Houssainy@2022
        </Text>
      </Center>
    </Box>
  );
}

export default Home;
