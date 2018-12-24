var Canvas = function (canvas_id) {
  this.canvas = document.createElement('canvas');
  this.canvas.id = canvas_id;
  var div = document.getElementById('canvas-div');
  div.style.width = 550 + 'px';
  this.canvas.width = 550 + '';
  this.canvas.height = 620 + '';
  div.appendChild(this.canvas);
  this.context = this.canvas.getContext('2d');
};
