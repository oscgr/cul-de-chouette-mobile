import React from 'react';
import {AsyncStorage, Button, View} from "react-native";

export default class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Connectez-vous',
    };

    render() {
        return (
            <View style={styles.container}>
                <Button title="Connexion" onPress={this._signInAsync} />
            </View>
        );
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
}
