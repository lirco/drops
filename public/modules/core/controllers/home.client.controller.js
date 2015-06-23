'use strict';



(function () {

	function homeController(Authentication, Notes, $mdDialog) {

		var self = this;
		var selectedTags = [];
		self.authentication = Authentication;
		self.notes = Notes.query();

		self.tags = self.authentication.user.tags;
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
		var ObjIndexOf = function(arr, prop, val) {
			for(var i = 0 ; i < arr.length ; i++) {
				if (arr[i][prop] === val) {
					return 1
				}
			}
			return -1;
		};

		self.click = function(tag) {
			var index = -1;
			for (var i=0; i < selectedTags.length ; i++) {
				if (selectedTags[i] == tag) {
					index = i;
					break;
				}
			}
			if (index == -1) {
				selectedTags.push(tag);
				// filter the notes on view by tag selected
				//TODO: option to show tags of multiple tags selected
				self.byTagsFilter = function(note) {
					return ObjIndexOf(note.tags, "text", tag.text) !==-1
				}
			} else {
				selectedTags.splice(index,1);
			}
		};

		self.showAll = function() {
			self.byTagsFilter = function(note) {
				return self.tags
			}
		};

		self.noteHover = function(note) {
			return note.showHidden = !note.showHidden;
		};

		self.showDeleteDialog = function(ev, note) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Would you like to delete this note?')
				.content('This note will be gone forever.')
				.ariaLabel('Lucky day')
				.ok('Delete')
				.cancel('Keep it')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function() {
				self.remove(note);
			}, function() {
				$scope.alert = 'You decided to keep your debt.';
			});
		};

	}

	angular.module('core')
		.controller('homeController', ['Authentication', 'Notes', '$mdDialog', homeController])

}());
