"use strict";

import * as State from './state.js';
import * as Constants from './constants.js';

function setLocalizationData(index, position, direction) {
  State.LPD.setLocationAtIndex(index, position);
  let keyForExtraLocationData = State.locationToKey(position);
  State.GBD.extraLocationData.set(keyForExtraLocationData, direction);
}

function doSomeInitialization() {

  setLocalizationData(0, [11, 1], Constants.Direction.UP);
  setLocalizationData(1, [10, 1], Constants.Direction.UP);
  setLocalizationData(2, [9, 1], Constants.Direction.UP);
  setLocalizationData(3, [8, 1], Constants.Direction.UP);
  setLocalizationData(4, [7, 1], Constants.Direction.UP);
  setLocalizationData(5, [6, 1], Constants.Direction.UP);
  setLocalizationData(6, [5, 1], Constants.Direction.UP);
  setLocalizationData(7, [4, 1], Constants.Direction.UP);

  setLocalizationData(8, [3, 1], Constants.Direction.RIGHT);
  setLocalizationData(9, [3, 2], Constants.Direction.RIGHT);
  setLocalizationData(10, [3, 3], Constants.Direction.RIGHT);

  State.LPD.playerHeadIndex = 10;
  State.LPD.playerTailIndex = 0;

  State.LPD.headPositionCurrent = [3, 3];
  State.LPD.headPositionNext = [3, 4];

  // drawing the initial board and stuff

  getById("score").textContent = "0";
  getById("speed").textContent = State.GBD.choosenSpeed;

  State.storeRowOfCellContent("row-0", "WWWWWWWWWWWWWWWWWWWWWWWW");
  State.storeRowOfCellContent("row-1", "W                      W");
  State.storeRowOfCellContent("row-2", "W                      W");
  State.storeRowOfCellContent("row-3", "WBBH                   W");
  State.storeRowOfCellContent("row-4", "WB                     W");
  State.storeRowOfCellContent("row-5", "WB                     W");
  State.storeRowOfCellContent("row-6", "WB                     W");
  State.storeRowOfCellContent("row-7", "WB                     W");
  State.storeRowOfCellContent("row-8", "WB                  F  W");
  State.storeRowOfCellContent("row-9", "WB                     W");
  State.storeRowOfCellContent("row-10", "WB                     W");
  State.storeRowOfCellContent("row-11", "WB                     W");
  State.storeRowOfCellContent("row-11", "WB                     W");
  State.storeRowOfCellContent("row-12", "W                      W");
  State.storeRowOfCellContent("row-13", "W                      W");
  State.storeRowOfCellContent("row-14", "W                      W");
  State.storeRowOfCellContent("row-15", "W                      W");
  State.storeRowOfCellContent("row-16", "W                      W");
  State.storeRowOfCellContent("row-17", "W                      W");
  State.storeRowOfCellContent("row-18", "W                      W");
  State.storeRowOfCellContent("row-19", "W                      W");
  State.storeRowOfCellContent("row-20", "W                      W");
  State.storeRowOfCellContent("row-21", "W                      W");
  State.storeRowOfCellContent("row-22", "W                      W");
  State.storeRowOfCellContent("row-23", "WWWWWWWWWWWWWWWWWWWWWWWW");

  toggleBareBones();

  State.RD.gameStatus = Constants.GameStatus.RUNNING;
}

function getRandomNumber() {
  let randomFloating = Math.random() * 24;
  let result = Math.floor(randomFloating);
  return result;
}

function placeFruit() {
  if (State.GBD.fruitCount < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let fruitPosition = [row, col];
    let cellContent = State.getCellContent(fruitPosition);
    if (cellContent === Constants.CellContent.SPACE) {
      State.GBD.fruitCount = State.GBD.fruitCount + 1;
      State.pushCellChange(fruitPosition, Constants.CellContent.FRUIT);
    }
  }
}

function placeKillingFruit() {
  if (State.GBD.killingFruitCount < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let killingPosition = [row, col];
    let cellContent = State.getCellContent(killingPosition);
    if (cellContent === Constants.CellContent.SPACE && !nearHeadZone(killingPosition)) {
      State.GBD.killingFruitCount = State.GBD.killingFruitCount + 1;
      State.pushCellChange(killingPosition, Constants.CellContent.KILLING_FRUIT);
      kfsList[kfsPointer] = killingPosition;
      increseKFP();
    }
  }
}

function nearHeadZone(killingPosition) {

  let headDirection = State.LPD.headDirection;
  let headPosition = State.LPD.headPositionCurrent;

  let x = headPosition[0];
  let y = headPosition[1];

  let kx = killingPosition[0];
  let ky = killingPosition[1];

  if (headDirection === Constants.Direction.RIGHT) {

    return (x === kx && y + 1 === ky) ||
      (x + 1 === kx && y + 1 === ky) ||
      (x === kx && y === ky) ||
      (x + 1 === kx && y === ky) ||
      (x + 2 === kx && y === ky) ||
      (x + 3 === kx && y === ky) ||
      (x === kx && y - 1 === ky) ||
      (x + 1 === kx && y - 1 === ky)

  } else if (headDirection === Constants.Direction.LEFT) {

  } else if (headDirection === Constants.Direction.UP) {

  } else if (headDirection === Constants.Direction.DOWN) {

  }

}

function increseKFP() {
  kfsPointer = kfsPointer + 1;
  if (kfsPointer == 3) {
    kfsPointer = 0;
  }
}

function getCellContentNextPositionHead() {
  let contentOfNextPositionHead = State.getCellContent(State.LPD.headPositionNext);
  return contentOfNextPositionHead;
}

function calculateHeadDirection() {

  if (State.RD.pressedKey === Constants.KeyboardKey.RIGHT) {

    if (State.LPD.headDirection === Constants.Direction.DOWN || State.LPD.headDirection === Constants.Direction.UP) {

      State.LPD.headDirection = Constants.Direction.RIGHT;
      State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
    }

  } else if (State.RD.pressedKey === Constants.KeyboardKey.LEFT) {

    if (State.LPD.headDirection === Constants.Direction.DOWN || State.LPD.headDirection === Constants.Direction.UP) {

      State.LPD.headDirection = Constants.Direction.LEFT;
      State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
    }

  } else if (State.RD.pressedKey === Constants.KeyboardKey.DOWN) {

    if (State.LPD.headDirection === Constants.Direction.RIGHT || State.LPD.headDirection === Constants.Direction.LEFT) {

      State.LPD.headDirection = Constants.Direction.DOWN;
      State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
    }

  } else if (State.RD.pressedKey === Constants.KeyboardKey.UP) {

    if (State.LPD.headDirection === Constants.Direction.RIGHT || State.LPD.headDirection === Constants.Direction.LEFT) {

      State.LPD.headDirection = Constants.Direction.UP;
      State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
    }

  }

}

function calculateHeadNextPos() {

  if (State.LPD.headDirection === Constants.Direction.RIGHT) {
    State.LPD.headPositionNext = [State.LPD.headPositionCurrent[0], State.LPD.headPositionCurrent[1] + 1];
  }

  if (State.LPD.headDirection === Constants.Direction.LEFT) {
    State.LPD.headPositionNext = [State.LPD.headPositionCurrent[0], State.LPD.headPositionCurrent[1] - 1];
  }

  if (State.LPD.headDirection === Constants.Direction.UP) {
    State.LPD.headPositionNext = [State.LPD.headPositionCurrent[0] - 1, State.LPD.headPositionCurrent[1]];
  }

  if (State.LPD.headDirection === Constants.Direction.DOWN) {
    State.LPD.headPositionNext = [State.LPD.headPositionCurrent[0] + 1, State.LPD.headPositionCurrent[1]];
  }

}


function processKeydown(event) {

  if (event.key === Constants.KeyboardKey.LEFT) {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.LEFT;

  } else if (event.key === Constants.KeyboardKey.RIGHT) {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.RIGHT;

  } else if (event.key === Constants.KeyboardKey.UP) {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.UP;

  } else if (event.key === Constants.KeyboardKey.DOWN) {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.DOWN;

  } else if (event.key === Constants.KeyboardKey.SPACE) {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.SPACE;

  } else if (event.key === 'p' || event.key === 'P') {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.P;

  } else if (event.key === 's' || event.key === 'S') {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.S;
    toggleBareBones();

  } else if (event.key === '+') {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.PLUS;

  } else if (event.key === '-') {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.MINUS;

  } else if (event.key === 'j' || event.key === 'J') {
    event.preventDefault();
    event.stopPropagation();
    State.LPD.jumped = 2;

  } else if (event.key === 'r' || event.key === 'R') {
    event.preventDefault();
    event.stopPropagation();
    State.RD.pressedKey = Constants.KeyboardKey.R;
    restart();
  }

}

export function aDelay(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

function setSpeed() {
  State.GBD.choosenSpeed = "6";
  let intSpeed = parseInt(State.GBD.choosenSpeed);
  intSpeed = 10 - intSpeed;
  State.RD.delayInterval = 100 * intSpeed;
  showSpeed();
}

function increaseSpeed() {
  let intSpeed = parseInt(State.GBD.choosenSpeed);
  if (intSpeed < 9) {
    intSpeed = intSpeed + 1;
    State.GBD.choosenSpeed = String(intSpeed);
    intSpeed = 10 - intSpeed;
    State.RD.delayInterval = 100 * intSpeed;
    showSpeed();
  }
}

function decreaseSpeed() {
  let intSpeed = parseInt(State.GBD.choosenSpeed);
  if (intSpeed > 1) {
    intSpeed = intSpeed - 1;
    State.GBD.choosenSpeed = String(intSpeed);
    intSpeed = 10 - intSpeed;
    State.RD.delayInterval = 100 * intSpeed;
    showSpeed();
  }
}

function showSpeed() {
  getById("speed").textContent = "" + State.GBD.choosenSpeed;
}

export async function play() {
  setSpeed();
  doSomeInitialization();
  while (!State.RD.gameOver) {
    checkForSpecialKeys();
    if (!State.RD.paused) {
      gameCycle();
    }
    await aDelay(State.RD.delayInterval);
  }
}

function restart() {
  location.reload();
}

function toggleBareBones() {
  const bonesOverlay = getById("bones-overlay");
  const barebonestoggle = getById("bare-bones-toggle");
  if (!State.GBD.showingBareBones) {
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
  State.GBD.showingBareBones = !State.GBD.showingBareBones;
}

function checkForSpecialKeys() {
  if (State.RD.pressedKey === Constants.KeyboardKey.P) {
    State.RD.paused = !State.RD.paused;
    State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
  } else if (State.RD.pressedKey === Constants.KeyboardKey.S) {
    setSpeed();
    State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
  } else if (State.RD.pressedKey === Constants.KeyboardKey.PLUS) {
    increaseSpeed();
    State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
  } else if (State.RD.pressedKey === Constants.KeyboardKey.MINUS) {
    decreaseSpeed();
    State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
  }
}

function markTheJump() {
  State.pushCellChange(State.LPD.headPositionNext, Constants.CellContent.JUMP);
}

function gameCycle() {
  let jumpingIndicator = getById('jump-indicator');
  if (State.LPD.jumped>0) {
    jumpingIndicator.style.color = Constants.Color.ALERT;
  } else {
    jumpingIndicator.style.color = Constants.Color.WALL;
  }
  placeFruit();
  placeKillingFruit();
  calculateHeadDirection();
  calculateHeadNextPos();
  let nextCellContent = getCellContentNextPositionHead()
  if ((nextCellContent === Constants.CellContent.SPACE) ||
    (nextCellContent === Constants.CellContent.BODY && isNextPositionSameAsTailPosition())) {
    movePlayerAhead();
  } else if (nextCellContent === Constants.CellContent.FRUIT) {
    if ((State.LPD.jumped > 0)) {
      storeJumpedData(State.LPD.headPositionNext, Constants.CellContent.FRUIT)
      markTheJump();
      movePlayerAhead();
    } else {
      growPlayerAhead();
    }
  } else if (nextCellContent === Constants.CellContent.BODY) {
    if ((State.LPD.jumped > 0)) {
      State.RD.pressedKey = Constants.KeyboardKey.NO_KEY;
      storeJumpedData(State.LPD.headPositionNext, Constants.CellContent.BODY)
      markTheJump();
      movePlayerAhead();
      // nothing
    } else {
      movePlayerAhead();
      State.RD.gameStatus = Constants.GameStatus.DEATH_BY_BODY;
      doGameOver("you stomp on yourself!!!");
    }
  } else if (nextCellContent === Constants.CellContent.WALL) {
    State.RD.gameStatus = Constants.GameStatus.DEATH_BY_WALL;
    doGameOver("you hit a wall!!!");
  } else if (nextCellContent === Constants.CellContent.KILLING_FRUIT) {
     if ((State.LPD.jumped > 0)) {
      storeJumpedData(State.LPD.headPositionNext, Constants.CellContent.KILLING_FRUIT)
      markTheJump();
      movePlayerAhead();
    } else {
      growToDeath();
    }
  }
  State.LPD.jumped--;
}

function storeJumpedData(position, jumpedThing) {
  let locationKey = State.locationToKey(position);
  State.GBD.jumpedThingsData.set(locationKey, jumpedThing);
}

function isNextPositionSameAsTailPosition() {
  let tailLocation = State.LPD.getLocationAtIndex(State.LPD.playerTailIndex);
  return ((tailLocation[0] === State.LPD.headPositionNext[0]) &&
    (tailLocation[1] === State.LPD.headPositionNext[1]));
}

async function doGameOver(mje) {
  State.RD.gameOver = true;
  await aDelay(State.RD.deathDelay * (State.LPD.playerHeadIndex - State.LPD.playerTailIndex + 5));

  const messagewrapper = getById("message-wrapper");
  messagewrapper.style.background = 'red';
  messagewrapper.style.transition = 'background 0.5s ease';
  setTimeout(() => {
    messagewrapper.style.background = 'lightgray';
  }, 550);

  await aDelay(160);

  const messagebox = getById("message");
  messagebox.style.color = "red"; 
  messagebox.style.fontSize = "14x"; 
  messagebox.innerHTML = "<b>Game Over: " + mje + "</b>"
}

function movePlayerAhead() {
  moveTailAhead();
  moveHeadAhead();
}

function growPlayerAhead() {
  State.GBD.fruitCount = State.GBD.fruitCount - 1;
  moveKillingFruit();
  moveHeadAhead();
  incrementScore();
}

function growToDeath() {
  State.GBD.fruitCount = State.GBD.fruitCount - 1;
  moveHeadAhead();
  State.RD.gameStatus = Constants.GameStatus.DEATH_BY_POISONOUS_FRUIT;
  doGameOver("you eat a killing fruit!!!");
}

let kfsList = [];
let kfsPointer = 0;

function moveKillingFruit() {
  let killingLocation = kfsList[kfsPointer];
  if (killingLocation !== undefined) {
    let kfLocationContent = State.getCellContent(killingLocation);
    if (kfLocationContent === Constants.CellContent.KILLING_FRUIT) {
      State.pushCellChange(killingLocation, Constants.CellContent.SPACE);
      increseKFP();
      State.GBD.killingFruitCount = State.GBD.killingFruitCount - 1;
    }
  }

}

function incrementScore() {
  State.GBD.score = State.GBD.score + 1;
  getById("score").textContent = "" + State.GBD.score;
}

function getById(id) {
  return document.getElementById(id);
}

function moveHeadAhead() {

  let currentPosContent = State.getCellContent(State.LPD.headPositionCurrent);
  if (currentPosContent === Constants.CellContent.JUMP) {
    // nothing
  } else {
    State.pushCellChange(State.LPD.headPositionCurrent, Constants.CellContent.BODY);
  }

  let keyForBody = State.locationToKey(State.LPD.headPositionCurrent);
  State.GBD.extraLocationData.set(keyForBody, State.LPD.headDirection);

  let nextPosContent = State.getCellContent(State.LPD.headPositionNext);
  if (nextPosContent === Constants.CellContent.JUMP) {
    // nothing
  } else {
    State.pushCellChange(State.LPD.headPositionNext, Constants.CellContent.HEAD);
  }

  let keyForHead = State.locationToKey(State.LPD.headPositionNext);
  State.GBD.extraLocationData.set(keyForHead, State.LPD.headDirection);

  State.LPD.headPositionCurrent = [State.LPD.headPositionNext[0], State.LPD.headPositionNext[1]];

  State.LPD.playerHeadIndex = State.LPD.playerHeadIndex + 1;

  State.LPD.setLocationAtIndex(State.LPD.playerHeadIndex, State.LPD.headPositionCurrent);

}

function moveTailAhead() {

  const tailLocation = State.LPD.getLocationAtIndex(State.LPD.playerTailIndex);

  let nextPosContent = State.getCellContent(tailLocation);
  if (nextPosContent === Constants.CellContent.JUMP) {
    let key = State.locationToKey(tailLocation);
    let formerCellContent = State.GBD.jumpedThingsData.get(key);
    State.GBD.jumpedThingsData.delete(key);
    State.pushCellChange(tailLocation, formerCellContent);
  } else {
    State.pushCellChange(tailLocation, Constants.CellContent.SPACE);
  }

  State.LPD.removeLocationAtIndex(State.LPD.playerTailIndex);

  State.LPD.playerTailIndex = State.LPD.playerTailIndex + 1;
}

function processTap(event) {
  event.preventDefault();
  
  const button = event.target.closest('.mobile-button');
  if (!button) return;

  const buttonId = button.id;

  if (buttonId === 'button-pause') {

    State.RD.pressedKey = Constants.KeyboardKey.P;

  } else if (buttonId === 'button-up') {

    State.RD.pressedKey = Constants.KeyboardKey.UP;
    
  } else if (buttonId === 'button-jump') {

    State.LPD.jumped = 2;
    
  } else if (buttonId === 'button-left') {
  
    State.RD.pressedKey = Constants.KeyboardKey.LEFT;
    
  } else if (buttonId === 'button-right') {

    State.RD.pressedKey = Constants.KeyboardKey.RIGHT;
    
  } else if (buttonId === 'button-down') {

    State.RD.pressedKey = Constants.KeyboardKey.DOWN;
    
  } else if (buttonId === 'button-restart') {

    State.RD.pressedKey = Constants.KeyboardKey.R;
    restart();
    
  } else if (buttonId === 'button-minus') {

    State.RD.pressedKey = Constants.KeyboardKey.MINUS;
    
  } else if (buttonId === 'button-plus') {

    State.RD.pressedKey = Constants.KeyboardKey.PLUS;
    
  }
  
}

export function attachEventHandlers() {

  const mobilecontrols = getById('mobile-controls');
  mobilecontrols.addEventListener('touchstart', processTap);

  const bareBonesToggle = getById('bare-bones-toggle');
  bareBonesToggle.addEventListener('click', toggleBareBones);

  document.addEventListener('keydown', processKeydown);

}


