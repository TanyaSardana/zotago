app.config(function($routeProvider) {
$routeProvider
    // route for the home page
    .when('/', {
        templateUrl : '/app/components/home/homeView.html',
        controller  : 'homeController',
    })
    // .when('/virtual-closet', {
    //     templateUrl : '/app/components/virtual/virtualView.html',
    //     controller  : 'virtualController',
    // })
    .when('/product-page', {
        templateUrl : '/app/components/product-page/productView.html',
        controller  : 'productController',
    })
    .when('/profile', {
        templateUrl : '/app/components/virtual/virtualView.html',
        controller  : 'virtualController',
    })
    .when('/create-sell-post', {
        templateUrl : '/app/components/create-sell-post/createSellView.html',
        controller  : 'createSellController',
    })
    .when('/offerings', {
        templateUrl : '/app/components/offerings/offeringsView.html',
        controller  : 'offeringsController',
    })
    .when('/the-offering', {
        templateUrl : '/app/components/offerings/offeringsAllComments.html',
        controller  : 'offeringsController',
    })
    

    // .when('/notifications', {
    //     templateUrl : '/app/components/notifications/notificationsView.html',
    //     controller  : 'notificationsController',
    // })
    // .when('/account-settings', {
    //     templateUrl : '/app/components/settings/settingsView.html',
    //     controller  : 'settingsController',
    // })
    // .when('/keywords', {
    //     templateUrl : '/app/components/keywords/keywordsView.html',
    //     controller  : 'keywordsController',
    // })
    // .when('/scoring-strategy', {
    //     templateUrl : '/app/components/scoring/scoringView.html',
    //     controller  : 'scoringController',
    // })
    // .when('/how-it-works', {
    //     templateUrl : '/app/components/how-it-works/howItWorksView.html',
    //     controller  : 'howItWorksController',
    // })
   

    .otherwise({
        redirectTo: '/',
        
    });
     
});
app.run(['$rootScope', '$window', 'facebookService','api','userService', '$timeout','$cookies',
  function($rootScope, $window, facebookService,api,userService,$timeout,$cookies) {

    watchLoginChange = function() {
      FB.Event.subscribe('auth.authResponseChange', function(res) {
        if (res.status === 'connected') {
          //$rootScope.user.isLoggedIn = true;
          //$rootScope.user.userId = FB.getUserID();
          userService.user.userId = FB.getUserID();
          /* 
           The user is already logged, 
           is possible retrieve his personal info
          */
          facebookService.getProfilePic(userService.user.userId).then(function(response){
            userService.user.profileImageUrl = response.data.url;
            $timeout();
          });
          console.log(facebookService.getProfilePic(userService.user.userId).data.url);

          FB.getUserInfo();    
          /*
           This is also the point where you should create a 
           session for the current user.
           For this purpose you can use the data inside the 
           res.authResponse object.
          */
        } 
        else {
            console.log('im not connected', $cookies);
          /*
           The user is not logged to the app, or into Facebook:
           destroy the session on the server.
          */      
        }
      });
    }  
    facebookService.load(document,watchLoginChange);
}]);

