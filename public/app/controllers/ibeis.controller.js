angular.module('ibeis.controller', [])
.controller('ibeis-controller', ['$scope', function($scope) {

	$scope.workplaces = [
		{ 'name': 'Workplace 1', 'id': 1, 'href': '/workplace-1' },
		{ 'name': 'Workplace 2', 'id': 2, 'href': '/workplace-2' },
		{ 'name': 'Super long workspace name to test this thing that is happening', 'id': 3, 'href': '/workplace-3' }
	];

	$scope.collections = [
		{ 'name': 'Collection 1', 'href': '/collection-1' },
		{ 'name': 'Collection 2', 'href': '/collection-2' },
		{ 'name': 'Collection 3', 'href': '/collection-3' },
		{ 'name': 'Collection 4', 'href': '/collection-4' },
		{ 'name': 'Collection 5', 'href': '/collection-5' },
		{ 'name': 'Collection 6', 'href': '/collection-6' },
		{ 'name': 'Collection 7', 'href': '/collection-7' },
		{ 'name': 'Collection 8', 'href': '/collection-8' },
		{ 'name': 'Collection 9', 'href': '/collection-9' }
	];

}]);