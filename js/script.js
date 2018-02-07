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
function sendViaEmail(){
  var currentSelectedVignettes = JSON.parse(sessionStorage.getItem("selectedVignettesLS"));
  var currentsearchData = JSON.parse(sessionStorage.getItem("searchdataLS"));
  var dataToSend = [];
  var recipientEmail = $("#recipient-name").val();
  if(currentSelectedVignettes != null) {
    for (key in currentSelectedVignettes["selected"]) {
      if (currentSelectedVignettes["selected"][key] == true) {
        dataToSend.push(currentsearchData[key]);
      };
    };
  if(dataToSend.length === 0) {
      console.log("RIEN A ENVOYER !");
  } else {
    console.log(dataToSend);
  var searchAPI = "http://127.0.0.1:3000/send/";
   $.ajax({
     url: searchAPI,
     type: 'post',
     dataType: 'json',
     data:  {'data':JSON.stringify(dataToSend),'email':recipientEmail},
     success: function(data) {
       $('#sendemail .modal-footer').html("<p class='text-success'>Message envoyé</p>");
       console.log(data);
     },
      error: function() {
        console.log("Erreur de connexion avec l'API send localhost.");
      }
 });
};
}
}


//AV identification profil. TODO
$(document).ready(function() {
  //verif internet
  setUrl();
  controle();

  //modal pour choix catégorie
  var haveProfil =  getCookie("profil");
if(haveProfil==""){
  $('#categorie').modal('show');
};



  $(window).scroll(function() {
    if ($(window).scrollTop() <= 250) {
      $(".PaginateNav").addClass("toHide");
    } else {
      $(".PaginateNav").removeClass("toHide");
    };
  });

  $("#toTop").on("click", function() {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
  });

  modaltype();


$("#viaEmail").on("click", function() {
   modalemail();
});

$("#viaTrello").on("click", function() {
  modalTrello();
});


});  //document ready FIN

function modalemail() {
  var currentSelectedVignettes=JSON.parse(sessionStorage.getItem("selectedVignettesLS"))["selected"];
  var someTrue = currentSelectedVignettes.some(elem => elem == true);
  if (someTrue==true){
    var nb= 0
    for (var i = 0;i<currentSelectedVignettes.length;i++) {
      if (currentSelectedVignettes[i]==true){
      nb++;
     };
    };
    $('#savesvignettes > span').html(nb);
    $('#sendemail').modal('show');
   }
}

//Fonction champ catégorie
function modaltype(){
  $("#profil").change( function() {
    let profilo =  $('option:selected',this).val();
    profilo = profilo.toLowerCase();
    document.cookie = "profil=" + profilo;
    $('#categorie').modal('hide');
  });
};

function enreGeo() {
  if (document.cookie.search("uuid_gmap") == -1) {
    var uuid = guid();
    document.cookie = "uuid_gmap="+uuid;
  };

  var profilCookie = getCookie("profil");
  var uuid = getCookie("uuid_gmap");
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
        $('#noInternet').modal('show');
    //    controle();
  } else {
        $('#noInternet').modal('hide');
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


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setUrl(){
$('.social-network li a').each(function(){
    this.href = this.href + window.location;
});

}
