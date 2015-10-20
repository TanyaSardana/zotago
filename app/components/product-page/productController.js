app.controller('productController',['$scope','$rootScope',function($scope,$rootScope){
	$scope.product = {
		name : 'Mansur Gavriel Black With Ballerina Interior Tote Bag',
		condition : 'New with tags',
		price : '650',
		author : '@misss_t',
		profilePic : 'https://d1qb2nb5cznatu.cloudfront.net/users/1278802-medium_jpg?1434152842',
		desc : 'BRAND NEW TAGS STILL ON IT Mansur Gavriel Large Tote with Black exterior and Ballerina Light Pink Interior. This is a great tote- italian leather and never used.',
		mainImage : 'https://item4.tradesy.com/r/887312ba56ecee9b441f67a69334a403deeac38ea7b6ac831bacaccdd2f35d87/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg',
		otherImages : ['https://item4.tradesy.com/r/52833c856bbf7fb4b09a2bc55bf695e31da00719ae29557956876f0969f27b82/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/b39b219ebc4b4a775547ba3f5c2aca75879ee0b249a7d19ed6c522811cb37afd/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/44c2b2316bca57597e76e3a3b88d8bb98a4a83ab9cadd77dcef0e0063095d962/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/887312ba56ecee9b441f67a69334a403deeac38ea7b6ac831bacaccdd2f35d87/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg']

	}


	$scope.switchMainImageWithOther = function(otherImageIndex){
		console.log('image index is: ', otherImageIndex);
		var mainImage = $scope.product.mainImage;
		var otherImage = $scope.product.otherImages[otherImageIndex];

		$scope.product.mainImage = otherImage;
		$scope.product.otherImages[otherImageIndex] = mainImage;
	}
	
}]);