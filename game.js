const FPS = 50;

//movements constants
const TOP_TO_BOTTOM = 1;
const BOTTOM_TO_TOP = -1;
const LEFT_TO_RIGHT = 1;
const RIGHT_TO_LEFT = -1;
const NO_MOVE = 0;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE_VELOCITY = 15;
const PADDLE_PROXIMITY_PERCENTAGE = 75; //how close should the right paddle be before moving
const PADDLE_DEFLECTION_PERCENTAGE = 35; //percentage

const NET_LINE_HEIGHT = 10;
const NET_LINE_WIDTH = 5;

const WINNING_SCORE = 3;

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
    value: 0,
    winner: false
  },
  right: {
    x: 0,
    y: 0,
    value: 0,
    winner: false
  },
  color: "yellow",
  font: "15px Monaco"
};
let showingWinScreen = false;

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
  canvas.addEventListener("click", () => showingWinScreen = false);
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
  ball.position.x = canvas.width/2;
  ball.position.y = canvas.height/2;

   if (score.left.value >= WINNING_SCORE || score.right.value >= WINNING_SCORE) {
     [score.left.winner, score.right.winner] = [score.left.value >= WINNING_SCORE, score.right.value >= WINNING_SCORE];
     [score.left.value, score.right.value] = [0, 0];
     showingWinScreen = true;
   }
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
  if (paddles.right.y + PADDLE_HEIGHT/2 < ball.position.y - delta) {
    paddles.right.y += PADDLE_VELOCITY;
  } else if (paddles.right.y + PADDLE_HEIGHT/2 > ball.position.y + delta) {
    paddles.right.y -= PADDLE_VELOCITY;
  }

  //when reaches the edges, flip the ball, count the score
  if (ball.position.x < 0) { //reach the left edge
    if (ball.position.y >= paddles.left.y && ball.position.y <= (paddles.left.y + PADDLE_HEIGHT)) {
      ball.direction.x = ball.direction.x === LEFT_TO_RIGHT ? RIGHT_TO_LEFT : LEFT_TO_RIGHT;
      const delta = ball.position.y - (paddles.left.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
    } else {
      score.right.value++;
      ballReset();
    }
  } else if (ball.position.x > canvas.width) { //reach the right edge
    if (ball.position.y >= paddles.right.y && ball.position.y <= (paddles.right.y + PADDLE_HEIGHT)) {
      ball.direction.x = ball.direction.x === LEFT_TO_RIGHT ? RIGHT_TO_LEFT : LEFT_TO_RIGHT;
      const delta = ball.position.y - (paddles.right.y + PADDLE_HEIGHT/2);
      ball.speed.y = delta * (PADDLE_DEFLECTION_PERCENTAGE / 100);
    } else {
      score.left.value++;
      ballReset();
    }
  } else if (ball.position.y < 0) { //reach the top edge
    ball.direction.y = ball.direction.y === TOP_TO_BOTTOM ? BOTTOM_TO_TOP : TOP_TO_BOTTOM;
  } else if (ball.position.y > canvas.height) { //reach the bottom edge
    ball.direction.y = ball.direction.y === TOP_TO_BOTTOM ? BOTTOM_TO_TOP : TOP_TO_BOTTOM;
  }
}

function draw() {
  //screen background
  drawRect("black", {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
  });

  if (showingWinScreen) {
    const message = score.left.winner ? "You win!" : "Computer wins!";
    drawText(score.color, score.font, `${message} Click to continue...`, {
      x: canvas.width/2,
      y: canvas.height/2
    });
    return;
  }

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
