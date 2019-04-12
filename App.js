import React from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/screens/HomeScreen';
import GameScreen from "./components/screens/GameScreen";
import SignInScreen from "./components/screens/SignInScreen";
import AuthLoadingScreen from "./components/screens/AuthLoadingScreen";

const AppStack = createStackNavigator({ Home: HomeScreen, Room: GameScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

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

// import React from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import { YellowBox } from 'react-native';
// import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
//
//
// const io = require('sails.io.js')( require('socket.io-client') );
//
// const AppStack = createStackNavigator({ Home: HomeScreen, Game: GameScreen });
// const AuthStack = createStackNavigator({ SignIn: SignInScreen });
//
//
// export default class App extends React.Component {
//
//     constructor(props) {
//         super(props);
//
//         console.disableYellowBox = ['Unrecognized WebSocket', 'Setting'];
//         YellowBox.ignoreWarnings([
//             'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
//         ]);
//
//
//         this.state = {roomsViaFetch: [], roomsViaWS: []};
//
//         io.sails.url = 'https://cul-de-chouette-dev.herokuapp.com';
//
//         io.socket.get('/room', (resData) => this.setState({roomsViaWS: resData}));
//
//         fetch('https://cul-de-chouette-dev.herokuapp.com/room')
//             .then((response) => response.json())
//             .then((responseJson) => this.setState({roomsViaFetch: responseJson}))
//             .catch((e) => {
//             console.log(e);
//         });
//
//         io.socket.on('room', (msg) => {
//             console.log(msg);
//             if (msg.verb === 'created') {
//                 this.state.roomsViaWS.push(msg.data);
//                 this.setState({roomsViaWS: this.state.roomsViaWS});
//             } else if (msg.verb === 'destroyed') {
//                 this.state.roomsViaWS = this.state.roomsViaWS.filter((r) => r.id !== msg.id);
//                 this.setState({roomsViaWS: this.state.roomsViaWS});
//             }
//         });
//     }
//
//
//     render() {
//
//         return (
//             <View style={styles.container}>
//                 <Text>Salles via FETCH</Text>
//
//                 {this.state.roomsViaFetch.map(room =>
//                     <Text key={room.id}>
//                         {room.name}
//                     </Text>
//                 )}
//                 <Text>Salles via SOCKETS</Text>
//
//                 {this.state.roomsViaWS.map(room =>
//                     <Text key={room.id}>
//                         {room.name}
//                     </Text>
//                 )}
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
