var Game = function (second, pvp) {
  var map
  var player = null;
  var player2 = null;
  var secondPlayer = second;
  var player1Lives = 2;
  var player2Lives = secondPlayer ? 2 : -1; //setting initial lives
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
  var maxEnemyScreen = 4; //max enemy at once
  var pvp = pvp;
  var stage;
  var winnerBase = null;
  var pvpGO = false; //doesnt let scoreboard change after gameover

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
    var gamepads = checkXBOX(pollGamepads());
    var gp = gamepads[0];
    pauseHandled = (gamepadConnected && !gp.buttons[9].pressed) ? false : pauseHandled;
    if ((!keylog[13].handled && keylog[13].pressed) || (gamepadConnected && gp.buttons[9].pressed && !pauseHandled)) {
      pause = !pause;
      pauseHandled = true;
      keylog[13].handled = true;
    }
    elapsed = now - then;
    if (gameoverCounter) {
      canvas.context.globalAlpha = 0.2;
      canvas.context.fillStyle = 'gray';
      canvas.context.fillRect(42, 42, 416, 416);
    } else {
      canvas.context.globalAlpha = 1;
    }

    if (elapsed > fpsInterval && !pause) { //checking fps
      if (gameoverCounter) {
        gameoverCounter++;
      }
      then = now - (elapsed % fpsInterval);

      if (enemyCounter % 100 == 0) { //spawn enemy every 100 frames
        if (enemyLives < maxEnemyScreen && enemyCounter / 100 < enemyLimit) {
          enemy.push(new Enemy(pvp));
          enemyLives++;
          enemyCounter++;
        }
      } else {
        enemyCounter++;
      }

      clearMap();
      drawInfo();
      keyMapping();

      if (player === null && player1Lives >= 0) player = new Player(); //create player after killed
      if (secondPlayer && player2 === null && player2Lives >= 0) player2 = new Player2(pvp);
      if (player !== null) playerUpdates(player, 1);
      if (secondPlayer && player2 !== null) playerUpdates(player2, 2);

      /*Update all enemies and their bullets */
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

    /*Check if both players are out of life */
    if (pvp) {
      if (player1Lives < 0 || player2Lives < 0) {
        stop = gameOverScreen();
      }
    } else {
      if (player1Lives < 0 && player2Lives < 0) {
        stop = gameOverScreen();
      }
    }
    /*Check if base is destroyed */
    if (pvp) {
      if (!pvpGO) {
        if (map[0][12] == 6 || map[0][13] == 6 || map[1][13] == 6 || map[1][12] == 6) {
          if (!gameoverCounter) sound.explosionBase.play();
          stop = gameOverScreen();
          winnerBase = 1;
        } else if (map[24][12] == 6 || map[24][13] == 6 || map[25][13] == 6 || map[25][12] == 6) {
          if (!gameoverCounter) sound.explosionBase.play();
          stop = gameOverScreen();
          winnerBase = 2;
        }
      } else if (winnerBase) stop = gameOverScreen();
    } else {
      if (map[24][12] == 6 || map[24][13] == 6 || map[25][13] == 6 || map[25][12] == 6) {
        if (!gameoverCounter) sound.explosionBase.play();
        stop = gameOverScreen();
      }
    }

    /*Check all enemies are killed */
    if (enemyLeft <= 0) {
      if (!gameoverCounter) gameoverCounter = 1;
      if (!pvp) { //check if load new stage or gameOver
        if (gameoverCounter >= 100) {
          if (stage < 6) {
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
      } else stop = gameOverScreen();
    }

    if (!stop) {
      requestAnimationFrame(runGame);
    } else {
      canvas.context.clearRect(0, 0, 550, 620);
      gameOver.draw(116, 200);
      sound.over.play();
      setTimeout(initAll, 2500);
    }
  }

  /*Update and draw player 1 and 2 also initiate player bullet if fired*/
  playerUpdates = function (player, playerNumber) {
    var gamepads = checkXBOX(pollGamepads());
    if (playerNumber === 1) var gp = gamepads[0];
    else {
      if (gamepads.length > 1) var gp = gamepads[1];
      else var gp = null;
    }
    player.updateTank(map, enemy, gp);
    player.drawTank();
    if (player !== null && player.checkBulletFired(gp)) {
      var position;
      switch (player.direction) { //the extra numbers help to set the origin of bullet to nuzzle of tank
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

  /*Update every enemy and also initiate the bullet if ready */
  enemyUpdates = function (i) {
    enemy[i].updateTank(map, enemy, i, player);
    enemy[i].drawTank();
    if (enemy[i].checkBulletFired()) {
      var position;
      switch (enemy[i].direction) { //the extra numbers help to set the origin of bullet to nuzzle of tank
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

  /*Check if enemy bullet hits the player 1 or 2 also bullet-bullet collision of enemy and player */
  enemyBulletCheck = function (playerTank, i, playerNumber) {
    if (playerTank != null && enemyBullet[i].tankDetection(playerTank) && !pvpGO) {
      playerTank = null;
      playerNumber == 1 ? player = null : player2 = null;
      playerNumber == 1 ? player1Lives-- : player2Lives--;
      sound.explosionBase.play();
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

  /*Check player 1 and 2 bullet collision with enemies */
  playerBulletEnemyCheck = function (plBullet, i, playerNum) {
    if (plBullet != null && enemy[i]) {
      if (plBullet.tankDetection(enemy[i])) {
        enemy[i].life--;
        if (enemy[i].life <= 0) {
          if (enemy[i].tankSpeed == 1) var score = 100; //identifying type of enemy
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
      if (pvp && !pvpGO) {
        var tank = playerNum === 1 ? player2 : player;
        if (tank != null && plBullet.tankDetection(tank)) {
          sound.explosionTank.play();
          playerNum === 1 ? player2Bullet = null : playerBullet = null;
          playerNum === 1 ? player1Score += 500 : player2Score += 500;
          playerNum === 2 ? player = null : player2 = null;
          playerNum === 2 ? player1Lives-- : player2Lives--;
        }
        secondBullet = playerNum == 1 ? player2Bullet : playerBullet;
        if (plBullet && secondBullet) {
          if (plBullet.bulletBulletCollision(secondBullet.bulletPosition)) {
            plBullet = null;
            player.bulletFired = false;
            player2.bulletFired = false;
            playerBullet = null;
            player2Bullet = null;
          }

        }

      }
    }
  }

  /*Updating and drawing player 1 and 2 bullets */
  playerBulletUpdates = function (plBullet, playerNum) {
    if (plBullet != null && !pvpGO) {
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

  /*Drawing score, lives and enemies left*/
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

  /* Drawing the controls instruction*/
  keyMapping = function () {
    if (gamepadConnected) p1GamepadKey.draw(43, 480);
    else p1Keymap.draw(43, 480);
    if (secondPlayer) p2Keymap.draw(320, 480);
  }

  /*Drawing GameOver Text with scores and winner */
  gameOverScreen = function () {
    canvas.context.globalAlpha = 1.0;
    canvas.context.font = '20px prstart';
    canvas.context.fillStyle = 'red';
    canvas.context.textBaseline = 'top';
    canvas.context.fillText('GAME OVER', 170, 200);
    if (pvp) {
      canvas.context.font = '12px prstart';
      canvas.context.fillText('P1 SCORE: ' + player1Score, 150, 250);
      if (secondPlayer) canvas.context.fillText('P2 SCORE: ' + player2Score, 150, 300);
      if (winnerBase) canvas.context.fillText('PLAYER ' + winnerBase + " WON!!(DESTROYED BASE)", 100, 350);
      else if ((player1Lives < 0 || player2Lives < 0) && (player1Lives !== player2Lives)) {
        var winner = player1Lives > player2Lives ? '1' : '2';
        canvas.context.fillText('PLAYER ' + winner + " WON!!(OPPONENT NO LIVES LEFT)", 100, 350);
      } else {
        var winner = player1Score > player2Score ? '1' : '2';
        if (player1Score !== player2Score) canvas.context.fillText('PLAYER ' + winner + " WON!!(HIGHER SCORE)", 100, 350);
        else canvas.context.fillText('DRAW!! NONE WON', 150, 350);
      }
      pvpGO = true;
    } else {
      canvas.context.font = '15px prstart';
      canvas.context.fillText('P1 SCORE: ' + player1Score, 150, 250);
      if (secondPlayer) canvas.context.fillText('P2 SCORE: ' + player2Score, 150, 300);
    }
    if (!gameoverCounter) gameoverCounter = 1;
    if (gameoverCounter >= (pvp ? 250 : 120)) {
      return true;
    }
    return false;
  }

}
