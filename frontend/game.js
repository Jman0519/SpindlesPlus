let socket = io();

window.onload = main;
let sizeOfMap = 100;
let zoom = 1;

function main() {
    let emptyGame = { bodies: [], foods: [] };
    let gameDiv = document.getElementById('gameDiv');

    let canvas = document.createElement('canvas');
    let aspectRatio = 1;
    let minDimension = window.innerHeight;
    if (window.innerWidth < minDimension) {
        minDimension = window.innerWidth;
    }
    canvas.width = minDimension * aspectRatio;
    canvas.height = minDimension;
    zoom = canvas.width / sizeOfMap;

    gameDiv.appendChild(canvas);
    let ctx = canvas.getContext('2d');
    drawGame(emptyGame, ctx);

    let playerName = sessionStorage.name;
    socket.emit('join', playerName);

    window.addEventListener('keydown', (event) => {
        let newDirection = 0;
        if (event.key == 'ArrowRight' || event.key == "d") {
            newDirection = 0;
        } else if (event.key == 'ArrowDown' || event.key == "s") {
            newDirection = 1;
        } else if (event.key == 'ArrowLeft' || event.key == "a") {
            newDirection = 2;
        } else if (event.key == 'ArrowUp' || event.key == "w") {
            newDirection = 3;
        }
        socket.emit('direction', newDirection);
    });

    socket.on('update', (game) => {
        drawGame(game, ctx);
    });
}

function drawGame(game, ctx) {
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawSnake(game.bodies, ctx);
    drawFood(game.foods, ctx);
}

function drawSnake(bodies, ctx) {
    ctx.fillStyle = 'red';
    for (let body of bodies) {
        for (let segment of body) {
            ctx.beginPath();
            ctx.rect(segment.x * zoom, segment.y * zoom, 1 * zoom, 1 * zoom);
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawFood(foods, ctx) {
    ctx.fillStyle = 'green';
    for (let food of foods) {
        ctx.beginPath();
        ctx.arc(food.x * zoom + zoom / 2, food.y * zoom + zoom / 2, zoom / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}