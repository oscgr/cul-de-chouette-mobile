import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, View, Dimensions} from "react-native";
import Sails from "../../singletons/SailsIO";
import {Input, Overlay, Button, Text} from "react-native-elements";
import PlayerCard from "../PlayerCard";

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
            roomId: navigation.getParam('roomId', null),
            room: {
                players: []
            },
            me: {},
            newPlayerName: '',
            loading: true,
            readOnly: true,
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

            Sails.io.on(`PLAYER_LEFT`, (r) => {
                let players = this.state.room.players.filter(p => p.id !== r.playerDeleted.id);
                this.setState({room: {players}});
                console.log('player left : ' + r.playerDeleted.username);
                if (r.newPlayersTurn) {
                    let room = this.state.room;
                    room.players.find(p => p.id === r.newPlayersTurn.id).isPlayersTurn = true;
                    this.setState({room});
                    console.log('player turn changed to : ' + r.newPlayersTurn.username);
                    if (r.newPlayersTurn.order === 1) {
                        let room = this.state.room;
                        room.turn = room.turn + 1;
                        this.setState({room});
                        console.log('New turn');
                    }
                }
            });

            Sails.io.on(`PLAYER_WON`, (r) => {
                // Notify
                this.props.navigation.navigate('Home')
            });
            Sails.io.on(`PLAYER_ACTION`, (r) => {
                let players = this.state.room.players.map(player => {
                    if (player.id === r.player.id) {
                        if (r.action === 'THROW_CHOUETTES') {
                            player.chouette1 = r.payload.chouette1;
                            player.chouette2 = r.payload.chouette2;
                        } else if (r.action === 'THROW_CUL') {
                            player.isPlayersTurn = false;
                            player.score = r.payload.score;
                            player.cul = r.payload.cul;
                        }
                    } else if (r.action === 'THROW_CUL' && player.id === r.payload.newPlayersTurn.id) {
                        player.isPlayersTurn = true;
                    }
                    return player;
                });
                this.setState(prevState => ({
                        room: {
                            turnCount: ((r.payload.newPlayersTurn && r.payload.newPlayersTurn.order === 1) ? prevState.room.turnCount + 1 : prevState.room.turnCount),
                            players
                        }
                    }
                ));
            });
            this.subbed = true;
        }
    }

    componentWillUnmount() {
        Sails.io.removeAllListeners();
        this._leave();
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

                <View style={{flex: 11}}>
                    <FlatList
                        data={this.state.room.players}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        extraData={this.state}
                        renderItem={({item}) => (
                            <View style={{width: Dimensions.get('window').width / 2}}>
                                <PlayerCard
                                    player={item}
                                    data={this.state}
                                />
                            </View>
                        )}
                    />
                </View>
                {!this.state.readOnly && (
                    <View style={{flex: 2, flexDirection: 'row'}}>
                        <View style={{flex: 1, margin: 5}}>
                            <Button
                                containerStyle={{flex: 1}}
                                title="LANCER LES CHOUETTES"
                                type="clear"
                                disabled={!this._isMyTurn()}
                                onPress={() => this._throwChouettes()}/>
                        </View>
                        <View style={{flex: 1, margin: 5}}>
                            <Button
                                containerStyle={{flex: 1}}
                                title="LANCER LE CUL"
                                type="clear"
                                disabled={!this._isMyTurn()}
                                onPress={() => this._throwCul()}/>
                        </View>
                    </View>
                )}
                <Overlay
                    isVisible={this.state.overlayIsVisible && !this.state.readOnly}
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
                            onPress={() => this._join()}
                        />
                    </View>
                </Overlay>
            </View>
        );
    }

    _fetchRoom = () => {
        Sails.io.get(`/room/${this.state.roomId}/sub`, (r) => {
            if (r) {
                this.setState({room: r, loading: false, readOnly: r.players > 6});
            } else {
                console.log('room doesnt exist anymore');
                // Notify
                this.props.navigation.navigate('Home');
            }
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
            Sails.io.delete(`/room/${this.state.roomId}/player/${this.state.me.id}`, {}, () => {
                console.log('deleted player ' + this.state.me.id);
            });
        }
        this.props.navigation.navigate('Home')
    }

    _isMyTurn() {
        return this.state.room.players.some(p => p.isPlayersTurn && p.id === this.state.me.id);
    }

    _throwChouettes() {
        if (this.state.me.chouette1 === 0) {
            Sails.io.post(`/room/${this.state.roomId}/player/${this.state.me.id}/action`, {
                action: 'THROW_CHOUETTES'
            }, (r) => {
                let me = this.state.me;
                me.chouette1 = r.chouette1;
                me.chouette1 = r.chouette2;
                this.setState({me})
            });
        }
    }

    _throwCul() {
        if (this.state.me.chouette1 > 0) {
            Sails.io.post(`/room/${this.state.roomId}/player/${this.state.me.id}/action`, {
                action: 'THROW_CUL'
            }, () => {
                // Notify
                let me = this.state.me;
                me.chouette1 = 0;
                me.chouette1 = 0;
                this.setState({me})
            });

        }
    }
}
