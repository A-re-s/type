window.addEventListener("load", function() {
    var elements = document.querySelectorAll('.accur');
    elements.forEach(function(element) {
        var value = parseFloat(element.textContent);
        if (!isNaN(value)) {
            element.textContent = (value / 100).toFixed(2) + "%";
        }
    });
});