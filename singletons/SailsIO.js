const io = require('sails.io.js')( require('socket.io-client') );

export default class SailsIO {
    static init() {
        io.sails.url = 'https://cul-de-chouette-dev.herokuapp.com';
    }

    static async get(uri, cb) {
         await io.socket.get(uri, cb);
    }
}