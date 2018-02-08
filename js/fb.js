firebase.initializeApp(configFB);
var database = firebase.database().ref;

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(errorMessage);
  }
  console.log(error);

});

function writeUserData(uuid, date, profilCookie, radius, nombre,cercle) {
  var infoEnregistrement = {
      id: uuid,
      date : date,
      profil: profilCookie,
      rayon: radius,
      nbResultat: nombre,
      cercleCentre: {lat: cercle[0],
                      lng: cercle[1]}
  };
  var newPostKey = firebase.database().ref().push().key;
  var sauvegarde = {};
  //console.log(sauvegarde);
  sauvegarde['/historique/' + newPostKey] = infoEnregistrement;
  firebase.database().ref().update(sauvegarde);
}

function writeUser(email,id,choix) {
  var infoEnregistrement = {
      id: id,
      email: email
  };
  var newPostKey = firebase.database().ref().push().key;
  var sauvegarde = {};
  //console.log(sauvegarde);
  if (choix=="trello") {
   sauvegarde['/trello/' + newPostKey] = infoEnregistrement;
  }else{ 
   sauvegarde['/email/' + newPostKey] = infoEnregistrement;
  };  
  firebase.database().ref().update(sauvegarde);
};