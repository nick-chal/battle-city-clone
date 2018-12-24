var Player = function (plNum, pvp) {

  this.direction = 'up'; //initital facing
  this.bulletFired = false;

  this.fireKey = false;
  this.upKey = false;
  this.downKey = false;
  this.leftKey = false;
  this.rightKey = false;

  this.startAnimationCounter = 0; //creation time animation

  this.playerNumber = plNum;

  if (this.playerNumber === 1) {
    this.tankPosition = [8 * 16, 24 * 16]; //creation position
  } else {
    this.tankPosition = pvp ? [16 * 16, 0 * 16] : [16 * 16, 24 * 16];
    if (pvp) this.direction = 'down';
  }


  this.keyCheck = function (gamepad) {
    var gamepadButtonPressed = false;
    if (this.playerNumber === 1) {
      if (gamepad && (gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[2].pressed || gamepad.buttons[3].pressed))
        gamepadButtonPressed = true;
      if ((!gamepad && (keylog[32].pressed && !keylog[32].handled && this.bulletFired == false)) || (gamepadButtonPressed && this.bulletFired == false)) {
        this.fireKey = true;
        if (!gamepad) keylog[32].handled = true;
      }
      if ((!gamepad && (!keylog[38].handled && keylog[38].pressed)) || (gamepad && (gamepad.axes[1] < -.99))) {
        this.upKey = true;
      } else if ((!gamepad && (!keylog[40].handled && keylog[40].pressed)) || (gamepad && (gamepad.axes[1] > .99))) {
        this.downKey = true;
      } else if ((!gamepad && (!keylog[39].handled && keylog[39].pressed)) || (gamepad && (gamepad.axes[0] > .99))) {
        this.rightKey = true;
      } else if ((!gamepad && (!keylog[37].handled && keylog[37].pressed)) || (gamepad && (gamepad.axes[0] < -.99))) {
        this.leftKey = true;
      }
    } else {
      if (gamepad && (gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[2].pressed || gamepad.buttons[3].pressed))
        gamepadButtonPressed = true;
      if ((!gamepad && (keylog[70].pressed && !keylog[70].handled && this.bulletFired == false)) || (gamepadButtonPressed && this.bulletFired == false)) {
        this.fireKey = true;
        if (!gamepad) keylog[70].handled = true;
      }
      if ((!gamepad && (!keylog[87].handled && keylog[87].pressed)) || (gamepad && (gamepad.axes[1] < -.99))) {
        this.upKey = true;
      } else if ((!gamepad && (!keylog[83].handled && keylog[83].pressed)) || (gamepad && (gamepad.axes[1] > .99))) {
        this.downKey = true;
      } else if ((!gamepad && (!keylog[68].handled && keylog[68].pressed)) || (gamepad && (gamepad.axes[0] > .99))) {
        this.rightKey = true;
      } else if ((!gamepad && (!keylog[65].handled && keylog[65].pressed)) || (gamepad && (gamepad.axes[0] < -.99))) {
        this.leftKey = true;
      }
    }

  }

  this.drawTank = function () {
    var currTankImage = null;
    if (this.startAnimationCounter < 120) { //draw creation animation
      creation.drawAnimated(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1, 2, 3, 4, 5])
    } else {
      switch (this.direction) { //select tank direction sprite
        case 'up':
          currTankImage = tankSprite['tankUp' + this.playerNumber];
          break;
        case 'down':
          currTankImage = tankSprite['tankDown' + this.playerNumber];
          break;
        case 'right':
          currTankImage = tankSprite['tankRight' + this.playerNumber];
          break;
        case 'left':
          currTankImage = tankSprite['tankLeft' + this.playerNumber];
          break;
      }
      currTankImage.drawAnimated(this.tankPosition[0] + PADD, this.tankPosition[1] + PADD, [0, 1]);
    }
  }

  /*check if ready to create new bullet */
  this.checkBulletFired = function (gamepad) {
    this.keyCheck(gamepad);
    if (this.fireKey && this.startAnimationCounter >= 120) {
      this.bulletFired = true;
      this.fireKey = false;
      return true;
    }
    return false;
  }

  /*update tank and position along with collision check */
  this.updateTank = function (map, enemyList, gamepad) {
    var wallCheck1 = [];
    var wallCheck2 = [];
    var tankCollision = false;
    var tankCollision = false;
    this.keyCheck(gamepad);
    if (this.startAnimationCounter < 120) {
      this.startAnimationCounter++;
      this.bulletFired = true;
      if (this.startAnimationCounter >= 120) this.bulletFired = false;
    } else {
      for (var i = 0; i < enemyList.length; i++) {

        if (enemyList[i].startAnimationCounter >= 120) tankCollision = this.tankTankCollision(enemyList[i].tankPosition);
        if (tankCollision)
          break;
      }
      if (this.upKey) {
        if (tankCollision && this.direction == 'up') return;
        if (this.direction == 'right' || this.direction == 'left') {
          this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
        }
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

        if (this.tankPosition[1] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
          this.tankPosition[1] -= 2;
        }
        this.direction = 'up';
        this.upKey = false;

      } else if (this.downKey) {
        if (tankCollision && this.direction == 'down') return;
        if (this.direction == 'right' || this.direction == 'left') {
          this.tankPosition[0] = ((this.tankPosition[0]) % 16 < 8) ? Math.floor(this.tankPosition[0] / 16) * 16 : Math.ceil(this.tankPosition[0] / 16) * 16;
        }
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16) + 2)];
        wallCheck2 = [wallCheck1[0] + 1, wallCheck1[1]];

        if (this.tankPosition[1] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
          this.tankPosition[1] += 2;
        }
        this.direction = 'down';
        this.downKey = false;

      } else if (this.rightKey) {
        if (tankCollision && this.direction == 'right') return;
        if (this.direction == 'up' || this.direction == 'down') {
          this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
        }
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16) + 2), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];

        if (this.tankPosition[0] < (24 * 16) && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
          this.tankPosition[0] += 2;
        }
        this.direction = 'right';
        this.rightKey = false;

      } else if (this.leftKey) {
        if (tankCollision && this.direction == 'left') return;
        if (this.direction == 'up' || this.direction == 'down') {
          this.tankPosition[1] = ((this.tankPosition[1]) % 16 < 8) ? Math.floor(this.tankPosition[1] / 16) * 16 : Math.ceil(this.tankPosition[1] / 16) * 16;
        }
        wallCheck1 = [(Math.floor(this.tankPosition[0] / 16)), (Math.floor(this.tankPosition[1] / 16))];
        wallCheck2 = [wallCheck1[0], wallCheck1[1] + 1];
        if (this.tankPosition[0] > 0 && !this.collisionDetection(map, wallCheck1, wallCheck2)) {
          this.tankPosition[0] -= 2;
        }
        this.direction = 'left';
        this.leftKey = false;
      }
    }

  }

  /*check collision with enemy */
  this.tankTankCollision = function (position) {
    if (this.tankPosition[0] <= position[0] + 32 && this.tankPosition[0] + 32 >= position[0] && this.tankPosition[1] <= position[1] + 32 && this.tankPosition[1] + 32 >= position[1]) {
      return true;
    }
    return false;
  }

  /*check map element collision */
  this.collisionDetection = function (map, wall1, wall2) {
    if (map[wall1[1]][wall1[0]] == 1 || map[wall1[1]][wall1[0]] == 2 || map[wall1[1]][wall1[0]] == 4 || map[wall1[1]][wall1[0]] == 5) {
      return true;
    } else if (map[wall2[1]][wall2[0]] == 1 || map[wall2[1]][wall2[0]] == 2 || map[wall2[1]][wall2[0]] == 4 || map[wall2[1]][wall2[0]] == 5) {
      return true;
    }
    return false;
  }
}
