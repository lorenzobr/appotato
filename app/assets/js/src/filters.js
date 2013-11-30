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