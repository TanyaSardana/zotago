app.controller('miniWantController',['$scope','$rootScope','api','$timeout', function($scope,$rootScope,api,$timeout){

	$scope.wantPost = {
	    "post": {
	        imageUrl: $scope.miniWantImage,
	        description: '',
	        creatorId: 1,
	    },
	    "tags": []
	};
	
	
	$scope.publishWantPost = function(){
		var chosenTags = [];
		for( var i = 0 ; i < $rootScope.tags.length; i++){
			chosenTags.push($rootScope.tags[i].text);
		}
		console.log('tags are: ', chosenTags);
		$scope.wantPost.tags = chosenTags;
		$scope.wantPost.post.imageUrl = $scope.miniWantImage;
		var dataObj = $scope.wantPost;
		console.log('dataObj is: ', dataObj);

		api.createWantPost(dataObj).then(createWantPostSuccessCallback,createWantPostErrorCallback);	
	}

	function createWantPostSuccessCallback(data){
		console.log('wantpost is created');
		$scope.getQueriedWantPosts();
	};
	function createWantPostErrorCallback(data){
		console.log('error');
	};
	var dropzone = '';
	$timeout(function(){
        document.getElementById('files-to-upload2').addEventListener('change', handleNotDraggedFilesSelect);
        //Photos Sell DropZone
		//dropzone = document.getElementById("photoDropzone");
		//dropzone.addEventListener("drop",handleDraggedFilesSelect);
    },1000);

	
	//File Upload Select
	// function handleDraggedFilesSelect (event){
	// 	event.stopPropagation();
	//     event.preventDefault();
	// 	var files = (!!event.target.files) ? event.target.files : event.dataTransfer.files;//fileList object
	// 	displayUploadedImages(files);			
	// }
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
	        	$scope.miniWantImage = e.target.result;
	        	$timeout();//timeout to refresh scope in view
	        	 

	        };
	      })(f);

	      // Read in the image file as a data URL.
	      reader.readAsDataURL(f);
	    }
	}
	
	
	
	// dropzone.ondragover = function(e){
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// 	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	// 	this.className = "photoDropzone dragover";
	// 	return false;
	// };
	// dropzone.ondragleave = function(){
	// 	this.className = "photoDropzone";
	// 		return false;
	// };

	
}]);