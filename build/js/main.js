angular.module('filters', [])
	.filter('truncate', function () {
        return function (text, length, end) 
        {
            if(undefined === text)
                return;
            
            if (isNaN(length))
                length = 10;
 
            if (end === undefined)
                end = "...";
            
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }
        }
    })
    .filter('dateFormat', function() {
        return function (date, format) 
        {
            if(undefined == date)
                return;

            if('timestamp' == format)
                return moment.unix(date).format('Do MMM YYYY [at] h:mm a');

            return moment(date).format('Do MMM YYYY [at] h:mm a');
        }
    })
    .filter('getPhotoID', function() {
        return function(link) 
        {
            if(undefined == link)
                return;

            var splitted = link.split('/');
            return splitted[5];
        }
    })
    .filter('getFeedTags', function() {
        return function(tags) 
        {
            if(undefined == tags)
                return;

            var stag = tags.split(' ');
            if(stag.length > 8) {
                sp = stag.slice(0, 7);
                return sp.concat(['[+more+]']);
            } 
            else return stag;
        }
    });
(function(window, document, undefined) {
	'use strict';

	var appotato = angular.module('appotato', ['filters']);

	appotato.config(
		function($interpolateProvider) { 
			$interpolateProvider.startSymbol('{[').endSymbol(']}') 
		}
	);

	appotato.config(
		function($routeProvider) { 
			$routeProvider
				.when('/', {
					templateUrl: 'partials/feed.html',
					controller: 'FeedController'
				})
				.when('/search/:tag', {
					templateUrl: 'partials/search.html',
					controller: 'SearchController'
				})
				.when('/photo/:photo_id', {
					templateUrl: 'partials/photo-single.html',
					controller: 'PhotoController'
				});
		}
	);

	appotato.factory('$potatocache', function($cacheFactory) {
		return {
			get: function(key) {
				var cache = localStorage.getItem(key);
				try {
					cache = JSON.parse(localStorage.getItem(key));
					return cache;
				} catch(err) {
					return cache;
				}
			},
			put: function(key, value) {
				(typeof value === 'string') 
				? localStorage.setItem(key, value) : localStorage.setItem(key, JSON.stringify(value));
			},
			remove: function(key) {
				localStorage.removeItem(key);
			}
		}
	});

	appotato.factory('$flickrapi', function($http) {
		var defaults = {
			method: null,
			url: 'http://api.flickr.com/services/rest/',
			apikey: '963f0905359a5d81c0214cd5e3aea33a',
			format: 'json',
			callback: 'JSON_CALLBACK'
		};

		var prepare = function(method, query) {
			return defaults.url + '?method=' + method + '&api_key=' + defaults.apikey + '&' + query 
			+ '&format=' + defaults.format + '&jsoncallback=' + defaults.callback;
		};

		return {
			get: function(method, query) {
				return $http.jsonp(prepare(method, query));
			}
		}
	});

	window.appotato = appotato;
})(window, document);
appotato.directive('bodyId', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope.$watch('currentPage', function (value) {
        if ('FeedController' == value) {
          $('body').attr('id', 'feed');
        }
        if ('PhotoController' == value) {
          $('body').attr('id', 'photo-single');
        }
        if ('SearchController' == value) {
          $('body').attr('id', 'search');
        }
      });
    }
  };
});
appotato.directive('infiniteScroll', function () {
  return function (scope, element, attr) {
    $(window).scroll(function () {
      var bufferPX = 40;
      var pos = $(window).scrollTop() + $(window).height() + bufferPX > $(document).height();
      if (pos && scope.loaded && scope.loaded != 'completed') {
        $('.scroll-loader').show();
        scope.page++;
        scope.$apply(attr.infiniteScroll);
      }
      if ('completed' == scope.loaded)
        $('.scroll-loader').hide();
    });
  };
});
appotato.controller('FeedController', function FeedController($scope, $route, $http, $potatocache) {
  $scope.currentPage = $route.current.$$route.controller;
  $scope.init = function () {
    $scope.feed = $potatocache.get('feed');
    $http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK').success(function (data) {
      $scope.feed = data;
      $potatocache.put('feed', data);
    }).error(function (err) {
    });
  };
  $scope.init();
});
appotato.controller('PhotoController', function PhotoController($scope, $route, $routeParams, $flickrapi) {
  $scope.currentPage = $route.current.$$route.controller;
  $scope.photo = [];
  $scope.load = function () {
    var photoID = $routeParams.photo_id;
    $flickrapi.get('flickr.photos.getInfo', 'photo_id=' + photoID).success(function (data) {
      $scope.photo = data.photo;
    });
    $flickrapi.get('flickr.photos.getSizes', 'photo_id=' + photoID).success(function (data) {
      angular.forEach(data.sizes.size, function (item, index) {
        if ('Small' == item.label)
          $scope.photo['thumb'] = item.source;
        if ('Medium' == item.label)
          $scope.photo['thumb'] = item.source;
        if ('Medium 800' == item.label)
          $scope.photo['thumb'] = item.source;
      });
    });
    $flickrapi.get('flickr.photos.geo.getLocation', 'photo_id=' + photoID).success(function (data) {
      if ('fail' != data.stat) {
        $scope.photo['location'] = data.photo.location;
      }
    });
  };
  $scope.load();
});
appotato.controller('SearchController', function FeedController($scope, $route, $routeParams, $flickrapi, $potatocache) {
  $scope.currentPage = $route.current.$$route.controller;
  $scope.keyword = 'potato';
  $scope.page = 1;
  $scope.init = function () {
    var tag = $scope.keyword = $routeParams.tag;
    $flickrapi.get('flickr.photos.search', '&tags=' + tag + '&extras=url_t%2C+url_q%2C+url_z%2C+description%2C+tags%2C+path_alias%2C+date_upload&per_page=5&page=' + $scope.page).success(function (data) {
      $scope.search = data.photos.photo;
      $scope.loaded = true;
    }).error(function (err) {
    });
  };
  $scope.loadMore = function () {
    $scope.loaded = false;
    $flickrapi.get('flickr.photos.search', '&tags=' + $scope.keyword + '&extras=url_t%2C+url_q%2C+url_z%2C+description%2C+tags%2C+path_alias%2C+date_upload&per_page=5&page=' + $scope.page).success(function (data) {
      if (data.photos.photo.length == 0) {
        $scope.loaded = 'completed';
      } else {
        for (i in data.photos.photo) {
          $scope.search.push(data.photos.photo[i]);
        }
        $scope.loaded = true;
      }
    }).error(function (err) {
    });
  };
  $scope.init();
});