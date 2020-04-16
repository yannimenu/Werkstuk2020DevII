$(function () {
    loadScript("helper.js");
    loadScript("dataAccess.js");
    loadScript("home.js");
});

// https://stackoverflow.com/a/950146
function loadScript(url)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "./Scripts/" + url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    // script.onreadystatechange = callback;
    // script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}