
$(document).ready(function() {

})

$('.online').click(function() {
    if (!($('.online').hasClass("active"))) {
      $('.online').addClass("active");
      $('.all').removeClass("active");
      $('.user-list').html("");

    }
})


$('.all').click(function() {
    if (!($('.all').hasClass("active"))) {
      $('.all').addClass("active");
      $('.online').removeClass("active");
      $('.user-list').html("");


    }
})