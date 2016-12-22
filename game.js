const FPS = 50;

//movements constants
const TOP_TO_BOTTOM = 1;
const BOTTOM_TO_TOP = -1;
const LEFT_TO_RIGHT = 1;
const RIGHT_TO_LEFT = -1;
const NO_MOVE = 0;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE_VELOCITY = 8;
const PADDLE_PROXIMITY_PERCENTAGE = 75;
const PADDLE_DEFLECTION_PERCENTAGE = 35; //percentage

const NET_LINE_HEIGHT = 10;
const NET_LINE_WIDTH = 5

let canvas;
let context;
let net = {
  color: "white"
};
let paddles = {
  left: {
    color: "gray"
  },
  right: {
    color: "white"
  }
};
let ball = {
  color: "yellow",
  position: {
    x: 0,
    y: 0
  },
  direction: {
    x: LEFT_TO_RIGHT,
    y: TOP_TO_BOTTOM
  },
  radius: 10,
  speed: {
    x: 10,
    y: 10
  }
};
let score = {
  left: {
    x: 0,
    y: 0,
    value: 0
  },
  right: {
    x: 0,
    y: 0,
    value: 0
  },
  color: "yellow",
  font: "15px Monaco"
};

function setup() {
  canvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  paddles.left.x = 0;
  paddles.left.y = canvas.height / 2 - PADDLE_HEIGHT/2;
  paddles.right.x = canvas.width - PADDLE_WIDTH;
  paddles.right.y = canvas.height/2 - PADDLE_HEIGHT/2;

  score.left.x = canvas.width / 4;
  score.left.y = canvas.height / 4;
  score.right.x = 3 * canvas.width / 4;
  score.right.y = canvas.height / 4;

  ball.diameter = ball.radius * 2;
  ballReset();

  canvas.addEventListener("mousemove", updatePaddleCoordinates);
}

function updatePaddleCoordinates(event) {
  let coord = getMouseCoordinates(event);
  paddles.left.y = coord.y - PADDLE_HEIGHT/2;
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

function drawText(color, font, text, coord) {
  context.fillStyle = color;
  context.font = font;
  context.fillText(text, coord.x, coord.y);
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

function moveRightPaddle() {
  const paddleRightCenter = paddles.right.y + PADDLE_HEIGHT/2;
  const paddleSpan = PADDLE_HEIGHT * ((100 - PADDLE_PROXIMITY_PERCENTAGE) / 100); //defines how to much closer should the paddle be without chasing the ball
  if (paddleRightCenter < ball.position.y - paddleSpan) {
    paddles.right.y += PADDLE_VELOCITY;
  } else if (paddleRightCenter > ball.position.y + paddleSpan) {
    paddles.right.y -= PADDLE_VELOCITY;
  }
}

function moveBall() {
  ball.position.x += ball.speed.x * ball.direction.x;
  ball.position.y += ball.speed.y * ball.direction.y;
}

function checkCollision() {
  if (hasCollisionWithPaddle(paddles.left) || hasCollisionWithPaddle(paddles.right)) {
    if (hasCollisionWithPaddle(paddles.left)) {
      const delta = ball.position.y - (paddles.left.position.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
    } else {
      const delta = ball.position.y - (paddles.right.position.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
    }
    flipBallDirectionHorizontally();
  } else if (isOutOfBounds()) {
      if (isOutOfBoundsOnLeft()) {
        score.right.value++;
      } else {
        score.left.value++;
      }
      flipBallDirectionHorizontally();
      ballReset();
  }
  if (isOneEdgeVertically()) {
    flipBallDirectionVertically();
  }
}

function move() {
  moveBall();
  moveRightPaddle();
  checkCollision();
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

  //score
  drawText(score.color, score.font, "Score: " + score.left.value, {
    x: score.left.x,
    y: score.left.y
  });
  drawText(score.color, score.font, "Score: " + score.right.value, {
    x: score.right.x,
    y: score.right.y
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
