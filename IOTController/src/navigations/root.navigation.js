import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Home, Device} from '../screens';
import screenConfig from '../config/screen.config';

const Stack = createStackNavigator();

function RootNavigation() {
  return (
    <Stack.Navigator initialRouteName="Kitchensink | NativeBase">
      <Stack.Screen
        name={screenConfig.home}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screenConfig.device}
        component={Device}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigation;
