$(function() {

    $('.valid').parsley({
        trigger: "change",
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function(el) {
            return el.$element.closest(".form-group");
        }
    });

    $('#submit').click(function (e) {
        e.preventDefault();

        $.post('/', {
            name : $('input[name="name"]').val(),
            email: $('input[name="email"]').val(),
            body : $('textarea[name="body"]').val(),
            _csrf: $('input[name="_csrf"]').val()
        }, function (result) {
            swal(result.title, result.msg, result.status)

        });
    });
});