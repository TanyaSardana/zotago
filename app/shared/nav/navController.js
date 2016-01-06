app.controller('navController',['$scope','$window','$location', '$rootScope','$cookieStore','facebookService','api','userService','$timeout',function($scope,$window,$location,$rootScope,$cookieStore,facebookService,api,userService,$timeout){
	
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
			href: '#/profile/' + userService.user.id,
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
            userService.setToken(response.data.accessToken);
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
            console.log('responsssse: ', response);            
            userService.setToken(response.data.accessToken);
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
		userService.setToken('');

		//redirect to have page
		$location.path('/')
		
	}

	// $scope.errorMessage = "There seems to be a problem. Try refreshing your page";
	// $scope.showErrorModal = false;
	// $scope.toggleErrorModal = function(){
 //       console.log('hl');
 //       $scope.showErrorModal = !$scope.showErrorModal;
 //    }




}]);
