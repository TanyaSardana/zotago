var uniqueID = 0;
app.controller('createSellController',['$scope','api','$rootScope','userService','$location' ,function($scope,api,$rootScope,userService,$location){
	$rootScope.showMainSearchBar = false;
	console.log('usertken in createsellctrl: ', userService.user.token);
	//create post object
	$scope.sellPost = {
	    post: {
	        imageUrl: 'http://www.example.com',
	        description: '',
	        creatorId: userService.user.id,
	    },
	    tags: []
	};


	$scope.createSellPost = function(){
		var desc = $scope.sellPost.post.description;
		var image = $scope.sellPost.post.imageUrl;
		console.log(desc);
		console.log(image);
		var chosenTags = [];
		for( var i = 0 ; i < $scope.tags.length; i++){
			chosenTags.push($scope.tags[i].text);
		}
		$scope.sellPost.tags = chosenTags;
		console.log('hello',$scope.sellPost);	



		var dataObj = $scope.sellPost;
		api.createSellPost(dataObj)
		.then(function(data){
			console.log('want post is created');
			$location.path('/');

		},function(error){
			console.log('error');
		});	
	};
	

	$scope.tags = [
        { text: 'just' },
       
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
    	$scope.loadTags = function(query) {	    
	    
		    return searchPluginTagList;	    
		    //return $http.get('/tags?query=' + query);
	  	};

    };

	$scope.product = {
		mainImage : 'https://item4.tradesy.com/r/887312ba56ecee9b441f67a69334a403deeac38ea7b6ac831bacaccdd2f35d87/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg',
		otherImages : ['https://item4.tradesy.com/r/52833c856bbf7fb4b09a2bc55bf695e31da00719ae29557956876f0969f27b82/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/b39b219ebc4b4a775547ba3f5c2aca75879ee0b249a7d19ed6c522811cb37afd/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/44c2b2316bca57597e76e3a3b88d8bb98a4a83ab9cadd77dcef0e0063095d962/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg','https://item4.tradesy.com/r/887312ba56ecee9b441f67a69334a403deeac38ea7b6ac831bacaccdd2f35d87/355/355/bags/mansur-gavriel/totes/mansur-gavriel-tote-bag-black-with-ballerina-interior-4814743.jpg']
	}


	
    document.getElementById('files-to-upload').addEventListener('change', handleNotDraggedFilesSelect);


	//File Upload Select
	function handleDraggedFilesSelect (event){
		event.stopPropagation();
	    event.preventDefault();
		var files = (!!event.target.files) ? event.target.files : event.dataTransfer.files;//fileList object
		displayUploadedImages(files);			
	}
	function handleNotDraggedFilesSelect(evt) {
	    var files = evt.target.files; // FileList object
	    displayUploadedImages(files);
	}

	function displayUploadedImages(files){
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
	      // Only process image files.
	      if (!f.type.match('image.*')) {
	        continue;
	      }

	      var reader = new FileReader();

	      // Closure to capture the file information.
	      
	      reader.onload = (function(theFile) {
	        return function(e) {
	          // Render thumbnail.
	        	console.log('inside onload');
	        	e.uniqueID = uniqueID;
	        	console.log('picture counter: ', e);
	        	var newImgThumb = 
	        	'<div id="'+e.uniqueID+'"class="thumbnail sell-upload-picture">'+
	        			'<div style="height:15%;"><a onclick="deleteSelectedUploadedFile('+e.uniqueID+')"><i class="fa fa-times pull-right"></i></a></div>'+
	        			'<img class="uploadedImage" src="'+e.target.result+'"/>'+
		                '<div class="text-center"><small><input class="cover-picture-radio" type="radio" name="sell-upload-picture">Cover?</small></div>'+
		            '</div>'+
            	'</div>';
	        	uniqueID++;
	        	var existingPics = document.getElementById('uploaded-images').innerHTML;
	        	document.getElementById('uploaded-images').innerHTML = existingPics +  newImgThumb; 

	        	$scope.sellPost.post.imageUrl = e.target.result;         
	        };
	      })(f);

	      // Read in the image file as a data URL.
	      reader.readAsDataURL(f);
	    }
	}
	
	//Photos Sell DropZone
	var dropzone = document.getElementById("photoDropzone");
	dropzone.addEventListener("drop",handleDraggedFilesSelect);
	
	dropzone.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		this.className = "photoDropzone dragover";
		return false;
	};
	dropzone.ondragleave = function(){
		this.className = "photoDropzone";
			return false;
	};


}]);
//This should be placed outside $(document).ready(function(){}) because the onclick is coming from the window, that is the html, which has to go through the jquery before accessing local elements
	//What you can do is either put the function outside or put it inside as window.x = function(){} 
	function deleteSelectedUploadedFile(counter){
		var selectedThumbnail = $("#"+counter);
		selectedThumbnail.remove();
	}