// Note: having this function here instead of using a transform makes it much clearer what the code is actually doing. There was no real indication that a transform would be applied before.
function gridSize(factor) {
  return factor * 8;
}

module.exports = {
  "0.25x":  {
    "value": gridSize(0.25),
  },
  "0.5x": {
    "value": gridSize(0.5),
  },
  "1x": {
    "value": gridSize(1),
  }
}
