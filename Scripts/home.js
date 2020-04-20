var Home = {
    init: function () {
        addListeners();
        initToastr();
        loginUserProcess();
    }
};

function addListeners() {
    //Add listener for movie search
    document.getElementById('btnSearchMovie').onclick = handleSearchMovie;
    document.getElementById('registerToolTipLogin').onclick = handleRegisterFromLogin
    document.getElementById('submitRegister').onclick = handleUserRegister
    document.getElementById('submitLogin').onclick = handleUserLogin
    document.getElementById('submitLogout').onclick = handleUserLogout
}

async function handleSearchMovie(event) {
    var movieQryVal = $('#movieQry').val();
    var res = await getMovieByQry(movieQryVal);

    var append = '';
    res.forEach(show => {
        var imageSrc = (show.show.image?.medium != null) ? show.show.image?.medium : './Images/question.jpg';
        var summary = (show.show.summary != null) ?  Helper.stripHtml(show.show.summary).substring(0, 200) : 'No summary';
        var summaryFull = '';
        var showName = show.show.name;

        if (show.show.summary?.length > 200) {
            summary = summary.substring(0, summary.lastIndexOf(' '));
            summary = summary + '...';
            summaryFull = Helper.stripHtml(show.show.summary);
        };

        append += Helper.fillApiResult(showName, imageSrc, summaryFull, summary);
    });

    document.getElementById('showCardSection').innerHTML = append;
 
  
     $('[data-toggle="tooltip"]').tooltip();
}

function handleRegisterFromLogin(event) {
    event.preventDefault();
    $('#loginPopUp').modal('toggle');
    $('#registerPopUp').modal('toggle');
}

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
        // Not logged in
        document.getElementById("navbarNotLoggedIn").style.display = "block";
        document.getElementById("navbarLoggedIn").style.display = "none";
    
    }
    else {
        //Logged in
        document.getElementById("navbarNotLoggedIn").style.display = "none";
        document.getElementById("navbarLoggedIn").style.display = "block";
        document.getElementById("navbarLoggedInTitle").innerHTML = `Welkom ${user.Username}!`;
    }
}

function initToastr() {
    $('.toast').toast();
}

//Api call
async function getMovieByQry(qry) {
    var protocol = (window.location.protocol.indexOf("https") != -1) ? "https" : "http";
    var api_url = `${protocol}://api.tvmaze.com/search/shows`
    response = await fetch(api_url + "?q=" + qry);
    data = await response.json();
    return data;
}

