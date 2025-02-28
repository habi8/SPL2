document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.querySelector('.content').style.opacity = "1";
    }, 1000); // 5-second delay for text appearance
});

function enterSite() {
    window.location.href = 'homepage.html';
}
