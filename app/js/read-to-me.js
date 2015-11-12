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
				console.log($scope.parsedScript);
				responsiveVoice.speak($scope.parsedScript[$scope.sentenceIndex], "UK English Female", {onend: function() {
					$scope.sentenceIndex++;
					sayNextSentence();
				}});
			}
		};
		sayNextSentence();
	};
}]);