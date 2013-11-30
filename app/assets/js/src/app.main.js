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