var Bullet = function (direction, position, owner) {
  this.direction = direction;
  this.bulletPosition = position;
  switch (owner) {
    case 0:
      this.speed = 4;
      break;
    case 1:
      this.speed = 3;
      break;
  }
  this.destroyed = false;

  var currBulletImage = null;

  switch (this.direction) {
    case 'up':
      currBulletImage = bulletUp;
      break;
    case 'down':
      currBulletImage = bulletDown;
      break;
    case 'right':
      currBulletImage = bulletRight;
      break;
    case 'left':
      currBulletImage = bulletLeft;
      break;
  }

  this.drawBullet = function () {
    if (this.direction == 'left') {
      currBulletImage.draw(this.bulletPosition[0] + PADD, this.bulletPosition[1] + PADD + 4);
    } else if (this.direction == 'up') {
      currBulletImage.draw(this.bulletPosition[0] + PADD + 4, this.bulletPosition[1] + PADD);
    } else if (this.direction == 'right') {
      currBulletImage.draw(this.bulletPosition[0] + PADD + 24, this.bulletPosition[1] + PADD + 4);
    } else {
      currBulletImage.draw(this.bulletPosition[0] + PADD + 4, this.bulletPosition[1] + PADD + 8);
    }

  }

  var updateMap = function (map, wall1, wall2) {
    switch (map[wall1[1]][wall1[0]]) {
      case 1:
        map[wall1[1]][wall1[0]] = 0;
        break;
      case 5:
        map[wall1[1]][wall1[0]] = 6;
        break;
    }
    switch (map[wall2[1]][wall2[0]]) {
      case 1:
        map[wall2[1]][wall2[0]] = 0;
        break;
      case 5:
        map[wall2[1]][wall2[0]] = 6;
        break;
    }
  }

  this.updateBullet = function (map) {
    switch (this.direction) {
      case 'up':
        if (this.bulletPosition[1] >= 0) {
          wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.floor(this.bulletPosition[1] / 16))];
          wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[1] -= this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          this.destroyed = true;
        }
        break;
      case 'down':
        if (this.bulletPosition[1] <= (24 * 16) + 16) {
          wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.ceil(this.bulletPosition[1] / 16))];
          wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[1] += this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          this.destroyed = true;
        }
        break;
      case 'right':
        if (this.bulletPosition[0] <= (24 * 16)) {
          wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16) + 2), (Math.floor(this.bulletPosition[1] / 16))];
          wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[0] += this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          this.destroyed = true;
        }
        break;
      case 'left':
        if (this.bulletPosition[0] >= 0) {
          wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.floor(this.bulletPosition[1] / 16))];
          wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[0] -= this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          this.destroyed = true;
        }
        break;
    }
  }

  this.tankDetection = function (tankPosition) {
    if (this.bulletPosition[0] <= tankPosition[0] + 32 && this.bulletPosition[0] + 8 >= tankPosition[0] && this.bulletPosition[1] <= tankPosition[1] + 32 && this.bulletPosition[1] + 8 >= tankPosition[1]) {
      this.destroyed = true;
      return true;
    }
    return false;
  }

  this.bulletBulletCollision = function (bulletPosition) {
    if (this.bulletPosition[0] <= bulletPosition[0] + 8 && this.bulletPosition[0] + 8 >= bulletPosition[0] && this.bulletPosition[1] <= bulletPosition[1] + 8 && this.bulletPosition[1] + 8 >= bulletPosition[1]) {
      this.destroyed = true;
      return true;
    }
    return false;
  }

  this.collisionDetection = function (map, wall1, wall2) {
    if (map[wall1[1]][wall1[0]] == 1 || map[wall1[1]][wall1[0]] == 2 || map[wall1[1]][wall1[0]] == 5) {
      return true;
    } else if (map[wall2[1]][wall2[0]] == 1 || map[wall2[1]][wall2[0]] == 2 || map[wall2[1]][wall2[0]] == 5) {
      return true;
    }
    return false;
  }
}