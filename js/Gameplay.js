var Game = function (second) {
  var map
  var player = null;
  var player2 = null;
  var secondPlayer = second;
  var player1Lives = 2;
  var player2Lives = secondPlayer ? 2 : -1;
  var player1Score = 0;
  var player2Score = 0;
  var enemy = [];
  var enemyBullet;
  var playerBullet;
  var player2Bullet;
  var enemyLimit;
  var enemyLeft;
  var enemyCounter;
  var enemyLives;
  var pause;
  var pauseHandled
  var gameoverCounter = null;
  // var stageoverCounter = null;

  var stage;

  this.init = function (mapLoad, stageNum = 1) {
    map = mapLoad;
    enemy = [];
    enemyBullet = [];
    playerBullet = null;
    player2Bullet = null;
    enemyLimit = 18;
    enemyKilled = 0;
    enemyCounter = 0;
    enemyLives = 0;
    enemyLeft = enemyLimit;
    stage = stageNum;
    gameoverCounter = 0;
    // player = new Player();
    // if (secondPlayer) player2 = new Player2();
    then = Date.now();
    startTime = then;
    sound.start.play();
    requestAnimationFrame(function () {
      runGame();
    })
  }

  var runGame = function () {
    var stop = false;
    now = Date.now();
    var gp = pollGamepads();
    pauseHandled = (gamepadConnected && !gp.buttons[9].pressed) ? false : pauseHandled;
    if ((!keylog[13].handled && keylog[13].pressed) || (gamepadConnected && gp.buttons[9].pressed && !pauseHandled)) {
      pause = !pause;
      pauseHandled = true;
      keylog[13].handled = true;
    }
    elapsed = now - then;
    if (elapsed > fpsInterval && !pause) {
      if (gameoverCounter) gameoverCounter++;
      then = now - (elapsed % fpsInterval);
      if (enemyCounter % 100 == 0) {
        if (enemyLives < 4 && enemyCounter / 100 < enemyLimit) {
          enemy.push(new Enemy());
          enemyLives++;
          enemyCounter++;
        }
      } else {
        enemyCounter++;
      }
      clearMap();
      drawInfo();
      keyMapping();
      if (player === null && player1Lives >= 0) player = new Player();
      if (secondPlayer && player2 === null && player2Lives >= 0) player2 = new Player2();
      if (player !== null) playerUpdates(player, 1);
      if (secondPlayer && player2 !== null) playerUpdates(player2, 2);
      for (var i = 0; i < enemy.length; i++) {
        enemyUpdates(i);
        if (enemyBullet[i]) {
          if (!enemyBullet[i].destroyed) {
            enemyBullet[i].drawBullet();
            enemyBullet[i].updateBullet(map);
            enemyBulletCheck(player, i, 1);
            if (secondPlayer && enemyBullet[i] != null && !enemyBullet[i].destroyed) {
              enemyBulletCheck(player2, i, 2);
            }
          } else {
            enemyBullet[i] = null;
            enemy[i].bulletFired = false;
          }
        }

        if (enemy.length >= 0) playerBulletEnemyCheck(playerBullet, i, 1);
        if (secondPlayer && enemy.length >= 0) {
          playerBulletEnemyCheck(player2Bullet, i, 2);
        }
      }


      playerBulletUpdates(playerBullet, 1);
      if (secondPlayer) {
        playerBulletUpdates(player2Bullet, 2);
      }
    }
    drawMap(map);

    if (player1Lives < 0 && player2Lives < 0) {
      stop = gameOverScreen();
    }

    if (map[24][12] == 6 || map[24][13] == 6 || map[25][13] == 6 || map[25][12] == 6) {
      if (!gameoverCounter) sound.explosionBase.play();
      stop = gameOverScreen();
    }
    if (enemyLeft <= 0) {
      if (!gameoverCounter) gameoverCounter = 1;
      if (gameoverCounter >= 100) {
        if (stage < 5) {
          player = null;
          if (secondPlayer) player2 = null;
          var mapLoad = stages[stage + 1].map(function (item) {
            return item.slice();
          });
          game.init(mapLoad, stage + 1);
          return;
        } else {
          stop = true;
        }
      }
    }
    if (!stop) {
      requestAnimationFrame(runGame);
    } else {
      canvas.context.clearRect(0, 0, 550, 620)
      gameOver.draw(116, 200);
      sound.over.play();
      setTimeout(initAll, 2500);
    }
  }


  playerUpdates = function (player, playerNumber) {
    gp = pollGamepads()
    player.updateTank(map, enemy, gp);
    player.drawTank();
    if (player !== null && player.checkBulletFired(gp)) {
      var position;
      switch (player.direction) {
        case 'up':
          position = [player.tankPosition[0] + 8, player.tankPosition[1]];
          break;
        case 'down':
          position = [player.tankPosition[0] + 8, player.tankPosition[1] + 16];
          break;
        case 'right':
          position = [player.tankPosition[0], player.tankPosition[1] + 8];
          break;
        case 'left':
          position = [player.tankPosition[0], player.tankPosition[1] + 8];
          break;
      }
      if (playerNumber == 1) playerBullet = new Bullet(player.direction, position, 0);
      else if (playerNumber == 2) player2Bullet = new Bullet(player.direction, position, 0);
      sound.bullet.play();
    }
  }

  enemyUpdates = function (i) {
    enemy[i].updateTank(map, enemy, i, player);
    enemy[i].drawTank();
    if (enemy[i].checkBulletFired()) {
      var position;
      switch (enemy[i].direction) {
        case 'up':
          position = [enemy[i].tankPosition[0] + 8, enemy[i].tankPosition[1]];
          break;
        case 'down':
          position = [enemy[i].tankPosition[0] + 8, enemy[i].tankPosition[1] + 16];
          break;
        case 'right':
          position = [enemy[i].tankPosition[0], enemy[i].tankPosition[1] + 8];
          break;
        case 'left':
          position = [enemy[i].tankPosition[0], enemy[i].tankPosition[1] + 8];
          break;
      }
      enemyBullet[i] = (new Bullet(enemy[i].direction, position, 1));
    }
  }

  enemyBulletCheck = function (playerTank, i, playerNumber) {
    if (playerTank != null && enemyBullet[i].tankDetection(playerTank)) {
      playerTank = null;
      playerNumber == 1 ? player = null : player2 = null;
      playerNumber == 1 ? player1Lives-- : player2Lives--;
    }
    plBullet = playerNumber == 1 ? playerBullet : player2Bullet;
    if (playerTank !== null && plBullet !== null) {
      if (enemyBullet[i].bulletBulletCollision(plBullet.bulletPosition)) {
        enemyBullet[i] = null;
        playerNumber == 1 ? player.bulletFired = false : player2.bulletFired = false;
        enemy[i].bulletFired = false;
        playerNumber == 1 ? playerBullet = null : player2Bullet = null;
      }
    }
  }

  playerBulletEnemyCheck = function (plBullet, i, playerNum) {
    if (plBullet != null && enemy[i]) {
      if (plBullet.tankDetection(enemy[i])) {
        enemy[i].life--;
        if (enemy[i].life <= 0) {
          if (enemy[i].tankSpeed == 1) var score = 100;
          else if (enemy[i].tankSpeed == 0.75) var score = 200;
          else if (enemy[i].tankSpeed == 1.75) var score = 300;
          enemy.splice(i, 1);
          sound.explosionTank.play();
          enemyBullet.splice(i, 1);
          enemyLives--;
          enemyLeft--;
          playerNum === 1 ? player1Score += score : player2Score += score;
        } else {
          sound.bulletWall.play();
        }
      }
    }
  }

  playerBulletUpdates = function (plBullet, playerNum) {
    if (plBullet != null) {
      if (!plBullet.destroyed) {
        plBullet.drawBullet();
        plBullet.updateBullet(map);
      } else {
        plBullet = null;
        playerNum === 1 ? playerBullet = null : player2Bullet = null;
        if (playerNum === 1 && player !== null) player.bulletFired = false;
        else if (playerNum === 2 && player2 !== null) player2.bulletFired = false;
      }
    }
  }

  drawInfo = function () {
    canvas.context.font = '10px prstart';
    canvas.context.fillStyle = 'black';
    canvas.context.textBaseline = 'top';
    canvas.context.fillText('LIVES: ' + (player1Lives >= 0 ? player1Lives : 'X'), 30 + 42, 10);
    canvas.context.fillText('SCORE: ' + player1Score, 30 + 42, 30);
    canvas.context.fillText('ENEMIES', 470, 45);

    if (secondPlayer) {
      canvas.context.fillText('LIVES: ' + (player2Lives >= 0 ? player2Lives : 'X'), 348 + 30, 10);
      canvas.context.fillText('SCORE: ' + player2Score, 348 + 30, 30);
    }
    canvas.context.font = '13px prstart';
    canvas.context.fillText('STAGE:' + stage, 210, 20);
    canvas.context.fillText('P1', 42, 20);
    secondPlayer ? canvas.context.fillText('P2', 348, 20) : null;
    var xpos = 485;
    var ypos = 70;
    for (var i = 0; i <= (enemyLeft - enemyLives); i++) {
      if ((i) >= (enemyLeft - enemyLives)) break;
      enemyIcon.draw(xpos, ypos);
      xpos += 20;
      if ((i + 1) % 2 == 0) {
        ypos += 20;
        xpos = 485;
      }
    }
  }

  keyMapping = function () {
    if (gamepadConnected) p1GamepadKey.draw(43, 480);
    else p1Keymap.draw(43, 480);
    if (secondPlayer) p2Keymap.draw(320, 480);
  }

  gameOverScreen = function () {
    canvas.context.font = '20px prstart';
    canvas.context.fillStyle = 'red';
    canvas.context.textBaseline = 'top';
    canvas.context.fillText('GAME OVER', 170, 200);
    if (!gameoverCounter) gameoverCounter = 1;
    if (gameoverCounter >= 100) {
      return true;
    }
    return false;
  }

}