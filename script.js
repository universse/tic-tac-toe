$(function() {
  $('#choose').modal();
  
  var player, computer, board;
  
  function makeRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  };
  
  function fillBoard(move) {
    $('#' + move).html(computer).prop('disabled', true);
    board[move] = computer;
  }
  
  $('.btn').click(function() {
    $('.board').html('-').prop('disabled', false);
    board = [];
    
    player = $(this).html();
    if (player === '<i class="fa fa-times"></i>') {
      computer = '<i class="fa fa-circle-o"></i>';
    } else {
      computer = '<i class="fa fa-times"></i>';
      var computerFirstMove = makeRandomMove([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      fillBoard(computerFirstMove);
    }
  });
  
  var winMove = [[0 ,1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var doubleCorners = [[0, 8], [2, 6]];
  var corner = [0, 2, 6, 8];
  var side = [1, 3, 5, 7];
  
  function winningMove(whose) {    
    function checkWin(line) {
      var pos1 = line[0],
          pos2 = line[1],
          pos3 = line[2];
      
      if (board[pos1] === board[pos2] && board[pos1] === whose && !board[pos3]) {
        return pos3;
      }
      
      if (board[pos2] === board[pos3] && board[pos2] === whose && !board[pos1]) {
        return pos1;
      }
      
      if (board[pos1] === board[pos3] && board[pos3] === whose && !board[pos2]) {
        return pos2;
      } 
    }
    
    for (var i = 0; i < winMove.length; i++) {
      var move = checkWin(winMove[i]);      
      if (move || move === 0) {
        return move;
      }
    }
  }
  
  function forkingMove(whose) {
    var forkMove = [[[1, 2], [4, 8],[3, 6]], [[0, 2], [4, 7]], [[0, 1], [4, 6], [5, 8]], [[0, 6], [4, 5]], [[0, 8], [1, 7], [2, 6], [3, 5]], [[2, 8], [3, 4]], [[0, 3], [2, 4], [7, 8]], [[1, 4], [6, 8]], [[0, 4], [2, 5], [6, 7]]];
    var possibleMoves = [];
    
    function forkCombinations() {
      var combinations = [];
      for (var i = 0; i < forkMove.length; i++) {
        var lines = [];
        for (var j = 0; j < forkMove[i].length - 1; j++) {
          for (var k = j + 1; k < forkMove[i].length; k++) {
            lines.push([forkMove[i][j], forkMove[i][k]]);
          }
        }
        combinations.push(lines);
      }
      return combinations;
    }
    
    function checkFork() {
      var combinations = forkCombinations();         
      for (var i = 0; i < combinations.length; i++) {
        if (!board[i]) {
          for (var j = 0; j < combinations[i].length; j++) {
            var pos1 = combinations[i][j][0][0],
                pos2 = combinations[i][j][0][1],
                pos3 = combinations[i][j][1][0],
                pos4 = combinations[i][j][1][1];
            
            var condition1 = board[pos1] === whose && !board[pos2],
                condition2 = !board[pos1] && board[pos2] === whose,
                condition3 = board[pos3] === whose && !board[pos4],
                condition4 = !board[pos3] && board[pos4] === whose;
            
            if ((condition1 && condition3) || (condition1 && condition4) || (condition2 && condition3) || (condition2 && condition4)) {
              possibleMoves.push(i);
            }
          }
        }
      }
    }
    
    checkFork();
    return makeRandomMove(possibleMoves);
  }
  
  function blockFork() {
    for (var i = 0; i < doubleCorners.length; i++) {
      var pos1 = doubleCorners[i][0],
          pos2 = doubleCorners[i][1];
      if (board[pos1] === player && board[pos2] === player) {
        return makeRandomMove(side);
      }
    }
        
    var move = forkingMove(player);
    if (move || move === 0) {
      return move;
    }
  }
  
  function takeCenter() {
    if (!board[4]) {
      return 4;
    }
  }
  
  function takeOppositeCorners() {
    var possibleMoves = [];
    for (var i = 0; i < doubleCorners.length; i++) {
      var pos1 = doubleCorners[i][0],
          pos2 = doubleCorners[i][1];
      if (board[pos1] === player && !board[pos2]) {
        possibleMoves.push(pos2);
      } else if (board[pos2] === player && !board[pos1]) {
        possibleMoves.push(pos1);
      }
    }
    return makeRandomMove(possibleMoves);
  }
  
  function takeEmptyCornerOrSide(cornerOrSide) {
    var possibleMoves = [];
    for (var i = 0; i < cornerOrSide.length; i++) {
      var pos = cornerOrSide[i];
      if (!board[pos]) {
        possibleMoves.push(pos);
      }
    }
    return makeRandomMove(possibleMoves);
  }
  
  
  
  function computerMove() {
    var moveByPriority = [winningMove(computer), winningMove(player), forkingMove(computer), blockFork(), takeCenter(), takeOppositeCorners(), takeEmptyCornerOrSide(corner), takeEmptyCornerOrSide(side)];
    console.log(moveByPriority);
    for (var i = 0; i < moveByPriority.length; i++) {
      var move = moveByPriority[i];
      if (move || move === 0) {
        fillBoard(move);
        if (i === 0) {
          $('#computer-wins').modal();
        }
        return move;
      }
    }
  }

  $('.board').click(function() {
    $(this).html(player).prop('disabled', true);
    var move = eval($(this).attr('id'));
    
    if (board.length === 0) {
      var computerFirstMove;
      board[move] = player;
      switch(move) {
        case 0:
        case 2:
        case 6:
        case 8:
          computerFirstMove = makeRandomMove([4]);
          break;
        case 4:
          computerFirstMove = makeRandomMove(corner);
          break;
        case 1:
          computerFirstMove = makeRandomMove([0, 2, 4, 7]);
          break;
        case 3:
          computerFirstMove = makeRandomMove([0, 4, 5, 6]);
          break;
        case 5:
          computerFirstMove = makeRandomMove([2, 3, 4, 8]);
          break;
        case 7:
          computerFirstMove = makeRandomMove([1, 4, 6, 8]);
          break;
      }
      fillBoard(computerFirstMove);
    } else {
      board[move] = player;
      computerMove();
    }
    
    var boardFilled = true;
    for (var i = 0; i < 9; i++) {
      if (!board[i]) {
        boardFilled = false;
      }
    }
    if (boardFilled) {
      $('#draw').modal();
    }
  });
  
});