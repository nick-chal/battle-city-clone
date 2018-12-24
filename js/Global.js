var fps = 60;
var fpsInterval = 1000 / fps;
var startTime, now, then, elapsed;

var gamepadHandled = false;

var game; //gameplay object

/*tank and map co-ordinate padding */
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

/*if no key pressed return pressed false */
var keylog = new Proxy({}, proxyHandler);

/*load sound */
var sound = {
  bullet: new Audio('assets/sound/bullet_shot.ogg'),
  start: new Audio('assets/sound/stage_start.ogg'),
  over: new Audio('assets/sound/game_over.ogg'),
  bulletWall: new Audio('assets/sound/bullet_hit_1.ogg'),
  bulletBrick: new Audio('assets/sound/bullet_hit_2.ogg'),
  explosionTank: new Audio('assets/sound/explosion_1.ogg'),
  explosionBase: new Audio('assets/sound/explosion_2.ogg')
}

/*Load all Sprites */
var homekey = new Sprite('assets/images/home_key.png', 250, 140);
var gamepadHome = new Sprite('assets/images/gamepad_home.png', 250, 140);
var gamepadEditor = new Sprite('assets/images/editor_gamepad_map.png', 250, 140);
var p1GamepadKey = new Sprite('assets/images/game_gamepad_key.png', 250, 140);
var p2GamepadKey = new Sprite('assets/images/game_gamepad_key2.png', 250, 140);
var p1Keymap = new Sprite('assets/images/game_keyboard_key.png', 250, 140);
var p2Keymap = new Sprite('assets/images/game_p2_key.png', 250, 140);
var exit = new Sprite('assets/images/exit_key.png', 100, 50);
var keyEditor = new Sprite('assets/images/editor_key_map.png', 250, 140);
var mapType = new Sprite('assets/images/editor_active.png', 32, 220)
var brick = new Sprite('assets/images/wall_brick.png', 16, 16);
var steel = new Sprite('assets/images/wall_steel.png', 16, 16);
var tree = new Sprite('assets/images/tree.png', 16, 16);
var water = new Sprite('assets/images/water1.png', 16, 16);
var base = new Sprite('assets/images/base.png', 32, 32);
var baseDestroyed = new Sprite('assets/images/base_destroyed.png', 32, 32)
var tankEditor = new Sprite('assets/images/tank_player1_editor.png', 32, 32);

var tankSprite = {
  tankRight1: new Sprite('assets/images/tank_right.png', 32, 32),
  tankLeft1: new Sprite('assets/images/tank_left.png', 32, 32),
  tankDown1: new Sprite('assets/images/tank_down.png', 32, 32),
  tankUp1: new Sprite('assets/images/tank_up.png', 32, 32),

  tankRight2: new Sprite('assets/images/tank_player2_right.png', 32, 32),
  tankLeft2: new Sprite('assets/images/tank_player2_left.png', 32, 32),
  tankDown2: new Sprite('assets/images/tank_player2_down.png', 32, 32),
  tankUp2: new Sprite('assets/images/tank_player2_up.png', 32, 32)
}

var creation = new Sprite('assets/images/create_sprite.png', 32, 32);

var enemyIcon = new Sprite('assets/images/enemy.png', 16, 16);
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

/*keyhandling */
document.addEventListener('keydown', function (e) {
  keylog[e.keyCode] = {
    pressed: true,
    handled: false
  };
});

document.addEventListener('keyup', function (e) {
  keylog[e.keyCode] = {
    pressed: false,
    handled: true
  };
})

/*poll the state of the gampepad */
function pollGamepads() {
  var gp = [];
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i])
      gp.push(gamepads[i]);
  }
  return gp;
}

checkXBOX = function (gp) {
  var temp;
  for (var i = 0; i < gp.length; i++) {
    if ((gp[i].id === "Xbox 360 Controller (XInput STANDARD GAMEPAD)" || gp[i].id === "xinput") && i !== 0) {
      temp = gp[0];
      gp[0] = gp[i];
      gp[i] = temp;
      return gp;
    }
  }
  return gp;
}

function randomGenerator(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}


function clearMap() {
  canvas.context.fillStyle = 'gray';
  canvas.context.fillRect(0, 0, 550, 620);
  canvas.context.clearRect(42, 42, 500 - 84, 500 - 84);
}

function drawMap(mapArray) {
  var xpos = 0;
  var ypos = 0;
  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 26; j++) {
      xpos = j * 16 + PADD;
      ypos = i * 16 + PADD;
      var ran = mapArray[i][j];
      switch (ran) {
        case 1:
          brick.draw(xpos, ypos);
          break;
        case 2:
          steel.draw(xpos, ypos);
          break;
        case 3:
          tree.draw(xpos, ypos);
          break;
        case 4:
          water.draw(xpos, ypos);
          break;
        case 5:
          if (i === 24 && j === 12) base.draw(xpos, ypos);
          if (i === 0 && j === 12) base.draw(xpos, ypos);
          break;
        case 6:
          if (i === 24 && j === 12) baseDestroyed.draw(xpos, ypos);
          if (i === 0 && j === 12) baseDestroyed.draw(xpos, ypos);
          break;
        default:
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  canvas = new Canvas('canvas');
});

window.onload = function () {
  new Main().initAll();
}
