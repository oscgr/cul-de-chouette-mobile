import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
var io = require('sails.io.js')( require('socket.io-client') );

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {roomsViaFetch: [], roomsViaWS: []};

        io.sails.url = 'https://cul-de-chouette-dev.herokuapp.com';
        //io.sails.connect('https://cul-de-chouette-dev.herokuapp.com/room');

        io.socket.get('/room', (resData) => this.setState({roomsViaWS: resData}));

        fetch('https://cul-de-chouette-dev.herokuapp.com/room')
            .then((response) => response.json())
            .then((responseJson) => this.setState({roomsViaFetch: responseJson}))
            .catch((e) => {
            console.log(e);
        });

        io.socket.on('room', (msg) => {
            console.log(msg);
            if (msg.verb === 'created') {
                this.state.roomsViaWS.push(msg.data);
                this.setState({roomsViaWS: this.state.roomsViaWS});
            } else if (msg.verb === 'destroyed') {
                this.state.roomsViaWS = this.state.roomsViaWS.filter((r) => r.id !== msg.id);
                this.setState({roomsViaWS: this.state.roomsViaWS});
            }
        });
    }


    render() {

        return (
            <View style={styles.container}>
                <Text>Salles via FETCH</Text>

                {this.state.roomsViaFetch.map(room =>
                    <Text key={room.id}>
                        {room.name}
                    </Text>
                )}
                <Text>Salles via SOCKETS</Text>

                {this.state.roomsViaWS.map(room =>
                    <Text key={room.id}>
                        {room.name}
                    </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
