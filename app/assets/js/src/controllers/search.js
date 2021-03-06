appotato.controller('SearchController', function FeedController($scope, $route, $routeParams, $flickrapi, $potatocache) {
	$scope.currentPage = $route.current.$$route.controller;

	$scope.keyword = 'potato';
	$scope.page = 1;

	$scope.init = function() {
		var tag = $scope.keyword = $routeParams.tag;

		$flickrapi.get('flickr.photos.search', '&tags=' + tag + '&extras=url_t%2C+url_q%2C+url_z%2C+description%2C+tags%2C+path_alias%2C+date_upload&per_page=5&page=' + $scope.page)
		.success(function(data) {
			$scope.search = data.photos.photo;
			$scope.loaded = true;
		})
		.error(function(err) {
			
		});
	};

	$scope.loadMore = function() {
		$scope.loaded = false;
		
		$flickrapi.get('flickr.photos.search', '&tags=' + $scope.keyword + '&extras=url_t%2C+url_q%2C+url_z%2C+description%2C+tags%2C+path_alias%2C+date_upload&per_page=5&page=' + $scope.page)
		.success(function(data) {
			if(data.photos.photo.length == 0) {
				$scope.loaded = 'completed';
			} 
			else {
				for(i in data.photos.photo) {
					$scope.search.push(data.photos.photo[i]);
				}
				$scope.loaded = true;
			}
		})
		.error(function(err) {
			
		});
	};

	$scope.init();
});