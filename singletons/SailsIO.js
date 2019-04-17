const io = require('sails.io.js')( require('socket.io-client') );

export default class Sails {
    static init() {
        io.sails.url = 'https://cul-de-chouette-dev.herokuapp.com';
        this.io = io.socket;
    }
}