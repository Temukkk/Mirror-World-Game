const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 50;
const cols = canvas.width / cellSize;
const rows = canvas.height / cellSize;
const maze = [];
const stack = [];
let player = { x: 0, y: 0 };

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.visited = false;
  this.walls = { top: true, right: true, bottom: true, left: true };
}

function createMaze() {
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push(new Cell(x, y));
    }
    maze.push(row);
  }
  let startCell = maze[0][0];
  startCell.visited = true;
  stack.push(startCell);
  carveMaze();
}

function carveMaze() {
  if (stack.length > 0) {
    let current = stack[stack.length - 1];
    let next = getUnvisitedNeighbor(current);

    if (next) {
      next.visited = true;
      stack.push(next);
      removeWalls(current, next);
      carveMaze();
    } else {
      stack.pop();
      carveMaze();
    }
  } else {
    drawMaze();
  }
}

function getUnvisitedNeighbor(cell) {
  const neighbors = [];
  const { x, y } = cell;

  if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
  if (x < cols - 1 && !maze[y][x + 1].visited) neighbors.push(maze[y][x + 1]);
  if (y < rows - 1 && !maze[y + 1][x].visited) neighbors.push(maze[y + 1][x]);
  if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);

  return neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
}

function removeWalls(current, next) {
  const xDiff = current.x - next.x;
  const yDiff = current.y - next.y;

  if (xDiff === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (xDiff === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }

  if (yDiff === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (yDiff === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#333';

  maze.forEach(row => {
    row.forEach(cell => {
      const { x, y, walls } = cell;
      const xPos = x * cellSize;
      const yPos = y * cellSize;

      if (walls.top) ctx.strokeRect(xPos, yPos, cellSize, 1);
      if (walls.right) ctx.strokeRect(xPos + cellSize, yPos, 1, cellSize);
      if (walls.bottom) ctx.strokeRect(xPos, yPos + cellSize, cellSize, 1);
      if (walls.left) ctx.strokeRect(xPos, yPos, 1, cellSize);
    });
  });

  ctx.fillStyle = 'green'; 
  ctx.fillRect((cols - 1) * cellSize, (rows - 1) * cellSize, cellSize, cellSize);


  drawPlayer();
}

function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

document.addEventListener('keydown', (event) => {
  let moved = false;
  
  if (event.key === 'ArrowUp' && !maze[player.y][player.x].walls.top) {
    player.y -= 1;
    moved = true;
  } else if (event.key === 'ArrowRight' && !maze[player.y][player.x].walls.right) {
    player.x += 1;
    moved = true;
  } else if (event.key === 'ArrowDown' && !maze[player.y][player.x].walls.bottom) {
    player.y += 1; 
    moved = true;
  } else if (event.key === 'ArrowLeft' && !maze[player.y][player.x].walls.left) {
    player.x -= 1; 
    moved = true;
  }

  if (moved) {
    drawMaze();
    checkWinCondition();
  }
});

function checkWinCondition() {
  if (player.x === cols - 1 && player.y === rows - 1) {
    showWinModal();
  }
}

function showWinModal() {
  const modal = document.getElementById('winModal');
  modal.classList.add('show');

  const restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', () => {
    resetGame();
    modal.classList.remove('show');
  });
}

function resetGame() {
  player = { x: 0, y: 0 };
  maze.length = 0; 
  stack.length = 0; 
  initGame(); 
}

function initGame() {
  createMaze();
}

initGame();
