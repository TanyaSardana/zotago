app.controller('navController',['$scope', '$rootScope', function($scope,$rootScope){
	$rootScope.isLoggedIn = false;

	$scope.height = '75px';
	$scope.company = {
		
		logo : 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Warwick_W_logo.png',
	}
	$scope.navbarProfileMenu = [
		
		{
			name: 'Invite Friends & Earn $$',
			href: '',
		},
		{
			name: 'My Score',
			href : '#/scoring-strategy',
		},
		{
			name: 'My Keywords',
			href : '#/keywords',
		},
		{
			name: 'Account Settings',
			href : '#/account-settings',
		},
		{
			name: 'Logout',
			href: '',
		},
	];
	$scope.showNavbar = false;


}]);