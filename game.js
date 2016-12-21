const FPS = 30;

//movements constants
const TOP_TO_BOTTOM = 1;
const BOTTOM_TO_TOP = -1;
const LEFT_TO_RIGHT = 1;
const RIGHT_TO_LEFT = -1;
const NO_MOVE = 0;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

const NET_LINE_HEIGHT = 10;
const NET_LINE_WIDTH = 5

let canvas;
let context;
let paddleLeftY;
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
  radius: 10,
  speed: 10
};

function setup() {
  canvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ball.diameter = ball.radius * 2;
  paddleLeftY = canvas.height / 2 - PADDLE_HEIGHT/2;

  canvas.addEventListener("mousemove", updatePaddleCoordinates);
}

function updatePaddleCoordinates(event) {
  let coord = getMouseCoordinates(event);
  paddleLeftY = coord.y - PADDLE_HEIGHT/2;
}

function getMouseCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  return {
    x: event.clientX - rect.left - root.scrollLeft,
    y: event.clientY - rect.top - root.scrollTop
  };
}

function drawRect(color, coord) {
  context.fillStyle = color;
  context.fillRect(coord.x, coord.y, coord.width, coord.height);
}

function drawCircle(color, radius, centerCoord) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(centerCoord.x, centerCoord.y, radius, 0, Math.PI * 2, true);
  context.fill();
}

function move() {
  //bouncing the ball, flipping the directions if necessary
  if (ball.position.x < 0 || (ball.position.x + ball.diameter) > canvas.width) {
    //doesn't change if direction is NO_MOVE
    if (ball.direction.x === LEFT_TO_RIGHT)
      ball.direction.x = RIGHT_TO_LEFT;
    else if (ball.direction.x === RIGHT_TO_LEFT)
      ball.direction.x = LEFT_TO_RIGHT;
  }
  if (ball.position.y < 0 || (ball.position.y + ball.diameter) > canvas.height) {
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

  //net
  for (var i = 0; i < canvas.height/NET_LINE_HEIGHT; i += 2) {
    drawRect("white", {
      x: canvas.width/2 - NET_LINE_WIDTH/2,
      y: i * NET_LINE_HEIGHT,
      width: NET_LINE_WIDTH,
      height: NET_LINE_HEIGHT
    });
  }

  //left paddle
  drawRect("white", {
    x: 0,
    y: paddleLeftY,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });

  //right paddle
  drawRect("white", {
    x: canvas.width - PADDLE_WIDTH,
    y: canvas.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });

  //ball
  drawCircle("yellow", ball.radius, {
    x: ball.position.x,
    y: ball.position.y
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
