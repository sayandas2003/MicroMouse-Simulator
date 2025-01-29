        const gridElement = document.getElementById('grid');
        const setWallBtn = document.getElementById('setWall');
        const setStartBtn = document.getElementById('setStart');
        const setEndBtn = document.getElementById('setEnd');
        const randomMazeBtn = document.getElementById('randomMaze');
        const findPathBtn = document.getElementById('findPath');
        const resetBtn = document.getElementById('reset');

        let currentMode = 'wall';
        const grid = [];
        const rows = 10;
        const cols = 10;
        let startCell = null;
        let endCell = null;

        // Create the grid dynamically
        for (let row = 0; row < rows; row++) {
            grid[row] = [];
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col, cell));
                gridElement.appendChild(cell);
                grid[row][col] = cell;
            }
        }

        // Handle cell click based on the current mode
        function handleCellClick(row, col, cell) {
            if (currentMode === 'wall') {
                cell.classList.toggle('wall');
            } else if (currentMode === 'start') {
                if (startCell) startCell.classList.remove('start');
                cell.classList.add('start');
                startCell = cell;
            } else if (currentMode === 'end') {
                if (endCell) endCell.classList.remove('end');
                cell.classList.add('end');
                endCell = cell;
            }
        }

        // Change mode based on button clicks
        setWallBtn.addEventListener('click', () => (currentMode = 'wall'));
        setStartBtn.addEventListener('click', () => (currentMode = 'start'));
        setEndBtn.addEventListener('click', () => (currentMode = 'end'));

        // Reset the grid
        resetBtn.addEventListener('click', () => {
            grid.forEach(row => {
                row.forEach(cell => {
                    cell.className = 'cell';
                });
            });
            startCell = null;
            endCell = null;
        });

        // Generate random maze
        randomMazeBtn.addEventListener('click', () => {
            resetBtn.click();
            grid.forEach(row => {
                row.forEach(cell => {
                    if (Math.random() < 0.3) {
                        cell.classList.add('wall');
                    }
                });
            });
        });

        // Assign indices using flood-fill algorithm and trace path
        findPathBtn.addEventListener('click', () => {
            if (!endCell || !startCell) {
                alert('Please set both a start and an end point.');
                return;
            }

            const endRow = parseInt(endCell.dataset.row);
            const endCol = parseInt(endCell.dataset.col);

            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0] // Right, Down, Left, Up
            ];

            const queue = [[endRow, endCol]];
            const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

            distances[endRow][endCol] = 0;

            while (queue.length > 0) {
                const [currentRow, currentCol] = queue.shift();

                for (const [dx, dy] of directions) {
                    const newRow = currentRow + dx;
                    const newCol = currentCol + dy;

                    if (
                        newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        !grid[newRow][newCol].classList.contains('wall') &&
                        distances[newRow][newCol] > distances[currentRow][currentCol] + 1
                    ) {
                        distances[newRow][newCol] = distances[currentRow][currentCol] + 1;
                        queue.push([newRow, newCol]);
                    }
                }
            }

            const startRow = parseInt(startCell.dataset.row);
            const startCol = parseInt(startCell.dataset.col);

            if (distances[startRow][startCol] === Infinity) {
                alert('No path to start point!');
                return;
            }

            // Trace back the shortest path
            let currentRow = startRow;
            let currentCol = startCol;
            while (distances[currentRow][currentCol] !== 0) {
                grid[currentRow][currentCol].classList.add('path');

                for (const [dx, dy] of directions) {
                    const newRow = currentRow + dx;
                    const newCol = currentCol + dy;

                    if (
                        newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        distances[newRow][newCol] === distances[currentRow][currentCol] - 1
                    ) {
                        currentRow = newRow;
                        currentCol = newCol;
                        break;
                    }
                }
            }
        });