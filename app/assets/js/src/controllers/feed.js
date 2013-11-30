appotato.controller('FeedController', function FeedController($scope, $route, $http, $potatocache) {
	$scope.currentPage = $route.current.$$route.controller;

	$scope.init = function() {
		$scope.feed = $potatocache.get('feed');

		$http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK')
		.success(function(data) {
			$scope.feed = data;
			$potatocache.put('feed', data);
		})
		.error(function(err) {
			
		});
	};

	$scope.init();
});