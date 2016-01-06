app.factory('userService', function($cookieStore) {
    var user = {
    	userId : '',
    	profileImageUrl : '',
    	token : '',
    	isLoggedInToFb : false,
    };

    
    user.token = $cookieStore.get('accessToken');
    return {
        user: user,    
        setToken : function(val){
        	$cookieStore.put('accessToken', val);
        	user.token = val;
        }
    }
});