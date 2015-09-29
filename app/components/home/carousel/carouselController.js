

app.controller('carouselController',['$scope', function($scope){
  $scope.myInterval = 3000;
  $scope.slides = [
    {
      image: 'http://lorempixel.com/1400/500/',
      view : '/app/components/home/carousel/carouselViewOne.html',
    },
    {
      image: 'http://lorempixel.com/1400/500/food',
      view : '/app/components/home/carousel/carouselViewTwo.html',

    },
    {
      image: 'http://lorempixel.com/1400/500/sports',
      view : '/app/components/home/carousel/carouselViewThree.html',

    },
    
  ];


}]);
