let canvas;
let context;

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

function run() {
  setup();
  drawRect("black", {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
  });
  drawRect("white", {
    x: canvas.width/2,
    y: 0,
    width: 1,
    height: canvas.height
  });
}

window.onload = run;
