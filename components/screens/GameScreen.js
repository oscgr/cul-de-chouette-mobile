import React from 'react';
import {ActivityIndicator, AsyncStorage, Button, FlatList, StatusBar, StyleSheet, View} from "react-native";
import Sails from "../../singletons/SailsIO";
import {Card, Input, ListItem, Overlay, Text} from "react-native-elements";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

export default class GameScreen extends React.Component {
    static navigationOptions = {
        title: 'Partie'
    };

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.subbed = false;
        this.state = {
            room: {
                players: []
            },
            roomId: navigation.getParam('roomId', null),
            me: {},
            newPlayerName: '',
            loading: true,
            joiningLoading: false,
            overlayIsVisible: true,
            hasChooseUsername: false

        };
        this._fetchRoom();
    }

    componentDidMount() {
        if (!this.subbed) {
            Sails.io.on(`NEW_PLAYER`, (r) => {
                this.setState(prevState => ({
                    room: {players: [...prevState.room.players, r]}
                }));
                console.log('new player : ' + r.username);
            });
            this.subbed = true;
        }
    }

    componentWillUnmount() {
        Sails.io.removeAllListeners();
    }

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    align: 'center',
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                }}
            />
        );
    };

    render() {

        return (
            <View style={styles.container}>
                <View style={{flex: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {this.state.room.players && this.state.room.players.map(player => {
                        return (
                            <Card title={player.username} containerStyle={{width: '40%'}}>
                            </Card>
                        )
                    })}
                </View>

                {/*<View style={{flex: 10, flexDirection: 'row'}}>*/}
                {/*    <View style={{flex: 1, backgroundColor: '#EEE', borderWidth: 1, borderColor: '#CED0CE'}}>*/}
                {/*        <FlatList*/}
                {/*            data={this.state.room.players}*/}
                {/*            keyExtractor={item => item.id.toString()}*/}
                {/*            ItemSeparatorComponent={this.renderSeparator}*/}
                {/*            ListFooterComponent={this.renderFooter}*/}
                {/*            extraData={this.state}*/}
                {/*            renderItem={({item}) => (*/}
                {/*                <ListItem*/}
                {/*                    roundAvatar*/}
                {/*                    button*/}
                {/*                    title={`${item.username} ${item.id === this.state.me.id ? '(vous)' : ''}`}*/}
                {/*                />*/}
                {/*            )}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*    <View style={{flex: 2, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CED0CE'}}>*/}
                {/*        /!*<StatusBar barStyle="default" />*!/*/}
                {/*        <Text>moi : {this.state.me.username + `(${this.state.me.id})`}</Text>*/}
                {/*        /!*<Button title="Déconnexion" onPress={this._signOutAsync} />*!/*/}

                {/*    </View>*/}
                {/*</View>*/}
                <View style={{flex: 2, flexDirection: 'row'}}>
                    <View style={{flex: 6, backgroundColor: '#FDC007'}}>
                    </View>
                    <View style={{flex: 6, backgroundColor: '#0744fd'}}>
                    </View>
                </View>
                <Overlay
                    isVisible={this.state.overlayIsVisible}
                    onBackdropPress={() => this._leave()}
                    height={120}>
                    <View>
                        <Input
                            containerStyle={{paddingBottom: 15}}
                            placeholder='Pseudo'
                            onChangeText={(newPlayerName) => this.setState({newPlayerName})}
                        />
                        <Button
                            title="Rejoindre"
                            loading={this.state.joiningLoading}
                            onPress={() => {
                                this._join()
                            }}
                        />
                    </View>
                </Overlay>
            </View>
        );
    }

    _fetchRoom = () => {
        Sails.io.get(`/room/${this.state.roomId}/sub`, (r) => {
            this.setState({room: r, loading: false});
        });
    };

    // _signOutAsync = async () => {
    //     await AsyncStorage.clear();
    //     this.props.navigation.navigate('Auth');
    // };

    _join() {
        if (this.state.newPlayerName.length) {
            this.setState({
                joiningLoading: true
            });

            Sails.io.post(`/room/${this.state.roomId}/newPlayer`, {
                username: this.state.newPlayerName,
                room: this.state.roomId
            }, (me) => {
                console.log(me);
                if (me) {
                    this.setState({
                        me,
                        hasChooseUsername: true,
                        joiningLoading: false,
                        overlayIsVisible: false
                    });
                }
            });
        }
    }

    _leave() {
        if (this.state.hasChooseUsername) {
            Sails.io.delete(`/room/${this.state.roomId}/player/${this.state.me.id}`, {});
        }
        this.props.navigation.navigate('Home')
    }
}
