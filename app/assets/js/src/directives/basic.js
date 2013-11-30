appotato.directive('bodyId', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			scope.$watch('currentPage', function(value) 
			{
				if('FeedController' == value) {
					$('body').attr('id', 'feed');
				}
				if('PhotoController' == value) {
					$('body').attr('id', 'photo-single');
				}
				if('SearchController' == value) {
					$('body').attr('id', 'search');
				}
			});
		}
	}
});

appotato.directive('infiniteScroll', function() {
	return function(scope, element, attr) 
	{
		$(window).scroll(function() {
			var pos = $(window).scrollTop() + $(window).height() > $(document).height();
			if(pos && scope.loaded) {
				scope.page ++;
				scope.$apply(attr.infiniteScroll);
			}
		});
	}
})