'use strict';



(function () {

	function homeController(Authentication, Notes, $mdDialog, $scope) {

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
				template:
				'<md-dialog class="note-dialog" aria-label="Note dialog" flex="60"">' +
				'  <md-toolbar>' +
        '    <div class="md-toolbar-tools">' +
				'      <form class="note-dialog-form-title" name="noteTitleForm" flex>' +
				'        <md-input-container flex>' +
				'        <label></label>' +
				'          <input class="note-dialog-title" ng-model="note.title" columns="1" style="color: white"></input>' +
				'        </md-input-container>' +
				'      </form>' +
				'    </div>' +
				'  </md-toolbar>' +

				'  <md-dialog-content flex>' +
				'    <form name="noteContentForm">' +
				'      <md-input-container flex>' +
				'        <label></label>' +
				'        <textarea class="note-dialog-content" ng-model="note.content" columns="1"></textarea>' +
				'      </md-input-container>' +
				'    </form>' +
				'  </md-dialog-content>' +
				'  <div class="note-dialog-footer md-actions">' +
				'    <md-button ng-click="closeNote()" class="md-primary">' +
				'      Close' +
				'    </md-button>' +
				'    <md-button ng-click="updateNote()" class="md-primary">' +
				'      Update' +
				'    </md-button>' +
				'  </div>' +
				'</md-dialog>',
				locals: {
					note: note
				},
				controller: noteCtrl
			});
			function noteCtrl($scope, $mdDialog, note) {
				$scope.note = note;
				$scope.closeNote = function () {
					$mdDialog.hide();
				};
				$scope.updateNote = function () {
					//var note = activeNote;
					note.$update(function() {
						$mdDialog.hide();
					}, function(errorResponse) {
						self.error = errorResponse.data.message;
					});
				}
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
				return 'black'
			} else {
				return 'white'
			}
		}

	}

	angular.module('core')
		.controller('homeController', ['Authentication', 'Notes', '$mdDialog', '$scope', homeController])

}());
