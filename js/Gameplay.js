var Game = function () {
  var map;
  var player;
  var player2;
  var enemy = [];
  var secondPlayer = false;
  var enemyBullet = [];
  var playerBullet = null;
  var player2Bullet = null;
  var enemyLimit = 4;
  var enemyCounter = 0;
  var enemyLives = 0;

  this.init = function (mapLoad, second) {
    player = new Player();
    secondPlayer = second;
    if (secondPlayer) player2 = new Player2();
    map = mapLoad;
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
    // console.log('app');

    elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      if (enemyCounter % 100 == 0) {
        if (enemyLives < enemyLimit) {
          enemy.push(new Enemy());
          enemyLives++;
          enemyCounter++;
        }
      } else {
        enemyCounter++;
      }
      clearMap();
      if (player === null) player = new Player();
      if (secondPlayer && player2 == null) player2 = new Player2();
      player.updateTank(map, enemy);
      player.drawTank();
      if (player !== null && player.checkBulletFired()) {
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
        playerBullet = new Bullet(player.direction, position, 0);
        sound.bullet.play();
      }

      if (secondPlayer) {
        if (player2 === null) {
          player2 = new Player();
        }
        player2.updateTank(map, enemy);
        player2.drawTank();
        if (player2 !== null && player2.checkBulletFired()) {
          var position;
          switch (player2.direction) {
            case 'up':
              position = [player2.tankPosition[0] + 8, player2.tankPosition[1]];
              break;
            case 'down':
              position = [player2.tankPosition[0] + 8, player2.tankPosition[1] + 16];
              break;
            case 'right':
              position = [player2.tankPosition[0], player2.tankPosition[1] + 8];
              break;
            case 'left':
              position = [player2.tankPosition[0], player2.tankPosition[1] + 8];
              break;
          }
          player2Bullet = new Bullet(player2.direction, position, 0);
          sound.bullet.play();
        }
      }

      for (var i = 0; i < enemy.length; i++) {
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
        if (enemyBullet[i]) {
          if (!enemyBullet[i].destroyed) {
            enemyBullet[i].drawBullet();
            enemyBullet[i].updateBullet(map);
            if (player != null && enemyBullet[i].tankDetection(player)) {
              player = null;
            }
            if (player !== null && playerBullet != null) {
              if (enemyBullet[i].bulletBulletCollision(playerBullet.bulletPosition)) {
                enemyBullet[i] = null;
                player.bulletFired = false;
                enemy[i].bulletFired = false;
                playerBullet = null;
              }
            }
          } else {
            enemyBullet[i] = null;
            enemy[i].bulletFired = false;
          }
        }
        if (secondPlayer) {
          if (enemyBullet[i]) {
            if (!enemyBullet[i].destroyed) {
              if (player2 != null && enemyBullet[i].tankDetection(player2)) {
                player2 = null;
              }
              if (player2 !== null && player2Bullet != null) {
                if (enemyBullet[i].bulletBulletCollision(player2Bullet.bulletPosition)) {
                  enemyBullet[i] = null;
                  player2.bulletFired = false;
                  enemy[i].bulletFired = false;
                  player2Bullet = null;
                }
              }
            } else {
              enemyBullet[i] = null;
              enemy[i].bulletFired = false;
            }
          }
        }
        if (playerBullet != null) {
          if (playerBullet.tankDetection(enemy[i])) {
            enemy.splice(i, 1);
            sound.explosionTank.play();
            enemyBullet.splice(i, 1);
            enemyLives--;
          }
        }
        if (secondPlayer) {
          if (player2Bullet != null) {
            if (player2Bullet.tankDetection(enemy[i])) {
              enemy.splice(i, 1);
              sound.explosionTank.play();
              enemyBullet.splice(i, 1);
              enemyLives--;
            }
          }
        }
      }
      if (map[24][12] == 6 || map[24][13] == 6 || map[25][13] == 6 || map[25][12] == 6) {
        stop = true;
        sound.explosionBase.play();
      }
      drawMap(map);
      if (playerBullet != null) {
        if (!playerBullet.destroyed) {
          playerBullet.drawBullet();
          playerBullet.updateBullet(map);
        } else {
          playerBullet = null;
          if (player !== null) player.bulletFired = false;
        }
      }
      if (secondPlayer) {
        if (player2Bullet != null) {
          if (!player2Bullet.destroyed) {
            player2Bullet.drawBullet();
            player2Bullet.updateBullet(map);
          } else {
            player2Bullet = null;
            if (player2 !== null) player2.bulletFired = false;
          }
        }
      }
    }
    if (keylog[13] && !keylog[13].handled && keylog[13].pressed) {
      stop = true;
    }
    if (!stop) {
      requestAnimationFrame(runGame);
    } else {

      setTimeout(function () {
        canvas.context.clearRect(0, 0, 500, 500)
        gameOver.draw(116, 200);
        sound.over.play();
        setTimeout(initAll, 2500);
      }, 1500);

    }
  }



}