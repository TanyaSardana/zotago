app.directive('chosen',function(){
	var linker = function(scope,element,attr){
		scope.$watch('tagsList', function(){
			element.trigger('liszt:updated');
		});
		element.chosen();
	};
	return {
		restrict: 'A',
		link: linker
	}
});