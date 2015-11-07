app.controller('navboxController',['$scope','$rootScope','$timeout', function($scope,$rootScope,$timeout){
	$scope.toggle = true;
	$scope.hideTags = false;
	$scope.availableTags = ['fasion','advice','marketing','electronics','electronics','electronics','fasion','advice','marketing','electronics','electronics','food-love','electronics','self-development','advice'];
	$scope.toggleList = function(){
        $scope.hideTags = true;
        $timeout(function(){
            $scope.hideTags = false;
        }, 600).then(function(){
        	$scope.toggle = !$scope.toggle;
			if($scope.toggle){
				$scope.availableTags = listOne;
			}else{
				$scope.availableTags = listTwo;
			}

        });
          
	}
	var listOne = ['fasion','advice','marketing','electronics','electronics','electronics','fasion','advice','marketing','electronics','electronics','food-love','electronics','self-development','advice'];
	var listTwo = ['hello','how-are-you','mcgill','watch','jeans','2015-toyota','4floors','im-like-hey-wassup-hello'];
	
	$scope.recommendedItemOnClick = function(item){
		$rootScope.tags.push({text: item});
		$scope.onTagAdded(item);
	}

	

}]);