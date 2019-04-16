import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View} from 'react-native';
import {ListItem, SearchBar} from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import SailsIO from "../../singletons/SailsIO";
import AnimatedSvg from "../AnimatedSvg";

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            search: '',
            filteredRooms: [],
            loading: true};
        this._fetchRooms();
    }

    static navigationOptions = {
        title: 'Salles disponibles',
    };

    renderHeader = () => {
        return <SearchBar
            placeholder="Recherche d'une salle..."
            value={this.state.search}
            onChangeText={this._searchRooms}
            lightTheme />;
    };

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
                <Animatable.Text animation="slideInDown" duration={200} direction="alternate">Chargement des salles...</Animatable.Text>
                <ActivityIndicator animating size="large" />
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
                <FlatList
                    data={this.state.filteredRooms}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={({ item }) => (
                        <ListItem
                            roundAvatar
                            button
                            onPress={() => this._navigateToRoom(item)}
                            title={item.name}
                            subtitle={item.players.length.toString() + '/6 joueurs'}
                            leftIcon={{name: item.status === 'ACTIVE' ? 'lock-open' : 'lock'}}
                            chevron={true}
                        />
                    )}
                />
        );
    };

    keyExtractor = (item) => item.id;

    _searchRooms = (s) => {
        let search = s.toUpperCase();
        console.log(search);
        let results = this.state.rooms.filter(r => r.name.toUpperCase().includes(search));
        console.log(results.length);
        this.setState({
            filteredRooms: results,
            search: s
        });

    };


    _navigateToRoom = (room) => {
        console.log('Navigating to room ID #' + room.id);
        this.props.navigation.navigate('Room', {id: room.id});
    };

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

    _fetchRooms = async () => {
        await SailsIO.get('/room', (r) => {
            console.log(r.length);
            this.setState({rooms: r, filteredRooms: r, loading: false});
            return r;
        });
    }
}