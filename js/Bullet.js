var Bullet = function (direction, position, owner) {

  var owner = owner;
  this.direction = direction;
  this.bulletPosition = position;

  /*Check the owner is enemy or player */
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

  /*Select bullet sprite */
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

  /*update bullet after bullet hits base or brick */
  var updateMap = function (map, wall1, wall2) {
    if (owner === 0) {
      if (map[wall1[1]][wall1[0]] == 1 || map[wall2[1]][wall2[0]] == 1) sound.bulletBrick.play();
      else if (map[wall1[1]][wall1[0]] == 2 || map[wall2[1]][wall2[0]] == 2) sound.bulletWall.play();
    }
    switch (map[wall1[1]][wall1[0]]) {
      case 1:
        map[wall1[1]][wall1[0]] = 0;
        break;
      case 5:
        if (wall1[1] === 24 || wall1[1] === 25) {
          map[24][12] = 6;
          map[24][13] = 6;
          map[25][13] = 6;
          map[25][12] = 6;
        } else {
          map[0][12] = 6;
          map[0][13] = 6;
          map[1][13] = 6;
          map[1][12] = 6;
        }
        break;
    }
    switch (map[wall2[1]][wall2[0]]) {
      case 1:
        map[wall2[1]][wall2[0]] = 0;
        break;
      case 5:
        if (wall2[1] === 24 || wall1[1] === 25) {
          map[24][12] = 6;
          map[24][13] = 6;
          map[25][13] = 6;
          map[25][12] = 6;
        } else {
          map[0][12] = 6;
          map[0][13] = 6;
          map[1][13] = 6;
          map[1][12] = 6;
        }
        break;
    }
  }

  /*update bullet position and check collision */
  this.updateBullet = function (map) {
    var wallCheck1 = [];
    var wallCheck2 = [];

    switch (this.direction) {
      case 'up':
        wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.floor(this.bulletPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
        if (this.bulletPosition[1] >= 0) {
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[1] -= this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          if (owner == 0) {
            sound.bulletWall.play();
          }
          this.destroyed = true;
        }
        break;

      case 'down':
        wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.ceil(this.bulletPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
        if (this.bulletPosition[1] <= (24 * 16) + 16) {
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[1] += this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          if (owner == 0) {
            sound.bulletWall.play();
          }
          this.destroyed = true;
        }
        break;

      case 'right':
        wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16) + 2), (Math.floor(this.bulletPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
        if (this.bulletPosition[0] <= (24 * 16)) {
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[0] += this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          if (owner == 0) {
            sound.bulletWall.play();
          }
          this.destroyed = true;
        }
        break;

      case 'left':
        wallCheck1 = [(Math.floor(this.bulletPosition[0] / 16)), (Math.floor(this.bulletPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
        if (this.bulletPosition[0] >= 0) {
          if (!this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.bulletPosition[0] -= this.speed;
          } else {
            updateMap(map, wallCheck1, wallCheck2);
            this.destroyed = true;
          }
        } else {
          if (owner == 0) {
            sound.bulletWall.play();
          }
          this.destroyed = true;
        }
        break;
    }
  }

  /*check if bullet hits any tank(enemy->player or player->enemy) */
  this.tankDetection = function (tank) {
    if (tank.startAnimationCounter != undefined && tank.startAnimationCounter >= 120) {
      if (this.bulletPosition[0] <= tank.tankPosition[0] + 32 && this.bulletPosition[0] + 8 >= tank.tankPosition[0] && this.bulletPosition[1] <= tank.tankPosition[1] + 32 && this.bulletPosition[1] + 8 >= tank.tankPosition[1]) {
        this.destroyed = true;
        return true;
      }
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

  /*check if bullet hits the map elements */
  this.collisionDetection = function (map, wall1, wall2) {
    if (map[wall1[1]][wall1[0]] == 1 || map[wall1[1]][wall1[0]] == 2 || map[wall1[1]][wall1[0]] == 5) {
      return true;
    } else if (map[wall2[1]][wall2[0]] == 1 || map[wall2[1]][wall2[0]] == 2 || map[wall2[1]][wall2[0]] == 5) {
      return true;
    }
    return false;
  }
}
