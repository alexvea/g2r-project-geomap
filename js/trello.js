function modalTrello() {
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
    $('#sendTrello').modal();
   }
}

function sendViaTrello() {
  var uid = getCookie("uuid_gmap");
  writeUser(email,uid,"trello");
  var currentSelectedVignettes = JSON.parse(sessionStorage.getItem("selectedVignettesLS"));
  var currentsearchData = JSON.parse(sessionStorage.getItem("searchdataLS"));
  var dataToSend = [];
  if (currentSelectedVignettes != null) {
    for (key in currentSelectedVignettes["selected"]) {
      if (currentSelectedVignettes["selected"][key] == true) {
        dataToSend.push(currentsearchData[key]);
      };
    };
    if (dataToSend.length === 0) {
      console.log("RIEN A ENVOYER !");
    } else {
    sessionStorage.setItem("dataToSend",JSON.stringify(dataToSend));
    //  console.log(dataToSend);
      Trello.authorize({
        interactive: true,
        type: "popup",
        name: "Trello API - Simple Map",
        scope: {
          read: true,
          write: true
        },
        expiration: "never",
        persist: "true",
        success: function() {
          onAuthorizeSuccessful();
        },
        error: function() {
          console.log("Failed authentication");
        }
      });
    }

  }
}

function CreateBoard() {
  var boardName = "Simple Map - Trello";
  console.log(Trello);
  Trello.post("/boards/", {
    name: boardName,
    defaultLabels: 'true',
    defaultLists: 'true',
    keepFromSource: 'none',
    prefs_permissionLevel: 'public',
    prefs_voting: 'disabled',
    prefs_comments: 'members',
    prefs_invitations: 'members',
    prefs_selfJoin: 'true',
    prefs_cardCovers: 'true',
    prefs_background: 'blue',
    prefs_cardAging: 'regular'
  }, function() {
    console.log("Board created.");
  });
};
function getBoard() {
  Trello.get("members/me/boards", {
    fields: "id,name"
  }, function(boards, err) {
//    console.log(err);
    var found = false;
    for (var i = 0; i < boards.length; i++) {
      if (boards[i].name == 'Simple Map - Trello') {
        console.log("Tableau ID :" + boards[i].id);
        getListsBoard(boards[i].id);
        found = true;
        break;
      }
    }
    if (found == false) {
      CreateBoard();
      setTimeout(function(){  getBoard(); }, 3000);

    }
  });
};

function getListsBoard(boardSM) {
  console.log("BSM " +boardSM );
  Trello.get("boards/" + boardSM + "/lists", {
    fields: "name"
  }, function(lists, err) {
//    console.log(err);
    var found = false;
    console.log("Premiere liste: " + lists[0].id);
    var dataToSend = JSON.parse(sessionStorage.getItem("dataToSend"));
    for (var i = 0; i < dataToSend.length; i++) {
      let nom = dataToSend[i].nom;
      let intitule = dataToSend[i].intitule;
      let division = dataToSend[i].division;
      let adresse = dataToSend[i].adresse;
      let url = dataToSend[i].url;
      if(url == null){
          var description = "_Activité_ : "+intitule +" _Adresse_ : " + adresse;
      } else {
          var description = "_Activité_ : "+intitule +" _Adresse_ : " + adresse + " _url_ : [link]("+url+")";
      }
      CreateCard(lists[0].id, nom, description);
    }
     $('#sendTrello .modal-footer').html("<p class='text-success mb-1'>Cartes créées, lien Trello :  </p><a href='https://trello.com/' target='_blank'> <i class='fa fa-trello fa-2x'></i> </a>");
  });
};

function CreateCard(ListId, name, desc) {
  Trello.post("/cards", {
    name: name,
    desc: desc,
    pos: 'bottom',
    idList: ListId,
    keepFromSource: 'all'
  }, function() {
    console.log("Carte créée.");
  });
};



function onAuthorizeSuccessful() {
  getBoard();
};
// TRELLO END
