app.controller('searchBarController',['$scope','$rootScope','api', function($scope,$rootScope,api){

	$scope.paddingLeft= '10px';

	$scope.tagsList = [
		{
			id: 0,
			name : 'tag0',
		},
		{
			id: 1,
			name : 'tag1',
		},
		{
			id: 2,
			name : 'tag2',
		},
		{
			id: 3,
			name : 'tag3',
		},

	];
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
	    
		    return searchPluginTagList;	    
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