import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View} from "react-native";
import Sails from "../../singletons/SailsIO";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFC107',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default class AuthLoadingScreen extends React.Component {

    componentDidMount = async () => {
        Sails.init();
        await this.loadApp()
    };
    loadApp = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        this.props.navigation.navigate(userToken ? 'App' : 'Auth')
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

}
