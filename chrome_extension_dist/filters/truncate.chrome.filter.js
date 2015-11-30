(function () {

  function TruncateFilter() {
    return function (input, limit) {

      if (limit <= 0) {
        return '';
      }

      if (input) {
        var inputWords = input.split(/\s+/);
        if (inputWords.length > limit) {
          input = inputWords.slice(0, limit).join(' ') + '...';
        }
      }
      return input;
    }
  }

  angular.module('drops')
    .filter('truncate', TruncateFilter)
}());
