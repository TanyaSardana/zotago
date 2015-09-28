app.controller('createWantController',['$scope','$http','$rootScope' ,function($scope,$http,$rootScope){
	$rootScope.currentSection = 'Create Waunt Post';
	$scope.wauntPost = {
		title : '',
		desc : '',
		image : '',

	}
	$scope.submitWauntPost = function(){
		var title = $scope.wauntPost.title;
		var desc = $scope.wauntPost.desc;
		var image = $scope.wauntPost.image;
		console.log(title);
		console.log(desc);
		console.log(image);
	}
	

	
	
	

}]);