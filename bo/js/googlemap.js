var map;
function initMap2() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 46.227638, lng: 2.287592000000018},
    mapTypeId: 'roadmap'
  });

    heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    dissipating: true,
    opacity: 1.2,
    radius: 15

  });
  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });

}

function ajoutHeatMap(histo) {
  if(heatmap && heatmap !== 'null' && heatmap !== 'undefined') {
    heatmap.setMap(null);
  }
  var heatmapData = [];
  for (entree in histo){
    var coords = histo[entree].cercleCentre;
    var latLng = new google.maps.LatLng(coords.lat, coords.lng);
    heatmapData.push(latLng);
  }
  heatmap.setData(heatmapData);
  heatmap.setMap(map);
}
