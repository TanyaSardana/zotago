app.controller('navController',['$scope','$window', '$rootScope','facebookService','api','$timeout', function($scope,$window,$rootScope,facebookService,api,$timeout){
	
	$scope.showNavbar = false;
	$rootScope.user.isLoggedIn = false;

	$scope.height = '50px';
	$scope.company = {
		
		logo : '/assets/img/gotta-find-it-logo.png',
	}
	$scope.navbarProfileMenu = [
		
		{
			name: 'Invite Friends & Earn $$',
			href: '',
		},
		{
			name: 'Sell Something',
			href: '#/create-sell-post',
		},
		{
			name: 'My Closet',
			href: '#/profile',
		},

		
	];

	
	
	$scope.facebookLogin = function(){
		facebookService.login().then(function(response){

			if(response.status == 'connected'){
				var token = response.authResponse.accessToken;				
				api.createFacebookAuthentication(token).then(function(response){
					$rootScope.accessToken = response;
					console.log(response);
			})
            }else if(response.status === 'not_authorized'){

            }else{

            }
		})
	};

	$scope.getMyLastName = function() {
	   facebookService.getMyLastName() 
	     .then(function(response) {
	       $scope.last_name = response.last_name;
	       console.log($scope.last_name);
	     },function(response){
	     	console.log(response);
	     }
	   );
	};

	$scope.logout = function(){
		FB.logout();
	}

	$timeout(function(){
		$scope.getMyLastName();

	},1000);

}]);