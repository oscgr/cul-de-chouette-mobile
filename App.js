import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/screens/HomeScreen';
import GameScreen from "./components/screens/GameScreen";
import SignInScreen from "./components/screens/SignInScreen";
import AuthLoadingScreen from "./components/screens/AuthLoadingScreen";

const AppStack = createStackNavigator({ Home: HomeScreen, Room: GameScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));