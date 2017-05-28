$(function () {
   $('#searchInput').keyup(function () {
        if ($(this).val() == '') {
            $('.enableOnInput').prop('disabled', true);
                    } else {
                    $('.enableOnInput').prop('disabled', false);
                     }
                 });
            }); 




