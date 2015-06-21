'use strict';



(function () {

	function homeController(Authentication, Notes) {

		var self = this;
		var selectedTags = [];
		self.authentication = Authentication;
		self.notes = Notes.query();

		self.tags = self.authentication.user.tags;
		self.sortOrder = ['-modified'];

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

	}

	angular.module('core')
		.controller('homeController', ['Authentication', 'Notes', homeController])

}());
