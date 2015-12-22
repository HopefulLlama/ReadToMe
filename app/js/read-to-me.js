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
			fullscreen: false	
		})
		.then(function(text) {
			$scope.script.contents = text;
		});
	};
}]);

function DialogController($scope, $mdDialog) {
	$scope.importType = 'file';

	$scope.tabChange = {
		file: function() {
			$scope.importType = 'file';
		},
		camera: function() {
			$scope.importType = 'camera';
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
			if(navigator.getUserMedia) {
				navigator.getUserMedia({audio: false, video: true}, function(stream) {
					document.getElementById("camera-playback").src = window.URL.createObjectURL(stream);
				}, function() {
					console.log("No camera or denied permission.");
				});
			}
		}
	};

	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};	

	$scope.process = {
		file: function() {
			var canvas = document.createElement("canvas");
			var context = canvas.getContext('2d');
			var f = document.getElementById('file-upload').files[0];
			var image = new Image;
			image.onload = function() {
				canvas.width = this.width
				canvas.height = this.height;
				context.drawImage(image,0,0);
				var contents = OCRAD(context.getImageData(0,0,canvas.width,canvas.height));
				$mdDialog.hide(contents);
				$scope.$digest();
			}
			if(f) {
				image.src = URL.createObjectURL(f);
			}
		},
		camera: function() {
			var video = document.getElementById("camera-playback");
		    var canvas = document.createElement("canvas");
		    var context = canvas.getContext('2d');
			canvas.width = video.clientWidth
			canvas.height = video.clientHeight;
			context.drawImage(video,0,0);
			var contents = OCRAD(context.getImageData(0,0,canvas.width,canvas.height));
			$mdDialog.hide(contents);
		}
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
}