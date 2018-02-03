// Slider pour le rayon
$("#cercleradius").slider();
$("#cercleradius").on("slide", function(slideEvt) {
$("#radiusSliderVal").text(slideEvt.value);
});

// Slider pour nombre de resultat
$("#limitationnumber").slider();
$("#limitationnumber").on("slide", function(slideEvt) {
$("#numberSliderVal").text(slideEvt.value);
});

//onclick pour envoyer la liste d'entreprises via API
$("#viaEmail").on("click", function() {
  var currentSelectedVignettes = JSON.parse(sessionStorage.getItem("selectedVignettesLS"));
  var currentsearchData = JSON.parse(sessionStorage.getItem("searchdataLS"));
  var dataToSend = [];
  if(currentSelectedVignettes != null) {
    for (key in currentSelectedVignettes["selected"]) {
      if (currentSelectedVignettes["selected"][key] == true) {
        dataToSend.push(currentsearchData[key]);
      };
    };
  if(dataToSend.length === 0) {
      console.log("RIEN A ENVOYER !");
  } else {
  var searchAPI = "http://127.0.0.1:3000/send/EMAIL@domain.com"+"/"+JSON.stringify(dataToSend);
   $.ajax(searchAPI, {
     success: function(data) {
       console.log(data);
      },
      error: function() {
        console.log("error ");
      }
 });
};
}
});

//AV identification profil. TODO
$(document).ready(function() {
  //verif internet
  controle();
});


function enreGeo() {
  if (document.cookie.search("uuid_gmap") == -1) {
    var uuid = guid();
    var profils = ['stagiaire','freelanceur','entreprise'];
    var profil = profils[Math.floor((Math.random() * 3))];
    document.cookie = "profil="+profil;
    document.cookie = "uuid_gmap="+uuid;
  };
  var uuid = document.cookie.split(";")[1].split("=")[1]
  var profilCookie = document.cookie.split(";")[0].split("=")[1];
  var radius = document.getElementById('cercleradius').value;
  var nombre = parseInt(document.getElementById('limitationnumber').value);
  var cercle = [map.getCenter().lat(),map.getCenter().lng()];
  var date = new Date().toJSON().slice(0,10);
  //console.log("TESTGEOOOOO profil:"+profilCookie+"   rayon:"+radius+"   nombre résultat:"+nombre+"    lat:"+cercle[0]+ "    lng:"+cercle[1]);
  var enreGeo = new RechercheGeo(uuid,date, profilCookie,radius,nombre,cercle);
    console.log("TESTGEOOOOO uuid:"+enreGeo.id+" profil:"+enreGeo.profil+"   rayon:"+enreGeo.rayon+"   nombre résultat:"+enreGeo.nbResultat+"    lat:"+enreGeo.centreCercle[0]+ "    lng:"+enreGeo.centreCercle[1]);
    writeUserData(enreGeo.id, enreGeo.date, enreGeo.profil, enreGeo.rayon, enreGeo.nbResultat,enreGeo.centreCercle);
}

class RechercheGeo {
  constructor(id, date, profil, rayon, nbResultat,centreCercle) {
    this.id = id;
    this.date = date;
    this.profil = profil;
    this.rayon = rayon;
    this.nbResultat = nbResultat;
    this.centreCercle = centreCercle;
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


//verif internet
function IsOnline()
    {

      var param = navigator.onLine ;

      if (param == false)
      {
        alert("Vous êtes hors ligne");
      }
    }
function controle()
    {
    // traitement
    //alert(navigator.onLine ? "Vous êtes en ligne" : "Vous êtes hors ligne");

      setInterval(IsOnline,2000); /* rappel après 2 secondes = 2000 millisecondes */
  }



    document.onkeydown = function(e) {
      if (document.querySelector('.pagination')) {
        switch (e.keyCode) {
            case 37:
                document.querySelector('.pagination > li:first-child > a').click();
                break;
            case 39:
                document.querySelector('.pagination > li:last-child a').click();
        }
      }
    };
