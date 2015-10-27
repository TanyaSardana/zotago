app.controller('homeController',['$scope','$rootScope','api', function($scope,$rootScope,api){
$rootScope.showMainSearchBar = true;
$scope.wantPosts = {};
$scope.store = [

	{
		image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
		desc : 'Help me find this item !',
		followers : 2,
		offerings : 4,
		isAWant : true,
		followed : false,
		tags: ['tag1', 'tag2', 'tag3', 'tag4'],
		
	},
	{
		image : 'https://item4.tradesy.com/r/eb52b40f120fb63528e689d79003f3473f51f27c1320bd2eadd2b756ec33560b/203/307/accessories/hermes/scarves-and-wraps/herms-herms-silk-poste-et-cavalerie-scarf-1320628.jpg',
		desc : 'Looking for this exact item',
		isAWant : false,
		link : 'http://www.kijiji.ca/v-plumbing-sink-toilet-shower/city-of-toronto/art-sink-blow-out-super-deal-50-off-renoshop-ca/1106320850?enableSearchNavigationFlag=true',
		tags: ['tag1', 'tag2', 'tag3', 'tag4'],
	},
	{
		image : 'https://item5.tradesy.com/r/f8b5d9411b8b215e22c8c75366cecca4a522d7b4267c89a76f27593a83d89a87/203/307/accessories/hermes/jewelry/hermes-hermes-craie-swift-rose-gold-micro-kelly-leather-bracelet-medium-3968899.jpg',
		desc : 'Mo Money Mo Joy !',
		followers : 2,
		offerings : 4,
		isAWant : true,
		followed : false,
		tags: ['tag1', 'tag2', 'tag3', 'tag4'],
	},
	{
		image : 'https://item5.tradesy.com/r/7d162203d435af3e42f03a4effdf4d805ee7150599d74c9b3bf35437250dd728/203/307/accessories/hermes/jewelry/hermes-hermes-kelly-dog-bracelet-in-black-box-leather-gold-hardware-fabulous-4170559.jpg',
		desc : 'Help me find this item !',
		isAWant : false,
		link : 'http://www.kijiji.ca/v-plumbing-sink-toilet-shower/city-of-toronto/art-sink-blow-out-super-deal-50-off-renoshop-ca/1106320850?enableSearchNavigationFlag=true',
		tags: ['tag1', 'tag2', 'tag3', 'tag4'],
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
	
};
$scope.init = function(){
	console.log('init called');
	api.getWantPosts().then(successCallback, errorCallback);
};
$scope.init();


//api.createWantPost().then(successboom,errorboom);

function successboom(data){
	console.log('success',data);
	api.getWantPosts().then(successCallback, errorCallback);


};
function errorboom(data){
	console.log('error data',data);
}
function successCallback(data){
	console.log('success', data);
	$scope.wantPosts = data.data;

};
function errorCallback(data){
	console.log('error');
}
}]);	