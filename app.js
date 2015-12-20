angular.module('app', ['sudokuCtrl', 'ngMaterial', 'ngAnimate', 'ngAria']);

angular.module('sudokuCtrl', ['ngMaterial', 'ngAnimate', 'ngAria']);

angular.module('sudokuCtrl').controller('SudokuController', ['$scope', SudokuController]);
function SudokuController($scope) {
	$scope.solved = false;
	/*$scope.sudokuGrid = [[0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0]]; */
	/*$scope.sudokuGrid = [[0,0,0,0,0,2,3,0,9], easy
						 [3,0,0,0,9,0,0,7,8],
						 [0,0,9,8,0,3,1,5,0],
						 [0,9,0,2,0,8,4,0,0],
						 [0,0,2,0,5,4,0,1,0],
						 [0,0,0,7,1,0,0,8,0],
						 [0,0,0,3,0,5,0,9,7],
						 [9,5,0,1,0,0,0,2,0],
						 [4,7,0,0,0,9,0,0,1]];  */
	$scope.sudokuGrid = [[2,0,0,0,0,4,0,0,0],
						 [0,0,8,2,0,0,0,1,0],
						 [0,4,6,7,0,0,0,0,0],
						 [0,3,0,0,0,5,0,0,1],
						 [0,8,0,0,7,0,0,5,0],
						 [9,0,0,3,0,0,0,7,0],
						 [0,0,0,0,0,1,7,6,0],
						 [0,1,0,0,0,6,4,0,0],
						 [0,0,0,5,0,0,0,0,9]]; 
	$scope.solution =   [[0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0],
						 [0,0,0,0,0,0,0,0,0]]; 

	$scope.solve = function() {
		var partial = angular.copy($scope.sudokuGrid);
		$scope.solution = angular.copy($scope.sudokuGrid);
		$scope.filledIn = $scope.getMutableLocs(partial);
		/*for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				console.log("[" + i + ", " + j + "]: " + String(constructCandidates(partial, i, j, mutableLocs(partial))));
			}
		} */
		var mutable = angular.copy($scope.filledIn);
		uniqueSweep(partial, mutable);
		backtrack(partial, 0, -1, mutable);
		if (!$scope.solved) {
			alert("This sudoku puzzle has no solutions.");
			reset($scope.solution);
		}
		$scope.solved = false;
	}

	function reset(matrix) {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix[i].length; j++) {
				matrix[i][j] = 0;
			}
		}
	}

	$scope.resetInput = function() {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				$scope.sudokuGrid[i][j] = 0;
			}
		}
	}

	function uniqueSweep(partial, mutable) {
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

	function backtrack(partial, r, c, mutableLocs) {
		//console.log("1");
		var nextLoc = nextPoint(r, c, mutableLocs);
		if (nextLoc.length == 0) {
			processSolution(angular.copy(partial));
		}
		else {
			r = nextLoc[0];
			c = nextLoc[1];
			var candidates = constructCandidates(partial, r, c, mutableLocs);
			for (var i = 0; i < candidates.length; i++) {
				partial[r][c] = candidates[i];
				backtrack(partial, r, c, mutableLocs);
			}
			partial[r][c] = 0;
		}
	}

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

	$scope.test = function() {
		var row = $scope.sudokuGrid[0];
		row[0] = 5;
	}

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

	function processSolution(solution) {
		//console.log("4");
		//console.log(solution);
		$scope.solution = angular.copy(solution);
		$scope.solved = true;
	}

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
			rowNum: '=',
			col: '='
		},
		controller: SudokuCellController
	}
});

function SudokuCellController($scope) {
	$scope.disabled = $scope.$parent.$parent.solution;
	$scope.cross = $scope.$parent.cross;
	$scope.blackText = true;
	$scope.$parent.$parent.$parent.$watch('solution', function() {
		var orig = $scope.$parent.$parent.orig;
		var solGrid = $scope.$parent.$parent.$parent.solution;
		$scope.blackText = !$scope.disabled || orig[$scope.rowNum][$scope.col] == solGrid[$scope.rowNum][$scope.col];
	});
	$scope.displayNum = "" + $scope.row[$scope.col];
	if ($scope.displayNum == 0) {
		$scope.displayNum = null;
	}
	$scope.onClick = function() {
		var num = $scope.row[$scope.col];
		num++;
		if (num > 9) {
			num = 0;
		}
		$scope.row[$scope.col] = num;
	}
	$scope.$watch('row[col]', function(newV, oldV) {
		if (newV == 0) {
			$scope.displayNum = null;
		}
		else {
			$scope.displayNum = "" + newV;
		}
	});
}

angular.module('sudokuCtrl').directive('sudokuBox', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'sudokuBox.html',
		scope: {
			grid: '=',
			preFilled: '=',
			midRow: '@',
			midCol: '@',
		},
		controller: SudokuBoxController
	}
});

function SudokuBoxController($scope) {
	$scope.midRow = parseInt($scope.midRow);
	$scope.midCol = parseInt($scope.midCol);
	$scope.rowRange = [$scope.midRow - 1, $scope.midRow + 1];
	$scope.colRange = [$scope.midCol - 1, $scope.midCol + 1];
	$scope.cross = $scope.midRow == $scope.midCol || $scope.midRow + $scope.midCol == 8;
}

angular.module('sudokuCtrl').directive('sudokuGrid', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'sudokuGrid.html',
		scope: {
			orig: '=',
			solGrid: '=',
			solution: '='
		},
		controller: SudokuGridController
	}
});

function SudokuGridController($scope) {
	$scope.grid = $scope.orig;
	if ($scope.solution) {
		$scope.grid = $scope.solGrid;
	}
	$scope.$parent.$watch('solution', function() {
		if ($scope.solution) {
			$scope.grid = $scope.$parent.solution;
		}
	});
}