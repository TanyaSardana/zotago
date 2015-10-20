app.controller('virtualController',['$scope','$rootScope', function($scope,$rootScope){
	$scope.myProfile = {
		image : 'http://challengepost-s3-challengepost.netdna-ssl.com/photos/production/user_photos/000/203/481/datas/profile.jpg',
	};
	$scope.tabs = {
		currentTab : 1,
		postSelected : true,
		followSelected : false,
		scoreLevelSelected : false,
		currentTabFile : '/app/components/virtual/virtual-closet/virtual-closet.html',
	};
	$scope.closet = [
		{
			image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
			name : 'Hermes Craie Swift',
			desc : 'Help me find this item !',
			followers : 2,
			tips: '2.00',
		},
		{
			image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
			name : 'Hermes Craie Swift',
			desc : 'Help me find this item !',
			followers : 2,
			tips: '2.00',
		},
		{
			image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
			name : 'Hermes Craie Swift',
			desc : 'Help me find this item !',
			followers : 2,
			tips: '2.00',
		},
		{
			image : 'https://item5.tradesy.com/r/f11348355c9f7cd1825726c49cdd5712c93ff2698aef9af8c436b5c2772497d9/203/307/accessories/hermes/jewelry/hermes-hermes-orange-clic-clac-narrow-palladium-silver-h-bracelet-3525859.jpg',
			name : 'Hermes Craie Swift',
			desc : 'Help me find this item !',
			followers : 2,
			tips: '2.00',
		},
		
		

	];
	$scope.setTab = function(currentTab,clickedTab){
		console.log('currentTab is: ', currentTab);
		console.log('clickedTab is: ', clickedTab);
		if(clickedTab == 1 && currentTab != 1){//virtual closet clicked
			$scope.tabs.postSelected = true;
			$scope.tabs.followSelected = false;
			$scope.tabs.scoreLevelSelected = false;

			$scope.tabs.currentTabFile = '/app/components/virtual/virtual-closet/virtual-closet.html';
			$scope.tabs.currentTab = 1;
		}else if(clickedTab == 2 && currentTab != 2){//sold items clicked
			$scope.tabs.postSelected = false;
			$scope.tabs.followSelected = true;
			$scope.tabs.scoreLevelSelected = false;

			$scope.tabs.currentTabFile = '/app/components/virtual/virtual-closet/virtual-closet.html';
			$scope.tabs.currentTab = 2;
		}else if(clickedTab == 3 && currentTab != 3){//add an item clicked
			$scope.tabs.postSelected = false;
			$scope.tabs.followSelected = false;
			$scope.tabs.scoreLevelSelected = true;

			$scope.tabs.currentTabFile = '/app/components/virtual/virtual-closet/virtual-closet.html';
			$scope.tabs.currentTab = 3;
		}
	}

}]);