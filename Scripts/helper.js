// HELPER FUNCTIONS
//https://stackoverflow.com/a/822486
function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

Toastr = {
    success: function(text, hideTimeout) {
        $('#toastElement').find(".toast-img").attr("src", "./Images/checkmark.png");
        $('#toastElement').find(".toast-title").html("Success");
        $('#toastElement').find(".toast-body").html(text);
        $('#toastElement').toast('show');
    
        if (hideTimeout != null) {
            setTimeout(() => {
                $('#toastElement').toast('hide');
            }, hideTimeout);
        }
    },
    error: function(text, hideTimeout) {
        $('#toastElement').find(".toast-img").attr("src", "./Images/error.png");
        $('#toastElement').find(".toast-title").html("Error");
        $('#toastElement').find(".toast-body").html(text);
        $('#toastElement').toast('show');
    
        if (hideTimeout != null) {
            setTimeout(() => {
                $('#toastElement').toast('hide');
            }, hideTimeout);
        }
    }
};
