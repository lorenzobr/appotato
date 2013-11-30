appotato.controller('PhotoController', function PhotoController($scope, $route, $routeParams, $flickrapi) {
	$scope.currentPage = $route.current.$$route.controller;

	$scope.photo = [];

	$scope.load = function() {
		var photoID = $routeParams.photo_id;

		$flickrapi.get('flickr.photos.getInfo', 'photo_id=' + photoID)
		.success(function(data) {
			$scope.photo = data.photo;
		});

		$flickrapi.get('flickr.photos.getSizes', 'photo_id=' + photoID)
		.success(function(data) {
			angular.forEach(data.sizes.size, function(item, index) {
				if('Small' == item.label)
					$scope.photo['thumb'] = item.source;
				/*
				if('Original' == item.label)
					$scope.photo['thumb'] = item.source; */
			})
		});

		$flickrapi.get('flickr.photos.geo.getLocation', 'photo_id=' + photoID)
		.success(function(data) {
			if('fail' != data.stat) {
				$scope.photo['location'] = data.photo.location;
			}
		});
	};

	$scope.load();
});