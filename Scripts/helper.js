// HELPER FUNCTIONS
//https://stackoverflow.com/a/822486

Helper = {
    stripHtml: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    fillApiResult: function (showName, imageSrc, summaryFull, summary) {
        return `<div class="col-md-4">
        <div class="card mb-4 shadow-sm">
        <img class="card-img-top" src="${imageSrc}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${showName}</h5>
        <p class="card-text" data-toggle="tooltip" data-placement="bottom" title="${summaryFull}">${summary}</p>
        <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
        </div>
        <small class="text-muted">9 mins</small>
        </div>
        </div>
        </div>
        </div>`;
    }
};

Toastr = {
    success: function (text, hideTimeout) {
        document.querySelector("#toastElement img").setAttribute("src", "./Images/checkmark.png"); 
        document.querySelector("#toastElement .toast-title").innerHTML = "Success"
        document.querySelector("#toastElement .toast-body").innerHTML = text

        $('#toastElement').toast('show');

        if (hideTimeout != null) {
            setTimeout(() => {
                $('#toastElement').toast('hide');
            }, hideTimeout);
        }
    },
    error: function (text, hideTimeout) {
        console.log("err");
        
        document.querySelector("#toastElement img").setAttribute("src", "./Images/error.png"); 
        document.querySelector("#toastElement .toast-title").innerHTML = "Error"
        document.querySelector("#toastElement .toast-body").innerHTML = text
       
        $('#toastElement').toast('show');

        if (hideTimeout != null) {
            setTimeout(() => {
                $('#toastElement').toast('hide');
            }, hideTimeout);
        }
    }
};


