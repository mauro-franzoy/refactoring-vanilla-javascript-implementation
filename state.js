
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

  headDirection: Direction.RIGHT,

  playerHeadIndex: 0,

  playerTailIndex: 0

};

const LPD = littlePlayerData;

const gameBoardData = {
  score: 0,
  fruitCount: 1,
  killingFruitCount: 0,
  choosenSpeed: '3',
  extraLocationData: new Map(),
  showingBareBones: true
}

const GBD = gameBoardData;

const runningData = {
  pressedKey: KeyboardKey.NO_KEY,
  paused: false,
  delayInterval: 0,
  gameOver: false,
  deathDelay: 45
}

const RD = runningData;

function placeCellContent(location, block) {

  drawSquare(location, block);

  let rowNumber = location[0];
  let colNumber = location[1];

  let rowName = "row-" + rowNumber;
  let actualRow = document.getElementById(rowName);
  let text = actualRow.textContent;

  text = text.substring(0, colNumber) + block + text.substring(colNumber + 1);
  actualRow.textContent = text;
}

function getCellContent(location) {

  let row = location[0];
  let col = location[1];

  let rowName = "row-" + row;
  let text = document.getElementById(rowName).textContent;

  let block = text.substring(col, col + 1);

  return block;
}

