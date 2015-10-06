app.controller('navController',['$scope', '$rootScope', function($scope,$rootScope){
	$rootScope.isLoggedIn = false;

	$scope.height = '50px';
	$scope.company = {
		
		logo : '/assets/img/zotago_logo.png',
	}
	$scope.navbarProfileMenu = [
		
		{
			name: 'Invite Friends & Earn $$',
			href: '',
		},
		{
			name: 'Sell Something',
			href: '#/create-want-post',
		},
		{
			name: 'My Closet',
			href: '#/profile',
		},
		// {
		// 	name: 'My Score',
		// 	href : '#/scoring-strategy',
		// },
		// {
		// 	name: 'My Keywords',
		// 	href : '#/keywords',
		// },
		// {
		// 	name: 'Account Settings',
		// 	href : '#/account-settings',
		// },
		{
			name: 'Logout',
			href: '',
		},
	];
	$scope.showNavbar = false;


}]);