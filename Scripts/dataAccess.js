var Data = {
    firebaseConfig: {
        apiKey: "AIzaSyAD8D6pqyVwd1T5LE-oqIXc58Qf5xqNskU",
        authDomain: "werkstuk-8cb95.firebaseapp.com",
        databaseURL: "https://werkstuk-8cb95.firebaseio.com",
        projectId: "werkstuk-8cb95",
        storageBucket: "werkstuk-8cb95.appspot.com",
        messagingSenderId: "1064622512742",
        appId: "1:1064622512742:web:c7c9aa2b93ac9ba1536ba7",
        measurementId: "G-MPLTJBZHBD"
    },
    init: function () {
        firebase.initializeApp(this.firebaseConfig);
        firebase.analytics()
    },
    getDb: function () {
        var db = firebase.firestore();
        return db;
    },
    registerUser: function (user, ) {
        var db = this.getDb();
        return db.collection("users").doc().set(user.toPlainObject());
    },
    getUserByUserName: function (username) {
        var db = this.getDb();
        return db.collection("users").where("Username", "==", username).get();
    }
};

class User {
    constructor(username, password) {
        this.Username = username;
        this.Password = password;
    }

    toPlainObject() {
        return {
            Username: this.Username,
            Password: this.Password
        };
    }
}

$(function () {
    Data.init();
});