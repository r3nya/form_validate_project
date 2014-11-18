$(function() {

    $('.valid').parsley({
        trigger: "change",
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function(el) {
            return el.$element.closest(".form-group");
        }
    });

    //$('#submit').click(function (e) {
    //    e.preventDefault();
    //
    //    $.post('/send', {
    //        name : $('input[name="name"]').val(),
    //        email: $('input[name="email"]').val(),
    //        body : $('textarea[name="body"]').val()
    //    }, function (result) {
    //        alert(result);
    //    });
    //});
});