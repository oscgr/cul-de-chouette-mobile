import React from 'react';
import {ActivityIndicator, AsyncStorage, StyleSheet, View} from "react-native";
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
        const user = await AsyncStorage.getItem('user');

        if (user) {
            const fetchedUser = Sails.io.get(`user/${user.id}`);
            console.log(user);
        }

        this.props.navigation.navigate(user ? 'App' : 'Auth')
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
