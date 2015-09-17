angular.module('ibeis.controller', [])
.controller('ibeis-controller', ['$scope', function($scope) {
	$scope.breadcrumbs = [
		{ 'name': 'All Images', 'href': '/' }
	];

	$scope.workplaces = [
		{ 'name': 'Workplace 1', 'id': 1, 'href': '/workplace-1' },
		{ 'name': 'Workplace 2', 'id': 2, 'href': '/workplace-2' },
		{ 'name': 'Workplace 3', 'id': 3, 'href': '/workplace-3' }
	];

	$scope.collections = [
		{ 'name': 'Collection 1', 'href': '/collection-1' },
		{ 'name': 'Collection 2', 'href': '/collection-2' },
		{ 'name': 'Collection 3', 'href': '/collection-3' }
	];

}]);