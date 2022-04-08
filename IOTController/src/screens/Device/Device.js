import React, {memo, useContext, useCallback, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Spinner,
  Text,
  useToast,
  VStack,
} from 'native-base';
import usePrevious from '../../hooks/usePrevious';
import {AppContext} from '../../contexts/app.context';

const Device = ({}) => {
  const toast = useToast();
  const {device} = useContext(AppContext);

  const [data, setData] = useState({buttons: {}});

  const previousData = usePrevious(data);

  const onReceive = event => {
    try {
      if (
        JSON.parse(event.data) &&
        JSON.stringify(previousData) !== event.data
      ) {
        if (
          JSON.stringify(previousData) !==
          JSON.stringify(JSON.parse(event.data))
        ) {
          setData(JSON.parse(event.data));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  let receiveSubscription;

  const connect = async d => {
    try {
      if (d) {
        console.log('[connecting to ', d.name, ' ]');
        await d.isConnected().then(async connection => {
          if (!connection) {
            await d
              .connect({
                CONNECTOR_TYPE: 'rfcomm',
                //   DELIMITER: '\n',
                DEVICE_CHARSET: 'utf-8',
                SECURE_SOCKET: false,
              })
              .then(async res => {
                console.log('connection: ', res);
                receiveSubscription = await d.onDataReceived(onReceive);
              })
              .catch(err => console.log('connection Error: ', err));
          } else {
            console.log('[already connected!]');
            receiveSubscription = await d.onDataReceived(onReceive);
          }
        });
      }
    } catch (error) {
      // Handle error accordingly
      toast.show({description: error.message});
      receiveSubscription = await d.onDataReceived(event => {
        console.log('received event: ', event);
      });
    }
  };

  useEffect(() => {
    if (device) {
      console.log('[current paired device]: ', device);
      connect(device);
    }
    return () => {
      receiveSubscription?.remove?.();
    };
  }, []);

  const send = s => async () => {
    await device
      .write(s)
      .then(res => console.log('sended ', res))
      .catch(err => console.log(err));
  };

  //   const read = async () => await device.read().then(res => console.log(res));
  const read = async () =>
    await device
      .available()
      .then(async available => {
        if (available > 0) {
          await device
            .read()
            .then(msg => {
              const message = JSON.parse(msg);
              if (message) {
                console.log(message);
              }
            })
            .catch(err => console.log('err: ', err));
        }
      })
      .catch(err => console.log(err));

  return (
    !!device && (
      <Box>
        <Center py={5}>
          <Heading>{device.name}</Heading>
        </Center>
        <VStack space={2}>
          {Array.isArray(data?.sensors) ? (
            data?.sensors?.map((sensorIndex, index) => {
              return (
                <React.Fragment key={index}>
                  <HStack alignItems="center">
                    <Text mx={5} my={2}>
                      Sensor {index}:
                    </Text>
                    <Text>{sensorIndex}</Text>
                  </HStack>
                  <Divider />
                </React.Fragment>
              );
            })
          ) : (
            <Spinner />
          )}
          {data?.buttons && Object.keys(data?.buttons)?.length ? (
            <>
              <Text mx={5} my={2}>
                Buttons:
              </Text>
              {!!data?.buttons &&
                Object.keys(data?.buttons)?.map(key => {
                  return (
                    <Button key={key} onPress={send(key)} mx={5}>
                      {data.buttons[key]}
                    </Button>
                  );
                })}
            </>
          ) : (
            <Spinner />
          )}
          <Divider />
          {/* <Button onPress={read} mx={5}>
            read
          </Button> */}
        </VStack>
      </Box>
    )
  );
};

export default memo(Device);
