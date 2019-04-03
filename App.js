import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
var io = require('sails.io.js')( require('socket.io-client') );

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {rooms: []};


        // var ws = new WebSocket('wss://cul-de-chouette-dev.herokuapp.com/socket.io/?__sails_io_sdk_version=1.1.4&__sails_io_sdk_platform=node&__sails_io_sdk_language=javascript&EIO=3&transport=websocket');


        fetch('https://cul-de-chouette-dev.herokuapp.com/room')
            .then((response) => response.json())
            .then((responseJson) => this.setState({rooms: responseJson}))
            .catch((e) => {
            console.log(e);
        });
    }


    render() {

        return (
            <View style={styles.container}>
                <Text>DEVELOP BRANCH</Text>

                {this.state.rooms.map(room =>
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
