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
			var bufferPX = 40;
			var pos = $(window).scrollTop() + $(window).height() + bufferPX > $(document).height();
			if(pos && scope.loaded && scope.loaded != 'completed') {
				$('.scroll-loader').show();
				scope.page ++;
				scope.$apply(attr.infiniteScroll);
			}

			if('completed' == scope.loaded)
				$('.scroll-loader').hide();
		});
	}
})