import {Card, Text} from "react-native-elements";
import { View } from 'react-native';
import React from "react";

export default class PlayerCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card
                containerStyle={{backgroundColor: this.props.player.isPlayersTurn ? '#DDD' : '#FFF', margin: 6, padding: 10}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={{flex: 9, fontWeight: 'bold', fontSize: 15}}>{`${this.props.player.username.toUpperCase()} ${this.props.player.id === this.props.data.me.id ? '(vous)' : ''}`}</Text>
                    <Text style={{flex: 3, textAlign: 'right', fontSize: 15}}>{this.props.player.score}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', paddingTop: 20}}>
                    <Text style={{flex: 1, fontSize: 12, textAlign: 'left'}}>C1 : {this.props.player.chouette1}</Text>
                    <Text style={{flex: 1, fontSize: 12, textAlign: 'center'}}>C2 : {this.props.player.chouette2}</Text>
                    <Text style={{flex: 1, fontSize: 12, textAlign: 'right'}}>Cul : {this.props.player.cul}</Text>

                </View>
            </Card>
        )
    }
}
