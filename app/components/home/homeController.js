app.controller('homeController',['$scope','$rootScope', function($scope,$rootScope){
$rootScope.currentSection = 'Waunted';

$scope.store = [

	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		name : 'Hermes Craie Swift',
		desc : 'Help me find this item !',
		followers : 2,
		offerings : 4,
		
		followed : false,
		
	},
	{
		image : 'https://item4.tradesy.com/r/eb52b40f120fb63528e689d79003f3473f51f27c1320bd2eadd2b756ec33560b/203/307/accessories/hermes/scarves-and-wraps/herms-herms-silk-poste-et-cavalerie-scarf-1320628.jpg',
		name : 'Rose Gold Micro',
		desc : 'Looking for this exact item',
		followers : 2,
		offerings : 4,
		
		followed : false,
		
	},
	{
		image : 'https://item5.tradesy.com/r/f8b5d9411b8b215e22c8c75366cecca4a522d7b4267c89a76f27593a83d89a87/203/307/accessories/hermes/jewelry/hermes-hermes-craie-swift-rose-gold-micro-kelly-leather-bracelet-medium-3968899.jpg',
		name : 'Kelly Leather',
		desc : 'Mo Money Mo Joy !',
		followers : 2,
		offerings : 4,
		
		followed : false,
		
	},
	{
		image : 'https://item5.tradesy.com/r/7d162203d435af3e42f03a4effdf4d805ee7150599d74c9b3bf35437250dd728/203/307/accessories/hermes/jewelry/hermes-hermes-kelly-dog-bracelet-in-black-box-leather-gold-hardware-fabulous-4170559.jpg',
		name : 'Bracelet Medium',
		desc : 'Help me find this item !',
		followers : 2,
		offerings : 4,
		
		followed : false,
		
	},

	
];


$scope.addFollower = function(index){
	if($scope.store[index].followed == false){
		$scope.store[index].followers += 1;	
		$scope.store[index].followed = true;	

	}else{
		$scope.store[index].followers -= 1;
		$scope.store[index].followed = false;
	}
	
}


}]);