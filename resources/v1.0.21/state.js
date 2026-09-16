"use strict";

import * as Constants from './constants.js';

let cellChangeSubscriber = null;

export function subscribeToCellChange(callback) {
  cellChangeSubscriber = callback;
}

export function pushCellChange(location, block) {
  storeCellContent(location, block);
  cellChangeSubscriber(location, block); 
}

function littlePlayerData() {

  return {

    playerLocations: new Map(),

    headCurrentPosition: [0, 0],

    headNextPosition: [0, 0],

    tailPosition: [0, 0],

    headDirection: Constants.Direction.RIGHT,

    playerHeadIndex: 0,

    playerTailIndex: 0,

    cellsContent: new Map(),

    jumped: 0

  }

};

const LPD = littlePlayerData();

export function getPlayerLocationAtIndex(index) {
  let key = String(index);
  let location = LPD.playerLocations.get(key);
  return [location[0], location[1]];
}

export function setPlayerLocationAtIndex(index, location) {
    let key = String(index);
    LPD.playerLocations.set(key, [location[0], location[1]]);
  }

export function removePlayerLocationAtIndex(index) {
  let key = String(index);
  LPD.playerLocations.delete(key);
}

export function getHeadDirection() {
  return LPD.headDirection;
}

export function setHeadDirection(headDirection) {
  return LPD.headDirection = headDirection;
}

export function getHeadCurrentPosition() {
  return LPD.headCurrentPosition;
}

export function setHeadCurrentPosition(currentPosition) {
  return LPD.headCurrentPosition = currentPosition;
}

export function getHeadNextPosition() {
  return LPD.headNextPosition;
}

export function setHeadNextPosition(nextPosition) {
  return LPD.headNextPosition = nextPosition;
}

export function getPlayerpHeadIndex() {
  return LPD.playerHeadIndex;
}

export function setPlayerpHeadIndex(headIndex) {
  return LPD.playerHeadIndex = headIndex;
}

export function getPlayerTailIndex() {
  return LPD.playerTailIndex;
}

export function setPlayerTailIndex(tailIndex) {
  return LPD.playerTailIndex = tailIndex;
}

export function getPlayerJumped() {
  return LPD.jumped;
}

export function setPlayerJumped(newValue) {
  return LPD.jumped = newValue;
}

function storeCellContent(location, block) {

  let rowNumber = location[0];
  let colNumber = location[1];

  let rowName = "row-" + rowNumber;
  let text = LPD.cellsContent.get(rowName);

  text = text.substring(0, colNumber) + block + text.substring(colNumber + 1);
  LPD.cellsContent.set(rowName, text);
}

export function storeRowOfCellContent(rowId, rowContent) {
  LPD.cellsContent.set(rowId, rowContent);
}

export function getCellContent(location) {

  let row = location[0];
  let col = location[1];

  let rowName = "row-" + row;
  let text = LPD.cellsContent.get(rowName);

  let block = text.substring(col, col + 1);

  return block;
}

export function locationToKey(location) {
  return String(location[0]) + '_' + String(location[1]);
}

function gameBoardData() {
  return {
    score: 0,
    fruitCount: 1,
    killingFruitCount: 0,
    choosenSpeed: '3',
    extraLocationData: new Map(),
    showingBareBones: true,
    jumpedThingsData: new Map()
  };
}

const GBD = gameBoardData();

export function getScore() {
  return GBD.score;
}

export function setScore(newScore) {
  return GBD.score = newScore;
}

export function getFruitCount() {
  return GBD.fruitCount;
}

export function setFruitCount(newFruitCount) {
  return GBD.fruitCount = newFruitCount;
}

export function getKillingFruitCount() {
  return GBD.killingFruitCount;
}

export function setKillingFruitCount(newKillingFruitCount) {
  return GBD.killingFruitCount = newKillingFruitCount;
}

export function getChoosenSpeed() {
  return GBD.choosenSpeed;
}

export function setChoosenSpeed(newChoosenSpeed) {
  return GBD.choosenSpeed = newChoosenSpeed;
}

export function getExtraLocationData(key) {
  return GBD.extraLocationData.get(key);
}

export function setExtraLocationData(key, value) {
  return GBD.extraLocationData.set(key, value);
}

export function isShowingBareBones() {
  return GBD.showingBareBones;
}

export function setShowingBareBones(isShowingBareBones) {
  return GBD.showingBareBones = isShowingBareBones;
}

export function getJumpedThingsData(key) {
  return GBD.jumpedThingsData.get(key);
}

export function setJumpedThingsData(key, value) {
  return GBD.jumpedThingsData.set(key, value);
}

export function removeJumpedThingsData(key) {
  return GBD.jumpedThingsData.delete(key);
}

function runningData() {
  return {
    pressedKey: Constants.KeyboardKey.NO_KEY,
    paused: false,
    delayInterval: 0,
    gameOver: false,
    deathDelay: 45,
    gameStatus: Constants.GameStatus.STOPPED
  };
}

export const RD = runningData();


export function getPressedKey() {
  return RD.pressedKey;
}

export function setPressedKey(newPressedKey) {
  return RD.pressedKey = newPressedKey;
}

export function isPaused() {
  return RD.paused;
}

export function setPaused(isPaused) {
  return RD.paused = isPaused;
}

export function getDelayInterval() {
  return RD.delayInterval;
}

export function setDelayInterval(newDelayInterval) {
  return RD.delayInterval = newDelayInterval;
}

export function isGameOver() {
  return RD.gameOver;
}

export function setGameOver(isGameOver) {
  return RD.gameOver = isGameOver;
}

export function getDeathDelay() {
  return RD.deathDelay;
}

export function setDeathDelay(newDeathDelay) {
  return RD.deathDelay = newDeathDelay;
}

export function getGameStatus() {
  return RD.gameStatus;
}

export function setGameStatus(newGameStatus) {
  return RD.gameStatus = newGameStatus;
}
