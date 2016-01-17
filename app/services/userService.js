app.factory('userService', function($cookieStore) {
    var user = {
    	id : '',
    	profileImageUrl : '',
    	token : '',
    	isLoggedInToFb : false,
        firstName : '',
        lastName : '',
    };

    
    user.token = $cookieStore.get('accessToken');
    return {
        user: user,    
        setToken : function(val){
        	$cookieStore.put('accessToken', val);
        	user.token = val;
            console.log('cookiestore: ', $cookieStore.get('accessToken'));
        }
    }
});