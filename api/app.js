var express = require('express');
var bodyParser = require('body-parser');

var stringSimilarity = require('string-similarity');
var email = require('emailjs');
var hostname = 'localhost';
var port = 3000;
var app = express();
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true }));
var configSMTP = require('./cfg/config.json');

var blackList = [
  "fnac.com",
  "amazon.fr",
  "tripadvisor.fr",
  "indeed.fr",
  "pagesjaunes.fr",
  "lemonde.fr",
  "wikipedia.org",
  "lefigaro.fr",
  "linkedin.com",
  "annuaire.laposte.fr",
  "infogreffe.fr",
  "societe.com",
  "kompass.com",
  "verif.com",
  "score3.fr",
  "ellisphere.fr",
  "entreprises.lefigaro.fr",
  "bilansgratuits.fr",
  "manageo.fr",
  "mappy.com",
  "verif-siret.com",
  "dirigeants.bfmtv",
  "maps.google.fr",
  "entreprisesfr.com",
  "horaire24.com",
  "litinerant",
  "journal-officiel.gouv",
  "french-business.review"
];

const https = require('https');

const regexResultat = /<div[^<>]*class="g"[^"']+"[^<>]*>[\s\S]*?<\/div>/g;
const regexCite = /<cite[^<>]*[^<>]*>[\s\S]*?<\/cite>/g;

var myRouter = express.Router();

//Fonction googlesearch START
myRouter.route('/search/:nom/:adresse/').get(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  https.get('https://www.google.fr/search?q=' + req.params.nom + " " + req.params.adresse, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let m;
      //console.log(data);
      var resultat = "{";
      while ((m = regexResultat.exec(data)) !== null) {

        if (m.index === regexResultat.lastIndex) {
          regexResultat.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
          while ((m = regexCite.exec(match)) !== null) {

            if (m.index === regexCite.lastIndex) {
              regexCite.lastIndex++;
            }

            m.forEach((match2, groupIndex) => {
              var bl = 0;
              var url = match2.replace(/<b>/g, "").replace(/<\/b>/g, "").replace("<cite>", "").replace("</cite>", "");
              /*	for (let i=0;i<blackList.length;i++){
									if(url.includes(blackList[i])){
											bl++;
											break;
								//		console.log(url);
								  }
							} */
              function teststring(mot) {
                return url.includes(mot);
              }
              //	console.log("SSSSSSSS  "+blackList.some(teststring));
              if (blackList.some(teststring) != true) {
                sanshttp = url.replace("http://", "").replace("https://", "").replace(".com", "").replace(".fr", "").replace("www.", "");
                sanshttp = sanshttp.split("/")[0];
                score = stringSimilarity.compareTwoStrings(req.params.nom, sanshttp);
                // vérif si protocole présent
                if(url.indexOf("https://") === -1 || url.indexOf("https://") === -1){
                  url = "http://"+url;
                }
                var urlSplited =  url.split("/");
                url = "http://"+urlSplited[2];

                switch (true) {
                  case(score == 0):
                    console.log("\x1b[31m%s\x1b[0m", score + "  " + req.params.nom + " " + sanshttp + " " + url);
                    break;
                  case(score >= 0.5):
                    console.log("\x1b[32m%s\x1b[0m", score + "  " + req.params.nom + " " + sanshttp + " " + url);
                  //  resultat += "url:" + url + ",score:" + score + ",";
                  resultat = "{\"url\":\"" + url + "\",\"score\":\"" + score +"\",";
                    break;
                  case(score >= 0.2):
                    console.log("\x1b[34m%s\x1b[0m", score + "  " + req.params.nom + " " + sanshttp + " " + url);
          //          resultat += "url:" + url + ",score:" + score + ",";
                    break;
                  default:
                    console.log("\x1b[37m%s\x1b[0m", score + "  " + req.params.nom + " " + sanshttp + " " + url);
            //        resultat += "url:" + url + ",score:" + score + ",";
                }
              }
            });
          };
        });
      };
      resultat = resultat.replace(/,$/, "");
      resultat += "}";
      res.json(resultat);
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});
//Fonction googlesearch END

//fonction email START
myRouter.route('/send').post(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  var emailReceiver = req.body.email;
  console.log("E: "+emailReceiver);
  var listeString = req.body.data;
  var server = email.server.connect({user: configSMTP.user, password: configSMTP.password, host: configSMTP.host, tls: configSMTP.tls, port: configSMTP.port});
  var dataTable = "<table style='width:100%'>";
  dataTable += "<tr>";
  dataTable += "<th>Nom</th>";
  dataTable += "<th>Entreprise</th>";
  dataTable += "<th>Adresse</th>";
  dataTable += "<th>url</th>";
  dataTable += "</tr>";
   listeObject = JSON.parse(listeString);
  for (var i in listeObject) {
    console.log("N: "+listeObject[i].nom+"I: "+listeObject[i].intitule+"A: "+listeObject[i].adresse+"U: "+listeObject[i].url);
    dataTable += "<tr>";
    dataTable += "<td>" + listeObject[i].nom + "</td>";
    dataTable += "<td>" + listeObject[i].intitule + "</td>";
    dataTable += "<td>" + listeObject[i].adresse + "</td>";
    dataTable += "<td>" + listeObject[i].url + "</td>";
    dataTable += "</tr>";
  }
  dataTable += "</table>";
  var message = {
    text: listeString,
    from: "Contact <contact@map-appli.com>",
  //  to: req.params.email,
    to:  emailReceiver,
    subject: "Liste des entreprises via map-appli",
    attachment: [
      {
        data: "<html>" + dataTable + "</html>",
        alternative: true
      }
    ]
  };
  server.send(message, function(err, message) {
    console.log(err || message);
  });
  res.json(message);
});
//fonction email END

app.use(myRouter);

app.listen(port, hostname, function() {
  console.log("Mon serveur fonctionne sur http://" + hostname + ":" + port + "\n");
});
