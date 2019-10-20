
jQuery(function () {
    origin();
});

function origin() {
    $(".section.calculator > .header").on('click', function () {
        $(this).parent().toggleClass("collapsed");
    });
}

function redirect() {
    window.location = "https://xpuls3.github.io"
}

function comma(x) {
    let t = x.toString().split(".");
    t[0] = t[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return t.join(".");
}

function isNotWhole(value) {
    return value % 1 !== 0;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function prepare(n) {
    n = String(n);
    n = n.replace(/,/g,'');
    n = n.replace(/%/g,'');
    return n
}