var map;
var markers = [];
var paris = {
  lat: 48.856614,
  lng: 2.3522219000000177
};
var optionsAutocomplete = {
  componentRestrictions: {country: "fr"},
  types: ['geocode']
};
var placeSearch,
  autocomplete,
  autocomplete2;
var retval;
var contentMarkers = [];
var snapshotCodeNaf = Defiant.getSnapshot(datanaf);
var lien = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
var indexLienArray = window.location.pathname.split("/");
var indexLien = indexLienArray[indexLienArray.length - 1];
var iconBase = lien.replace(indexLien, 'img/');

var icons = {
  industrie: {
    name: "INDUSTRIE",
    icon: iconBase + 'industrie.png'
  },
  batiment: {
    name: "BATIMENT-TRAVAUX-PUBLICS",
    icon: iconBase + 'travaux.png'
  },
  pharmacie: {
    name: "PHARMACIE",
    icon: iconBase + 'pharmacie.png'
  },
  commerce: {
    name: "COMMERCE",
    icon: iconBase + 'commerce.png'
  },
  restauration: {
    name: "RESTAURATION",
    icon: iconBase + 'restauration.png'
  },
  services: {
    name: "SERVICES",
    icon: iconBase + 'services.png'
  },
  na: {
    name: "NO-NAF",
    icon: iconBase + 'pas_code_naf.png'
  }
};

// fonction permettant de zoomer la carte selon la taille du cercle.
function updateZoom(circle) {
  var radius = document.getElementById('cercleradius').value
  if (radius >= 1000) {
    map.setZoom(14);
  } else if (radius <= 250 && radius >= 100) {
    map.setZoom(17);
  } else if (radius < 100) {
    map.setZoom(19);
  } else {
    map.setZoom(15);
  }
}

// voir https://developers.google.com/maps/documentation/javascript/examples/marker-remove?hl=fr
function setMapOnAll(map) {
  for (var j = 0; j < markers.length; j++) {
    markers[j].setMap(map);
  }
}
function clearMarkers() {
  setMapOnAll(null);
}
function showMarkers() {
  setMapOnAll(map);
}
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
function addMarker(location, name, id, division) {

  var iconWithType = JSON.search(icons, '//*[name="' + division + '"]/icon');
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    id: "marker" + id,
    //exemple icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=2.1|0|FF69B4|13|b|'+name.substring(0, 4),
    icon: iconWithType[0],
    title: name
  });
  ajoutInformationsMarker(marker, name, id)
  markers.push(marker);
}

function ajoutInformationsMarker(marker, data, id) {
  var infowindow = new google.maps.InfoWindow({content: data});
  marker.addListener('click', function() {
    $("#vignette" + id).click();
    map.setZoom(18);
    map.setCenter(marker.getPosition());
    infowindow.open(marker.get('map'), marker);
  });
}

function getWebSite(nom, adresse, id) {
  var searchAPI = "http://127.0.0.1:3000/search/" + nom + "/" + adresse;
  //test synchrone  $.ajaxSetup({async: false});
  $.ajax(searchAPI, {
    success: function(data) {
      ajoutInfoSearchData(id, data);
    },
    error: function() {
      console.log("Erreur de connexion avec l'API localhost");
    }
  });
};
function resetProgressbar() {
  $('.progress-bar').width(0);
}

function progressbar() {
  var total = sessionStorage.getItem("countSearch");
  var pourcentage = $('.progress-bar').parent().width() / total * 1.2;
  var currentProgress = $(".progress-bar").width() / $('.progress-bar').parent().width() * 100;
  var nextProgress = currentProgress + pourcentage;
  $('.progress-bar').width(nextProgress + '%');
}

function ajoutInfoSearchData(id, data) {
  setTimeout(function(){ progressbar(); }, 750);

  var currentData = JSON.parse(sessionStorage.getItem("searchdataLS"));
  if (data == "{}") {
    currentData[id].url = "NA";
    currentData[id].score = "NA";
  } else {
    var dataJSON = JSON.parse(data);
    var url = dataJSON['url'];
    var score = dataJSON['score'];
    currentData[id].url = url;
    currentData[id].score = score;
  }
  sessionStorage.setItem("searchdataLS", JSON.stringify(currentData));
}

function getSecteur(codenaf) {
  var division = codenaf.substring(0, 2);
  switch (true) {
    case(division >= 01 && division <= 39):
      return "INDUSTRIE";
      break;
    case(division >= 41 && division <= 43):
      return "BATIMENT-TRAVAUX-PUBLICS";
      break;
    case(division >= 45 && division <= 47):
      if (codenaf == "4773Z") {
        return "PHARMACIE";
      } else {
        return "COMMERCE";
      }
      break;
    case(division >= 49 && division <= 99):
      if (division == 56) {
        return "RESTAURATION";
      } else {
        return "SERVICES";
      }
      break;
      default:
        return "NO-NAF";
  };
};

//Fonction à créer qui recherche dans ./data/code-naf.json le type d'activité selon le code naf.
//A faire en synchrone et asynchrone.
//la fonction remplace getNafIntitule(), appelé en ligne 105      var typecommerce = getNafIntitule(i,data.records[i].fields.code_ape);
function getNafJSON(codenaf) {
  intitule = JSON.search(snapshotCodeNaf, "//f[c='" + codenaf + "']/i");
  return intitule.toString();
}

function getNafIntitule(id, codenaf) {
  var infogreffecodenaf = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=nomenclature-dactivites-francaise-naf-rev-2&rows=1&refine.code_naf=" + codenaf
  $.ajax(infogreffecodenaf, {
    success: function(data) {
      console.log(id + "  " + data.records[0].fields.intitule_naf);
    },
    error: function() {
      console.log("error " + id);
    }
  });
};

// Fonction permettant de récuperer les infos de datainfogreffe
function getList(lat, lng, nb) {
  resetProgressbar();
  var contentMarkers = [];
  var radius = document.getElementById('cercleradius').value;
  var nombre = nb;
  var datainfogreffe = "https://opendata.datainfogreffe.fr/api/records/1.0/search/?dataset=entreprises-immatriculees-2017&rows=" + nombre + "&facet=region&facet=date_immatriculation&geofilter.distance=" + lat + "%2C" + lng + "%2C" + radius;
  $.getJSON(datainfogreffe, function(data) {
    var nombreDeResultatTotal = data.nhits;
    var nombreDeResultatRecu = data.records.length;
    deleteMarkers();
    for (i = 0; i < nombreDeResultatRecu; i++) {
      var denominationData = data.records[i].fields.denomination;
      var positionData = {
        lat: data.records[i].fields.geolocalisation[0],
        lng: data.records[i].fields.geolocalisation[1]
      };
      var adresse = data.records[i].fields.adresse + " " + data.records[i].fields.code_postal + " " + data.records[i].fields.ville;
      if (data.records[i].fields.code_ape != null) {
        var typecommerce = getNafJSON(data.records[i].fields.code_ape);
        var division = getSecteur(data.records[i].fields.code_ape);
        contentMarkers.push({
          id: i,
          nom: denominationData,
          intitule: typecommerce,
          division: division,
          adresse: adresse,
          url: "",
          score: ""
        });
      } else {
        var division = "NO-NAF";
        contentMarkers.push({
          id: i,
          nom: denominationData,
          intitule: "Pas de code NAF",
          division: division,
          adresse: adresse,
          url: "",
          score: ""
        });
      }
      addMarker(positionData, denominationData, i, division);
      var website = getWebSite(denominationData, adresse, i);

    } //for
    enreGeo();
    sessionStorage.setItem('countSearch',contentMarkers.length);
    sessionStorage.setItem('searchdataLS', JSON.stringify(contentMarkers));
    $(".card-pagination > div").removeClass("border");
  });

}
/* Exemple de JSON  DATAINFOGREFFE
;
      {etat_pub: "A", departement: "Paris", siren: "833813058", code_postal: "75013", date_de_publication: "2017-12-16", …}
      adresse:"115 BOULEVARD DE L HOPITAL"
      code_greffe:"7501"
      code_postal:"75013"
      date_de_publication:"2017-12-16"
      date_immatriculation:"2017-12-12"
      denomination:"PHO VIET"
      departement:"Paris"
      dist:"48"
      etat:"Nouveau"
      etat_pub:"A"
      fiche_identite:"https://www.infogreffe.fr/infogreffe/ficheIdentite.do?siren=833813058"
      forme_juridique:"Societe par actions simplifiee a associe unique"
      geolocalisation:(2) [48.835936, 2.359162]
      greffe:"PARIS"
      nic:"00017"
      num_dept:"75"
      region:"Ile-de-France"
      siren:"833813058"
      statut:"B"
      ville:"PARIS"
      __proto__:Object
*/

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: paris,
    zoom: 12,
    disableDefaultUI: true, //enlève l'UI
    scaleControl: true // ajoute l'échelle
  });

  // ajoute un cercle
  var circle = new google.maps.Circle({
    strokeColor: '#0000FF',
    strokeOpacity: 0.7,
    strokeWeight: 1.5,
    fillColor: '#0000FF',
    fillOpacity: 0.15,
    map: map,
    center: paris, // ajoute au centre de paris
    draggable: true, // permet de bouger le cerle
    radius: 500
  });

  // Permet de garder le centre après redimensionnement de la fenetre du navigateur
  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

  // Permet de déplacer le cercle
  google.maps.event.addListener(circle, 'dragend', function() {

    var nombre = parseInt(document.getElementById('limitationnumber').value);
    map.setCenter({lat: circle.getCenter().lat(), lng: circle.getCenter().lng()});
    updateZoom(circle);
    getList(circle.getCenter().lat(), circle.getCenter().lng(), nombre);
    geocodeLatLng(circle.getCenter().lat(),circle.getCenter().lng());
  });

  // MAJ le rayon du cercle.
  google.maps.event.addDomListener(document.getElementById("radiusdiv"), 'click', function() {
    var radius = parseInt(document.getElementById('cercleradius').value);
    var nombre = parseInt(document.getElementById('limitationnumber').value);
    updateZoom(circle);
    circle.setRadius(radius);
    getList(circle.getCenter().lat(), circle.getCenter().lng(), nombre);
    geocodeLatLng(circle.getCenter().lat(),circle.getCenter().lng());
  });

  google.maps.event.addDomListener(document.getElementById("numberdiv"), 'click', function() {
    var radius = parseInt(document.getElementById('cercleradius').value);
    var nombre = parseInt(document.getElementById('limitationnumber').value);
    updateZoom(circle);
    circle.setRadius(radius);
    getList(circle.getCenter().lat(), circle.getCenter().lng(), nombre);
    geocodeLatLng(circle.getCenter().lat(),circle.getCenter().lng());
  });

  /* Ne fonctionne pas
// Au double click permet de recentrer le cercle.
google.maps.event.addListener(map, 'dblclick', function(event) {
var latitude = event.latLng.lat();
var longitude = event.latLng.lng();
console.log(latitude + " " + longitude);
map.setCenter({lat: latitude, lng: longitude});
circle.setCenter({lat: latitude, lng: longitude});
updateZoom(circle);
}); */

  // fonctionnalité de recherche d'adresse, puis recentrage
  var autocomplete = new google.maps.places.Autocomplete(
  /** @type {!HTMLInputElement} */
  (document.getElementById('autocomplete')), optionsAutocomplete);

  var autocomplete2 = new google.maps.places.Autocomplete(
  /** @type {!HTMLInputElement} */
  (document.getElementById('autocomplete2')), optionsAutocomplete);

  var onChangeHandler = function() {
    $("html").animate({
      scrollTop: $(".tools").offset().top
    }, 600);
    var nombre = parseInt(document.getElementById('limitationnumber').value);
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('autocomplete').value;
    document.getElementById('autocomplete2').value = document.getElementById('autocomplete').value;
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        //fonctionne aussi    map.setCenter(new google.maps.LatLng(latitude,longitude);
        map.setCenter({lat: latitude, lng: longitude});
        circle.setCenter({lat: latitude, lng: longitude});
        updateZoom(circle);
        getList(latitude, longitude, nombre);
      }
    });
  };

  var onChangeHandler2 = function() {
    var nombre = parseInt(document.getElementById('limitationnumber').value);
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('autocomplete2').value;
    document.getElementById('autocomplete').value = document.getElementById('autocomplete2').value;
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        //fonctionne aussi    map.setCenter(new google.maps.LatLng(latitude,longitude);
        map.setCenter({lat: latitude, lng: longitude});
        circle.setCenter({lat: latitude, lng: longitude});
        updateZoom(circle);
        getList(latitude, longitude, nombre);
      }
    });
  };

  function geocodeLatLng(lat,long) {
    var latlng = {lat: lat, lng: long};
      var geocoder2 = new google.maps.Geocoder();
      geocoder2.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            console.log(JSON.stringify(results[1]));
            document.getElementById('autocomplete').value =  results[1]['formatted_address'];
            document.getElementById('autocomplete2').value = results[1]['formatted_address'];
          }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
  }

  autocomplete.addListener('place_changed', onChangeHandler);
  autocomplete2.addListener('place_changed', onChangeHandler2);

}
