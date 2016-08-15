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
