var Main = function () {

  /*Run the initital screen with options */
  this.initAll = function () {
    canvas.context.clearRect(0, 0, 550, 620);
    battleCity.draw(62, 50);
    canvas.context.font = '16px prstart';
    canvas.context.fillStyle = 'white';
    canvas.context.textBaseline = 'middle';
    canvas.context.fillText('1 PLAYER', 175, 250);
    canvas.context.fillText('2 PLAYERS', 175, 300);
    canvas.context.fillText('CONSTRUCTION', 175, 350);
    canvas.context.fillText('PLAYER VS PLAYER', 175, 400);
    then = Date.now();
    startTime = then;
    var tankPosition = 250;
    requestAnimationFrame(function () {
      landingView(tankPosition);
    });
  }

  /*show which option is higlighted */
  var landingView = function (tankPosition) {
    var stop = false;
    var gamepads = checkXBOX(pollGamepads());
    var gp = gamepads[0];
    var gamepad = gp;
    if (gp) {
      if (gp.axes[1] < 0.1 && gp.axes[1] > -0.1) gamepadHandled = false;
    }
    var gamepadButtonPressed = false;
    if (gamepad && (gp.buttons[0].pressed || gp.buttons[1].pressed || gp.buttons[2].pressed || gp.buttons[3].pressed))
      gamepadButtonPressed = true;
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {

      canvas.context.clearRect(135, (tankPosition - 16), 32, 32);
      canvas.context.clearRect(0, 450, 550, 600);
      homekey.draw(25, 450);

      if (gamepad) gamepadHome.draw(300, 450);

      then = now - (elapsed % fpsInterval);

      //move selection down
      if (((!keylog[38].handled && keylog[38].pressed) || (gamepad && gp.axes[1] < -.99 && !gamepadHandled)) && tankPosition != 250) {
        tankPosition -= 50;
        gamepad ? gamepadHandled = true : null;
        keylog[38].handled = true;
      }

      //move selection up
      if (((!keylog[40].handled && keylog[40].pressed) || (gamepad && gp.axes[1] > .99 && !gamepadHandled)) && tankPosition != 400) {
        tankPosition += 50;
        gamepad ? gamepadHandled = true : null;
        keylog[40].handled = true;
      }

      tankSprite.tankRight1.drawAnimated(135, tankPosition - 16, [0, 1]);

      /*Check which option is selected when enter is pressed */
      if ((keylog[13].pressed && !keylog[13].handled) || (gamepadButtonPressed)) {

        if (tankPosition === 250) {
          canvas.context.clearRect(0, 0, 550, 620);
          var mapLoad = stages[1].map(function (item) {
            return item.slice();
          });
          game = new Game(false, false);
          game.init(mapLoad);
          stop = true;

        } else if (tankPosition === 300) {
          canvas.context.clearRect(0, 0, 550, 620);
          var mapLoad = stages[1].map(function (item) {
            return item.slice();
          });
          game = new Game(true, false);
          game.init(mapLoad);
          stop = true;

        } else if (tankPosition === 350) {
          canvas.context.clearRect(0, 0, 550, 620);
          new Editor().init();
          stop = true;

        } else if (tankPosition === 400) {
          canvas.context.clearRect(0, 0, 550, 620);
          var mapLoad = pvpStage.map(function (item) {
            return item.slice();
          });
          game = new Game(true, true);
          game.init(mapLoad);
          stop = true;
        }
        keylog[13].handled = true;
      }

    }
    if (!stop) {
      requestAnimationFrame(function () {
        landingView(tankPosition);
      });
    }
  }
}
