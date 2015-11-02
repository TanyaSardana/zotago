app.controller('miniWantController',['$scope','$rootScope','api', function($scope,$rootScope,api){
	$scope.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_(2011).svg/2000px-Google_Chrome_icon_(2011).svg.png';

	$scope.wantPost = {
	    post: {
	        imageUrl: $scope.image,
	        description: '',
	        creatorId: 1,
	    },
	    tags: []
	};

	$scope.publishWantPost = function(){



		var chosenTags = [];
		for( var i = 0 ; i < $rootScope.tags.length; i++){
			chosenTags.push($rootScope.tags[i].text);
		}
		$scope.wantPost.tags = chosenTags;
		var dataObj = $scope.wantPost;
		console.log('dataObj is: ', dataObj);

		api.createWantPost(dataObj)
		.then(function(data){
			console.log('want post is created');
		},function(error){
			console.log('error');
		});	
	}
}]);