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
app.run(['$rootScope', '$window', 'facebookService','api', '$timeout',
  function($rootScope, $window, facebookService,api,$timeout) {

  $rootScope.accessToken = '';
  $rootScope.user = {};

  (function(d){
        // load the Facebook javascript SDK

        var js, 
        id = 'facebook-jssdk', 
        ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement('script'); 
        js.id = id; 
        js.async = true;
        js.src = "//connect.facebook.net/en_US/sdk.js";

        ref.parentNode.insertBefore(js, ref);

    }(document));

  $window.fbAsyncInit = function() {
    FB.init({ 
          appId: '923132421099770',
          status: true, 
          cookie: false, 
          xfbml: true,
          version: 'v2.4'
        });
        watchLoginChange();
        //Quick check
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            api.createFacebookAuthentication(accessToken).then(function(response){
                $rootScope.accessToken = response;
            })
          } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
          } else {
            // the user isn't logged in to Facebook.
          }
        });

    };
    //this method will fire when the user status changes i.e. login/logout
    watchLoginChange = function() {


      FB.Event.subscribe('auth.authResponseChange', function(res) {

        if (res.status === 'connected') {
          $rootScope.user.isLoggedIn = true;
          $rootScope.user.userId = FB.getUserID();
          console.log('im connected');
          /* 
           The user is already logged, 
           is possible retrieve his personal info
          */
          


          facebookService.getProfilePic($rootScope.user.userId).then(function(response){
            $rootScope.user.profileImageUrl =  response.data.url;
          });
          console.log(facebookService.getProfilePic($rootScope.userId).data.url);

          FB.getUserInfo();
          

          /*
           This is also the point where you should create a 
           session for the current user.
           For this purpose you can use the data inside the 
           res.authResponse object.
          */

        } 
        else {
            $rootScope.user.isLoggedIn = false;
            console.log('im not connected');
          /*
           The user is not logged to the app, or into Facebook:
           destroy the session on the server.
          */
           
        }

      });

    }    

   
    

}]);

