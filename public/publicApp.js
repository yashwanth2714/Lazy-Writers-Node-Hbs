// Highlight the active tab
$(function () {
    $('nav a[href^="' + location.pathname + '"]').addClass('tabActive');
});
