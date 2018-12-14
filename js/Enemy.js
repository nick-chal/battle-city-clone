var Enemy = function () {
  this.direction = 'down';
  this.change = 'down';
  this.tankDestroyed = false;
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

  this.bulletFired = false;
  this.tankSpeed = 1;
  var that = this;

  this.drawTank = function () {
    var currTankImage = null;
    switch (this.direction) {
      case 'up':
        currTankImage = enemyUp;
        break;
      case 'down':
        currTankImage = enemyDown;
        break;
      case 'right':
        currTankImage = enemyRight;
        break;
      case 'left':
        currTankImage = enemyLeft;
        break;
    }
    currTankImage.drawAnimated(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1]);
  }

  this.checkBulletFired = function () {
    if (this.bulletFired == false) {
      this.bulletFired = true;
      return true;
    }
    return false;
  }

  this.updateTank = function (map, enemyList, index, player) {
    var wallCheck1 = [];
    var wallCheck2 = [];
    var tankCollision = false;
    for (var i = 0; i < enemyList.length; i++) {
      if (index !== i) {
        tankCollision = this.tankTankCollision(enemyList[i].tankPosition);
      }
      if (tankCollision) break;
      if (i == enemyList.length - 1 && !tankCollision && player !== null) {
        tankCollision = this.tankTankCollision(player.tankPosition);
      }
    }
    if (this.change == 'up') {
      if (tankCollision && this.direction == 'up') {
        this.change = 'up';
      }
      if (this.direction == 'right' || this.direction == 'left') {
        this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
      wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

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
      this.direction = 'up';

    } else if (this.change == 'down') {
      if (tankCollision && this.direction == 'down') {
        this.change = 'down';
      }
      if (this.direction == 'right' || this.direction == 'left') {
        this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16) + 2)];
      wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

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
      this.direction = 'down';

    } else if (this.change == 'right') {
      if (tankCollision && this.direction == 'right') {
        this.change = 'left';
      }
      if (this.direction == 'up' || this.direction == 'down') {
        this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
      }
      wallCheck1 = [(Math.floor(this.tankPosition[0] / 16) + 2), (Math.floor(this.tankPosition[1] / 16))];
      wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];

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
      this.direction = 'right';

    } else if (this.change == 'left') {
      if (tankCollision && this.direction == 'left') {
        this.change = 'right';
      }
      if (this.direction == 'up' || this.direction == 'down') {
        this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
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
      this.direction = 'left';
    }
  }

  this.tankTankCollision = function (position) {
    console.log();
    if (this.tankPosition[0] <= position[0] + 32 && this.tankPosition[0] + 32 >= position[0] && this.tankPosition[1] <= position[1] + 32 && this.tankPosition[1] + 32 >= position[1]) {
      return true;
    }
    return false;
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