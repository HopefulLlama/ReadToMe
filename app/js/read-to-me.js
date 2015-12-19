var readToMeApp = angular.module('ReadToMeApp', ['ngMaterial']);

readToMeApp.controller('ReadToMeController', ['$scope', function($scope) {
	$scope.speak = false;
	$scope.sentenceIndex = 0;
	$scope.toggleSpeak = function() {
		if(typeof $scope.script !== 'undefined' && $scope.script !== null) {
			$scope.speak = !$scope.speak;
			$scope.parsedScript = $scope.script.trim().split(".");
			if($scope.parsedScript[$scope.parsedScript.length-1] === "") {
				$scope.parsedScript.splice($scope.parsedScript.length-1, 1);
			}	
			sayNextSentence();
		} else {
			$scope.speak = false;
		}
	};

	var sayNextSentence = function() {
		if($scope.parsedScript.length === $scope.sentenceIndex) {
			$scope.sentenceIndex = 0;
			$scope.speak = false;
			$scope.$digest();
		}

		if($scope.speak) {
			responsiveVoice.speak($scope.parsedScript[$scope.sentenceIndex], "UK English Female", {onend: function() {
				$scope.sentenceIndex++;
				sayNextSentence();
			}});
		}
	};

	$scope.processFile = function(domId) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		var f = document.getElementById(domId).files[0];
		var image = new Image;
		image.onload = function() {
			canvas.width = this.width
			canvas.height = this.height;
			context.drawImage(image,0,0);
			$scope.script = OCRAD(context.getImageData(0,0,canvas.width,canvas.height));
			$scope.$digest();
		}
		image.src = URL.createObjectURL(f);
	}
}]);