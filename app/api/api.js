app.factory('api', function($http){
    var baseUrl = '/api';
    return {
        
        getWantPosts: function() {
            console.log('boom');
            return $http.get( baseUrl + '/wantposts');
        },
        getTags: function(){
        	return $http.get( baseUrl + '/tags');
        },
        createWantPost: function(dataObj){	
			// var dataObj = {
			//     post: {
			//         imageUrl: 'http://www.example.com',
			//         description: 'Hey I just created a want post',
			//         creatorId: 1,
			//     },
			//     tags: [
			//         'tag1',
			//         'tag2',
			//     ]
			// };
			return $http.post(baseUrl + '/wantposts', dataObj);
         },
         
    };
});