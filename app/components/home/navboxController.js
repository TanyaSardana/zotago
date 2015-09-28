app.controller('navboxController',['$scope', function($scope){

$scope.navbox = {
	currentTags : ['fasion','advice','marketing','electronics','electronics','electronics','fasion','advice','marketing','electronics','electronics'],
	availableTags : ['fasion','advice','marketing','electronics','electronics','electronics','fasion','advice','marketing','electronics','electronics','food-love','electronics','self-development'],
}

$scope.models = {
    selected: null,
    lists: {"A": [{label: "fasion"},{label: "advice"},{label: "marketing"}], 
    "B": [{label: "marketing"},{label: "electronics"},{label: "food-love"},{label: "marketing"},{label: "electronics"},{label: "food-love"}]}
};



// Model to JSON for demo purpose
$scope.$watch('models', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
}, true);




}]);