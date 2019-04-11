var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("filebutton");
var holder = document.getElementById("holder");
var storage = firebase.storage();
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        //alert(`Signed in as ${user.email}`);
        console.log(user.toJSON());
    } else {
        // No user is signed in.
        var matching = new RegExp('index.html')
        alert("Please sign in or create an account");
        //redirect to signin page
        var result = matching.test(window.location.href)
        if (result == false){
            window.location.replace('index.html')
        }
    }
});
function adduser(){
    var email = document.getElementById('InputEmail').value;
    var password = document.getElementById('InputPassword').value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("error"+ error.message);
        // ...
    });
}
function signIn() {
    //alert("Signing In");

    var email = document.getElementById('SignEmail').value;
    var password = document.getElementById('SignPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        alert("Error signing in");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
    alert('Signed in as ' + email)
    document.getElementById('SignEmail').value = '';
    document.getElementById('SignPassword').value = '';
}
function signOut(){
    firebase.auth().signOut().then(function() {
        alert("Signed out!");
    }).catch(function(error) {
        // An error happened.
    });
}

function addcards() {
    db.collection("Family").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            document.getElementById('card-deck').innerHTML += `<div class="card text-center" style="width: 18rem;">
                <img src="images/${doc.data().image}" class="card-img-top" alt="500x325 dummy picture">
                <div class="card-body">
                <h5 class="card-title">${doc.data().name}</h5>
            <p class="card-text">${doc.data().description}</p>
            </div>
            </div>`
        });
    });
}
function getImageForPath(p, g){
    var holder = document.getElementById(g)
    var storageRef = firebase.storage().ref();
    var spaceRef = storageRef.child(p);
    storageRef.child(p).getDownloadURL().then(function(url) {
        var fullurl = url;
        //alert(fullurl);
        holder.src = fullurl;
    }).catch(function(error) {
        //catch error here
    });
}
function usercards() {
    db.collection("User_Submitted").get().then((querySnapshot) => {//alert("Data Recieved");
        n = 0;
        querySnapshot.forEach((doc) => {
            document.getElementById('card-deck').innerHTML += `<div class="card text-center" style="width: 18rem;">
                <img src="" class="card-img-top" id="holder${n}" alt="User Picture">
                <div class="card-body">
                <h5 class="card-title">${doc.data().location}</h5>
            <p class="card-text">${doc.data().Description}</p>
            </div>
            </div>`;
            n = n + 1;
        });
    });
}
function userpics(){
    db.collection("User_Submitted").get().then((querySnapshot) => {
        n = 0;
        querySnapshot.forEach((doc) => {
            var image = doc.data().submittedimage;
            getImageForPath(image, `holder${n}`);
            console.log(n, image);
            n = n + 1;
        });
    });
}