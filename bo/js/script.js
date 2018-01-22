$('.datepicker').pickadate({
  monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  today: 'aujourd\'hui',
  clear: 'effacer',
  format: 'yyyy-mm-dd',
  formatSubmit: 'yyyy-mm-dd'
});
$('select').on('change', function () {
    if($('#date').val() != null) {
      getFBvalues($("#date").val(),$('select').val());
    } else {
      getFBvalues("",$('select').val());
    }
  }).material_select();

$('.datepicker').change(function(){
  if($('select').val() != null) {
    getFBvalues($("#date").val(),$('select').val());
  } else {
    getFBvalues($("#date").val());
  }
});
