app.controller('offeringsController',['$scope','$location','$rootScope', function($scope,$location,$rootScope){
	$scope.showYourCloset = false;
	$scope.selectedIndex = 0;
	
	//to delete. it is replaced by $scope.wantPostClickedItem in homeController.js
	$scope.mainWaunt = {
		image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
		price : '52',
		
		user : {
			name : '@chree7',
			image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',
			follows : '1',

		},
		tags : ['#knit','#cream','#jumper','#crop'],
	}

	//get this list from backend and then delete this list
	$scope.offerings = [
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			href : '#/product-page',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345455/note_preview/508dbde8995a49fc488752282f0efdb9.jpeg',
			price : '52',
			href : '#/product-page',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345454/note_preview/8dc7a280adf24210daa32dd7a47f34d6.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		


	];
	$scope.yourCloset = [
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345455/note_preview/508dbde8995a49fc488752282f0efdb9.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345455/note_preview/508dbde8995a49fc488752282f0efdb9.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345455/note_preview/508dbde8995a49fc488752282f0efdb9.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345456/note_preview/09c219e923b69049739cedf4c447f452.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		{
			image : 'https://thehunt.insnw.net/app/public/system/note_images/10345455/note_preview/508dbde8995a49fc488752282f0efdb9.jpeg',
			price : '52',
			
			location : 'newlook.com',
			user : {
				name : '@chree7',
				image : 'https://thehunt.insnw.net/app/public/system/user_images/505079/lg_thumb/1426314763_056382763df50419a40489aac11af42b.jpg',

			},
			tags : ['#knit','#cream','#jumper','#crop'],
		},
		
	];

	$scope.yourClosetItemClicked = function($index){
		console.log($index);
    	$scope.selectedIndex = $index;
	}

	$rootScope.closeModalWithID = function(id){
		angular.element("#"+id).modal('hide');
	};

	
	//Resize modal
	function rescale(){
	    var size = {width: $(window).width() , height: $(window).height() }
	    /*CALCULATE SIZE*/
	    var offset = 30;
	    var offsetBody = 150;
	    $('#myModal').css('height', size.height - offset );
	    $('.modal-body').css('height', size.height - (offset + offsetBody));
	    $('#myModal').css('top', 0);
	}
	$(window).bind("resize", rescale);
	rescale();



}]);