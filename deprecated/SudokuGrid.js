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
	/*$scope.$parent.$watch('solution', function() {
		if ($scope.solution) {
			$scope.grid = $scope.$parent.solution;
		}
	});*/
}