class Player {
    game = undefined;
    socket = undefined;
    name = "";
    body = [];
    moveInterval = undefined;
    direction = 0;
    moving = 0;

    constructor(game, socket) {
        this.game = game;
        this.socket = socket;
        this.socket.on('direction', this.setDirection.bind(this));
        this.body.push(this.game.randomLocation());
        this.updateMoveSpeed();
    }

    setDirection(direction) {
        if (this.moving != (direction + 2) % 4) {
            this.direction = direction;
        }
    }

    reset() {
        this.body = [];
        this.body.push(this.game.randomLocation());
        this.updateMoveSpeed();
    }

    move() {
        this.moving = this.direction
        let newPosition = {
            x: this.body[this.body.length - 1].x + directions[this.direction].dx,
            y: this.body[this.body.length - 1].y + directions[this.direction].dy
        };

        // if dead
        if (this.wouldDie(newPosition)) {
            this.reset();
            return;
        }

        // in all cases
        this.body.push(newPosition);

        // if did not eat food
        let numFoods = 0;
        for (let i = 0; i < this.game.foods.length; i++) {
            let food = this.game.foods[i];
            if (food.x == newPosition.x && food.y == newPosition.y) {
                this.game.removeFood(i);
                numFoods++;
            }
        }

        if (numFoods == 0) {
            this.removeTail();
        }
        else {
            this.updateMoveSpeed();
        }

        this.game.update();
    }

    removeTail() {
        this.body.shift();
    }

    disconnect() {
        clearInterval(this.moveInterval);
        let index = this.game.players.findIndex((player) => player.name == this.name);
        this.game.players.splice(index, 1);
    }

    updateMoveSpeed() {
        clearInterval(this.moveInterval);
        let interval = (this.body.length * 10) + 50;
        // let interval = (10 / (this.body.length + 1)) + 100;
        this.moveInterval = setInterval(this.move.bind(this), interval);
    }

    wouldDie(position) {
        if (position.x < 0 || position.x >= this.game.size || position.y < 0 || position.y >= this.game.size) {
            return true;
        }

        for (let player of this.game.players) {
            for (let segment of player.body) {
                if (segment.x == position.x && segment.y == position.y) {
                    return true;
                }
            }
        }

        return false;
    }
}

directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: -1 }
];

module.exports = Player;