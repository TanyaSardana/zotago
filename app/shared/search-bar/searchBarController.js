app.controller('searchBarController',['$scope','$rootScope','$http', function($scope,$rootScope,$http){


	$scope.paddingLeft= '10px';

	$scope.tagsList = [
		{
			id: 0,
			name : 'tag0',
		},
		{
			id: 1,
			name : 'tag1',
		},
		{
			id: 2,
			name : 'tag2',
		},
		{
			id: 3,
			name : 'tag3',
		},

	];
	$scope.tags = [
        { text: 'just' },
        { text: 'some' },
        { text: 'cool' },
        { text: 'tags' }
    ];
    $scope.loadTags = function(query) {	    
	    return [
	    	{ text: 'tag0' },
	        { text: 'tag1' },
	        { text: 'tag2' },
	        { text: 'tag3' }

	    ];

	    
	    //return $http.get('/tags?query=' + query);
  	};
	

	var init = function(){
		
	}
	init();
	

}]);