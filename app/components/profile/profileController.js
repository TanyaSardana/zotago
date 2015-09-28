app.controller('profileController',['$scope','$rootScope', function($scope,$rootScope){
$rootScope.currentSection = 'My Profile';
$scope.myProfile = {
	followers : 221,
	following : 1256,
	offerings : 33,
	tips : 230,
	image : 'https://simplybeautysydney.files.wordpress.com/2013/01/brad-profile-square.jpg',
	bio : 'Hi my name is Joy an im literally joy. Check out my virtual closet. It got lots of lingeries.'

};
$scope.tabs = {
	currentTab : 1,
	postSelected : true,
	followSelected : false,
	scoreLevelSelected : false,
};
$scope.setTab = function(currentTab,clickedTab){
	console.log('currentTab is: ', currentTab);
	console.log('clickedTab is: ', clickedTab);
	if(clickedTab == 1 && currentTab != 1){//virtual closet clicked
		$scope.tabs.postSelected = true;
		$scope.tabs.followSelected = false;
		$scope.tabs.scoreLevelSelected = false;

		$scope.tabs.currentTab = 1;
	}else if(clickedTab == 2 && currentTab != 2){//sold items clicked
		$scope.tabs.postSelected = false;
		$scope.tabs.followSelected = true;
		$scope.tabs.scoreLevelSelected = false;

		$scope.tabs.currentTab = 2;
	}else if(clickedTab == 3 && currentTab != 3){//add an item clicked
		$scope.tabs.postSelected = false;
		$scope.tabs.followSelected = false;
		$scope.tabs.scoreLevelSelected = true;

		$scope.tabs.currentTab = 3;
	}
}

}]);