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

// Get the edit modal
var c_edit = document.getElementById('edit_form');

// Get the button that opens the modal
var b_edit = document.getElementById("comment_edit");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
b_edit.onclick = function() {
    c_edit.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    c_edit.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == c_edit) {
        c_edit.style.display = "none";
    }
}
