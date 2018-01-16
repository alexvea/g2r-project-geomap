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




$("#toto").on("click", function() {
  var currentSelectedVignettes = JSON.parse(localStorage.getItem("selectedVignettesLS"));
  var currentsearchData = JSON.parse(localStorage.getItem("searchdataLS"));
  var dataToSend = [];
    for (key in currentSelectedVignettes["selected"]) {
      if (currentSelectedVignettes["selected"][key] == true) {
        dataToSend.push(currentsearchData[key]);
      };
    };
  if(dataToSend.length === 0) {
      console.log("RIEN A ENVOYER !");
  } else {
      console.log(dataToSend);
  };
});
