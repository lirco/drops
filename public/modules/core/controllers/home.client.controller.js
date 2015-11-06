'use strict';

(function () {

	function homeController(Authentication, Notes, $mdDialog, $scope, $q) {

		var self = this;
		var selectedTags = [];
		self.authentication = Authentication.getUser();
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
			//note dialog controller
			function noteCtrl($scope, $mdDialog, note) {
				$scope.note = note;
				$scope.userTags = loadTags();
				$scope.querySearch = querySearch;

				function querySearch (query) {
					var results = query ? $scope.userTags.filter( createFilterFor(query) ) : $scope.userTags,
						deferred;
					deferred = $q.defer();
					deferred.resolve( results );
					return deferred.promise;
				}

				function createFilterFor(query) {
					var lowercaseQuery = angular.lowercase(query);
					return function filterFn(tag) {
						return (tag.textToLower.indexOf(lowercaseQuery) === 0);
					};
				}

				function loadTags() {
					var allTags = self.authentication.user.tags;
					return allTags.map( function (tag) {
						return {
							textToLower: tag.text.toLowerCase(),
							text: tag.text,
							color: tag.color
						};
					});
				}

				$scope.newTagAppend = function(chip) {
					if (chip.color) {
						return {
							text: chip.text,
							color: chip.color
						};
					} else {
						return {
							text: chip,
							color: getRandomColor()
						};
					}
				};

				function getRandomColor() {
					var letters = '0123456789ABCDEF'.split('');
					var color = '#';
					for (var i = 0; i < 6; i++ ) {
						color += letters[Math.floor(Math.random() * 16)];
					}
					return color;
				}
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




	}

	angular.module('core')
		.controller('homeController', ['Authentication', 'Notes', '$mdDialog', '$scope', '$q',homeController]);

}());
