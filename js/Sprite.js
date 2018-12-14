var Sprite = function (fn, width, height) {

  this.image = null;
  this.S_WIDTH = width;
  this.S_HEIGHT = height;

  this.animationDelay = 0;
  this.animationIndexCounter = 0;
  this.animationCurrentFrame = 0;
  var that = this;

  this.load = function (filename) {
    this.image = new Image();
    this.image.src = filename;
    return this;
  };

  // Load the sprite
  if (fn != undefined && fn != "" && fn != null) {
    this.load(fn);
  }


  this.draw = function (x, y) {
    canvas.context.drawImage(this.image, x, y, this.S_WIDTH, this.S_HEIGHT);
  }

  this.drawAnimated = function (x, y, spriteSheetIndex) {
    updateAnimationFrame(spriteSheetIndex);
    var resX = this.animationCurrentFrame % 2;
    canvas.context.drawImage(this.image, resX * this.S_WIDTH, 0, this.S_WIDTH, this.S_WIDTH, x, y, this.S_WIDTH, this.S_HEIGHT);
  };

  this.drawMoving = function (x, y, spriteSheetIndex) {
    if ((keylog[37] && keylog[37].pressed) || (keylog[38] && keylog[38].pressed) || (keylog[39] && keylog[39].pressed) || (keylog[40] && keylog[40].pressed)) {
      updateAnimationFrame(spriteSheetIndex);

    }
    var resX = this.animationCurrentFrame % 2;
    canvas.context.drawImage(this.image, resX * this.S_WIDTH, 0, this.S_WIDTH, this.S_WIDTH, x, y, this.S_WIDTH, this.S_HEIGHT);
  };

  var updateAnimationFrame = function (spriteSheetIndex) {
    if (that.animationDelay++ >= 1) {
      that.animationDelay = 0;
      that.animationIndexCounter++;
      if (that.animationIndexCounter >= spriteSheetIndex.length)
        that.animationIndexCounter = 0;
      that.animationCurrentFrame = spriteSheetIndex[that.animationIndexCounter];
    }
  }
}