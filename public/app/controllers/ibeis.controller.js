angular.module('ibeis.controller', [])
.controller('ibeis-controller', ['$scope', function($scope) {
	$scope.breadcrumbs = [
		{ 'name': 'All Images', 'href': '/' }
	];

	$scope.collections = [
		{ 'name': 'Collection 1', 'href': '/collection-1' },
		{ 'name': 'Collection 2', 'href': '/collection-2' },
		{ 'name': 'Collection 3', 'href': '/collection-3' }
	];
}]);