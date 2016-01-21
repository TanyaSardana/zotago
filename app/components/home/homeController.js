app.controller('homeController',['$scope','$rootScope','api','userService','$timeout', function($scope,$rootScope,api,userService,$timeout){
$scope.miniWantImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_(2011).svg/2000px-Google_Chrome_icon_(2011).svg.png';
$rootScope.showMainSearchBar = true;
$scope.queriedWantPosts = {};
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


$scope.errorModal = {
	message: "There seems to be a problem...",
	showModal : false,
}   
    
$scope.toggleErrorModal = function(){
	$scope.errorModal.showModal = !$scope.errorModal.showModal; 
}

$scope.toggleFollow = function(item){
	if(!!userService.user.token){
		//follow -> unfollow
		if(item.isFollowed == true){		
			$scope.unfollowClick(item);
			item.followerCount -= 1;
		}
		//unfollow -> follow
		else{		
			$scope.followClick(item);
			item.followerCount += 1;
		}
	}else{
		$scope.toggleErrorModal();
	}
}
$scope.followClick = function(item){
		item.isFollowed = true;
		api.followWantPost(item.id).then(function(response){
		});
}
$scope.unfollowClick = function(item,event){
		item.isFollowed = false;
		api.unfollowWantPost(item.id).then(function(response){
			console.log('unfollow success', response);
		},function(err){
			console.log('error in unfollowing want post');
		});
}

$scope.getQueriedWantPosts = function(){
	api.getQueriedWantPosts('').then(getQueriedWantPostsSuccessCallback,getQueriedWantPostsErrorCallBack);	
}

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
	$scope.getQueriedWantPosts();	
};
$scope.init();

function getQueriedWantPostsSuccessCallback(data){
	//wantPostService.queriedWantPosts = data.data;
	$scope.queriedWantPosts = data.data;
}
function getQueriedWantPostsErrorCallBack(data){
	console.log('error ', data);
}
$scope.parsedListOfTag = '';
$scope.onTagAdded = function(addedTag){
	formatTagList(addedTag);
	api.getQueriedWantPosts('' + $scope.parsedListOfTag).then(getQueriedWantPostsSuccessCallback,getQueriedWantPostsErrorCallBack);	

	//api.getImage($scope.parsedListOfTag).then(getImageSuccessCallback,getImageErrorCallback);
	
}
$scope.onTagRemoved = function(){
	if($scope.parsedListOfTag.indexOf(',') === -1){
	  //no ','
	  $scope.parsedListOfTag = '';
	}else{
		var temp = $scope.parsedListOfTag.substring(0,$scope.parsedListOfTag.lastIndexOf('"'));
		temp = temp.substring(0,temp.lastIndexOf('"') - 2); // - 2 to remove the coma and the "
		temp += '"';
		$scope.parsedListOfTag = temp;
	}	
	
	api.getQueriedWantPosts($scope.parsedListOfTag).then(getQueriedWantPostsSuccessCallback,getQueriedWantPostsErrorCallBack);	

	//api.getImage($scope.parsedListOfTag).then(getImageSuccessCallback,getImageErrorCallback);
}
function getImageSuccessCallback (data){
	if(!!data.data.bossresponse.images){
		$scope.miniWantImage = data.data.bossresponse.images.results[0].url;
		console.log('s', data);	
	}	
}
function getImageErrorCallback (data){
	console.log('e', data);
}
function formatTagList(tag){

	if($scope.parsedListOfTag.length > 0){
		$scope.parsedListOfTag += ',' + '"' + tag + '"';
	}else{
		$scope.parsedListOfTag += '"' + tag + '"';
	}
}


function errorCallback(data){
	console.log('error');
}

$scope.closeOfferingsWindow = function(){
	$scope.offeringsWindow = false;
}
function getOfferingsOfWantPostSuccessCallback(data){
	console.log('success:', data);
	$rootScope.offerings = data.data;
	//$scope.offerings = data.data;
}
function getOfferingsOfWantPostErrorCallback(data){
	console.log('error:', data);
}



}]);	