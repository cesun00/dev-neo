/* the async part of theme-related code */

// the mjs module is always loaded async,
// so wrapping in a DOMContentLoaded event handler is not required.

//document.addEventListener("DOMContentLoaded", () => {

// listening for localStorage change on the same page (subscriber pattern)
// isn't possible now
// https://stackoverflow.com/questions/26974084/listen-for-changes-with-localstorage-on-the-same-window

function applyStorageTheme() {
    const cc = document.querySelector('#c-container');

    if (localStorage.getItem('dark-theme')) {
        document.querySelector('#theme-checkbox').checked = true;
        if (cc)
            cc.style.display="none";
    } else {
        document.querySelector('#theme-checkbox').checked = false;
        if (cc)
            cc.style.display="initial";
    }
}

applyStorageTheme();

document.querySelector('#theme-checkbox').addEventListener("change", function (ev) {
    if (ev.target.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-theme', true);
    } else {
        document.body.classList.remove('dark');
        localStorage.removeItem('dark-theme');
    }
    applyStorageTheme();
});



document.querySelectorAll(".wide-container").forEach(node=>node.addEventListener("click", function(ev){
    if (ev.target.tagName == "BUTTON") {
        this.querySelector(".wide-item").classList.toggle("wide-widen");
    }
}));
//});

