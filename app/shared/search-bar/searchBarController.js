app.controller('searchBarController',['$scope','$rootScope','api','$filter', function($scope,$rootScope,api,$filter){

	$scope.paddingLeft= '10px';


	//tags to insert when user loads the page
	$rootScope.tags = [
        { text: 'montreal' },        
    ];
    
    function getTags(){
    	var tags;
    	api.getTags().success(function(data){
		   //$scope.tags = data;
		   setSearchPluginTagList(data);
		});
    };
    getTags();

    function setSearchPluginTagList(data){
    	var searchPluginTagList = [];
    	for (var i = 0 ; i < data.length ; i++){
    		searchPluginTagList.push({text: data[i].name});
    	}
    	$scope.loadTagsToDisplay = function(query) {	    
	    	console.log('searchPluginTagList: ', searchPluginTagList);
	    	console.log('query: ', query);
		    return $filter('filter')(searchPluginTagList, query);
		    //return $http.get('/tags?query=' + query);
	  	};

    };

    

   //  $scope.loadTags = function(query) {	    
	    

	  //   return [
	  //   	{ text: 'tag0' },
	  //       { text: 'tag1' },
	  //       { text: 'tag2' },
	  //       { text: 'tag3' }

	  //   ];

	    
	  //   //return $http.get('/tags?query=' + query);
  	// };
	

	var init = function(){
		
	}
	init();
	

}]);