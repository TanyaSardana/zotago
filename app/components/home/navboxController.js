app.controller('navboxController',['$scope','$rootScope','$timeout','api', function($scope,$rootScope,$timeout,api){
	$scope.toggle = true;
	$scope.hideTags = false;
	$scope.availableTags = ['fasion','advice','marketing','electronics','electronics','electronics','fasion','advice','marketing','electronics','electronics','food-love','electronics','self-development','advice'];
	$scope.listOfAvailableTags = [];
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
		$rootScope.tags.push({text: item.name});
		$scope.onTagAdded(item.name);
	}

	

	$scope.nextTagsList = function(){
		
	}

	$scope.previousTagsList = function(){

	}

	


	function getTags(){
		api.getTags().then(function(response){			
			$scope.listOfAvailableTags = response.data;
			console.log('listOfAvailableTags: ', $scope.listOfAvailableTags);
		},function(err){
			console.log('error');
		})
	}



	$scope.init = function(){
		getTags();
	}
	$scope.init();
	

}]);