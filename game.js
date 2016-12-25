const FPS = 50;

//movements constants
const TOP_TO_BOTTOM = 1;
const BOTTOM_TO_TOP = -1;
const LEFT_TO_RIGHT = 1;
const RIGHT_TO_LEFT = -1;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE_VELOCITY = 10; //pixels
const PADDLE_PROXIMITY_PERCENTAGE = 75; //percentage - how close should the right paddle be before moving
const PADDLE_DEFLECTION_PERCENTAGE = 35; //percentage

const WINNING_SCORE = 10; //points
const INITIAL_BALL_SPEED = 5;
const VELOCITY_INCREASE_RATE = 0.1;

let canvas;
let context;
let net = {
  color: "white",
  segment: {
    height: 10,
    width: 5
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
    x: INITIAL_BALL_SPEED,
    y: INITIAL_BALL_SPEED
  }
};
let players = {
  left: {
    paddle: {
      position: {
        x: 0,
        y: 0
      },
      color: "grey"
    },
    name: {
      value: "You",
      position: {
        x: 0,
        y: 0
      },
      color: "white",
      font: "15px Monaco"
    },
    score: {
      value: 0,
      position: {
        x: 0,
        y: 0
      },
      color: "white",
      font: "30px Monaco"
    },
    winner: false
  },
  right: {
    paddle: {
      position: {
        x: 0,
        y: 0
      },
      color: "white"
    },
    name: {
      value: "Computer",
      position: {
        x: 0,
        y: 0
      },
      color: "white",
      font: "15px Monaco"
    },
    score: {
      value: 0,
      position: {
        x: 0,
        y: 0
      },
      color: "white",
      font: "30px Monaco"
    },
    winner: false
  }
};
let screen = {
  default: {
    color: "black"
  },
  winner: {
    color: "white",
    font: "50px Monaco"
  }
};
let showingWinScreen = false;

function setup() {
  canvas = document.getElementById("gameCanvas");
  context = gameCanvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  players.left.paddle.position.x = 0;
  players.left.paddle.position.y = canvas.height / 2 - PADDLE_HEIGHT/2;
  players.right.paddle.position.x = canvas.width - PADDLE_WIDTH;
  players.right.paddle.position.y = canvas.height/2 - PADDLE_HEIGHT/2;

  players.left.score.position.x  = 1/4 * canvas.width;
  players.left.score.position.y  = 1/8 * canvas.height;
  players.right.score.position.x = 3/4 * canvas.width;
  players.right.score.position.y = 1/8 * canvas.height;

  players.left.name.position.x  = 1/4 *  canvas.width;
  players.left.name.position.y  = 7/8 * canvas.height;
  players.right.name.position.x = 3/4 * canvas.width;
  players.right.name.position.y = 7/8 * canvas.height;

  ball.diameter = ball.radius * 2;
  ballReset();

  canvas.addEventListener("mousemove", updatePaddleCoordinates);
  canvas.addEventListener("mousedown", () => showingWinScreen = false);
}

function updatePaddleCoordinates(event) {
  let coord = getMouseCoordinates(event);
  players.left.paddle.position.y = coord.y - PADDLE_HEIGHT/2;
}

function getMouseCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  return {
    x: event.clientX - rect.left - root.scrollLeft,
    y: event.clientY - rect.top - root.scrollTop
  };
}

function checkWinner() {
  if (players.left.score.value >= WINNING_SCORE || players.right.score.value >= WINNING_SCORE) {
   [players.left.winner, players.right.winner] = [players.left.score.value >= WINNING_SCORE, players.right.score.value >= WINNING_SCORE];
   [players.left.score.value, players.right.score.value] = [0, 0];
   showingWinScreen = true;
  }
}

function ballReset() {
  ball.position.x = canvas.width/2;
  ball.position.y = canvas.height/2;
  [ball.speed.x, ball.speed.y] = [INITIAL_BALL_SPEED, INITIAL_BALL_SPEED];
  checkWinner();
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
  context.textAlign = "center";
  context.fillText(text, coord.x, coord.y);
}

function move() {
  if (showingWinScreen)
    return;

  //moving ball
  ball.position.x += ball.speed.x * ball.direction.x;
  ball.position.y += ball.speed.y * ball.direction.y;

  //right paddle AI
  const delta = PADDLE_HEIGHT * (100 - PADDLE_PROXIMITY_PERCENTAGE) / 100;
  if (players.right.paddle.position.y + PADDLE_HEIGHT/2 < ball.position.y - delta) {
    players.right.paddle.position.y += PADDLE_VELOCITY;
  } else if (players.right.paddle.position.y + PADDLE_HEIGHT/2 > ball.position.y + delta) {
    players.right.paddle.position.y -= PADDLE_VELOCITY;
  }

  //when reaches the edges, flip the ball, count the score
  if (ball.position.x < 0) { //reach the left edge
    if (ball.position.y >= players.left.paddle.position.y && ball.position.y <= (players.left.paddle.position.y + PADDLE_HEIGHT)) {
      ball.direction.x = ball.direction.x === LEFT_TO_RIGHT ? RIGHT_TO_LEFT : LEFT_TO_RIGHT;
      const delta = ball.position.y - (players.left.paddle.position.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
      ball.speed.x += ball.speed.x * VELOCITY_INCREASE_RATE;
    } else {
      players.right.score.value++;
      ballReset();
    }
  } else if (ball.position.x > canvas.width) { //reach the right edge
    if (ball.position.y >= players.right.paddle.position.y && ball.position.y <= (players.right.paddle.position.y + PADDLE_HEIGHT)) {
      ball.direction.x = ball.direction.x === LEFT_TO_RIGHT ? RIGHT_TO_LEFT : LEFT_TO_RIGHT;
      const delta = ball.position.y - (players.right.paddle.position.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
      ball.speed.x += ball.speed.x * VELOCITY_INCREASE_RATE;
    } else {
      players.left.score.value++;
      ballReset();
    }
  } else if (ball.position.y < 0) { //reach the top edge
    ball.direction.y = ball.direction.y === TOP_TO_BOTTOM ? BOTTOM_TO_TOP : TOP_TO_BOTTOM;
  } else if (ball.position.y > canvas.height) { //reach the bottom edge
    ball.direction.y = ball.direction.y === TOP_TO_BOTTOM ? BOTTOM_TO_TOP : TOP_TO_BOTTOM;
  }
}

function drawBackground() {
  drawRect(screen.default.color, {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
  });
}

function drawNet() {
  for (var i = 0; i < canvas.height/net.segment.height; i += 2) {
    drawRect(net.color, {
      x: canvas.width/2 - net.segment.width/2,
      y: i * net.segment.height,
      width: net.segment.width,
      height: net.segment.height
    });
  }
}

function drawPaddle(paddle) {
  drawRect(paddle.color, {
    x: paddle.position.x,
    y: paddle.position.y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  });
}

function drawPaddles() {
  drawPaddle(players.left.paddle);
  drawPaddle(players.right.paddle);
}

function drawBall() {
  drawCircle("yellow", ball.radius, {
    x: ball.position.x,
    y: ball.position.y
  });
}

function drawScore(score) {
  drawText(score.color, score.font, score.value, {
    x: score.position.x,
    y: score.position.y
  });
}

function drawScores() {
  drawScore(players.left.score);
  drawScore(players.right.score);
}

function drawPlayerName(name) {
  drawText(name.color, name.font, name.value, {
    x: name.position.x,
    y: name.position.y
  });
}

function drawPlayerNames() {
  drawPlayerName(players.left.name);
  drawPlayerName(players.right.name);
}

function drawWinnerScreen() {
  const winner = players.left.winner ? players.left : players.right;
  drawText(screen.winner.color, screen.winner.font, `${winner.name.value} won! Click to continue...`, {
    x: canvas.width/2,
    y: canvas.height/2
  });
}

function draw() {
  drawBackground();
  if (showingWinScreen) {
    drawWinnerScreen();
  } else {
    drawNet();
    drawPaddles();
    drawBall();
    drawScores();
    drawPlayerNames();
  }
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
