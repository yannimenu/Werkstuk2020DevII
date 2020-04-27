//Data Object, in order to be able to call functions from the other scripts that use it
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
    //Initializes firebase to be able to query the firestore
    init: function () {
        firebase.initializeApp(this.firebaseConfig);
        firebase.analytics()
    },
    //Gets a firestore reference (which can be queried on)
    getDb: function () {
        var db = firebase.firestore();
        return db;
    },
    //Function to register a user in firebase
    registerUser: function (user) {
        var db = this.getDb();
        return db.collection("users").doc().set(user.toPlainObject());
    },
    //Function to get a user by its username
    getUserByUserName: function (username) {
        var db = this.getDb();
        return db.collection("users").where("Username", "==", username).get();
    },
    //Function to save a users's favorite 
    saveUserFavorite: async function (user, show) {
        var db = this.getDb();
        var result = await this.getUserByUserName(user.Username);
        var doc = result.docs[0];
        var firestoreUser = doc.data();
        var showsToPush = [];

        if (Array.isArray(firestoreUser.favorites) && firestoreUser.favorites.length > 0) {
            firestoreUser.favorites.push(show);
            showsToPush = firestoreUser.favorites;
        }
        else {
            showsToPush = [show];
        }

        return db.collection("users").doc(doc.id).update(
            { "favorites": showsToPush }
        );
    },
    //Function to remove a user's favorite
    removeUserFavorite: async function (username, showId) {
        var db = this.getDb();
        var result = await this.getUserByUserName(username);
        var doc = result.docs[0];
        var firestoreUser = doc.data();
        var showsToPush = [];
        showsToPush = firestoreUser.favorites.filter(x => x.show.id != showId);

        db.collection("users").doc(doc.id).update(
            { "favorites": showsToPush }
        );
    }
};

//An user class that is used during the login and register procedures
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