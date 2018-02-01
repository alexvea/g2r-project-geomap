var express = require('express');
var stringSimilarity = require('string-similarity');
var email 	= require('emailjs');
var hostname = 'localhost';
var port = 3000;
var app = express();
var blackList = ["fnac.com","amazon.fr","tripadvisor.fr","indeed.fr","pagesjaunes.fr","lemonde.fr","wikipedia.org","lefigaro.fr","linkedin.com","annuaire.laposte.fr","infogreffe.fr","societe.com","kompass.com","verif.com","score3.fr","ellisphere.fr","entreprises.lefigaro.fr","bilansgratuits.fr","manageo.fr","mappy.com","verif-siret.com","dirigeants.bfmtv","maps.google.fr","entreprisesfr.com","horaire24.com","litinerant","journal-officiel.gouv","french-business.review"];

const https = require('https');

const regexResultat = /<div[^<>]*class="g"[^"']+"[^<>]*>[\s\S]*?<\/div>/g;
const regexCite = /<cite[^<>]*[^<>]*>[\s\S]*?<\/cite>/g;


var myRouter = express.Router();


//Fonction googlesearch START
myRouter.route('/search/:nom/:adresse/')
.get(function(req,res){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	https.get('https://www.google.fr/search?q='+req.params.nom+" "+req.params.adresse, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
	let m;
	//console.log(data);
	var resultat= "{";
		while ((m = regexResultat.exec(data)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regexResultat.lastIndex) {
					regexResultat.lastIndex++;
			}
			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				while ((m = regexCite.exec(match)) !== null) {
					// This is necessary to avoid infinite loops with zero-width matches
					if (m.index === regexCite.lastIndex) {
							regexCite.lastIndex++;
					}
					// The result can be accessed through the `m`-variable.
					m.forEach((match2, groupIndex) => {
						var bl = 0;
						var url = match2.replace(/<b>/g,"").replace(/<\/b>/g,"").replace("<cite>","").replace("</cite>","");
						/*	for (let i=0;i<blackList.length;i++){
									if(url.includes(blackList[i])){
											bl++;
											break;
								//		console.log(url);
								  }
							} */
							function teststring(mot){
								return url.includes(mot);
							}
					//	console.log("SSSSSSSS  "+blackList.some(teststring));
							if(blackList.some(teststring) != true) {
								sanshttp = url.replace("http://","").replace("https://","").replace(".com","").replace(".fr","").replace("www.","");
								sanshttp = sanshttp.split("/")[0];
								score = stringSimilarity.compareTwoStrings(req.params.nom, sanshttp);
									switch (true) {
										case (score==0):
												console.log("\x1b[31m%s\x1b[0m",score+"  "+req.params.nom+" "+sanshttp+" "+url);
												break;
										case (score>=0.5):
												console.log("\x1b[32m%s\x1b[0m",score+"  "+req.params.nom+" "+sanshttp+" "+url);
												resultat += "url:"+url+",score:"+score+",";
												break;
										case (score>=0.2):
												console.log("\x1b[34m%s\x1b[0m",score+"  "+req.params.nom+" "+sanshttp+" "+url);
												resultat += "url:"+url+",score:"+score+",";
												break;
										default:
												console.log("\x1b[37m%s\x1b[0m",score+"  "+req.params.nom+" "+sanshttp+" "+url);
												resultat += "url:"+url+",score:"+score+",";
									}
							}
					});


				};
			});
		};
		resultat = resultat.replace(/,$/,"");
		resultat += "}";
    res.json(resultat);
  });
	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	});
});
//Fonction googlesearch END

//fonction email START
//myRouter.all('/send/:email/:data', function (req, res) {
myRouter.route('/send/:email/:data/')
.post(function (req, res) {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	var listeObject = req.params.data;
	console.log(typeof(listeObject));
	var toto= "";
	var server 	= email.server.connect({
   user:	"f307f0aa3f1e22",
   password:"c591c44267d025",
   host:	"smtp.mailtrap.io",
   tls:		true,
	 port: 2525
});

var message	= {
   text:	"i hope this works"+toto,
   from:	"Contact <contact@map-appli.com>",
   to:		"mailtrap@mailtrap.io",
   subject:	"Liste des entreprises via map-appli",
   attachment:
   [
      {data:"<html>" + toto +"</html>", alternative:true}
   ]
};

// send the message and get a callback with an error or details of the message that was sent
server.send(message, function(err, message) { console.log(err || message); });

// you can continue to send more messages with successive calls to 'server.send',
// they will be queued on the same smtp connection

// or you can create a new server connection with 'email.server.connect'
// to asynchronously send individual emails instead of a queue
  console.log(req.params.email + "  -- "+req.params.data);
   res.json(req.params.email + " -- "+req.params.data);
});


//fonction email END

app.use(myRouter);
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port+"\n");
});
