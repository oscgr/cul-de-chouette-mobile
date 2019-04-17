import React from 'react';
import {AsyncStorage, Button, StatusBar, StyleSheet, View} from "react-native";
import Sails from "../../singletons/SailsIO";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class GameScreen extends React.Component {
    static navigationOptions = {
        title: 'Partie'
    };
    
    constructor(props) {
        super(props);
        this.state = {
            room: null,
            loading: true
        };
        this._fetchRoom();
    }

    render() {

        return (
            <View style={styles.container}>
                <Button title="Déconnexion" onPress={this._signOutAsync} />
                <StatusBar barStyle="default" />
            </View>
        );
    }
    
    _fetchRoom = async () => {
        const { navigation } = this.props;
        const roomId = navigation.getParam('roomId', null);
        
        await Sails.io.get(`/room/${roomId}`, (r) => {
            console.log(r);
            this.setState({room: r, loading: false});
        });
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}
