function getHtmlMail(name, email, text, callback) {
    var msg = "<ul><li>From: "  + name  + "</li>" +
        "<li>Subject: "     + email + "</li>" +
        "<li>Body: "        + text  + "</li></ul>";
    callback(msg);
}

module.exports = getHtmlMail;