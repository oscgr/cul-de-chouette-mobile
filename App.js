import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/screens/HomeScreen';
import GameScreen from "./components/screens/GameScreen";
import SignInScreen from "./components/screens/SignInScreen";
import AuthLoadingScreen from "./components/screens/AuthLoadingScreen";

const AppStack = createStackNavigator({ Home: HomeScreen, Room: GameScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

console.ignoredYellowBox = ['Unrecognized WebSocket'];

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