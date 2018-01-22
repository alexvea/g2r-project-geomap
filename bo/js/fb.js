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

function getFBvalues(date,profil){
  firebase.database().ref().child("historique/").orderByChild("date").equalTo(date).on("value",function(data){//récupère l'ensemble de l'objet client dans la BDD
      var BDD = data.val();
      var toDisplayBDD = [];
      if(profil == null){
        toDisplayBDD = BDD;
      } else {
        for (entry in BDD) {
          if(BDD[entry].profil == profil) {
              toDisplayBDD.push(BDD[entry]);
          }
        }
      }
      sessionStorage.setItem("historique",JSON.stringify(toDisplayBDD));
      var histo = JSON.parse(sessionStorage.getItem("historique"));
      ajoutHeatMap(histo);
  });
}
