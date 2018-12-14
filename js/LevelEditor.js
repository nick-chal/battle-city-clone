var Editor = function () {
  var map = [];
  var tankPosition = [0, 0];
  var itemCounter = 0;
  var positionCounter = 0;

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

  var animateEditor = function () {
    var stop = false;
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
      clearMap();
      drawMap(map);
      tankEditor.draw(tankPosition[0] + PADD, tankPosition[1] + PADD);
      then = now - (elapsed % fpsInterval);
      if (keylog[38] && !keylog[38].handled && keylog[38].pressed && tankPosition[1] > 0) {
        tankPosition[1] -= 32;
        keylog[38].handled = true;
        positionCounter = 0;
      }
      if (keylog[40] && !keylog[40].handled && keylog[40].pressed && tankPosition[1] < (24 * 16)) {
        tankPosition[1] += 32;
        keylog[40].handled = true;
        positionCounter = 0;
      }
      if (keylog[39] && !keylog[39].handled && keylog[39].pressed && tankPosition[0] < (24 * 16)) {
        tankPosition[0] += 32;
        positionCounter = 0;
        keylog[39].handled = true;
      }
      if (keylog[37] && !keylog[37].handled && keylog[37].pressed && tankPosition[0] > 0) {
        tankPosition[0] -= 32;
        keylog[37].handled = true;
        positionCounter = 0;
      }
      if (keylog[32] && !keylog[32].handled && keylog[32].pressed) {
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
        keylog[32].handled = true;
      }

      if (keylog[13] && !keylog[13].handled && keylog[13].pressed) {
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
        new Game().init(map);
        tankEditor.draw(8 * 16 + PADD, 24 * 16 + PADD);
        keylog[13].handled = true;
      }

    }


    if (!stop) {
      requestAnimationFrame(function () {
        animateEditor();
      });
    }

  }


}