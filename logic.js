function setLocalizationData(index, position, direction) {
  LPD.setLocationAtIndex(index, position);
  let keyForExtraLocationData = locationToKey(position);
  GBD.extraLocationData.set(keyForExtraLocationData, direction);
}

function doSomeInitialization() {

  let canvasBoard = getById("canvasBoard");
  cbCtx = canvasBoard.getContext("2d");

  setLocalizationData(0, [11, 1], Direction.UP);
  setLocalizationData(1, [10, 1], Direction.UP);
  setLocalizationData(2, [9, 1], Direction.UP);
  setLocalizationData(3, [8, 1], Direction.UP);
  setLocalizationData(4, [7, 1], Direction.UP);
  setLocalizationData(5, [6, 1], Direction.UP);
  setLocalizationData(6, [5, 1], Direction.UP);
  setLocalizationData(7, [4, 1], Direction.UP);

  setLocalizationData(8, [3, 1], Direction.RIGHT);
  setLocalizationData(9, [3, 2], Direction.RIGHT);
  setLocalizationData(10, [3, 3], Direction.RIGHT);

  LPD.playerHeadIndex = 10;
  LPD.playerTailIndex = 0;

  LPD.headPositionCurrent = [3, 3];
  LPD.headPositionNext = [3, 4];

  // drawing the initial board and stuff

  getById("score").textContent = "0";
  getById("speed").textContent = GBD.choosenSpeed;

  getById("row_0").textContent = "WWWWWWWWWWWWWWWWWWWWWWWW";
  getById("row_1").textContent = "W                      W";
  getById("row_2").textContent = "W                      W";
  getById("row_3").textContent = "WBBH                   W";
  getById("row_4").textContent = "WB                     W";
  getById("row_5").textContent = "WB                     W";
  getById("row_6").textContent = "WB                     W";
  getById("row_7").textContent = "WB                     W";
  getById("row_8").textContent = "WB                  F  W";
  getById("row_9").textContent = "WB                     W";
  getById("row_10").textContent = "WB                     W";
  getById("row_11").textContent = "WB                     W";
  getById("row_11").textContent = "WB                     W";
  getById("row_12").textContent = "W                      W";
  getById("row_13").textContent = "W                      W";
  getById("row_14").textContent = "W                      W";
  getById("row_15").textContent = "W                      W";
  getById("row_16").textContent = "W                      W";
  getById("row_17").textContent = "W                      W";
  getById("row_18").textContent = "W                      W";
  getById("row_19").textContent = "W                      W";
  getById("row_20").textContent = "W                      W";
  getById("row_21").textContent = "W                      W";
  getById("row_22").textContent = "W                      W";
  getById("row_23").textContent = "WWWWWWWWWWWWWWWWWWWWWWWW";

  translateCharBoardToCanvas();

  toggleBareBones();
}

function translateCharBoardToCanvas() {
  let position = null;
  let cellContent = null;
  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j <= 23; j++) {
      position = [i, j];
      cellContent = getCellContent(position);
      drawSquare(position, cellContent);
    }
  }
}

function getRandomNumber() {
  let randomFloating = Math.random() * 24;
  let result = Math.floor(randomFloating);
  return result;
}

function placeFruit() {
  if (GBD.fruitCount < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let fruitPosition = [row, col];
    let cellContent = getCellContent(fruitPosition);
    if (cellContent === CellContent.SPACE) {
      GBD.fruitCount = GBD.fruitCount + 1;
      placeCellContent(fruitPosition, CellContent.FRUIT);
    }
  }
}

function placeKillingFruit() {
  if (GBD.killingFruitCount < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let killingPosition = [row, col];
    let cellContent = getCellContent(killingPosition);
    if (cellContent === CellContent.SPACE && !nearHeadZone(killingPosition)) {
      GBD.killingFruitCount = GBD.killingFruitCount + 1;
      placeCellContent(killingPosition, CellContent.KILLING_FRUIT);
      kfsList[kfsPointer] = killingPosition;
      increseKFP();
    }
  }
}

function nearHeadZone(killingPosition) {

  let headDirection = LPD.headDirection;
  let headPosition = LPD.headPositionCurrent;

  let x = headPosition[0];
  let y = headPosition[1];

  let kx = killingPosition[0];
  let ky = killingPosition[1];

  if (headDirection === Direction.RIGHT) {

    return (x === kx && y + 1 === ky) ||
      (x + 1 === kx && y + 1 === ky) ||
      (x === kx && y === ky) ||
      (x + 1 === kx && y === ky) ||
      (x + 2 === kx && y === ky) ||
      (x + 3 === kx && y === ky) ||
      (x === kx && y - 1 === ky) ||
      (x + 1 === kx && y - 1 === ky)

  } else if (headDirection === Direction.LEFT) {

  } else if (headDirection === Direction.UP) {

  } else if (headDirection === Direction.DOWN) {

  }

}

function increseKFP() {
  kfsPointer = kfsPointer + 1;
  if (kfsPointer == 3) {
    kfsPointer = 0;
  }
}

function getCellContentNextPositionHead() {
  let contentOfNextPositionHead = getCellContent(LPD.headPositionNext);
  return contentOfNextPositionHead;
}

function calculateHeadDirection() {

  if (RD.pressedKey === KeyboardKey.RIGHT) {

    if (LPD.headDirection === Direction.DOWN || LPD.headDirection === Direction.UP) {

      LPD.headDirection = Direction.RIGHT;
      RD.pressedKey = KeyboardKey.NO_KEY;
    }

  } else if (RD.pressedKey === KeyboardKey.LEFT) {

    if (LPD.headDirection === Direction.DOWN || LPD.headDirection === Direction.UP) {

      LPD.headDirection = Direction.LEFT;
      RD.pressedKey = KeyboardKey.NO_KEY;
    }

  } else if (RD.pressedKey === KeyboardKey.DOWN) {

    if (LPD.headDirection === Direction.RIGHT || LPD.headDirection === Direction.LEFT) {

      LPD.headDirection = Direction.DOWN;
      RD.pressedKey = KeyboardKey.NO_KEY;
    }

  } else if (RD.pressedKey === KeyboardKey.UP) {

    if (LPD.headDirection === Direction.RIGHT || LPD.headDirection === Direction.LEFT) {

      LPD.headDirection = Direction.UP;
      RD.pressedKey = KeyboardKey.NO_KEY;
    }

  }

}

function calculateHeadNextPos() {

  if (LPD.headDirection === Direction.RIGHT) {
    LPD.headPositionNext = [LPD.headPositionCurrent[0], LPD.headPositionCurrent[1] + 1];
  }

  if (LPD.headDirection === Direction.LEFT) {
    LPD.headPositionNext = [LPD.headPositionCurrent[0], LPD.headPositionCurrent[1] - 1];
  }

  if (LPD.headDirection === Direction.UP) {
    LPD.headPositionNext = [LPD.headPositionCurrent[0] - 1, LPD.headPositionCurrent[1]];
  }

  if (LPD.headDirection === Direction.DOWN) {
    LPD.headPositionNext = [LPD.headPositionCurrent[0] + 1, LPD.headPositionCurrent[1]];
  }

}


function processKeydown(event) {

  if (event.key === KeyboardKey.LEFT) {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.LEFT;

  } else if (event.key === KeyboardKey.RIGHT) {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.RIGHT;

  } else if (event.key === KeyboardKey.UP) {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.UP;

  } else if (event.key === KeyboardKey.DOWN) {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.DOWN;

  } else if (event.key === KeyboardKey.SPACE) {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.SPACE;

  } else if (event.key === 'p' || event.key === 'P') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.P;

  } else if (event.key === 's' || event.key === 'S') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.S;
    toggleBareBones();

  } else if (event.key === '+') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.PLUS;

  } else if (event.key === '-') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.MINUS;

  } else if (event.key === 'j' || event.key === 'J') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.J;

  } else if (event.key === 'r' || event.key === 'R') {
    event.preventDefault();
    event.stopPropagation();
    RD.pressedKey = KeyboardKey.R;
    restart();
  }

}

function aDelay(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

function setSpeed() {
  GBD.choosenSpeed = "6";
  let intSpeed = parseInt(GBD.choosenSpeed);
  intSpeed = 10 - intSpeed;
  RD.delayInterval = 100 * intSpeed;
  showSpeed();
}

function increaseSpeed() {
  let intSpeed = parseInt(GBD.choosenSpeed);
  if (intSpeed < 9) {
    intSpeed = intSpeed + 1;
    GBD.choosenSpeed = String(intSpeed);
    intSpeed = 10 - intSpeed;
    RD.delayInterval = 100 * intSpeed;
    showSpeed();
  }
}

function decreaseSpeed() {
  let intSpeed = parseInt(GBD.choosenSpeed);
  if (intSpeed > 1) {
    intSpeed = intSpeed - 1;
    GBD.choosenSpeed = String(intSpeed);
    intSpeed = 10 - intSpeed;
    RD.delayInterval = 100 * intSpeed;
    showSpeed();
  }
}

function showSpeed() {
  getById("speed").textContent = "" + GBD.choosenSpeed;
}

async function play() {
  setSpeed();
  doSomeInitialization();
  drawPlayer();
  while (!RD.gameOver) {
    checkForSpecialKeys();
    if (!RD.paused) {
      gameCycle();
    }
    await aDelay(RD.delayInterval);
  }
}

function restart() {
  location.reload();
}

function toggleBareBones() {
  const bonesOverlay = getById("bonesOverlay");
  const barebonestoggle = getById("barebonestoggle");
  if (!GBD.showingBareBones) {
    barebonestoggle.innerText = "HIDE";
    bonesOverlay.style.display = 'none';
    bonesOverlay.style.border = '1px solid Gainsboro';
  } else {
    barebonestoggle.innerText = "SEE";
    bonesOverlay.style.display = 'flex';
    bonesOverlay.style.position = 'absolute';
    bonesOverlay.style.top = '0';
    bonesOverlay.style.left = '0';
    bonesOverlay.style.width = '100%';
    bonesOverlay.style.height = '100%';
    bonesOverlay.style.backgroundColor = 'Gainsboro';
    bonesOverlay.style.zIndex = '10';
    bonesOverlay.style.justifyContent = 'center';
    bonesOverlay.style.alignItems = 'center';
    bonesOverlay.style.border = '2px dashed gray';
  }
  GBD.showingBareBones = !GBD.showingBareBones;
}

function checkForSpecialKeys() {
  if (RD.pressedKey === KeyboardKey.P) {
    RD.paused = !RD.paused;
    RD.pressedKey = KeyboardKey.NO_KEY;
  } else if (RD.pressedKey === KeyboardKey.S) {
    setSpeed();
    RD.pressedKey = KeyboardKey.NO_KEY;
  } else if (RD.pressedKey === KeyboardKey.PLUS) {
    increaseSpeed();
    RD.pressedKey = KeyboardKey.NO_KEY;
  } else if (RD.pressedKey === KeyboardKey.MINUS) {
    decreaseSpeed();
    RD.pressedKey = KeyboardKey.NO_KEY;
  }
}

function markTheJump() {
  placeCellContent(LPD.headPositionNext, CellContent.JUMP);
}

function gameCycle() {
  placeFruit();
  placeKillingFruit();
  calculateHeadDirection();
  calculateHeadNextPos();
  let nextCellContent = getCellContentNextPositionHead()
  if ((nextCellContent === CellContent.SPACE) ||
    (nextCellContent === CellContent.BODY && isNextPositionSameAsTailPosition())) {
    movePlayerAhead();
  } else if (nextCellContent === CellContent.FRUIT) {
    growPlayerAhead();
  } else if (nextCellContent === CellContent.BODY) {
    if ((RD.pressedKey === KeyboardKey.J)) {
      RD.pressedKey = KeyboardKey.NO_KEY;
      markTheJump();
      movePlayerAhead();
      // nothing
    } else {
      movePlayerAhead();
      drawPlayerDeathSync(1, Color.JUMP_MARK);
      doGameOver("you stomp on yourself!!!");
    }
  } else if (nextCellContent === CellContent.WALL) {
    clearHeadSourroundings();
    drawPlayerDeathSync(1, Color.WALL);
    doGameOver("you hit a wall!!!");
  } else if (nextCellContent === CellContent.KILLING_FRUIT) {
    growToDeath();

  }
}

function isNextPositionSameAsTailPosition() {
  let tailLocation = LPD.getLocationAtIndex(LPD.playerTailIndex);
  return ((tailLocation[0] === LPD.headPositionNext[0]) &&
    (tailLocation[1] === LPD.headPositionNext[1]));
}

async function doGameOver(mje) {
  RD.gameOver = true;
  await aDelay(RD.deathDelay * (LPD.playerHeadIndex - LPD.playerTailIndex + 5));

  const messagewrapper = getById("message-wrapper");
  messagewrapper.style.border = '3px solid red';
  messagewrapper.style.transition = 'border-color 0.5s ease';
  setTimeout(() => {
    messagewrapper.style.borderColor = 'transparent';
    messagewrapper.style.border = 'none';
  }, 550);

  await aDelay(160);

  const messagebox = getById("message");
  messagebox.style.color = "CornflowerBlue"; 
  messagebox.style.fontSize = "14x"; 
  messagebox.innerHTML = "<b>Game Over: " + mje + "</b>"
  messagebox.style.border = '3px solid red';
  messagebox.style.transition = 'border-color 1.5s ease';
  setTimeout(() => {
    messagebox.style.borderColor = 'transparent';
    messagebox.style.border = 'none';
  }, 1550);

}

function movePlayerAhead() {
  moveTailAhead();
  moveHeadAhead();
}

function growPlayerAhead() {
  GBD.fruitCount = GBD.fruitCount - 1;
  moveKillingFruit();
  moveHeadAhead();
  incrementScore();
}

function growToDeath() {
  GBD.fruitCount = GBD.fruitCount - 1;
  moveHeadAhead();
  drawPlayerDeathSync(1, Color.KILLING_FRUIT);
  doGameOver("you eat a killing fruit!!!");
}

let kfsList = [];
let kfsPointer = 0;

function moveKillingFruit() {
  let killingLocation = kfsList[kfsPointer];
  if (killingLocation !== undefined) {
    let kfLocationContent = getCellContent(killingLocation);
    if (kfLocationContent === CellContent.KILLING_FRUIT) {
      placeCellContent(killingLocation, CellContent.SPACE);
      increseKFP();
      GBD.killingFruitCount = GBD.killingFruitCount - 1;
    }
  }

}

function incrementScore() {
  GBD.score = GBD.score + 1;
  getById("score").textContent = "" + GBD.score;
}

function getById(id) {
  return document.getElementById(id);
}

function moveHeadAhead() {

  let currentPosContent = getCellContent(LPD.headPositionCurrent);
  if (currentPosContent === CellContent.JUMP) {
    // nothing
  } else {
    placeCellContent(LPD.headPositionCurrent, CellContent.BODY);
  }

  let keyForBody = locationToKey(LPD.headPositionCurrent);
  GBD.extraLocationData.set(keyForBody, LPD.headDirection);

  let nextPosContent = getCellContent(LPD.headPositionNext);
  if (nextPosContent === CellContent.JUMP) {
    // nothing
  } else {
    placeCellContent(LPD.headPositionNext, CellContent.HEAD);
  }

  let keyForHead = locationToKey(LPD.headPositionNext);
  GBD.extraLocationData.set(keyForHead, LPD.headDirection);

  LPD.headPositionCurrent = [LPD.headPositionNext[0], LPD.headPositionNext[1]];

  LPD.playerHeadIndex = LPD.playerHeadIndex + 1;

  LPD.setLocationAtIndex(LPD.playerHeadIndex, LPD.headPositionCurrent);

}

function locationToKey(location) {
  return String(location[0]) + '_' + String(location[1]);
}

function moveTailAhead() {

  const tailLocation = LPD.getLocationAtIndex(LPD.playerTailIndex);

  let nextPosContent = getCellContent(tailLocation);
  if (nextPosContent === CellContent.JUMP) {
    placeCellContent(tailLocation, CellContent.BODY);
  } else {
    placeCellContent(tailLocation, CellContent.SPACE);
  }

  LPD.removeLocationAtIndex(LPD.playerTailIndex);

  LPD.playerTailIndex = LPD.playerTailIndex + 1;
}

document.addEventListener('keydown', processKeydown);
window.addEventListener('load', play);

