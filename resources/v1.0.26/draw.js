"use strict";

import * as State from './state.js';
import * as Constants from './constants.js';

function processCellChange(location, block) {
  drawSquare(location, block);
  drawRawCellContent(location, block);
}

export function subscribeToCellChanges(){
  State.subscribeToCellChange(processCellChange)
}

let alreadyInitialRendering = false;

export async function render() {
  drawPlayer();
  while (true) {
    if (State.getGameStatus() == Constants.GameStatus.RUNNING && !alreadyInitialRendering) {
      drawAllRawCells();
      translateCharBoardToCanvas();
      alreadyInitialRendering = true;
    }
    if (State.getGameStatus() == Constants.GameStatus.DEATH_BY_BODY) {
      drawPlayerDeathSync(1, Constants.Color.JUMP_MARK);
      return;
    } else if (State.getGameStatus() == Constants.GameStatus.DEATH_BY_WALL) {
      clearHeadSourroundings();
      drawPlayerDeathSync(1, Constants.Color.WALL);
      return;
    } else if (State.getGameStatus() == Constants.GameStatus.DEATH_BY_POISONOUS_FRUIT) {
      drawPlayerDeathSync(1, Constants.Color.KILLING_FRUIT);
      return;
    }
    await aDelay(State.getDelayInterval() / 2);
  }
}

let cbCtx = null;
let canvasBoard = document.getElementById("canvas-board");
cbCtx = canvasBoard.getContext("2d");

function aDelay(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

function drawAllRawCells() {
  let position = null;
  let cellContent = null;
  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j <= 23; j++) {
      position = [i, j];
      cellContent = State.getCellContent(position);
      drawRawCellContent(position, cellContent);
    }
  }
}

function translateCharBoardToCanvas() {
  let position = null;
  let cellContent = null;
  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j <= 23; j++) {
      position = [i, j];
      cellContent = State.getCellContent(position);
      drawSquare(position, cellContent);
    }
  }
}

function drawRawCellContent(location, block) {

  let rowNumber = location[0];
  let colNumber = location[1];

  let rowName = "row-" + rowNumber;
  let actualRow = document.getElementById(rowName);
  let text = actualRow.textContent;

  text = text.substring(0, colNumber) + block + text.substring(colNumber + 1);
  actualRow.textContent = text;
}

function drawFruit(position, mainColor) {

  let x = position[1] * 20;
  let y = position[0] * 20;
  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fillRect(x, y, 20, 20);

  // main part
  cbCtx.beginPath();
  cbCtx.arc(x + 10, y + 10, 8, 0, 2 * Math.PI);
  cbCtx.fillStyle = mainColor;
  cbCtx.fill();

  // stem cavity
  cbCtx.beginPath();
  cbCtx.arc(x + 10, y, 4, 0, -1 * Math.PI);
  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fill();

  // basin
  cbCtx.beginPath();
  cbCtx.arc(x + 10, y + 20, 4, Math.PI, 0);
  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fill();

  // leaf
  cbCtx.beginPath();
  cbCtx.fillStyle = Constants.Color.LEAF;
  cbCtx.moveTo(x + 14, y);
  cbCtx.lineTo(x + 10, y + 4);
  cbCtx.lineTo(x + 16, y + 2);
  cbCtx.closePath();
  cbCtx.fill();

  //stem
  cbCtx.beginPath();
  cbCtx.fillStyle = Constants.Color.STEM;
  cbCtx.moveTo(x + 11, y);
  cbCtx.lineTo(x + 10, y + 4);
  cbCtx.lineTo(x + 12, y + 0);
  cbCtx.closePath();
  cbCtx.fill();

  //shine
  drawShine(position, Constants.Color.SHINE);
}

function drawSquare(position, cellContent) {

  if (cellContent === Constants.CellContent.SPACE) {
    drawSoil(position);
  } else if (cellContent === Constants.CellContent.WALL) {
    drawWall(position);
  } else if (cellContent === Constants.CellContent.KILLING_FRUIT) {
    drawFruit(position, Constants.Color.KILLING_FRUIT);
    return;
  } else if (cellContent === Constants.CellContent.FRUIT) {
    drawFruit(position, Constants.Color.FRUIT);
    return;
  }
}

function drawSoil(position) {
  drawRawSquare(position, Constants.Color.SOIL);
}

function drawWall(position) {
  drawRawSquare(position, Constants.Color.WALL);
}

function drawRawSquare(position, color) {
  let x = position[1] * 20;
  let y = position[0] * 20;

  cbCtx.fillStyle = color;
  cbCtx.fillRect(x, y, 20, 20);
}

function drawShine(position, color) {
  let x = position[1] * 20;
  let y = position[0] * 20;
  cbCtx.beginPath();
  cbCtx.fillStyle = color;
  cbCtx.moveTo(x + 14, y + 5);
  cbCtx.lineTo(x + 14, y + 9);
  cbCtx.lineTo(x + 16, y + 7);
  cbCtx.closePath();
  cbCtx.fill();
}

function getColorByJumpedContent(content) {
  if (content == Constants.CellContent.KILLING_FRUIT) {
    return Constants.Color.KILLING_FRUIT;
  } else if (content == Constants.CellContent.FRUIT) {
    return Constants.Color.FRUIT;
  } else if (content == Constants.CellContent.BODY) {
    return Constants.Color.JUMPING_BODY;
  }
}

function drawJumpDetails(position, color) {
  let x = position[1] * 20;
  let y = position[0] * 20;
  cbCtx.beginPath();
  cbCtx.fillStyle = color
  cbCtx.moveTo(x + 14 - 4, y + 5 + 1);
  cbCtx.lineTo(x + 14 - 4, y + 9 + 1);
  cbCtx.lineTo(x + 16 - 4, y + 7 + 1);
  cbCtx.closePath();
  cbCtx.fill();

  let keyExtraLocationData = State.locationToKey(position);
  let direction = State.getExtraLocationData(keyExtraLocationData);

  let key = State.locationToKey(position);
  let formerCellContent = State.getJumpedThingsData(key);
  let detailColor = getColorByJumpedContent(formerCellContent);

  cbCtx.lineWidth = 1;
  if (Constants.Direction.RIGHT === direction || Constants.Direction.LEFT === direction) {
    cbCtx.beginPath();
    cbCtx.strokeStyle = detailColor;
    cbCtx.moveTo(x + 2, y + 2);
    cbCtx.lineTo(x + 5, y + 1);
    cbCtx.lineTo(x + 15, y + 1);
    cbCtx.lineTo(x + 18, y + 2);
    cbCtx.stroke();

    cbCtx.beginPath();
    cbCtx.strokeStyle = detailColor;
    cbCtx.moveTo(x + 2, y + 18);
    cbCtx.lineTo(x + 5, y + 19);
    cbCtx.lineTo(x + 15, y + 19);
    cbCtx.lineTo(x + 18, y + 18);
    cbCtx.stroke();

  } else if (Constants.Direction.UP === direction || Constants.Direction.DOWN === direction) {
    cbCtx.beginPath();
    cbCtx.strokeStyle = detailColor;
    cbCtx.moveTo(x + 2, y + 2);
    cbCtx.lineTo(x + 1, y + 5);
    cbCtx.lineTo(x + 1, y + 15);
    cbCtx.lineTo(x + 2, y + 18);
    cbCtx.stroke();

    cbCtx.beginPath();
    cbCtx.strokeStyle = detailColor;
    cbCtx.moveTo(x + 18, y + 2);
    cbCtx.lineTo(x + 19, y + 5);
    cbCtx.lineTo(x + 19, y + 15);
    cbCtx.lineTo(x + 18, y + 18);
    cbCtx.stroke();
  }
  return;
}

function drawLittlePlayerBodyJump(position, toggle) {
  drawLittlePlayerBodyPivotWithColor(position, toggle, Constants.Color.BODY);
  drawJumpDetails(position, Constants.Color.SHINE);
}

function drawLittlePlayerBodyJumpDeath(position, toggle, color) {
  drawLittlePlayerBodyPivotWithColor(position, toggle, color);
  drawJumpDetails(position, Constants.Color.SHINE);
}

function drawLittlePlayerBodyJumpWithColor(position, toggle, color) {
  drawLittlePlayerBodyPivot(position, toggle, color);
  drawJumpDetails(position, Constants.Color.SHINE);
}

function drawLittlePlayerWavyBody(position, toggle) {
  drawLittlePlayerWavyBodyWithColor(position, toggle, Constants.Color.BODY);
}

function drawLittlePlayerWavyBodyDeath(position, toggle, color) {
  drawLittlePlayerWavyBodyWithColor(position, toggle, color);
}

function drawLittlePlayerWavyBodyWithColor(position, toggle, color) {

  let x = position[1] * 20;
  let y = position[0] * 20;

  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fillRect(x, y, 20, 20);

  let keyExtraLocationData = State.locationToKey(position);
  let direction = State.getExtraLocationData(keyExtraLocationData);

  if (direction === Constants.Direction.RIGHT) {

    let col = position[1];
    let offSet = (toggle + col) % 2;
    if (offSet == 0) {
      offSet = 1;
    } else {
      offSet = - 1;
    }

    x = position[1] * 20;
    y = position[0] * 20 + 1 + offSet;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x, y + 2, 20, 18 - 4);

    cbCtx.fillRect(x + 4, y, 20 - 6, 2);
    cbCtx.fillRect(x + 4, y + 16, 20 - 6, 2);

  } else if (direction === Constants.Direction.LEFT) {

    let col = position[1];
    let offSet = (toggle + col) % 2;
    if (offSet == 0) {
      offSet = 1;
    } else {
      offSet = - 1;
    }

    x = position[1] * 20;
    y = position[0] * 20 + 1 + offSet;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x, y + 2, 20, 18 - 4);

    cbCtx.fillRect(x + 4, y, 20 - 6, 2);
    cbCtx.fillRect(x + 4, y + 16, 20 - 6, 2);

  } else if (direction === Constants.Direction.UP) {

    let row = position[0];
    let offSet = (toggle + row) % 2;
    if (offSet == 0) {
      offSet = 1;
    } else {
      offSet = - 1;
    }

    x = position[1] * 20 + 1 + offSet;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x + 2, y, 18 - 4, 20);

    cbCtx.fillRect(x, y + 4, 2, 20 - 6);
    cbCtx.fillRect(x + 16, y + 4, 2, 20 - 6);

  } else if (direction === Constants.Direction.DOWN) {

    let row = position[0];
    let offSet = (toggle + row) % 2;
    if (offSet == 0) {
      offSet = 1;
    } else {
      offSet = - 1;
    }

    x = position[1] * 20 + 1 + offSet;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x + 2, y, 18 - 4, 20);

    cbCtx.fillRect(x, y + 4, 2, 20 - 6);
    cbCtx.fillRect(x + 16, y + 4, 2, 20 - 6);
  }
}

function drawLittlePlayerTail(position) {
  drawLittlePlayerTailWithColor(position, Constants.Color.BODY);
}

function drawLittlePlayerTailDeath(position, color) {
  drawLittlePlayerTailWithColor(position, color);
}

function drawLittlePlayerTailWithColor(position, color) {

  let x = position[1] * 20;
  let y = position[0] * 20;

  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fillRect(x, y, 20, 20);

  let keyExtraLocationData = State.locationToKey(position);
  let direction = State.getExtraLocationData(keyExtraLocationData);

  if (direction === Constants.Direction.RIGHT) {

    x = position[1] * 20;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x, y + 8, 20, 4);

    cbCtx.beginPath();
    cbCtx.fillStyle = color;
    cbCtx.moveTo(x + 0, y + 10);
    cbCtx.lineTo(x + 20, y + 16);
    cbCtx.lineTo(x + 20, y + 4);
    cbCtx.closePath();
    cbCtx.fill();

  } else if (direction === Constants.Direction.LEFT) {

    x = position[1] * 20;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x, y + 8, 20, 4);

    cbCtx.beginPath();
    cbCtx.fillStyle = color;
    cbCtx.moveTo(x + 20, y + 10);
    cbCtx.lineTo(x + 0, y + 16);
    cbCtx.lineTo(x + 0, y + 4);
    cbCtx.closePath();
    cbCtx.fill();

  } else if (direction === Constants.Direction.UP) {

    x = position[1] * 20;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x + 8, y, 4, 20);

    cbCtx.beginPath();
    cbCtx.fillStyle = color;
    cbCtx.moveTo(x + 4, y + 0);
    cbCtx.lineTo(x + 10, y + 20);
    cbCtx.lineTo(x + 16, y + 0);
    cbCtx.closePath();
    cbCtx.fill();

  } else if (direction === Constants.Direction.DOWN) {

    x = position[1] * 20;
    y = position[0] * 20;
    cbCtx.fillStyle = color;
    cbCtx.fillRect(x + 8, y, 4, 20);

    cbCtx.beginPath();
    cbCtx.fillStyle = color;
    cbCtx.moveTo(x + 4, y + 20);
    cbCtx.lineTo(x + 10, y + 0);
    cbCtx.lineTo(x + 16, y + 20);
    cbCtx.closePath();
    cbCtx.fill();

  }
}

function positionToXY(position) {
  return {
    x: position[1] * 20,
    y: position[0] * 20,
  };
}

function drawLittlePlayerBodyPivot(position, toggle) {
  drawLittlePlayerBodyPivotWithColor(position, toggle, Constants.Color.BODY);
}

function drawLittlePlayerBodyPivotDeath(position, toggle, color) {
  drawLittlePlayerBodyPivotWithColor(position, toggle, color);
}

function drawLittlePlayerBodyPivotWithColor(position, toggle, color) {

  let coord = positionToXY(position);
  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fillRect(coord.x, coord.y, 20, 20);

  cbCtx.beginPath();
  cbCtx.arc(coord.x + 10, coord.y + 10, 10, 0, 2 * Math.PI);
  cbCtx.fillStyle = color;
  cbCtx.fill();

  // centered square
  cbCtx.fillRect(coord.x + 2, coord.y + 2, 16, 16);

  // horizontal rect
  cbCtx.fillRect(coord.x + 0, coord.y + 3, 20, 14);

  // vertical rect
  cbCtx.fillRect(coord.x + 3, coord.y + 0, 14, 20);
}

function drawLittlePlayerHead() {
  drawLittlePlayerHeadWithColor(Constants.Color.BODY);
}

function drawLittlePlayerHeadDeath(color) {
  drawLittlePlayerHeadWithColor(color);
}

function drawLittlePlayerHeadWithColor(color) {

  let headDirection = State.getHeadDirection();
  let headPosition = State.getHeadCurrentPosition();

  let x = headPosition[1] * 20;
  let y = headPosition[0] * 20;
  cbCtx.fillStyle = Constants.Color.SOIL;
  cbCtx.fillRect(x, y, 20, 20);



  if (headDirection === Constants.Direction.RIGHT) {

    // head
    cbCtx.beginPath();
    cbCtx.arc(x + 10, y + 10, 10, 0, 2 * Math.PI);
    cbCtx.fillStyle = color;
    cbCtx.fill();

    //neck
    cbCtx.fillRect(x + 0, y + 3, 10, 14);

    // tongue
    cbCtx.fillStyle = Constants.Color.TONGUE;
    cbCtx.fillRect(x + 20, y + 9, 6, 2);

    // tongue tips
    cbCtx.fillRect(x + 26, y + 8, 2, 1);
    cbCtx.fillRect(x + 26, y + 11, 2, 1);

    // eyes         
    cbCtx.fillStyle = Constants.Color.EYE;
    cbCtx.fillRect(x + 13, y + 5, 4, 3);
    cbCtx.fillRect(x + 13, y + 13, 4, 3);



  } else if (headDirection === Constants.Direction.LEFT) {

    // head
    cbCtx.beginPath();
    cbCtx.arc(x + 10, y + 10, 10, 0, 2 * Math.PI);
    cbCtx.fillStyle = color;
    cbCtx.fill();

    //neck
    cbCtx.fillRect(x + 10, y + 3, 10, 14);

    // tongue
    cbCtx.fillStyle = Constants.Color.TONGUE;
    cbCtx.fillRect(x - 6, y + 9, 6, 2);

    // tongue tips
    cbCtx.fillRect(x - 8, y + 8, 2, 1);
    cbCtx.fillRect(x - 8, y + 11, 2, 1);

    // eyes         
    cbCtx.fillStyle = Constants.Color.EYE;
    cbCtx.fillRect(x + 4, y + 5, 4, 3);
    cbCtx.fillRect(x + 4, y + 13, 4, 3);

  } else if (headDirection === Constants.Direction.UP) {

    // head        
    cbCtx.beginPath();
    cbCtx.arc(x + 10, y + 10, 10, 0, 2 * Math.PI);
    cbCtx.fillStyle = color;
    cbCtx.fill();

    //neck
    cbCtx.fillRect(x + 3, y + 10, 14, 10);

    // tongue
    cbCtx.fillStyle = Constants.Color.TONGUE;
    cbCtx.fillRect(x + 9, y - 6, 2, 6);

    // tongue tips
    cbCtx.fillRect(x + 8, y - 7, 1, 2);
    cbCtx.fillRect(x + 11, y - 7, 1, 2);

    // eyes         
    cbCtx.fillStyle = Constants.Color.EYE;
    cbCtx.fillRect(x + 5, y + 4, 3, 4);
    cbCtx.fillRect(x + 13, y + 4, 3, 4);

  } else if (headDirection === Constants.Direction.DOWN) {

    // head         
    cbCtx.beginPath();
    cbCtx.arc(x + 10, y + 10, 10, 0, 2 * Math.PI);
    cbCtx.fillStyle = color;
    cbCtx.fill();

    //neck
    cbCtx.fillRect(x + 3, y + 0, 14, 10);

    cbCtx.fillStyle = Constants.Color.TONGUE;
    cbCtx.fillRect(x + 9, y + 20, 2, 6);

    // tongue tips
    cbCtx.fillRect(x + 8, y + 26, 1, 2);
    cbCtx.fillRect(x + 11, y + 26, 1, 2);

    // eyes         
    cbCtx.fillStyle = Constants.Color.EYE;
    cbCtx.fillRect(x + 5, y + 13, 3, 4);
    cbCtx.fillRect(x + 13, y + 13, 3, 4);

  }
  drawHeadJumping(headPosition, headDirection);
  reDrawLittlePlayerHeadSourroundingsToHideOldTongue();
}

function drawHeadJumping(headPosition, direction) {

  let key = State.locationToKey(headPosition);
  let formerCellContent = State.getJumpedThingsData(key);

  if (formerCellContent != undefined) {
    drawJumpDetails(headPosition, direction);
  }
}

function reDrawLittlePlayerHeadSourroundingsToHideOldTongue() {
  let headDirection = State.getHeadDirection();
  let headPosition = State.getHeadCurrentPosition();

  let row = headPosition[0];
  let col = headPosition[1];
  let positionToReDraw = null;

  if (headDirection === Constants.Direction.RIGHT) {

    reDrawSquare([row - 1, col - 1]);
    reDrawSquare([row + 1, col - 1]);

  } else if (headDirection === Constants.Direction.LEFT) {

    reDrawSquare([row - 1, col + 1]);
    reDrawSquare([row + 1, col + 1]);

  } else if (headDirection === Constants.Direction.UP) {

    reDrawSquare([row + 1, col + 1]);
    reDrawSquare([row + 1, col - 1]);

  } else if (headDirection === Constants.Direction.DOWN) {

    reDrawSquare([row - 1, col + 1]);
    reDrawSquare([row - 1, col - 1]);

  }

}

function clearHeadSourroundings() {
  let headPosition = State.getHeadCurrentPosition();

  let row = headPosition[0];
  let col = headPosition[1];

  reDrawSquare([row - 1, col - 1]);
  reDrawSquare([row - 1, col + 0]);
  reDrawSquare([row - 1, col + 1]);
  reDrawSquare([row + 0, col - 1]);
  reDrawSquare([row + 0, col + 0]);
  reDrawSquare([row + 0, col + 1]);
  reDrawSquare([row + 1, col - 1]);
  reDrawSquare([row + 1, col + 0]);
  reDrawSquare([row + 1, col + 1]);
}

function reDrawSquare(positionToReDraw) {
  let cellContent = State.getCellContent(positionToReDraw);
  drawSquare(positionToReDraw, cellContent);
}

async function drawPlayer() {
  let toggle = 0;
  while (true) {
    if (!State.isPaused() && !State.isGameOver() && State.getGameStatus() == Constants.GameStatus.RUNNING) {
      drawPlayerSync(toggle);
    }
    await aDelay(State.getDelayInterval() / 2);
    toggle = (toggle + 1) % 4;
  }
}


function drawPlayerSync(toggle) {
  for (let i = State.getPlayerTailIndex(); i < State.getPlayerpHeadIndex(); i++) {
    let position = State.getPlayerLocationAtIndex(i);
    if (State.getCellContent(position) === Constants.CellContent.JUMP) {
      drawLittlePlayerBodyJump(position, toggle);
    } else {
      if (i == State.getPlayerTailIndex()) {
        drawLittlePlayerTail(position, toggle);
      } else {
        let positionBefore = State.getPlayerLocationAtIndex(i - 1);
        let position = State.getPlayerLocationAtIndex(i);
        let positionAfter = State.getPlayerLocationAtIndex(i + 1);
        if (positionBefore[0] != positionAfter[0] && positionBefore[1] != positionAfter[1]) {
          // its a pivot
          drawLittlePlayerBodyPivot(position, toggle);
        } else {
          // regular body part
          drawLittlePlayerWavyBody(position, toggle);
        }
      }
    }
  }
  drawLittlePlayerHead();
}

function drawPlayerDeathSync(toggle, color) {
  drawPlayerDeath(toggle, color);
}


async function drawPlayerDeath(toggle, color) {
  await aDelay(State.getDeathDelay());
  drawLittlePlayerHeadDeath(color);
  for (let i = State.getPlayerpHeadIndex() - 1; i >= State.getPlayerTailIndex(); i--) {
    let position = State.getPlayerLocationAtIndex(i);
    if (State.getCellContent(position) === Constants.CellContent.JUMP) {
      await aDelay(State.getDeathDelay());
      drawLittlePlayerBodyJumpDeath(position, toggle, color);
    } else {
      if (i == State.getPlayerTailIndex()) {
        await aDelay(State.getDeathDelay());
        drawLittlePlayerTailDeath(position, color);
      } else {
        let positionBefore = State.getPlayerLocationAtIndex(i - 1);
        let position = State.getPlayerLocationAtIndex(i);
        let positionAfter = State.getPlayerLocationAtIndex(i + 1);
        if (positionBefore[0] != positionAfter[0] && positionBefore[1] != positionAfter[1]) {
          // its a pivot
          await aDelay(State.getDeathDelay());
          drawLittlePlayerBodyPivotDeath(position, toggle, color);
        } else {
          // regular body part
          await aDelay(State.getDeathDelay());
          drawLittlePlayerWavyBodyDeath(position, toggle, color);
        }
      }
    }
  }
}
