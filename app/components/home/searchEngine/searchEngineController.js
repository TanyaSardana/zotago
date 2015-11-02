app.controller('searchEngineController',['$scope','$rootScope','api','$timeout',function($scope,$rootScope,api,$timeout){
	$scope.test = "hello";
	
	$scope.getYahooImage = function(){
	console.log('call the yahoo engine!');
	}

    
}]);