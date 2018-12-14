var Game = function () {
  var map;
  var player;
  var enemy = [];
  var enemyBullet = [];
  var playerBullet = null;

  this.init = function (mapLoad) {
    player = new Player();
    map = mapLoad;
    enemy.push(new Enemy);
    enemy.push(new Enemy);
    enemy.push(new Enemy);
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
      clearMap();
      player.updateTank(map);
      player.drawTank();
      if (player.checkBulletFired()) {
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
        enemy[i].updateTank(map);
        enemy[i].drawTank();
        if (playerBullet != null) {
          playerBullet.tankDetection(enemy[i].tankPosition);
        }
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
        if (enemyBullet[i] != null) {
          if (!enemyBullet[i].destroyed) {
            enemyBullet[i].drawBullet();
            enemyBullet[i].updateBullet(map);
            if (playerBullet != null) {
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
      }
      drawMap(map);
      if (playerBullet != null) {
        if (!playerBullet.destroyed) {
          playerBullet.drawBullet();
          playerBullet.updateBullet(map);

        } else {
          playerBullet = null;
          player.bulletFired = false;
        }
      }
    }
    if (keylog[13] && !keylog[13].handled && keylog[13].pressed) {
      stop = true;
    }
    if (!stop) {
      requestAnimationFrame(runGame);
    }
  }



}