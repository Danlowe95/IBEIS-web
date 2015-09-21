angular.module('ibeis.controller', [])
.controller('ibeis-controller', ['$scope', function($scope) {

	$scope.workplaces = [
		{ 'name': 'Workplace 1', 'id': 1, 'href': '' },
		{ 'name': 'Workplace 2', 'id': 2, 'href': '' },
		{ 'name': 'Super long workspace name to test this thing that is happening', 'id': 3, 'href': '' }
	];

	$scope.createWorkplace = function() {
		$scope.workplaces.push({ 'name': 'New Workplace', 'id': Math.floor((Math.random() * 100) + 1), 'href': '' });
	};

	$scope.collections = [];

	$scope.addCollection = function() {
		$scope.collections.push({ 'name': 'NewCollection', 'href': '' });
	};

}]);