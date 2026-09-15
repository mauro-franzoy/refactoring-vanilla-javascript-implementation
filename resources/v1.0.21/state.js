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

const littlePlayerData = {

  getLocationAtIndex: function (index) {
    let key = String(index);
    let location = this.playerLocations.get(key);
    return [location[0], location[1]];
  },

  setLocationAtIndex: function (index, location) {
    let key = String(index);
    this.playerLocations.set(key, [location[0], location[1]]);
  },

  removeLocationAtIndex: function (index) {
    let key = String(index);
    this.playerLocations.delete(key);
  },

  playerLocations: new Map(),

  headPositionCurrent: [0, 0],

  headPositionNext: [0, 0],

  tailPosition: [0, 0],

  headDirection: Constants.Direction.RIGHT,

  playerHeadIndex: 0,

  playerTailIndex: 0,

  cellsContent: new Map(),

  jumped: 0

};

export const LPD = littlePlayerData;

const gameBoardData = {
  score: 0,
  fruitCount: 1,
  killingFruitCount: 0,
  choosenSpeed: '3',
  extraLocationData: new Map(),
  showingBareBones: true,
  jumpedThingsData: new Map()
}

export const GBD = gameBoardData;

const runningData = {
  pressedKey: Constants.KeyboardKey.NO_KEY,
  paused: false,
  delayInterval: 0,
  gameOver: false,
  deathDelay: 45,
  gameStatus: Constants.GameStatus.STOPPED
}

export const RD = runningData;

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

