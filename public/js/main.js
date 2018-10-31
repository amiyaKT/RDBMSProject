// Used to hide the toggleable navbar on clicking anywhere outside it.
$(document).on('click', function() {
  $('.collapse').collapse('hide');
});

// Used for the dropdown in addd books section for admin.
$('.ui.dropdown').dropdown({
  forceSelection: false
});

// Used to show the ratings on each book
$('.rating').rating({
  maxRating: 5,
  interactive: false
});

// Used to enable interaction with the user to rate the book
$('#userRating').rating({
  maxRating: 5,
  interactive: true,
  onRate: function(rating) {
    $('#ratingInput').attr('value', rating);
  }
});

// Validate Form
$('#register').form({
  fields: {
    firstname: 'empty',
    lastname: 'empty',
    username: 'empty',
    email: 'empty',
    address: 'empty',
    password: 'empty'
  }
});
