app.controller('searchBarController',['$scope','$rootScope', function($scope,$rootScope){


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
	

	var init = function(){
		
	}
	init();
	

}]);