$(function () {
    $('nav a[href^="' + location.pathname + '"]').addClass('tabActive');
});