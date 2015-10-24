(function () {

  function LircoTools() {

    // ***********************************
    // -------- PUBLIC METHODS -----------
    // ***********************************
    var self = this;
    self.hexToRGB = hexToRGB();
    self.setTextColor = setTextColor();
    self.setTextColor = getRandomColor();

    // ***********************************
    // -------- PRIVET METHODS -----------
    // ***********************************
    /**
     * helper function to convert hex color to rgb
     * @param hex
     * @returns {*}
     */
    function hexToRGB(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
        : null;
    }

    /**
     * determine the text color by it's background color
     * @param bg
     * @returns {*}
     */
    function setTextColor(bg) {
      var rgb = self.hexToRGB(bg);
      var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
      if (o > 125){
        return 'black';
      } else {
        return 'white';
      }
    }

    /**
     * generates random color
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

  }

  angular.module('core')
    .service('LircoTools', [LircoTools])

}());
