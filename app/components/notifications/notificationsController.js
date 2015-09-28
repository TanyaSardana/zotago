app.controller('notificationsController',['$scope','$rootScope', function($scope,$rootScope){
$rootScope.currentSection = 'Notifications';
$scope.letter = false;

$scope.notifications = [
	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		text: 'Reply',
	},
	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		text: 'New Offering',
	},
	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		text: 'View',
	},
	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		text: 'Reply',
	},
	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		text: 'View',
	},


];

}]);