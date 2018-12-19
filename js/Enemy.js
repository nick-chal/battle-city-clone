var Enemy = function (enemy) {
  this.direction = 'down';
  this.change = 'down';
  this.tankDestroyed = false;
  this.bulletFired = true;
  var temp = randomGenerator(0, 10);
  if (temp < 7) {
    var fireLimit = 20;
    var type = 1;
    this.life = 1;
    this.tankSpeed = 1;
  } else if (temp < 9) {
    var fireLimit = 40;
    var type = 2;
    this.life = 2;
    this.tankSpeed = 0.75;
  } else {
    var fireLimit = 20;
    var type = 3;
    this.life = 1;
    this.tankSpeed = 1.75;
  }
  var fireRate = 0;
  this.startAnimationCounter = 0;
  var ok = false;

  var generationSpot = randomGenerator(1, 3);
  switch (generationSpot) {
    case 1:
      this.tankPosition = [0, 0];
      break;
    case 2:
      this.tankPosition = [12 * 16, 0];
      break;
    case 3:
      this.tankPosition = [24 * 16, 0];
      break;
  }

  this.allEnemyCheck = function (enemyList, index, player) {
    var collision = false;
    for (var i = 0; i < enemyList.length; i++) {
      if (index !== i) {
        collision = this.tankTankCollision(enemyList[i].tankPosition);
        if (collision && enemyList[i].startAnimationCounter < 120) collision = false;
        if (collision && (this.tankPosition[0] <= 64 && this.tankPosition[1] <= 64)) collision = false;
      }
      if (collision) return true;
      if (i == enemyList.length - 1 && !collision && player !== null) {
        collision = this.tankTankCollision(player.tankPosition);
      }
    }
    return false;
  }

  this.drawTank = function () {
    var currTankImage = null;
    if (this.startAnimationCounter < 120) {
      creation.drawAnimated(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1, 2, 3, 4, 5])
    } else {
      switch (this.direction) {
        case 'up':
          currTankImage = enemySprite['enemyUp' + type];
          break;
        case 'down':
          currTankImage = enemySprite['enemyDown' + type];
          break;
        case 'right':
          currTankImage = enemySprite['enemyRight' + type];
          break;
        case 'left':
          currTankImage = enemySprite['enemyLeft' + type];
          break;
      }
      currTankImage.drawAnimated(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1]);
    }
  }

  this.checkBulletFired = function () {
    if (this.bulletFired == false && fireRate % 20 == 0) {
      this.bulletFired = true;
      fireRate = 1;
      return true;
    }
    fireRate++;
    return false;
  }

  this.updateTank = function (map, enemyList, index, player) {
    var wallCheck1 = [];
    var wallCheck2 = [];
    var tankCollision = false;
    if (this.startAnimationCounter < 120) {
      this.startAnimationCounter++;
      if (this.startAnimationCounter >= 120) this.bulletFired = false;
    } else {
      if (this.change == 'up') {
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
        tankCollision = this.allEnemyCheck(enemyList, index, player);
        if (tankCollision && this.direction == 'up') {
          this.change = 'down';
        } else {
          if (this.direction == 'right' || this.direction == 'left') {
            var tempPosition = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
            if (tempPosition < 0) this.tankPosition[0] = 0;
            else if (tempPosition > 24 * 16) this.tankPosition[0] = 24 * 16;
            else this.tankPosition[0] = tempPosition;
          }
          if (this.tankPosition[1] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.direction = this.change;
            this.tankPosition[1] -= this.tankSpeed;
            switch (randomGenerator(1, 200)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;
            }
          } else {
            switch (randomGenerator(1, 10)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;
            }
          }
        }
        if (!tankCollision) this.direction = 'up';
      } else if (this.change == 'down') {
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16) + 2)];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];
        tankCollision = this.allEnemyCheck(enemyList, index, player);
        if (tankCollision && this.direction == 'down') {
          this.change = 'up';
        } else {
          if (this.direction == 'right' || this.direction == 'left') {
            var tempPosition = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
            if (tempPosition < 0) this.tankPosition[0] = 0;
            else if (tempPosition > 24 * 16) this.tankPosition[0] = 24 * 16;
            else this.tankPosition[0] = tempPosition;
          }
          if (this.tankPosition[1] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.direction = this.change;
            this.tankPosition[1] += this.tankSpeed;
            switch (randomGenerator(1, 200)) {
              case 1:
                this.change = 'up';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;
            }
          } else {
            switch (randomGenerator(1, 10)) {
              case 1:
                this.change = 'up';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;

            }
          }
        }
        this.direction = 'down';

      } else if (this.change == 'right') {
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16) + 2), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
        tankCollision = this.allEnemyCheck(enemyList, index, player);
        if (tankCollision && this.direction == 'right') {
          this.change = 'left';
        } else {
          if (this.direction == 'up' || this.direction == 'down') {
            var tempPosition = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
            if (tempPosition < 0) this.tankPosition[1] = 0;
            else if (tempPosition > 24 * 16) this.tankPosition[1] = 24 * 16;
            else this.tankPosition[1] = tempPosition;
          }
          if (this.tankPosition[0] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.direction = this.change;
            this.tankPosition[0] += this.tankSpeed;
            switch (randomGenerator(1, 200)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'up';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;
            }
          } else {
            switch (randomGenerator(1, 10)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'up';
                break;
              case 3:
                this.change = 'left';
                break;
              default:
                this.change = this.direction;

            }
          }
        }
        if (!tankCollision) this.direction = 'right';
      } else if (this.change == 'left') {
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
        tankCollision = this.allEnemyCheck(enemyList, index, player);
        if (tankCollision && this.direction == 'left') {
          this.change = 'right';
        } else {
          if (this.direction == 'up' || this.direction == 'down') {
            var tempPosition = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
            if (tempPosition < 0) this.tankPosition[1] = 0;
            else if (tempPosition > 24 * 16) this.tankPosition[1] = 24 * 16;
            else this.tankPosition[1] = tempPosition;
          }
          wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
          wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
          if (this.tankPosition[0] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
            this.direction = this.change;
            this.tankPosition[0] -= this.tankSpeed;
            switch (randomGenerator(1, 200)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'up';
                break;
              default:
                this.change = this.direction;
            }
          } else {
            switch (randomGenerator(1, 10)) {
              case 1:
                this.change = 'down';
                break;
              case 2:
                this.change = 'right';
                break;
              case 3:
                this.change = 'up';
                break;
              default:
                this.change = this.direction;

            }
          }
        }
        if (!tankCollision) this.direction = 'left';
      }
    }
  }

  this.tankTankCollision = function (position) {
    if ((this.direction === 'left' && this.tankPosition[0] >= (position[0] + 32)) || (this.direction === 'right' && this.tankPosition[0] <= (position[0] + 32)) || (this.direction === 'up' && this.tankPosition[1] >= (position[1] + 32)) || (this.direction === 'down' && this.tankPosition[1] <= (position[1] + 32))) {
      if (this.tankPosition[0] <= position[0] + 32 && this.tankPosition[0] + 32 >= position[0] && this.tankPosition[1] <= position[1] + 32 && this.tankPosition[1] + 32 >= position[1]) {
        return true;
      }
    }
    return false;
  }

  this.collisionDetection = function (map, wall1, wall2) {
    checkNegative(wall1);
    checkNegative(wall2);
    if (map[wall1[1]][wall1[0]] == 1 || map[wall1[1]][wall1[0]] == 2 || map[wall1[1]][wall1[0]] == 4 || map[wall1[1]][wall1[0]] == 5) {
      return true;
    } else if (map[wall2[1]][wall2[0]] == 1 || map[wall2[1]][wall2[0]] == 2 || map[wall2[1]][wall2[0]] == 4 || map[wall2[1]][wall2[0]] == 5) {
      return true;
    }
    return false;
  }


  checkNegative = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = Math.max(0, arr[i]);
    }
  }
}
