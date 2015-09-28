app.controller('keywordsController',['$scope','$timeout','$rootScope', function($scope,$timeout,$rootScope){
	$rootScope.currentSection = 'Keywords';
	$scope.tagsPerSlide = 7;
	$scope.allTags = ['Adult & Gambling','Art & Entertainment','Automotive','Cameras & Photo','Careers & Employment','Cell Phones & Mobile','Collectibles',
						'Consumer Electronics','Dating ','Education','Family & Baby','Fashion & Accessories *','Financial Services','Hunting','Food & Drink','Gaming','Health & Beauty','Home & Garden ','Jewellery & Watches','Lifestyle','Motorcycles & Powersports','Music & Musicians',
						'News, Books & Magazines','Online Services','Other *','Pets','Real-Estate','Self-Help','Shopping & Coupons','Sports & Fitness','Toys & Hobbies','Travel'];
	$scope.tagsPointerStart = 0;
	$scope.tagsPointerEnd = $scope.tagsPerSlide;
	$scope.tags =  $scope.allTags.slice(0,7);
	
	$scope.displayTags = function(direction){
		$(".tagContents").fadeOut();
		$timeout(function() {

			if(direction == "forward"){

				if($scope.allTags.length >= ($scope.tagsPointerEnd + $scope.tagsPerSlide) ){
					var end = $scope.tagsPointerEnd;
					$scope.tagsPointerStart = end;
					$scope.tagsPointerEnd = $scope.tagsPointerStart + $scope.tagsPerSlide;
				}else if($scope.allTags.length - $scope.tagsPointerEnd < $scope.tagsPerSlide && $scope.allTags.length - $scope.tagsPointerEnd > 0  ){					
					$scope.tagsPointerEnd = $scope.allTags.length;
					$scope.tagsPointerStart += $scope.tagsPerSlide;
				}
				
				console.log('start is: ',$scope.tagsPointerStart);
				console.log('end is: ',$scope.tagsPointerEnd);
			}else{
				

				if($scope.tagsPointerStart - $scope.tagsPerSlide  >= 0){
					$scope.tagsPointerEnd = $scope.tagsPointerStart;;
					$scope.tagsPointerStart = $scope.tagsPointerEnd - $scope.tagsPerSlide;
					
				}else if($scope.tagsPointerStart > 0 && $scope.tagsPointerStart < $scope.tagsPerSlide ){
					var start = $scope.tagsPointerStart;					
					$scope.tagsPointerEnd = start;
					$scope.tagsPointerStart = 0;
					
				}
				
				console.log('start is: ',$scope.tagsPointerStart);
				console.log('end is: ',$scope.tagsPointerEnd);
			}
				$scope.tags = $scope.allTags.slice($scope.tagsPointerStart,$scope.tagsPointerEnd);
				$(".tagContents").fadeIn();
				console.log('tags are: ',$scope.tags);
				console.log('allTags are : ', $scope.allTags);

    	}, 500);
		
		
	};
	
}]);