import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StatusBar as RNStatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  Box,
  useColorModeValue,
  useToken,
  useColorMode,
  Spinner,
  HStack,
  Heading,
  Center,
  useToast,
} from 'native-base';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import RootNavigation from './src/navigations/root.navigation';
import {AppContext} from './src/contexts/app.context';

const checkLocation = stopLoading => {
  RNAndroidLocationEnabler?.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  })
    .then(data => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
      if (data === 'enabled' || data === 'already-enabled') {
        // stopLoading();
      }
    })
    .catch(err => {
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
      // codes :
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
      //  - ERR03 : Internal error
      console.log(err);
    });
};

const checkIfBluetoothEnabled = async (
  stopLoading,
  setEnable,
  setConnected,
) => {
  checkLocation();
  try {
    console.log('[checking if bluetooth available]');
    await RNBluetoothClassic.isBluetoothAvailable().then(available => {
      if (available) {
        RNBluetoothClassic.requestBluetoothEnabled().then(async res => {
          setEnable(res);
          if (res) {
            const connected = await RNBluetoothClassic.getConnectedDevices();
            console.log(connected);
            setConnected(connected);
            stopLoading();
          }
        });
      }
    });
  } catch (err) {
    // Handle accordingly
  }
};

const App = () => {
  const toast = useToast();

  const [event, setEvent] = useState({
    enabled: false,
    eventType: 'BLUETOOTH_ENABLED',
    state: 'ENABLED',
  });

  const [connectedDevices, setConnected] = useState([]);

  const [device, setDevice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [lightBg, darkBg] = useToken(
    'colors',
    ['coolGray.50', 'blueGray.900'],
    'blueGray.900',
  );
  const bgColor = useColorModeValue(lightBg, darkBg);

  const {colorMode} = useColorMode();

  const onStateChange = value => {
    setLoading(false);
    setEvent(value);
  };

  useEffect(() => {
    checkIfBluetoothEnabled(
      () => setLoading(false),
      enabled => setEvent({enabled}),
      setConnected,
    );
    const enabledSubscription =
      RNBluetoothClassic.onBluetoothEnabled(onStateChange);

    const disableSubscription =
      RNBluetoothClassic.onBluetoothDisabled(onStateChange);

    const connectSubscription = RNBluetoothClassic.onDeviceConnected(evt =>
      setDevice(evt.device),
    );
    return () => {
      enabledSubscription.remove();
      disableSubscription.remove();
      connectSubscription.remove();
    };
  }, []);

  return (
    <AppContext.Provider value={{event, setDevice, device}}>
      <NavigationContainer
        theme={{
          colors: {background: bgColor},
        }}>
        <RNStatusBar
          backgroundColor={bgColor}
          barStyle={`${colorMode === 'dark' ? 'light' : 'dark'}-content`}
        />
        <Box
          flex={1}
          w="100%"
          _light={{
            bg: 'coolGray.50',
          }}
          _dark={{
            bg: 'blueGray.900',
          }}>
          {!loading ? (
            <RootNavigation />
          ) : (
            <Center h="full">
              <HStack space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                  Loading
                </Heading>
              </HStack>
            </Center>
          )}
        </Box>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
