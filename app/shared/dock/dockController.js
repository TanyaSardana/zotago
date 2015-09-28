app.controller('dockController',['$scope','$rootScope', function($scope,$rootScope){



$scope.dockItems = [
	{
		image: 'assets/img/waunted-dock.png',
		tooltip : 'Waunted',
		href : '',

	},
	{
		image: 'assets/img/virtual-closet-dock.png',
		tooltip : 'Virtual Closet',
		href : 'virtual-closet',

	},
	{
		image: 'assets/img/create-want-post-dock.png',
		tooltip : 'Create Want Post',
		href : 'create-want-post',

	},
	{
		image: 'assets/img/notifications-dock.png',
		tooltip : 'Notifications',
		href : 'notifications',

	},
	{
		image: 'assets/img/my-profile-dock.png',
		tooltip : 'My Profile',
		href : 'profile',

	},
	
	
]


}]);