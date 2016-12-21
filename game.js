const FPS = 50;

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
let net = {
  color: "white"
};
let paddles = {
  left: {
    score: 0,
    color: "gray"
  },
  right: {
    score: 0,
    color: "white"
  }
};
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
let paddle; //allow control both side (without AI)

function setup() {
  canvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paddles.left.x = 0;
  paddles.left.y = canvas.height / 2 - PADDLE_HEIGHT/2;
  paddles.right.x = canvas.width - PADDLE_WIDTH;
  paddles.right.y = canvas.height/2 - PADDLE_HEIGHT/2;

  ball.diameter = ball.radius * 2;
  ballReset();

  canvas.addEventListener("mousemove", updatePaddleCoordinates);
}

function updatePaddleCoordinates(event) {
  let coord = getMouseCoordinates(event);
  paddle.y = coord.y - PADDLE_HEIGHT/2;
}

function getMouseCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  return {
    x: event.clientX - rect.left - root.scrollLeft,
    y: event.clientY - rect.top - root.scrollTop
  };
}

function ballReset() {
  flipBallDirectionHorizontally();
  ball.position.x = canvas.width/2 - ball.radius;
  ball.position.y = canvas.height/2 - ball.radius;
}

function flipBallDirectionHorizontally() {
  ball.direction.x = ball.direction.x === LEFT_TO_RIGHT ? RIGHT_TO_LEFT : LEFT_TO_RIGHT;
}

function flipBallDirectionVertically() {
  ball.direction.y = ball.direction.y === TOP_TO_BOTTOM ? BOTTOM_TO_TOP : TOP_TO_BOTTOM;
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

function hasCollisionWithPaddle(paddle) {
  return ((ball.position.y >= paddle.y) &&
          (ball.position.y <= (paddle.y + PADDLE_HEIGHT)) &&
          ((ball.position.x - ball.radius <= PADDLE_WIDTH) ||
           (ball.position.x + ball.radius >= paddles.right.x)));
}

function isOnTopEdge() {
  return ball.position.y - ball.radius <= 0;
}

function isOnBottomEdge() {
  return ball.position.y + ball.radius >= canvas.height;
}

function isOneEdgeVertically() {
  return isOnTopEdge() || isOnBottomEdge();
}

function isOutOfBoundsOnLeft() {
  return ball.position.x < 0;
}

function isOutOfBoundsOnRight() {
  return ball.position.x > canvas.width;
}

function isOutOfBounds() {
  return isOutOfBoundsOnLeft() || isOutOfBoundsOnRight();
}

function move() {
  //bouncing the ball, flipping the directions if necessary
  if (hasCollisionWithPaddle(paddles.left) || hasCollisionWithPaddle(paddles.right)) {
    flipBallDirectionHorizontally();
  } else if (isOutOfBounds()) {
      if (isOutOfBoundsOnLeft()) {
        paddles.right.score++;
      } else {
        paddles.left.score++;
      }
      flipBallDirectionHorizontally();
      ballReset();
  }
  if (isOneEdgeVertically()) {
    flipBallDirectionVertically();
  }
  ball.position.x += ball.speed * ball.direction.x;
  ball.position.y += ball.speed * ball.direction.y;

  //choosing the paddle to control (temporary)
  paddle = ball.position.x <= canvas.width/2 ? paddles.left : paddles.right;
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
    drawRect(net.color, {
      x: canvas.width/2 - NET_LINE_WIDTH/2,
      y: i * NET_LINE_HEIGHT,
      width: NET_LINE_WIDTH,
      height: NET_LINE_HEIGHT
    });
  }

  //left paddle
  drawRect(paddles.left.color, {
    x: paddles.left.x,
    y: paddles.left.y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });

  //right paddle
  drawRect(paddles.right.color, {
    x: paddles.right.x,
    y: paddles.right.y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });

  //ball
  drawCircle("yellow", ball.radius, {
    x: ball.position.x,
    y: ball.position.y
  });

  //Keeps the score on console (temporary)
  console.log("LEFT: " + paddles.left.score);
  console.log("RIGHT: " + paddles.right.score);
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
