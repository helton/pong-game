const FPS = 30;

//movements constants
const TOP_TO_BOTTOM = 1;
const BOTTOM_TO_TOP = -1;
const LEFT_TO_RIGHT = 1;
const RIGHT_TO_LEFT = -1;
const NO_MOVE = 0;

const PADDLE_LENGTH = 100;
const PADDLE_WIDTH = 10;

let canvas;
let context;
let ball = {
  color: "yellow",
  position: {
    x: 50,
    y: 0
  },
  direction: {
    x: LEFT_TO_RIGHT,
    y: TOP_TO_BOTTOM
  },
  size: 20,
  speed: 10
};

function setup() {
  canvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawRect(color, coord) {
  context.fillStyle = color;
  context.fillRect(coord.x, coord.y, coord.width, coord.height);
}

function move() {
  //bouncing the ball, flipping the directions if necessary
  if (ball.position.x < 0 || (ball.position.x + ball.size) > canvas.width) {
    //doesn't change if direction is NO_MOVE
    if (ball.direction.x === LEFT_TO_RIGHT)
      ball.direction.x = RIGHT_TO_LEFT;
    else if (ball.direction.x === RIGHT_TO_LEFT)
      ball.direction.x = LEFT_TO_RIGHT;
  }
  if (ball.position.y < 0 || (ball.position.y + ball.size) > canvas.height) {
    //doesn't change if direction is NO_MOVE
    if (ball.direction.y === TOP_TO_BOTTOM)
      ball.direction.y = BOTTOM_TO_TOP;
    else if (ball.direction.y === BOTTOM_TO_TOP)
      ball.direction.y = TOP_TO_BOTTOM;
  }
  ball.position.x += ball.speed * ball.direction.x;
  ball.position.y += ball.speed * ball.direction.y;
}

function draw() {
  //screen background
  drawRect("black", {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
  });

  //middle line
  drawRect("white", {
    x: canvas.width/2,
    y: 0,
    width: 1,
    height: canvas.height
  });

  //left paddle
  drawRect("white", {
    x: 0,
    y: canvas.height/2 - PADDLE_LENGTH/2,
    width: PADDLE_WIDTH,
    height: PADDLE_LENGTH
  });

  //right paddle
  drawRect("white", {
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height/2 - PADDLE_LENGTH/2,
    width: PADDLE_WIDTH,
    height: PADDLE_LENGTH
  });

  //ball
  drawRect(ball.color, {
    x: ball.position.x,
    y: ball.position.y,
    width: ball.size,
    height: ball.size
  });
}

function update() {
  move();
  draw();
}

function run() {
  setup();
  update();
  setInterval(update, 1000 / FPS);
}

window.onload = run;
