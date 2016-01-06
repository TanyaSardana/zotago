app.controller('navController',['$scope','$window','$location', '$rootScope','$cookieStore','facebookService','api','userService','$interval',function($scope,$window,$location,$rootScope,$cookieStore,facebookService,api,userService,$interval){
	
	$scope.user =  userService.user;
	
	
	$scope.showNavbar = false;
	//$rootScope.user.isLoggedIn = false;

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
          console.log('authresponse: ', token);
          api.login({
            method: "facebook",
            shortToken: token,
          })
          .then(function(response){
            //$rootScope.accessToken = response;
            //$rootScope.accessToken = response.data.accessToken;
            userService.user.token = response.data.accessToken;
            $cookieStore.put('accessToken',userService.user.token);
            console.log('2contd: ', userService.user.token);
          });
        }else if(response.status === 'not_authorized'){

        }else{

        }
      })
	};
	$scope.facebookSignup = function(username){
      facebookService.login().then(function(response){
        if(response.status == 'connected'){
          var token = response.authResponse.accessToken;
          console.log('authresponse: ', token);
          api.register({
            method: "facebook",
            shortToken: token,
            username: username
          })
          .then(function(response){
            //$rootScope.accessToken = response;
            //$rootScope.accessToken = response.data.accessToken;
            console.log('responsssse: ', response);
            userService.user.token = response.data.accessToken;
            console.log('3contd: ', userService.user.token);
          });
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
		console.log('loging out');
		FB.logout(function(){
			userService.user.token = '';
		});

		//clear cookie token
		$cookieStore.put('accessToken','');

		//redirect to have page
		$location.path('/')
		
	}



}]);
