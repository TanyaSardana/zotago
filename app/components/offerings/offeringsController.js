app.controller('offeringsController',['$scope','$location','$rootScope','api','$routeParams','$interval', function($scope,$location,$rootScope,api,$routeParams,$interval){
	$scope.showYourCloset = false;
	$scope.selectedIndex = 0;
	$scope.sellPosts = {};
	$scope.wantPost = {};
	$scope.offerPost = {};

	$scope.getOfferingInfo = function(){
		console.log('hello', $scope.wantPost);
	}


	$scope.setShowCloset = function(bool){
		$scope.showYourCloset = bool;
	}

	function getWantItem(){
		api.getWantPost($routeParams.id).then(function(response){
			$scope.wantPost = response.data.post;
			$scope.wantPost.tags = response.data.tags;
		},function(err){
			console.error('error');
		})		
	}
	function getOffersToWantItem(){
		api.getOfferingsOfWantPost($routeParams.id).then(getOfferingsOfWantPostSuccessCallback,getOfferingsOfWantPostErrorCallback);
	}

	//to delete. it is replaced by $scope.wantPostClickedItem in homeController.js
	$scope.mainWaunt = {
		
		tags : ['#knit','#cream','#jumper','#crop'],
	}

	
	
	$scope.offerSellPost = function(wantPost){
		var wantId = wantPost.id;
		var sellPostId = $scope.sellPosts[$scope.selectedIndex].id;
		var dataObj = {
			'postId': sellPostId
		}
		console.log('wantId: ', wantId);
		console.log('sellid is: ', dataObj);
		api.createOfferingToWantPost(wantId, dataObj).then(createOfferingToWantPostSuccessCallback,createOfferingToWantPostErrorCallback);

	}
	function createOfferingToWantPostSuccessCallback(data){
		console.log('success', data);
		api.getOfferingsOfWantPost($scope.wantPost.id).then(getOfferingsOfWantPostSuccessCallback,getOfferingsOfWantPostErrorCallback);
		//transition back to offering listing
		$scope.showYourCloset = false;

	}
	function getOfferingsOfWantPostSuccessCallback(data){
		console.log('getoffering success', data);
		$scope.offerings = data.data;
	}
	function getOfferingsOfWantPostErrorCallback(data){
		console.log('getoffering error', data);
	}
	function createOfferingToWantPostErrorCallback(){
		console.log('error' , data);
	}
	$scope.yourClosetItemClicked = function($index){
    	$scope.selectedIndex = $index;
	}

	$rootScope.closeModalWithID = function(id){
		angular.element("#"+id).modal('hide');
	};

	
	//Resize modal
	function rescale(){
	    var size = {width: $(window).width() , height: $(window).height() }
	    /*CALCULATE SIZE*/
	    var offset = 30;
	    var offsetBody = 150;
	    $('#myModal').css('height', size.height - offset );
	    $('.modal-body').css('height', size.height - (offset + offsetBody));
	    $('#myModal').css('top', 0);
	}
	$(window).bind("resize", rescale);
	rescale();

	function getSellPostsSuccessCallback(data){
		console.log('success of get sell post', data);
		$scope.sellPosts = data.data;
	}
	function getSellPostsErrorCallback(data){
		console.log('error of get sell posts', data);

	}

	function init(){
		getWantItem();
		getOffersToWantItem();
		api.getSellPosts().then(getSellPostsSuccessCallback, getSellPostsErrorCallback);
	}
	init();

}]);