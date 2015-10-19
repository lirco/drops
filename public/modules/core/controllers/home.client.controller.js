'use strict';

(function () {

	function homeController(Authentication, Notes, $mdDialog, $scope) {

		var self = this;
		var selectedTags = [];
		self.authentication = Authentication;
		self.notes = Notes.query();

		self.userTags = self.authentication.user.tags;
		self.sortOrder = ['-modified'];

		self.remove = function(note) {
			if (note) {
				note.$remove();

				for (var i in self.notes) {
					if (self.notes[i] === note) {
						self.notes.splice(i,1);
					}
				}
			} else {
				self.note.$remove(function() {
					$state.go('home');
				});
			}
		};

		//helper function for finding objects in array
		var objIndexOf = function(arr, prop, val) {
			for(var i = 0 ; i < arr.length ; i++) {
				if (arr[i][prop] === val) {
					return 1;
				}
			}
			return -1;
		};

		self.click = function(tag) {
			var index = -1;
			for (var i=0; i < selectedTags.length ; i++) {
				if (selectedTags[i] === tag) {
					index = i;
					break;
				}
			}
			if (index === -1) {
				selectedTags.push(tag);
				// filter the notes on view by tag selected
				//TODO: option to show tags of multiple tags selected
				self.byTagsFilter = function(note) {
					return objIndexOf(note.tags, 'text', tag.text) !==-1;
				};
			} else {
				selectedTags.splice(index,1);
			}
		};

		self.showAll = function() {
			self.byTagsFilter = function(note) {
				return self.userTags;
			};
		};

		self.noteHover = function(note) {
			return note.showHidden = !note.showHidden;
		};

		/**
		 * helper function for creating random colors for tags
		 * TODO: move this to a service class that holds helper functions
		 * @returns {string}
		 */
		function getRandomColor() {
			var letters = '0123456789ABCDEF'.split('');
			var color = '#';
			for (var i = 0; i < 6; i++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}

		self.showDeleteDialog = function(ev, note) {
			var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Delete this note?')
				.content('This note will be gone forever.')
				.ariaLabel('Delete')
				.ok('Delete')
				.cancel('Keep it')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function() {
				self.remove(note);
			}, function() {
				$scope.alert = 'You decided to keep your note.';
			});
		};

		self.showNote = function($event, note) {
			$mdDialog.show({
				parent: angular.element(document.body),
				targetEvent: $event,
				templateUrl:"modules/core/views/note.client.view.html",
				locals: {
					note: note
				},
				controller: noteCtrl
			});
			function noteCtrl($scope, $mdDialog, note) {
				$scope.note = note;
				$scope.newTagAppend = function(chipText) {
					return {
						text: chipText,
						color: getRandomColor()
					};
				};
				$scope.closeNote = function () {
					$mdDialog.hide();
				};
				$scope.updateNote = function () {
					note.$update(function() {
						$mdDialog.hide();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				};
			}
		};

		// helper function to convert hex color to rgb
		self.hexToRGB = function(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16)
			]
			 : null;
		};

		// determine the text color by it's background color
		self.setTextColor = function(bg) {
			var rgb = self.hexToRGB(bg);
			var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
			if (o > 125){
				return 'black';
			} else {
				return 'white';
			}
		};

	}

	angular.module('core')
		.controller('homeController', ['Authentication', 'Notes', '$mdDialog', '$scope', homeController]);

}());
