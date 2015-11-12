var readToMeApp = angular.module('ReadToMeApp', []);

readToMeApp.controller('ReadToMeController', ['$scope', function($scope) {
	var speak = false;
	$scope.sentenceIndex = 0;
	$scope.toggleSpeak = function() {
		speak = !speak;

		$scope.parsedScript = $scope.script.trim().split(".");
		if($scope.parsedScript[$scope.parsedScript.length-1] === "") {
			$scope.parsedScript.splice($scope.parsedScript.length-1, 1);
		}

		var sayNextSentence = function() {
			if($scope.parsedScript.length === $scope.sentenceIndex) {
				$scope.sentenceIndex = 0;
				speak = false;
			}

			if(speak) {
				responsiveVoice.speak($scope.parsedScript[$scope.sentenceIndex], "UK English Female", {onend: function() {
					$scope.sentenceIndex++;
					sayNextSentence();
				}});
			}
		};
		sayNextSentence();
	};

	$scope.processFile = function() {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		var f = document.getElementById('fileUpload').files[0];
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