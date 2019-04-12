import React from 'react';
import {AsyncStorage, Button, StatusBar, StyleSheet, View} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class GameScreen extends React.Component {
    static navigationOptions = {
        title: 'Partie',
    };

    render() {
        return (
            <View style={styles.container}>
                <Button title="Déconnexion" onPress={this._signOutAsync} />
                <StatusBar barStyle="default" />
            </View>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}
