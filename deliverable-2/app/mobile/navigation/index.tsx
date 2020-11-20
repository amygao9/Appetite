import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import colorTheme from "../constants/Colors";
import {Auth, Home, Preferences} from "../screens";
import {CardDetails} from "../components";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colorTheme.darkGray,
  },
};

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer theme={MyTheme}>
      <RootStackScreen />
    </NavigationContainer>
  );
}


const Stack = createStackNavigator();

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator(); 

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="Preferences" component={Preferences}  options={{ headerShown: false }}/>
      <RootStack.Screen name="CardDetails" component={CardDetails}  options={{ headerShown: false }}/>
    </RootStack.Navigator>
  );
}

