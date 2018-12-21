var Editor = function () {
  var map = [];
  var tankPosition = [0, 0];
  var itemCounter = 0; //indicate the active map element
  var positionCounter = 0; //check if tank is already present
  var gamepadCounter = 0; //delay the gamepad event until action taken

  /*initialize the empty map with the base */
  this.init = function () {
    for (var i = 0; i < 26; i++) {
      var tempArr = []
      for (var j = 0; j < 26; j++) {
        tempArr[j] = 0;
      }
      map.push(tempArr);
    }
    map[23][11] = 1;
    map[23][12] = 1;
    map[23][13] = 1;
    map[23][14] = 1;
    map[24][11] = 1;
    map[25][11] = 1;
    map[24][14] = 1;
    map[25][14] = 1;
    map[24][12] = 5;
    then = Date.now();
    startTime = then;
    requestAnimationFrame(function () {
      animateEditor();
    });
  }

  /*move tank and update the map*/
  var animateEditor = function () {
    var stop = false;
    now = Date.now();
    elapsed = now - then;
    var gamepads = checkXBOX(pollGamepads());
    var gamepad = gamepads[0];
    if (elapsed > fpsInterval) {
      clearMap();
      drawMap(map);
      editorActive();
      keyMapping();

      gamepadHandled = gamepadCounter % 5 === 0 ? false : true;
      gamepadCounter++;

      tankEditor.draw(tankPosition[0] + PADD, tankPosition[1] + PADD);

      then = now - (elapsed % fpsInterval);

      if ((!gamepadConnected && (!keylog[38].handled && keylog[38].pressed)) || (gamepadConnected && (gamepad.axes[1] < -.99) && !gamepadHandled)) {
        if (tankPosition[1] > 0) {
          tankPosition[1] -= 32;
          keylog[38].handled = true;
          positionCounter = 0;
          gamepadCounter = 1;
        }
      } else if ((!gamepadConnected && (!keylog[40].handled && keylog[40].pressed)) || (gamepadConnected && (gamepad.axes[1] > .99) && !gamepadHandled)) {
        if (tankPosition[1] < 24 * 16) {
          tankPosition[1] += 32;
          keylog[40].handled = true;
          positionCounter = 0;
          gamepadCounter = 1;
        }
      } else if ((!gamepadConnected && (!keylog[39].handled && keylog[39].pressed)) || (gamepadConnected && (gamepad.axes[0] > .99) && !gamepadHandled)) {
        if (tankPosition[0] < 24 * 16) {
          tankPosition[0] += 32;
          positionCounter = 0;
          keylog[39].handled = true;
          gamepadCounter = 1;
        }
      } else if ((!gamepadConnected && (!keylog[37].handled && keylog[37].pressed)) || (gamepadConnected && (gamepad.axes[0] < -.99) && !gamepadHandled)) {
        if (tankPosition[0] > 0) {
          tankPosition[0] -= 32;
          keylog[37].handled = true;
          positionCounter = 0;
          gamepadCounter = 1;
        }
      }
      if ((!gamepadConnected && (keylog[32] && !keylog[32].handled && keylog[32].pressed)) || (gamepadConnected && gamepad.buttons[0].pressed && !gamepadHandled)) {
        if (positionCounter % 2 == 0) {
          positionCounter++;
        } else {
          itemCounter++;
        }
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < 2; j++) {
            map[tankPosition[1] / 16 + i][tankPosition[0] / 16 + j] = itemCounter % 5;
          }
        }
        gamepadConnected ? gamepadCounter = 1 : keylog[32].handled = true;
      }

      if ((!gamepadConnected && (keylog[13] && !keylog[13].handled && keylog[13].pressed)) || (gamepadConnected && gamepad.buttons[9].pressed)) {
        /*completing the map with base and space for generation */
        map[24][12] = 5;
        map[24][13] = 5;
        map[25][13] = 5;
        map[25][12] = 5;
        map[0][12] = 0;
        map[0][13] = 0;
        map[1][13] = 0;
        map[1][12] = 0;
        map[0][0] = 0;
        map[0][1] = 0;
        map[1][0] = 0;
        map[1][1] = 0;
        map[0][24] = 0;
        map[0][25] = 0;
        map[1][24] = 0;
        map[1][25] = 0;
        map[24][8] = 0;
        map[24][9] = 0;
        map[25][9] = 0;
        map[25][8] = 0;
        stop = true;

        console.log(JSON.stringify(map));
        clearMap();
        keylog[13].handled = true;
        game = new Game(false);
        game.init(map); //start gameplay from this map
      }
    }

    if (!stop) {
      requestAnimationFrame(function () {
        animateEditor();
      });
    }

  }

  /*highlight the active tile */
  editorActive = function () {
    canvas.context.font = '10px prstart';
    canvas.context.fillStyle = 'black';
    canvas.context.textBaseline = 'top';
    canvas.context.fillText('ACTIVE', 475, 45);
    canvas.context.fillText('TILE', 485, 60);
    canvas.context.fillStyle = 'red';
    canvas.context.fillRect(485, 82 + (47 * (itemCounter % 5)), 38, 38);
    mapType.draw(488, 85);
  }

  keyMapping = function () {
    if (gamepadConnected) gamepadEditor.draw(43, 480);
    else keyEditor.draw(43, 480);
  }


}
