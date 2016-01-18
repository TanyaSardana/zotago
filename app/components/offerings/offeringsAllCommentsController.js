app.controller('offeringsAllCommentsController',['$scope','$location','$rootScope','api','$routeParams', function($scope,$location,$rootScope,api,$routeParams){
//get specific want post with id
//get list of offerings from that id
$scope.offerPost = {};
function getWantItem(callback){
	api.getWantPost($routeParams.id).then(function(response){
		console.log('want: ',response.data.post);
		$scope.wantPost = response.data.post;
		$scope.wantPost.tags = response.data.tags;
		callback();		
	},function(err){
		console.error('error');
	})		
}
function getOffersToWantItem(){
	api.getOfferingsOfWantPost($routeParams.id).then(function(data){
		$scope.offerings = data.data;
		$scope.offerPost = getOfferingPostFromOfferings();		
	},function(err){
		console.log('error');
	});
}

function getOfferingPostFromOfferings(){
	for(var i = 0 ; i < $scope.offerings.length ; i++){
		if($scope.offerings[i].id == $routeParams.offerId){			
			return $scope.offerings[i];
		}
	}
	return '';
}


function init(){
	getWantItem(getOffersToWantItem);
}
init();



}]);