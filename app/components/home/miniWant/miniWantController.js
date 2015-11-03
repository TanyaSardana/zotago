app.controller('miniWantController',['$scope','$rootScope','api', function($scope,$rootScope,api){

	$scope.wantPost = {
	    post: {
	        imageUrl: $scope.miniWantImage,
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
		$scope.wantPost.post.imageUrl = $scope.miniWantImage;
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