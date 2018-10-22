$(document).on('click', function() {
  $('.collapse').collapse('hide');
});

$('.ui.dropdown').dropdown({
  forceSelection: false
});
$('.rating').rating({
  maxRating: 5,
  interactive: false
});
$('#userRating').rating({
  maxRating: 5,
  interactive: true,
  onRate: function(rating) {
    $('#ratingInput').attr('value', rating);
  }
});
