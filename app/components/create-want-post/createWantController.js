app.controller('createWantController',['$scope','$http','$rootScope' ,function($scope,$http,$rootScope){
	$rootScope.currentSection = 'Create Waunt Post';
	$scope.wantPost = {
		desc : '',
		image : '',

	};
	$scope.submitWantPost = function(){
		var desc = $scope.wacntPost.desc;
		var image = $scope.wantPost.image;
		console.log(desc);
		console.log(image);
	};
	$scope.tags = [
        { text: 'just' },
       
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
	

	
	
	

}]);