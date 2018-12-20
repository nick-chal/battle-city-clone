var Canvas = function (canvas_id) {
  this.canvas = null;
  this.context = null;
  this.canvas = document.getElementById(canvas_id);
  this.context = this.canvas.getContext('2d');
};

function clearMap() {
  canvas.context.fillStyle = 'gray';
  canvas.context.fillRect(0, 0, 550, 620);
  canvas.context.clearRect(42, 42, 500 - 84, 500 - 84);
}

function drawMap(mapArray) {
  var xpos = 0;
  var ypos = 0;
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 26; j++) {
      xpos = j * 16 + PADD;
      ypos = i * 16 + PADD;
      var ran = mapArray[i][j];
      switch (ran) {
        case 1:
          brick.draw(xpos, ypos);
          break;
        case 2:
          steel.draw(xpos, ypos);
          break;
        case 3:
          tree.draw(xpos, ypos);
          break;
        case 4:
          water.draw(xpos, ypos);
          break;
        case 5:
          if (i === 24 && j === 12) base.draw(xpos, ypos);
          if (i === 0 && j === 12) base.draw(xpos, ypos);
          break;
        case 6:
          if (i === 24 && j === 12) baseDestroyed.draw(xpos, ypos);
          if (i === 0 && j === 12) baseDestroyed.draw(xpos, ypos);
          break;
        default:
      }
    }
  }
}
