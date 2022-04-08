import React, {memo, useState, useCallback, useContext, useEffect} from 'react';
import {PermissionsAndroid, ScrollView} from 'react-native';
import {
  Box,
  Button,
  ChevronRightIcon,
  Heading,
  Pressable,
  Text,
  useToast,
  VStack,
} from 'native-base';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

import DeviceItem from './DeviceItem';
import {AppContext} from '../../../contexts/app.context';
import {useNavigation} from '@react-navigation/native';
import screenConfig from '../../../config/screen.config';

const requestAccessFineLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access fine location required for discovery',
      message:
        'In order to perform discovery, you must enable/allow ' +
        'fine location access.',
      buttonNeutral: 'Ask Me Later"',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const ScanView = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);

  const {setDevice} = useContext(AppContext);

  const scan = useCallback(async () => {
    let tmp = {unpaired: [], paired: []};
    try {
      let granted = await requestAccessFineLocationPermission();

      if (!granted) {
        throw new Error('Access fine location was not granted');
      }

      setLoading(true);

      try {
        let unpaired = await RNBluetoothClassic.startDiscovery();
        let paired = await RNBluetoothClassic.getBondedDevices();

        tmp = {unpaired, paired};
      } finally {
        setLoading(false);
        setDevices(tmp);
      }
    } catch (err) {
      setLoading(false);
      setDevices(tmp);
      toast.show({description: err.message});
    }
  }, [setLoading, setDevices, toast]);

  useEffect(() => {
    scan();
  }, []);

  const [showPaired, setShowPaired] = useState(false);

  const toggleShowPaired = useCallback(() => {
    setShowPaired(old => !old);
  }, []);

  const navigation = useNavigation();

  return (
    <Box alignItems="center" px={2} pt={5}>
      <Button isLoading={loading} width="full" onPress={scan}>
        Scan for devices
      </Button>
      <Button
        mt={2}
        variant="ghost"
        w="full"
        endIcon={<ChevronRightIcon size="sm" />}
        onPress={toggleShowPaired}>
        {`show ${showPaired ? 'paired' : 'unpaired'} devices`}
      </Button>
      <ScrollView style={{height: 400, paddingVertical: 5}}>
        <VStack space={4} alignItems="center">
          {devices?.[!showPaired ? 'paired' : 'unpaired']?.map(device => {
            const handleSelect = () => {
              if (loading) {
                return;
              }
              if (!device.bonded) {
                RNBluetoothClassic.pairDevice(device.address)
                  .then(res => {
                    console.log(res);
                    if (res) {
                      setDevice(device);
                      navigation.navigate(screenConfig.device);
                    }
                  })
                  .catch(err => {
                    setDevice(null);
                    console.log(err);
                    toast.show({description: err.message});
                  });
              } else {
                setDevice(device);
                navigation.navigate(screenConfig.device);
              }
              //   scan();
            };
            return (
              <DeviceItem
                name={device.name}
                id={device.id}
                key={device.id}
                isBonded={device.bonded}
                onSelect={handleSelect}
              />
            );
          })}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default memo(ScanView);
