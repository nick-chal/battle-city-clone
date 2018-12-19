var Sprite = function (filename, width, height) {

  this.image = null;
  this.S_WIDTH = width; //sprite width
  this.S_HEIGHT = height; //sprite height

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
  if (filename != undefined && filename != "" && filename != null) {
    this.load(filename);
  }

  /*draw static image */
  this.draw = function (x, y) {
    canvas.context.drawImage(this.image, x, y, this.S_WIDTH, this.S_HEIGHT);
  }

  /*draw moving sprite */
  this.drawAnimated = function (x, y, spriteSheetIndex) {
    updateAnimationFrame(spriteSheetIndex);
    var resX = this.animationCurrentFrame % 4;
    canvas.context.drawImage(this.image, resX * this.S_WIDTH, 0, this.S_WIDTH, this.S_WIDTH, x, y, this.S_WIDTH, this.S_HEIGHT);
  };

  // this.drawMoving = function (x, y, spriteSheetIndex) {
  //   updateAnimationFrame(spriteSheetIndex);
  //   var resX = this.animationCurrentFrame % 2;
  //   canvas.context.drawImage(this.image, resX * this.S_WIDTH, 0, this.S_WIDTH, this.S_WIDTH, x, y, this.S_WIDTH, this.S_HEIGHT);
  // };

  /*update sprite animation position */
  var updateAnimationFrame = function (spriteSheetIndex) {
    if (that.animationDelay++ >= 2) {
      that.animationDelay = 0;
      that.animationIndexCounter++;
      if (that.animationIndexCounter >= spriteSheetIndex.length)
        that.animationIndexCounter = 0;
      that.animationCurrentFrame = spriteSheetIndex[that.animationIndexCounter];
    }
  }
}