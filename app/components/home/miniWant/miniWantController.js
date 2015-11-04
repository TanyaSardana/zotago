app.controller('miniWantController',['$scope','$rootScope','api','$timeout', function($scope,$rootScope,api,$timeout){

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

		api.createWantPost(dataObj).then(createWantPostSuccessCallback,createWantPostErrorCallback);	
	}
	
	function createWantPostSuccessCallback(data){
		console.log('wantpost is created');
		$scope.getQueriedWantPosts();
	};
	function createWantPostErrorCallback(data){
		console.log('error');
	};
	
}]);