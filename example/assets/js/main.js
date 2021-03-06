// Generated by CoffeeScript 1.3.3

$(function() {
  var errorHandler;
  errorHandler = function(error) {
    return console.log("Error", error);
  };
  $('.download').on('click', function(event) {
    var yari;
    event.preventDefault();
    yari = new Yarinage({
      success: function(event) {
        return $('#resultContainer').append(event);
      },
      error: errorHandler
    });
    return yari.load('/api');
  });
  return $('.upload').on('click', function(event) {
    var data, yari;
    event.preventDefault();
    data = 'test upload';
    yari = new Yarinage({
      success: function(event) {
        return $('#resultContainer').append(event);
      },
      error: errorHandler
    });
    return yari.upload('/api', data);
  });
});
