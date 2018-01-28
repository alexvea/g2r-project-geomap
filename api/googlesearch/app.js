var express = require('express');
var stringSimilarity = require('string-similarity');
var hostname = 'localhost';
var port = 3000;
var app = express();
var blackList = ["fnac.com","amazon.fr","tripadvisor.fr","indeed.fr","pagesjaunes.fr","lemonde.fr","wikipedia.org","lefigaro.fr","linkedin.com","annuaire.laposte.fr","infogreffe.fr","societe.com","kompass.com","verif.com","score3.fr","ellisphere.fr","entreprises.lefigaro.fr","bilansgratuits.fr","manageo.fr","mappy.com","verif-siret.com","dirigeants.bfmtv","maps.google.fr","entreprisesfr.com","horaire24.com","litinerant","journal-officiel.gouv","french-business.review"];

const https = require('https');

const regexResultat = /<div[^<>]*class="g"[^"']+"[^<>]*>[\s\S]*?<\/div>/g;
const regexCite = /<cite[^<>]*[^<>]*>[\s\S]*?<\/cite>/g;


var myRouter = express.Router();
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
app.use(myRouter);
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port+"\n");
});
