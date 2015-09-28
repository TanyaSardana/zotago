app.controller('virtualController',['$scope', '$rootScope', function($scope,$rootScope){
	$rootScope.currentSection = 'Virtual Closet';
	$scope.tabs = {
		currentTab : 1,
		currentTabFile : 'app/components/virtual/virtual-closet/virtual-closet.html',
		virtualSelected : true,
		soldSelected : false,
		addSelected : false,
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
			$scope.tabs.virtualSelected = true;
			$scope.tabs.soldSelected = false;
			$scope.tabs.addSelected = false;

			$scope.tabs.currentTab = 1;
			$scope.tabs.currentTabFile = 'app/components/virtual/virtual-closet/virtual-closet.html';
		}else if(clickedTab == 2 && currentTab != 2){//sold items clicked
			$scope.tabs.virtualSelected = false;
			$scope.tabs.soldSelected = true;
			$scope.tabs.addSelected = false;

			$scope.tabs.currentTabFile = 'app/components/virtual/virtual-closet/virtual-closet.html';
			$scope.tabs.currentTab = 2;
		}else if(clickedTab == 3 && currentTab != 3){//add an item clicked
			$scope.tabs.virtualSelected = false;
			$scope.tabs.soldSelected = false;
			$scope.tabs.addSelected = true;

			$scope.tabs.currentTabFile = 'app/components/virtual/add-item/addItemView.html';
			$scope.tabs.currentTab = 3;
		}
	}

}]);