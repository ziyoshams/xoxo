import {Map} from 'immutable'

const MOVE = "MOVE";

export const move = (turn, coords) => {
  return {
    type: "MOVE",
    coord: coords,
    player: turn
  }
}

function bad({ turn, board }, { type, player, coord }){
  if (type !== MOVE) 
    return
  if (player !== turn) 
    return `It's not ${player}'s turn`
  if (coord.length !== 2)
    return `Specify row,column`
  const [row, col] = coord
  if (!Number.isInteger(row) || row < 0 || row > 2)
    return `Invalid row (must be 0-2): ${row}`
  if (!Number.isInteger(col) || col < 0 || col > 2)
    return `Invalid column (must be 0-2): ${col}`
  if (board.hasIn(coord))
    return `Square ${coord} is already taken`  
}

function reducer(state={}, action) {
  const error = bad(state, action)
  if (error) 
    return Object.assign({}, state, {error});
  const nextBoard = boardReducer(state.board, action)
  return {
    winner: winner(nextBoard),
    turn: turnReducer(state.turn, action),
    board: nextBoard,
  }
}

 function turnReducer(turn='X', action) {
  if (action.type === MOVE)
    return turn === 'X' ? 'O' : 'X'
  return turn
}

 function boardReducer(board=Map(), action) {
  if (action.type === MOVE)
    return board.setIn(action.coord, action.player)
  return board
}

 function winner(board) {
  let i = 3; 
  while (--i >= 0) {
    
    let row = streak(board, [0, i], [1, i], [2, i])
    if (row) 
      return row
    
    let col = streak(board, [i, 0], [i, 1], [i, 2])
    if (col) 
      return col
  }

  let diagDown = streak(board, [0, 0], [1, 1], [2, 2])
  if (diagDown) 
    return diagDown
  
  let diagUp = streak(board, [2, 0], [1, 1], [0, 2])
  if (diagUp) 
    return diagUp
  
  let r = 3; 
  while (--r >= 0) {
    let c = 3; 
    while (--c >= 0)
      if (!board.hasIn([r, c])) 
        return null
  }

  return 'draw'
}

 function streak(board, first, ...rest) {
  const player = board.getIn(first)
  if (!player) 
    return null
  for (let c of rest) {
    if (board.getIn(c) !== player) 
      return null
  }
  return player
}

export default reducer;