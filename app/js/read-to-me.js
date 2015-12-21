var readToMeApp = angular.module('ReadToMeApp', ['ngMaterial']);

readToMeApp.controller('ReadToMeController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
	$scope.speak = false;
	$scope.sentenceIndex = 0;

	$scope.script = new Script();

	$scope.toggleSpeak = function() {
		if($scope.script.hasContents()) {
			$scope.speak = !$scope.speak;
			$scope.parsedScript = $scope.script.contents.trim().split(".");
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

	$scope.showImportDialog = function(event) {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'src/js/dialogs/import.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true,
			fullscreen: true	
		})
		.then(function(text) {
			$scope.script.contents = text;
		});
	};
}]);

function DialogController($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
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
			var contents = OCRAD(context.getImageData(0,0,canvas.width,canvas.height));
			$mdDialog.hide(contents);
			$scope.$digest();
		}
		image.src = URL.createObjectURL(f);
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}