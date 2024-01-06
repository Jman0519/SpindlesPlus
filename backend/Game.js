const Player = require('./Player.js');

class Game {
    foods = [];
    players = [];
    size = 100;

    constructor() {
        setInterval(this.addFood.bind(this), 1000);
    }

    addConnection(socket) {
        let player = new Player(this, socket);
        this.players.push(player);
        socket.on('join', (playerName) => {
            player.name = playerName;
            console.log(player.name + " joined the game");
        });
        socket.on('disconnect', () => {
            player.disconnect();
        });
    }

    addFood() {
        this.foods.push(this.randomLocation());
        this.update();
    }

    removeFood(index) {
        this.foods.splice(index, 1);
    }

    update() {
        let bodies = []
        for (let player of this.players) {
            bodies.push(player.body);
        }
        let foods = this.foods;
        let clientGame = { bodies, foods };

        for (let player of this.players) {
            player.socket.emit('update', clientGame);
        }
    }

    randomLocation() {
        return { x: Math.floor(Math.random() * this.size), y: Math.floor(Math.random() * this.size) };
    }
}

module.exports = Game;