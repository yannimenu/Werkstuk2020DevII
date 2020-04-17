$(function () {
    addListeners();
    initToastr();
    loginUserProcess();
});

function addListeners() {
    //Add listener for movie search
    $('#btnSearchMovie').on('click', handleSearchMovie);
    $('#registerToolTipLogin').on('click', handleRegisterFromLogin);
    $('#submitRegister').on('click', handleUserRegister);
    $('#submitLogin').on('click', handleUserLogin);
    $('#submitLogout').on('click', handleUserLogout);
}

async function handleSearchMovie(event) {
    var movieQryVal = $('#movieQry').val();
    var res = await getMovieByQry(movieQryVal);

    var resultString = '';
    res.forEach(show => {
        var imageSrc = './Images/question.jpg';
        var summary = 'No summary';
        var summaryFull = '';

        if (show.show.image?.medium != null) imageSrc = show.show.image?.medium;
        if (show.show.summary != null) summary = stripHtml(show.show.summary).substring(0, 200);

        if (show.show.summary?.length > 200) {
            summary = summary.substring(0, summary.lastIndexOf(' '));
            summary = summary + '...';
            summaryFull = stripHtml(show.show.summary);
        };

        resultString += '<div class="col-md-4">' +
            '<div class="card mb-4 shadow-sm">' +
            '<img class="card-img-top" src="' + imageSrc + '" alt="Card image cap">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + show.show.name + '</h5>' +
            '<p class="card-text" data-toggle="tooltip" data-placement="bottom" title="' + summaryFull + '">' + summary + '</p>' +
            '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn-sm btn-outline-secondary">View</button>' +
            '<button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>' +
            '</div>' +
            '<small class="text-muted">9 mins</small>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    });

    $('#showCardSection').html(resultString);

    //update the tooltips with bootstrap
    $('[data-toggle="tooltip"]').tooltip();
    console.log('res', res);
}

function handleRegisterFromLogin(event) {
    event.preventDefault();
    $('#loginPopUp').modal('toggle');
    $('#registerPopUp').modal('toggle');
}

async function handleUserRegister() {
    var username = $('#registerUserName').val();
    var password = $('#registerPw').val();
    var user = new User(username, password);

    let dbResult = await Data.getUserByUserName(user.Username);

    if (dbResult.size == 0) {
        Data.registerUser(user)
            .then(function () {
                $('#registerPopUp').modal('toggle');
                Toastr.success('User successfully saved!', 2000);

            })
            .catch(function (error) {
                $('#registerPopUp').modal('toggle');
                Toastr.error('Something went wrong, please try again later.', 2000);
                console.error(error);

            });
    }
    else {
        Toastr.error('A user is already registered with that username, please choose a different one.', 5000);
    }
}

async function handleUserLogin() {
    var username = $('#loginUserName').val();
    var password = $('#loginPw').val();
    var user = new User(username, password);

    let dbResult = await Data.getUserByUserName(user.Username);
    let dbPw = undefined;

    if (!dbResult.empty) {
        dbPw = dbResult.docs[0].data().Password;
    }

    if (dbResult.size == 0) {
        Toastr.error('This user does not exist.', 3000);
    }
    else if (dbPw != password) {
        Toastr.error('The user exists but a wrong password is entered.', 3000);
    }
    else {
        Toastr.success('Successfully logged in.', 3000);
        localStorage.setItem('authenticatedUser', JSON.stringify(user));
        $('#loginPopUp').modal('toggle');
        loginUserProcess();
    }
}

function handleUserLogout() {
    Toastr.success('Successfully logged out.', 3000);
    localStorage.removeItem('authenticatedUser');
    loginUserProcess();
}

function loginUserProcess() {
    let user = JSON.parse(localStorage.getItem('authenticatedUser'));

    if (user == null) {
        //Not logged in
        $("#navbarNotLoggedIn").show();
        $('#navbarLoggedIn').hide();
    }
    else {
        //Logged in
        $("#navbarNotLoggedIn").hide();
        $('#navbarLoggedIn').show();
        $('#navbarLoggedInTitle').html(`Welkom ${user.Username}!`);
    }
}

function initToastr() {
    $('.toast').toast();
}

//Api call
async function getMovieByQry(qry) {
    var api_url = `${window.location.protocol}//api.tvmaze.com/search/shows`
    response = await fetch(api_url + "?q=" + qry);
    data = await response.json();
    return data;
}

