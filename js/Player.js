var Player = function () {
  // this.xPosition = 8 * 16;
  // this.yPosition = 24 * 16;
  this.direction = 'up';
  this.tankPosition = [8 * 16, 24 * 16];
  this.bulletFired = false;
  var that = this;

  this.drawTank = function () {
    var currTankImage = null;
    switch (this.direction) {
      case 'up':
        currTankImage = tankUp;
        break;
      case 'down':
        currTankImage = tankDown;
        break;
      case 'right':
        currTankImage = tankRight;
        break;
      case 'left':
        currTankImage = tankLeft;
        break;
    }
    currTankImage.drawMoving(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1]);
  }

  this.checkBulletFired = function () {
    if (keylog[32].pressed && !keylog[32].handled && this.bulletFired == false) {
      this.bulletFired = true;
      keylog[32].handled = true;
      return true;
    }
    return false;
  }

  this.updateTank = function (map) {
    var wallCheck1 = [];
    var wallCheck2 = [];
    if (!keylog[38].handled && keylog[38].pressed) {
      if (this.direction == 'right' || this.direction == 'left') {
        this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
      wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

      if (this.tankPosition[1] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
        this.tankPosition[1] -= 2;
      }
      this.direction = 'up';

    } else if (!keylog[40].handled && keylog[40].pressed) {
      if (this.direction == 'right' || this.direction == 'left') {
        this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16) + 2)];
      wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

      if (this.tankPosition[1] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
        this.tankPosition[1] += 2;
      }
      this.direction = 'down';

    } else if (!keylog[39].handled && keylog[39].pressed) {
      if (this.direction == 'up' || this.direction == 'down') {
        this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16) + 2), (Math.floor(this.tankPosition[1] / 16))];
      wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];

      if (this.tankPosition[0] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
        this.tankPosition[0] += 2;
      }
      this.direction = 'right';

    } else if (!keylog[37].handled && keylog[37].pressed) {
      if (this.direction == 'up' || this.direction == 'down') {
        this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
      wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
      if (this.tankPosition[0] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
        this.tankPosition[0] -= 2;
      }
      this.direction = 'left';
    }
  }

  this.collisionDetection = function (map, wall1, wall2) {
    if (map[wall1[1]][wall1[0]] == 1 || map[wall1[1]][wall1[0]] == 2 || map[wall1[1]][wall1[0]] == 4 || map[wall1[1]][wall1[0]] == 5) {
      return true;
    } else if (map[wall2[1]][wall2[0]] == 1 || map[wall2[1]][wall2[0]] == 2 || map[wall2[1]][wall2[0]] == 4 || map[wall2[1]][wall2[0]] == 5) {
      return true;
    }
    return false;
  }
}