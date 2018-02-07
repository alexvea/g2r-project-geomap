function getWeather(ville) {
var YQL = "select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+ville+"%2C%20FR%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
var searchAPI = "https://query.yahooapis.com/v1/public/yql?q="+YQL;
  //test synchrone  $.ajaxSetup({async: false});
  $.ajax(searchAPI, {
    async: false,
    success: function(data) {
      console.log(data);
      var weather = data.query.results.channel.item.condition.text;
      var tempF = data.query.results.channel.item.condition.temp;
      var tempC = (5/9) * (tempF-32);
      setWeather(weather,tempC,ville);
    },
    error: function() {
      console.log("Erreur de connexion avec l'API localhost");
    }
  });
};
