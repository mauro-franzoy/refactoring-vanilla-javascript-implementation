"use strict";

import * as State from './state.js';
import * as Constants from './constants.js';

function setLocalizationData(index, position, direction) {
  State.setPlayerLocationAtIndex(index, position);
  let keyForExtraLocationData = State.locationToKey(position);
  State.setExtraLocationData(keyForExtraLocationData, direction);
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

  State.setPlayerpHeadIndex(10);
  State.setPlayerTailIndex(0);

  State.setHeadCurrentPosition([3, 3]);
  State.setHeadNextPosition([3, 4]);

  // drawing the initial board and stuff

  getById("score").textContent = "0";
  getById("speed").textContent = State.getChoosenSpeed();

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

  State.setGameStatus(Constants.GameStatus.RUNNING);
}

function getRandomNumber() {
  let randomFloating = Math.random() * 24;
  let result = Math.floor(randomFloating);
  return result;
}

function placeFruit() {
  if (State.getFruitCount() < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let fruitPosition = [row, col];
    let cellContent = State.getCellContent(fruitPosition);
    if (cellContent === Constants.CellContent.SPACE) {
      State.setFruitCount(State.getFruitCount() + 1);
      State.pushCellChange(fruitPosition, Constants.CellContent.FRUIT);
    }
  }
}

function placeKillingFruit() {
  if (State.getKillingFruitCount() < 3) {
    let row = getRandomNumber();
    let col = getRandomNumber();
    let killingPosition = [row, col];
    let cellContent = State.getCellContent(killingPosition);
    if (cellContent === Constants.CellContent.SPACE && !nearHeadZone(killingPosition)) {
      State.setKillingFruitCount(State.getKillingFruitCount() + 1);
      State.pushCellChange(killingPosition, Constants.CellContent.KILLING_FRUIT);
      kfsList[kfsPointer] = killingPosition;
      increseKFP();
    }
  }
}

function nearHeadZone(killingPosition) {

  let headDirection = State.getHeadDirection();
  let headPosition = State.getHeadCurrentPosition();

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
  let contentOfNextPositionHead = State.getCellContent(State.getHeadNextPosition());
  return contentOfNextPositionHead;
}

function calculateHeadDirection() {

  if (State.getPressedKey() === Constants.KeyboardKey.RIGHT) {

    if (State.getHeadDirection() === Constants.Direction.DOWN || State.getHeadDirection() === Constants.Direction.UP) {

      State.setHeadDirection(Constants.Direction.RIGHT);
      State.setPressedKey(Constants.KeyboardKey.NO_KEY);
    }

  } else if (State.getPressedKey() === Constants.KeyboardKey.LEFT) {

    if (State.getHeadDirection() === Constants.Direction.DOWN || State.getHeadDirection() === Constants.Direction.UP) {

      State.setHeadDirection(Constants.Direction.LEFT);
      State.setPressedKey(Constants.KeyboardKey.NO_KEY);
    }

  } else if (State.getPressedKey() === Constants.KeyboardKey.DOWN) {

    if (State.getHeadDirection() === Constants.Direction.RIGHT || State.getHeadDirection() === Constants.Direction.LEFT) {

      State.setHeadDirection(Constants.Direction.DOWN);
      State.setPressedKey(Constants.KeyboardKey.NO_KEY);
    }

  } else if (State.getPressedKey() === Constants.KeyboardKey.UP) {

    if (State.getHeadDirection() === Constants.Direction.RIGHT || State.getHeadDirection() === Constants.Direction.LEFT) {

      State.setHeadDirection(Constants.Direction.UP);
      State.setPressedKey(Constants.KeyboardKey.NO_KEY);
    }

  }

}

function calculateHeadNextPos() {

  if (State.getHeadDirection() === Constants.Direction.RIGHT) {
    State.setHeadNextPosition([State.getHeadCurrentPosition()[0], State.getHeadCurrentPosition()[1] + 1]);
  }

  if (State.getHeadDirection() === Constants.Direction.LEFT) {
    State.setHeadNextPosition([State.getHeadCurrentPosition()[0], State.getHeadCurrentPosition()[1] - 1]);
  }

  if (State.getHeadDirection() === Constants.Direction.UP) {
    State.setHeadNextPosition([State.getHeadCurrentPosition()[0] - 1, State.getHeadCurrentPosition()[1]]);
  }

  if (State.getHeadDirection() === Constants.Direction.DOWN) {
    State.setHeadNextPosition([State.getHeadCurrentPosition()[0] + 1, State.getHeadCurrentPosition()[1]]);
  }

}


function processKeydown(event) {

  if (event.key === Constants.KeyboardKey.LEFT) {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.LEFT);

  } else if (event.key === Constants.KeyboardKey.RIGHT) {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.RIGHT);

  } else if (event.key === Constants.KeyboardKey.UP) {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.UP);

  } else if (event.key === Constants.KeyboardKey.DOWN) {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.DOWN);

  } else if (event.key === Constants.KeyboardKey.SPACE) {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.SPACE);

  } else if (event.key === 'p' || event.key === 'P') {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.P);

  } else if (event.key === 's' || event.key === 'S') {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.S);
    toggleBareBones();

  } else if (event.key === '+') {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.PLUS);

  } else if (event.key === '-') {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.MINUS);

  } else if (event.key === 'j' || event.key === 'J') {
    event.preventDefault();
    event.stopPropagation();
    State.setPlayerJumped(2);

  } else if (event.key === 'r' || event.key === 'R') {
    event.preventDefault();
    event.stopPropagation();
    State.setPressedKey(Constants.KeyboardKey.R);
    restart();
  }

}

function aDelay(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

function setSpeed() {
  State.setChoosenSpeed("6");
  let intSpeed = parseInt(State.getChoosenSpeed());
  intSpeed = 10 - intSpeed;
  State.setDelayInterval(100 * intSpeed);
  showSpeed();
}

function increaseSpeed() {
  let intSpeed = parseInt(State.getChoosenSpeed());
  if (intSpeed < 9) {
    intSpeed = intSpeed + 1;
    State.setChoosenSpeed(String(intSpeed));
    intSpeed = 10 - intSpeed;
    State.setDelayInterval(100 * intSpeed);
    showSpeed();
  }
}

function decreaseSpeed() {
  let intSpeed = parseInt(State.getChoosenSpeed());
  if (intSpeed > 1) {
    intSpeed = intSpeed - 1;
    State.setChoosenSpeed(String(intSpeed));
    intSpeed = 10 - intSpeed;
    State.setDelayInterval(100 * intSpeed);
    showSpeed();
  }
}

function showSpeed() {
  getById("speed").textContent = "" + State.getChoosenSpeed();
}

export async function play() {
  setSpeed();
  doSomeInitialization();
  while (!State.isGameOver()) {
    checkForSpecialKeys();
    if (!State.isPaused()) {
      gameCycle();
    }
    await aDelay(State.getDelayInterval());
  }
}

function restart() {
  location.reload();
}

function toggleBareBones() {
  const bonesOverlay = getById("bones-overlay");
  const barebonestoggle = getById("bare-bones-toggle");
  if (!State.isShowingBareBones()) {
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
  State.setShowingBareBones(!State.isShowingBareBones());
}

function checkForSpecialKeys() {
  if (State.getPressedKey() === Constants.KeyboardKey.P) {
    State.setPaused(!State.isPaused());
    State.setPressedKey(Constants.KeyboardKey.NO_KEY);
  } else if (State.getPressedKey() === Constants.KeyboardKey.S) {
    setSpeed();
    State.setPressedKey(Constants.KeyboardKey.NO_KEY);
  } else if (State.getPressedKey() === Constants.KeyboardKey.PLUS) {
    increaseSpeed();
    State.setPressedKey(Constants.KeyboardKey.NO_KEY);
  } else if (State.getPressedKey() === Constants.KeyboardKey.MINUS) {
    decreaseSpeed();
    State.setPressedKey(Constants.KeyboardKey.NO_KEY);
  }
}

function markTheJump() {
  State.pushCellChange(State.getHeadNextPosition(), Constants.CellContent.JUMP);
}

function gameCycle() {
  let jumpingIndicator = getById('jump-indicator');
  if (State.getPlayerJumped()>0) {
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
    if ((State.getPlayerJumped() > 0)) {
      storeJumpedData(State.getHeadNextPosition(), Constants.CellContent.FRUIT)
      markTheJump();
      movePlayerAhead();
    } else {
      growPlayerAhead();
    }
  } else if (nextCellContent === Constants.CellContent.BODY) {
    if ((State.getPlayerJumped() > 0)) {
      State.setPressedKey(Constants.KeyboardKey.NO_KEY);
      storeJumpedData(State.getHeadNextPosition(), Constants.CellContent.BODY)
      markTheJump();
      movePlayerAhead();
      // nothing
    } else {
      movePlayerAhead();
      State.setGameStatus(Constants.GameStatus.DEATH_BY_BODY);
      doGameOver("you stomp on yourself!!!");
    }
  } else if (nextCellContent === Constants.CellContent.WALL) {
    State.setGameStatus(Constants.GameStatus.DEATH_BY_WALL);
    doGameOver("you hit a wall!!!");
  } else if (nextCellContent === Constants.CellContent.KILLING_FRUIT) {
     if ((State.getPlayerJumped() > 0)) {
      storeJumpedData(State.getHeadNextPosition(), Constants.CellContent.KILLING_FRUIT)
      markTheJump();
      movePlayerAhead();
    } else {
      growToDeath();
    }
  } else if (nextCellContent === Constants.CellContent.JUMP) {
      movePlayerAhead();
      State.setGameStatus(Constants.GameStatus.DEATH_BY_BODY);
      doGameOver("Crossing active jump space!!!");
  }
  State.setPlayerJumped(State.getPlayerJumped()-1);
}

function storeJumpedData(position, jumpedThing) {
  let locationKey = State.locationToKey(position);
  State.setJumpedThingsData(locationKey, jumpedThing);
}

function isNextPositionSameAsTailPosition() {
  let tailLocation = State.getPlayerLocationAtIndex(State.getPlayerTailIndex());
  return ((tailLocation[0] === State.getHeadNextPosition()[0]) &&
    (tailLocation[1] === State.getHeadNextPosition()[1]));
}

async function doGameOver(mje) {
  State.setGameOver(true);
  await aDelay(State.getDeathDelay() * (State.getPlayerpHeadIndex() - State.getPlayerTailIndex() + 5));

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
  State.setFruitCount(State.getFruitCount() - 1);
  moveKillingFruit();
  moveHeadAhead();
  incrementScore();
}

function growToDeath() {
  State.setFruitCount(State.getFruitCount() - 1);
  moveHeadAhead();
  State.setGameStatus(Constants.GameStatus.DEATH_BY_POISONOUS_FRUIT);
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
      State.setKillingFruitCount(State.getKillingFruitCount() - 1);
    }
  }

}

function incrementScore() {
  State.setScore(State.getScore() + 1);
  getById("score").textContent = "" + State.getScore();
}

function getById(id) {
  return document.getElementById(id);
}

function moveHeadAhead() {

  let currentPosContent = State.getCellContent(State.getHeadCurrentPosition());
  if (currentPosContent === Constants.CellContent.JUMP) {
    // nothing
  } else {
    State.pushCellChange(State.getHeadCurrentPosition(), Constants.CellContent.BODY);
  }

  let keyForBody = State.locationToKey(State.getHeadCurrentPosition());
  State.setExtraLocationData(keyForBody, State.getHeadDirection());

  let nextPosContent = State.getCellContent(State.getHeadNextPosition());
  if (nextPosContent === Constants.CellContent.JUMP) {
    // nothing
  } else {
    State.pushCellChange(State.getHeadNextPosition(), Constants.CellContent.HEAD);
  }

  let keyForHead = State.locationToKey(State.getHeadNextPosition());

  State.setExtraLocationData(keyForHead, State.getHeadDirection());

  State.setHeadCurrentPosition([State.getHeadNextPosition()[0], State.getHeadNextPosition()[1]]);

  State.setPlayerpHeadIndex(State.getPlayerpHeadIndex() + 1);

  State.setPlayerLocationAtIndex(State.getPlayerpHeadIndex(), State.getHeadCurrentPosition());

}

function moveTailAhead() {

  const tailLocation = State.getPlayerLocationAtIndex(State.getPlayerTailIndex());

  let nextPosContent = State.getCellContent(tailLocation);
  if (nextPosContent === Constants.CellContent.JUMP) {
    let key = State.locationToKey(tailLocation);
    let formerCellContent = State.getJumpedThingsData(key);
    State.removeJumpedThingsData(key);
    State.pushCellChange(tailLocation, formerCellContent);
  } else {
    State.pushCellChange(tailLocation, Constants.CellContent.SPACE);
  }

  State.removePlayerLocationAtIndex(State.getPlayerTailIndex());

  State.setPlayerTailIndex(State.getPlayerTailIndex() + 1);
}

function processTap(event) {
  event.preventDefault();
  
  const button = event.target.closest('.mobile-button');
  if (!button) return;

  const buttonId = button.id;

  if (buttonId === 'button-pause') {

    State.setPressedKey(Constants.KeyboardKey.P);

  } else if (buttonId === 'button-up') {

    State.setPressedKey(Constants.KeyboardKey.UP);
    
  } else if (buttonId === 'button-jump') {

    State.setPlayerJumped(2);
    
  } else if (buttonId === 'button-left') {
  
    State.setPressedKey(Constants.KeyboardKey.LEFT);
    
  } else if (buttonId === 'button-right') {

    State.setPressedKey(Constants.KeyboardKey.RIGHT);
    
  } else if (buttonId === 'button-down') {

    State.setPressedKey(Constants.KeyboardKey.DOWN);
    
  } else if (buttonId === 'button-restart') {

    State.setPressedKey(Constants.KeyboardKey.R);
    restart();
    
  } else if (buttonId === 'button-minus') {

    State.setPressedKey(Constants.KeyboardKey.MINUS);
    
  } else if (buttonId === 'button-plus') {

    State.setPressedKey(Constants.KeyboardKey.PLUS);
    
  }
  
}

export function attachEventHandlers() {

  const mobilecontrols = getById('mobile-controls');
  mobilecontrols.addEventListener('touchstart', processTap);

  const bareBonesToggle = getById('bare-bones-toggle');
  bareBonesToggle.addEventListener('click', toggleBareBones);

  document.addEventListener('keydown', processKeydown);

}


