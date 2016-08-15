angular.module('sudokuCtrl', ['ngMaterial', 'ngAnimate', 'ngAria']);

angular.module('sudokuCtrl').controller('SudokuController', ['$scope', SudokuController]);
function SudokuController($scope) {
	$scope.numIters = 0;
	$scope.solved = false;
	$scope.numSolutionsFound = 0;
	/*$scope.sudokuGrid = [[0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0]]; */
	$scope.sudokuGrid = [[0,0,0,0,0,2,3,0,9], //easy
						 [3,0,0,0,9,0,0,7,8],
						 [0,0,9,8,0,3,1,5,0],
						 [0,9,0,2,0,8,4,0,0],
						 [0,0,2,0,5,4,0,1,0],
						 [0,0,0,7,1,0,0,8,0],
						 [0,0,0,3,0,5,0,9,7],
						 [9,5,0,1,0,0,0,2,0],
						 [4,7,0,0,0,9,0,0,1]]; 
	/*$scope.sudokuGrid = [[2,0,0,0,0,4,0,0,0],
						 [0,0,8,2,0,0,0,1,0],
						 [0,4,6,7,0,0,0,0,0],
						 [0,3,0,0,0,5,0,0,1],
						 [0,8,0,0,7,0,0,5,0],
						 [9,0,0,3,0,0,0,7,0],
						 [0,0,0,0,0,1,7,6,0],
						 [0,1,0,0,0,6,4,0,0],
						 [0,0,0,5,0,0,0,0,9]]; */
	/*$scope.solution =   [[0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0]]; */

	$scope.falseMat =  [[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false],
						[false, false, false, false, false, false, false, false, false]];
	$scope.filledIn = $scope.falseMat;

	$scope.solCopy = angular.copy($scope.solution);
	$scope.displayGrid = $scope.sudokuGrid;

	/*
		Goes through the routine whenever the Solve button is clicked on the UI.
		The current inputted grid is pulled from $scope.sudokuGrid after being validated, 
		then passed through the backtracking algorithm.
	*/
	$scope.solve = function() {
		if (!validateGrid($scope.sudokuGrid)) {
			alert("This sudoku puzzle is invalid.");
			return;
		}
		var partial = angular.copy($scope.sudokuGrid);
		$scope.solCopy = angular.copy($scope.solution);
		$scope.solution = angular.copy($scope.sudokuGrid);
		$scope.filledIn = $scope.getMutableLocs(partial);
		/*for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				console.log("[" + i + ", " + j + "]: " + String(constructCandidates(partial, i, j, mutableLocs(partial))));
			}
		} */
		var mutable = angular.copy($scope.filledIn);
		uniqueSweep(partial, mutable);
		var status = backtrack(partial, 0, -1, mutable);
		if (status == -1) {
			alert("This sudoku puzzle has no unique solution.");
			$scope.displayGrid = $scope.sudokuGrid;
			$scope.filledIn = $scope.falseMat;
		}
		else if (!$scope.solved) {
			alert("This sudoku puzzle has no solutions.");
			$scope.solution = angular.copy($scope.solCopy);
		}
		$scope.solved = false;
		console.log($scope.numIters);
	}

	/*
		Loops through every possible row/column/square in the grid 
		and individually validates each one. 
	*/
	function validateGrid(grid) {
		for (var i = 0; i < 9; i++) {
			var row = new Array(9);
			var square = new Array(9);
			var column = angular.copy(grid[i]);

			for (var j = 0; j < 9; j++) {
				row[j] = grid[j][i];
				square[j] = grid[Math.floor(i / 3) * 3 + Math.floor(j / 3)][i * 3 % 9 + j % 3];
			}

			if (!(validateSection(row) && validateSection(column) && validateSection(square))) {
				return false;
			}
		}
		return true;
	}

	/*
		Validates a section of the board (row, column, square). Loops through
		and ensures there are no duplicates. 
	*/
	function validateSection(input) {
		input = input.sort();
		for (var i = 0; i < input.length - 1; i++) {
			if ((input[i] == input[i + 1]) && (input[i] != 0)) {
				return false;
			}
		}
		return true;
	}

	/*
		Resets the given matrix to all 0's. 
	*/
	function resetSolution(matrix) {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				matrix[i][j] = 0;
			}
		}
	}

	/*
		Resets the input and solution grids, then sets the display to
		show the input grid.
	*/
	$scope.reset = function() {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				$scope.sudokuGrid[i][j] = 0;
				$scope.solution[i][j] = 0;
			}
		}
		$scope.displayGrid = $scope.sudokuGrid;
		$scope.filledIn = $scope.falseMat;
	}

	/*
		Sweeps through the board and fills in all the cells for which
		there is only one possible entry.
	*/
	function uniqueSweep(partial, mutable) {
		$scope.numIters++;
		var finishedSweep = true;
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var cand = constructCandidates(partial, i, j, mutable);
				if (cand.length == 1) {
					partial[i][j] = cand[0];
					if (mutable[i][j]) {
						mutable[i][j] = false;
						finishedSweep = false;
					}
				}
			}
		}
		if (finishedSweep) {
			$scope.solution = partial;
			return;
		}
		//console.log("1");
		uniqueSweep(partial, mutable);
	}

	/*
		Takes a 9x9 grid of numbers (grid) and returns a 9x9 boolean grid (m)
		where m[i][j] = (grid[i][j] == 0)		 
	*/
	$scope.getMutableLocs = function(grid) {
		//console.log(grid);
		var m= [[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true],
				[true, true, true, true, true, true, true, true, true]];
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if (grid[i][j] != 0) {
					m[i][j] = false;
				}
			}
		}
		//console.log(m);
		return m;
	}

	/*
		General backtracking algorithm. Takes in the partial solution,
		current row/column, and a matrix of locations that it can/can't
		modify.

		Finds all possible values for the next cell (given current position)
		and tries each one.
	*/
	function backtrack(partial, r, c, mutableLocs) {
		//console.log("1");
		$scope.numIters++;
		var nextLoc = nextPoint(r, c, mutableLocs);
		if (nextLoc.length == 0) {
			processSolution(angular.copy(partial));
			if ($scope.numSolutionsFound > 1) {
				$scope.numSolutionsFound = 0;
				resetSolution($scope.solution);
				return -1;
			}
		}
		else {
			r = nextLoc[0];
			c = nextLoc[1];
			var candidates = constructCandidates(partial, r, c, mutableLocs);
			for (var i = 0; i < candidates.length; i++) {
				partial[r][c] = candidates[i];
				var status = backtrack(partial, r, c, mutableLocs);
				if (status == -1) {
					return -1;
				}
			}
			partial[r][c] = 0;
		}
	}

	/*
		For a celll given by row/column, returns an array of all possible
		values that the cell can take. Existing values in the same
		row/column/square limit what values are valid in that cell.
	*/
	function constructCandidates(partial, r, c, mutableLocs) {
		if (!mutableLocs[r][c]) {
			return [partial[r][c]];
		}
		var included = [];
		for (var i = 0; i < 9; i++) {
			if (i != r) {
				included.push(partial[i][c]);
			}
			if (i != c) {
				included.push(partial[r][i]);
			}
		}
		var rowRange = [0, 2];
		var colRange = [0, 2];
		if (r <= 2) {
        	rowRange[0] = 0;
        	rowRange[1] = 2;  
	    }
	    else if (r >= 6) {
	    	rowRange[0] = 6;
	    	rowRange[1] = 8;
      	}
     	else {
	    	rowRange[0] = 3;
	    	rowRange[1] = 5;
	    }
	    if (c <= 2) {
	    	colRange[0] = 0;
	    	colRange[1] = 2;
	    }
	    else if (c >= 6) {
	    	colRange[0] = 6;
	    	colRange[1] = 8;
	    }
	    else {
	    	colRange[0] = 3;
	    	colRange[1] = 5;
	    }
	    //included.concat(getNumsInArea(partial, rowRange, colRange, r, c));
	    Array.prototype.push.apply(included, getNumsInArea(partial, rowRange, colRange, r, c));
	    var set = new Set(included);
	    var cand = [];
	    for (var i = 1; i < 10; i++) {
	    	if (!set.has(i)) {
	    		cand.push(i);
	    	}
	    }
	    //console.log("candidates:" + String(cand));
	    return cand;
	}

	/*
		Gets all the numbers within the specified row/col range
		except for the number at the specified row/col.
	*/
	function getNumsInArea(partial, rowRange, colRange, row, col) {
		//console.log("3");
		var inArea = [];
		for (var r = rowRange[0]; r <= rowRange[1]; r++) {
			for (var c = colRange[0]; c <= colRange[1]; c++) {
				if (r != row || c != col) {
					inArea.push(partial[r][c]);
				}
			}
		}
		return inArea;
	}

	/*
		Sets the display grid to a copy of the solution and 
		updates the number of computed solutions.
	*/
	function processSolution(solution) {
		//console.log("4");
		//console.log(solution);
		var copy = angular.copy(solution);
		if ($scope.isSolution(copy)) {
			$scope.displayGrid = copy;
			$scope.solution = copy;
			$scope.solved = true;
			$scope.numSolutionsFound++;
		}
	}

	/*
		Checks to see if a solution is really a solution 
		by looking for any 0's (each non-zero entry is assumed to be 
		inherently valid due to constructCandidates and the pre-solution
		validation)
	*/
	$scope.isSolution = function(solution) {
		//console.log("5");
		//console.log(solution);
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if (solution[i][j] == 0) {
					return false;
				}
			}
		}
		return true;
	}

	/*
		Given the current row/col positioning and the matrix of locations
		that can be changed, returns the next row/col that can be tested.
		Moves row by row, 1 column at a time.
	*/
	function nextPoint(r, c, mutableLocs) {
		//console.log("6");
		//console.log("(" + r + ", " + c + ")");
		c++;
		if (c >= 9) {
			r++;
			c = 0;
			if (r >= 9) {
				return [];
			}
		}
		if (mutableLocs[r][c]) {
			return [r, c];
		}
		return nextPoint(r, c, mutableLocs);
	}
}



angular.module('sudokuCtrl').directive('sudokuCell', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'sudokuCell.html',
		scope: {
			row: '=', 
			col: '=',
			initialNum: '='
		},
		controller: SudokuCellController
	}
});

function SudokuCellController($scope) {
	//$scope.rowIndex = parseInt($scope.rowIndex);
	$scope.displayNum = "" + $scope.row[$scope.col];
	//console.log($scope);
	//$scope.initialNum = $scope.$parent.colors[$scope.rowIndex][$scope.col];
	$scope.$watch('row[col]', function(newV, oldV) {
		if (newV == 0) {
			$scope.displayNum = null;
		}
		else {
			$scope.displayNum = "" + newV;
		}
	});
	$scope.updateTile = function() {
		var num = $scope.row[$scope.col];
		num++;
		if (num > 9) {
			num = 0;
		}
		$scope.row[$scope.col] = num;
	}
}


angular.module('sudokuCtrl').directive('sudokuBoard', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'sudokuBoard.html',
		scope: {
			grid: '=',
			colors: '='
		},
		controller: SudokuBoardController
	}
});

function SudokuBoardController($scope) {

}