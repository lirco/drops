'use strict';

(function () {

  function notesService($resource, ENV) {
    return $resource(ENV.apiEndPoint+'/notes/:noteId', {
      noteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      //custom method, gets url/domain parameters from controller for later querying on server
      getNotes: {
        method: 'GET',
        isArray: true
      }
    });
  }
  //Articles service used for communicating with the articles REST endpoints
  angular.module('core')
    .factory('Notes', ['$resource', 'ENV', notesService])

}());
