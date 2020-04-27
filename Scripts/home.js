//Home Object, in order to be able to call the initialization functions 
//from the other scripts that include it
var Home = {
    init: function () {
        addListeners();
        initToastr();
        loginUserProcess();
    }
};

//VARIABLES
var apiResult;
var selectedShow;
var authenticatedUser;

//This is a function that adds all the handler functions to the required HTML-Elements
function addListeners() {
    document.getElementById('btnSearchMovie').onclick = handleSearchShow;
    document.getElementById('registerToolTipLogin').onclick = handleRegisterFromLogin;
    document.getElementById('submitRegister').onclick = handleUserRegister;
    document.getElementById('submitLogin').onclick = handleUserLogin;
    document.getElementById('submitLogout').onclick = handleUserLogout;
    document.getElementById('submitTvShow').onclick = handleSubmitTvShow;
    document.getElementById('myFavorites').onclick = handleOpenMyFavorites;
}

//HANDLERS
//This function handles the request for a showSearch (data request @ api & appending it on the page)
async function handleSearchShow(event) {
    var movieQryVal = $('#movieQry').val();
    apiResult = await getMovieByQry(movieQryVal);

    var append = '';
    var counter = 1;

    apiResult.forEach(show => {
        append += Helper.apiTvElement(show, counter, authenticatedUser);
        show.id = counter;
        counter += 1;
    });

    document.getElementById('showCardSection').innerHTML = append;
    $('[data-toggle="tooltip"]').tooltip();
}

//This function redirects users from the register popup to the login popup
function handleRegisterFromLogin(event) {
    event.preventDefault();
    $('#loginPopUp').modal('toggle');
    $('#registerPopUp').modal('toggle');
}

//This function handels the registration of users
async function handleUserRegister() {
    var username = document.getElementById('registerUserName').value;
    var password = document.getElementById('registerPw').value;
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

// This function handels the login of users
async function handleUserLogin() {
    var username = $('#loginUserName').val();
    var password = $('#loginPw').val();
    authenticatedUser = new User(username, password);

    let dbResult = await Data.getUserByUserName(authenticatedUser.Username);
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
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
        $('#loginPopUp').modal('toggle');
        loginUserProcess();
    }

    removeApiResults();
}

// This function handels the opening of the AddTvShow-Popup
function handleOpenAddTvShow(id) {
    selectedShow = apiResult.find(x => x.id == id);
    $('#tvShowPopUp').modal('toggle');
    document.getElementById('titleTvShowPopUp').innerHTML = selectedShow.show.name;
    document.querySelector("#tvShowPopUp .modal-body").innerHTML = Helper.addTvFavPopUpElement(selectedShow);
}

// This function handels the logout of users
function handleUserLogout() {
    Toastr.success('Successfully logged out.', 3000);
    localStorage.removeItem('authenticatedUser');
    loginUserProcess();
    removeApiResults();
}

// This function handels the submission of a new user-showfavorite
function handleSubmitTvShow() {
    var userComment = document.getElementById('userCommentInput')?.value;
    $('#tvShowPopUp').modal('toggle');
    if (userComment != null) selectedShow.userComment = userComment;

    Data.saveUserFavorite(authenticatedUser, selectedShow)
        .then(function (msg) {
            Toastr.success('Show has been added.', 3000);
        })
        .catch(function (error) {
            Toastr.error(error, 3000);
            console.error(error);
        });

    selectedShow = null;
}

// This function handels the opening of the favorite popup
async function handleOpenMyFavorites() {
    $("#favTvShowPopUp").modal('toggle');
    document.querySelector("#favTvShowPopUp .modal-body").innerHTML = await Helper.myTvFavPopUpElement(authenticatedUser);
}

// This function handels the addition of a comment to a favorite
function handleAddComment(el) {
    el.remove();

    var tableBody = document.getElementById("show-tbody");
    tableBody.innerHTML = tableBody.innerHTML +
        `
        <tr>
            <td class="font-weight-bold">Note</td>
            <td colspan="3"><input id='userCommentInput' type="text" class="form-control"></td>
        </tr>
    `;
}

// This function handels the removal of a user's favorite
function handleRemoveUserFavorite(username, showId) {
    $("#favTvShowPopUp").modal('toggle');

    Data.removeUserFavorite(username, showId)
        .then(function (msg) {
            Toastr.success('Show has been removed.', 3000);
        })
        .catch(function (error) {
            Toastr.error(error, 3000);
            console.error(error);
        });
}

//GENERAL FUNCTIONS
//This function checks if the user is logged in and displays the correct top banner accordingly
function loginUserProcess() {
    authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));

    if (authenticatedUser == null) {
        // Not logged in
        document.getElementById("navbarNotLoggedIn").style.display = "block";
        document.getElementById("navbarLoggedIn").style.display = "none";
    }
    else {
        //Logged in
        document.getElementById("navbarNotLoggedIn").style.display = "none";
        document.getElementById("navbarLoggedIn").style.display = "block";
        document.getElementById("navbarLoggedInTitle").innerHTML = `Welcome ${authenticatedUser.Username}!`;
    }
}

//This function initializes the bootstrap toastr elements
function initToastr() {
    $('.toast').toast();
}

// This function removes the api results shown beneath the searchbar
function removeApiResults(){
    document.getElementById('showCardSection').innerHTML = '';
}

//API
// This function queries the tvMazeApi
async function getMovieByQry(qry) {
    var protocol = (window.location.protocol.indexOf("https") != -1) ? "https" : "http";
    var api_url = `${protocol}://api.tvmaze.com/search/shows`
    response = await fetch(api_url + "?q=" + qry);
    data = await response.json();    
    console.log(data);
    
    return data;
}

