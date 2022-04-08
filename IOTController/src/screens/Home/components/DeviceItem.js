import React, {memo} from 'react';
import {
  Box,
  Divider,
  Heading,
  HStack,
  Pressable,
  Text,
  VStack,
} from 'native-base';

type DeviceItemProp = {
  name: String,
  id: String,
  isBonded: Boolean,
  onSelect: () => void,
};

const DeviceItem = ({name, id, isBonded, onSelect}: DeviceItemProp) => {
  return (
    <Box w="80">
      <Pressable onPress={onSelect}>
        {({isPressed}) => (
          <Box
            width="100%"
            p={5}
            //   mt={3}
            borderColor="primary.500"
            borderWidth={1}
            rounded="8"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}>
            <VStack>
              <Heading>{name}</Heading>
              <Divider />
              <HStack>
                <Text>{id} - </Text>
                <Text color={isBonded ? 'green.500' : 'red.500'}>
                  {isBonded ? 'bonded' : 'not bonded'}
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}
      </Pressable>
    </Box>
  );
};

export default memo(DeviceItem);
