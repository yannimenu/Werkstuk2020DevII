// HELPER FUNCTIONS
//https://stackoverflow.com/a/822486

Helper = {
    stripHtml: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    getShowDetails: function (show) {
        var src = (show.show.image?.medium != null) ? show.show.image?.medium : './Images/question.jpg';
        var summary = (show.show.summary != null) ? Helper.stripHtml(show.show.summary).substring(0, 200) : 'No summary';
        var summaryFull = Helper.stripHtml(show.show.summary);
        var name = show.show.name;

        if (show.show.summary?.length > 200) {
            summary = summary.substring(0, summary.lastIndexOf(' '));
            summary = summary + ' ...';

        };

        return {
            src, summary, summaryFull, name
        };
    },
    apiElement: function (show, id, userLoggedIn) {
        var details = this.getShowDetails(show);

        return `<div class="col-md-4">
        <div class="card mb-4 shadow-sm">
        <img class="card-img-top" src="${details.src}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${details.name}</h5>
        <p class="card-text" data-toggle="tooltip" data-placement="bottom" title="${details.summaryFull}">${details.summary}</p>
        <div class="d-flex justify-content-between align-items-center">
        ${
            (userLoggedIn) ?
                `<div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="handleOpenAddTvShow(${id})">Favorite</button>
            </div>`
                : ''
            }
        </div>
        </div>
        </div>
        </div>`;
    },
    tvAddElement: function (show) {
        var details = this.getShowDetails(show);

        return `<div class="media">
        <img src="${details.src}" class="align-self-start mr-3" alt="...">
        <div class="media-body">
        <table class="table table-borderless">       
        <tbody id="show-tbody">
            <tr>          
                <td class="font-weight-bold">Rating</td>
                <td colspan="2">${show.show.rating.average}</td>
                <td class="text-right">                  
                 <button id="userComment" type="button" class="btn btn-sm btn-outline-secondary" onclick='handleAddComment(this)'>Add note</button>           
                </td>
            </tr >
    <tr>
        <td class="font-weight-bold">Premiered</td>
        <td colspan="3">${show.show.premiered}</td>
    </tr>
    <tr>
        <td class="font-weight-bold">Status</td>
        <td colspan="3">${show.show.status}</td>
    </tr>
    <tr>
        <td class="font-weight-bold">Summary</td>
        <td colspan="3">${details.summaryFull}</td>
    </tr>
        </tbody >
        </table >
        </div >
        </div > `;
    },
    favTvElement: async function (user) {
        var append = '';
        var fireBaseUser = await Data.getUserByUserName(user.Username);
        var favs = fireBaseUser.docs[0].data().favorites.sort((a, b) => {
            var nameA = a.show.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.show.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });


        favs.forEach(show => {
            var details = this.getShowDetails(show);

            append += `<div class="media" style = "padding: 5px 0px 5px 0px;" >
        <img src="${details.src}" class="align-self-start mr-3" alt="...">
        <div class="media-body">
            <table class="table table-borderless">
                <tbody id="show-tbody">
                    <tr>
                        <td class="font-weight-bold">Name</td>
                        <td colspan="3">${show.show.name}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Rating</td>
                        <td colspan="2">${show.show.rating.average}</td>
                        <td class="text-right">
                            <button onclick="removeUserComment('${user.Username}', ${show.show.id})" type="button" class="btn btn-sm btn-outline-secondary">Remove</button>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Premiered</td>
                        <td colspan="3">${show.show.premiered}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Status</td>
                        <td colspan="3">${show.show.status}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Summary</td>
                        <td colspan="3">${details.summaryFull}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Comment</td>
                        <td colspan="3">${(show.userComment == null) ? 'No comment' : show.userComment}</td>
                    </tr>
                </tbody>
            </table>
        </div>
                </div>`;
        });
        return append;
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


