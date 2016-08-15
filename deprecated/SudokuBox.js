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