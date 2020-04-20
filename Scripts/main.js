//To make use of bootstrap modals and tooltips, jquery is required
//Only for these actions jQuery is used in this project
// - https://www.w3schools.com/bootstrap/bootstrap_ref_js_tooltip.asp
// - https://www.w3schools.com/bootstrap/bootstrap_modal.asp

window.onload = function () {
    loadScript("helper.js");

    if (document.title == "Home") {
        // Need the script for the home page and dataAccess (because home makes use of it)      
        loadScript("dataAccess.js", () => {
            Data.init();
        });

        loadScript("home.js", () => {
            Home.init();
        });
    }
};

// https://stackoverflow.com/a/950146
function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "./Scripts/" + url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}