var Game = function () {
  var map;
  var player;
  var enemy = [];
  var enemyBullet = [];
  var playerBullet = null;
  var enemyLimit = 4;
  var enemyCounter = 0;
  var enemyLives = 0;

  this.init = function (mapLoad) {
    player = new Player();
    map = mapLoad;
    then = Date.now();
    startTime = then;
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
      if (enemyCounter % 300 == 0) {
        if (enemyLives < enemyLimit) {
          enemy.push(new Enemy());
          enemyLives++;
          enemyCounter++;
        }
      } else {
        enemyCounter++;
      }
      clearMap();
      if (player === null) {
        player = new Player();
      }
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
            if (player != null && enemyBullet[i].tankDetection(player.tankPosition)) {
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
        if (playerBullet != null) {
          if (playerBullet.tankDetection(enemy[i].tankPosition)) {
            enemy.splice(i, 1);
            enemyBullet.splice(i, 1);
            enemyLives--;
          }
        }
      }

      drawMap(map);
      if (map[24][12] == 6 || map[24][13] == 6 || map[25][13] == 6 || map[25][12] == 6) {
        stop = true;
        canvas.context.clearRect(0, 0, 500, 500)
        gameOver.draw(116, 200);
      }
      if (playerBullet != null) {
        if (!playerBullet.destroyed) {
          playerBullet.drawBullet();
          playerBullet.updateBullet(map);
        } else {
          playerBullet = null;
          if (player !== null) player.bulletFired = false;
        }
      }
    }
    if (keylog[13] && !keylog[13].handled && keylog[13].pressed) {
      stop = true;
    }
    if (!stop) {
      requestAnimationFrame(runGame);
    } else {
      setTimeout(initAll, 2500);
    }
  }



}