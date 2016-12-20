function run() {
  const canvas = document.querySelector("#gameCanvas");
  const context = gameCanvas.getContext("2d");

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

window.onload = run;
