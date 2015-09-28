app.controller('settingsController',['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.currentSection = 'Settings';
	$scope.test = "joy";
	$scope.user = {
		image : 'https://simplybeautysydney.files.wordpress.com/2013/01/brad-profile-square.jpg',
	}
}]);