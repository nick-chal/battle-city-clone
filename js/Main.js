var canvasContext = null;

var fps = 60;
var fpsInterval = 1000 / fps;
var startTime, now, then, elapsed;

var PADD = 42;

var proxyHandler = {
  get: function (obj, prop) {
    return prop in obj ?
      obj[prop] : {
        pressed: false,
        handled: false
      };
  }
};

var keylog = new Proxy({}, proxyHandler);
var mapType = new Sprite('assets/images/editor_active.png', 32, 220)
var brick = new Sprite('assets/images/wall_brick.png', 16, 16);
var steel = new Sprite('assets/images/wall_steel.png', 16, 16);
var tree = new Sprite('assets/images/tree.png', 16, 16);
var water = new Sprite('assets/images/water1.png', 16, 16);
var base = new Sprite('assets/images/base.png', 32, 32);
var baseDestroyed = new Sprite('assets/images/base_destroyed.png', 32, 32)
var tankEditor = new Sprite('assets/images/tank_player1_editor.png', 32, 32);
var tankRight = new Sprite('assets/images/tank_right.png', 32, 32);
var tankLeft = new Sprite('assets/images/tank_left.png', 32, 32);
var tankDown = new Sprite('assets/images/tank_down.png', 32, 32);
var tankUp = new Sprite('assets/images/tank_up.png', 32, 32);

var enemyIcon = new Sprite('assets/images/enemy.png', 16, 16);
var tank2Right = new Sprite('assets/images/tank_player2_right.png', 32, 32);
var tank2Left = new Sprite('assets/images/tank_player2_left.png', 32, 32);
var tank2Down = new Sprite('assets/images/tank_player2_down.png', 32, 32);
var tank2Up = new Sprite('assets/images/tank_player2_up.png', 32, 32);

var creation = new Sprite('assets/images/create_sprite.png', 32, 32);

var enemySprite = {
  enemyUp1: new Sprite('assets/images/enemy_up_1.png', 32, 32),
  enemyDown1: new Sprite('assets/images/enemy_down_1.png', 32, 32),
  enemyRight1: new Sprite('assets/images/enemy_right_1.png', 32, 32),
  enemyLeft1: new Sprite('assets/images/enemy_left_1.png', 32, 32),

  enemyUp2: new Sprite('assets/images/enemy_up_2.png', 32, 32),
  enemyDown2: new Sprite('assets/images/enemy_down_2.png', 32, 32),
  enemyRight2: new Sprite('assets/images/enemy_right_2.png', 32, 32),
  enemyLeft2: new Sprite('assets/images/enemy_left_2.png', 32, 32),

  enemyUp3: new Sprite('assets/images/enemy_up_3.png', 32, 32),
  enemyDown3: new Sprite('assets/images/enemy_down_3.png', 32, 32),
  enemyRight3: new Sprite('assets/images/enemy_right_3.png', 32, 32),
  enemyLeft3: new Sprite('assets/images/enemy_left_3.png', 32, 32),
}

var bulletRight = new Sprite('assets/images/bullet_right.png', 8, 8);
var bulletLeft = new Sprite('assets/images/bullet_left.png', 8, 8);
var bulletDown = new Sprite('assets/images/bullet_down.png', 8, 8);
var bulletUp = new Sprite('assets/images/bullet_up.png', 8, 8);

var battleCity = new Sprite('assets/images/battle_city.png', 376, 136);
var gameOver = new Sprite('assets/images/game_over.png', 248, 160);

var sound = {
  bullet: new Audio('assets/sound/bullet_shot.ogg'),
  start: new Audio('assets/sound/stage_start.ogg'),
  over: new Audio('assets/sound/game_over.ogg'),
  bulletWall: new Audio('assets/sound/bullet_hit_1.ogg'),
  bulletBrick: new Audio('assets/sound/bullet_hit_2.ogg'),
  explosionTank: new Audio('assets/sound/explosion_1.ogg'),
  explosionBase: new Audio('assets/sound/explosion_2.ogg')
}

document.addEventListener('keydown', function (e) {
  keylog[e.keyCode] = {
    pressed: true,
    handled: false
  };

});

var interval;

var gamepadConnected = false;
var gamepadHandled = false;


function pollGamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  for (var i = 0; i < gamepads.length; i++) {
    var gp = gamepads[i];
    if (gp) {
      return gp;
    }
  }
}

document.addEventListener('keyup', function (e) {
  keylog[e.keyCode] = {
    pressed: false,
    handled: true
  };
  // keylog[e.keyCode]['handled'] = true;
})

document.addEventListener('DOMContentLoaded', function () {
  canvas = new Canvas('canvas');
})
window.addEventListener("gamepaddisconnected", function () {
  gamepadConnected = false;
});

window.addEventListener("gamepadconnected", function () {
  gamepadConnected = true;
});


var landingAnimation;
var game;

window.onload = function () {
  initAll();
}

function randomGenerator(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

var initAll = function () {
  canvas.context.clearRect(0, 0, 550, 620);
  battleCity.draw(62, 50);
  canvas.context.font = '16px prstart';
  canvas.context.fillStyle = 'white';
  canvas.context.textBaseline = 'middle';
  canvas.context.fillText('1 PLAYER', 175, 250);
  canvas.context.fillText('2 PLAYERS', 175, 300);
  canvas.context.fillText('CONSTRUCTION', 175, 350);
  canvas.context.fillText('SAVED LEVELS', 175, 400);
  var tankPosition = 250;
  then = Date.now();
  startTime = then;
  landingAnimation = requestAnimationFrame(function () {
    landingView(tankPosition);
  });
}

var landingView = function (tankPosition) {
  var stop = false;
  var gp = pollGamepads();
  if (gamepadConnected) {
    if (gp.axes[1] < 0.1 && gp.axes[1] > -0.1) gamepadHandled = false;
  }
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    canvas.context.clearRect(135, tankPosition - 16, 32, 32);
    then = now - (elapsed % fpsInterval);
    if (((!keylog[38].handled && keylog[38].pressed) || (gamepadConnected && gp.axes[1] < -.99 && !gamepadHandled)) && tankPosition != 250) {
      tankPosition -= 50;
      gamepadConnected ? gamepadHandled = true : null;
      keylog[38].handled = true;
    }
    if (((!keylog[40].handled && keylog[40].pressed) || (gamepadConnected && gp.axes[1] > .99 && !gamepadHandled)) && tankPosition != 400) {
      tankPosition += 50;
      gamepadConnected ? gamepadHandled = true : null;
      keylog[40].handled = true;
    }
    tankRight.drawAnimated(135, tankPosition - 16, [0, 1]);
    if ((keylog[13].pressed && !keylog[13].handled) || (gamepadConnected && gp.buttons[0].pressed)) {
      if (tankPosition === 350) {
        cancelAnimationFrame(landingAnimation);
        canvas.context.clearRect(0, 0, 500, 500);
        new Editor().init();
        stop = true;
      } else if (tankPosition === 300) {
        canvas.context.clearRect(0, 0, 500, 500);
        var mapLoad = stages[1].map(function (item) {
          return item.slice();
        });
        game = new Game(true);
        game.init(mapLoad);
        stop = true;
      } else if (tankPosition === 250) {
        canvas.context.clearRect(0, 0, 500, 500);
        var mapLoad = stages[1].map(function (item) {
          return item.slice();
        });
        game = new Game(false);
        game.init(mapLoad);
        stop = true;
      }
      keylog[13].handled = true;
    }

  }
  if (!stop) {
    landingAnimation = requestAnimationFrame(function () {
      landingView(tankPosition);
    });
  }
}