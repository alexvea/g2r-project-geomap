<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Backoffice</title>
        <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-auth.js"></script>
        <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-database.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
        <link rel="stylesheet" href="css/bo-style.css" />
    </head>
    <body>

    <?php
    if (isset($_POST['mot_de_passe']) AND $_POST['mot_de_passe'] ==  "xxxxxx") // Si le mot de passe est bon
    {
    ?>
        <div class="row">
          <div class="row">
            <div class="col s4">
              <input type="date" id="date" class="datepicker">
            </div>
            <div class="input-field col s4">
              <select>
                <option value="" disabled selected>Choisir le profil</option>
                <option value="stagiaire">Stagiaire</option>
                <option value="freelanceur">Freelanceur</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>
        </div>
        <div class="row">
          <div id="map" class="col s12"></div>
        </div>

    <?php
    }
    else // Sinon, on affiche un message d'erreur
    {
        echo '<p>Mot de passe incorrect</p>';
    }
    ?>
    <script src=js/googlemap.js></script>
    <script src='../cfg/config.json'></script>
    <script type="text/javascript">
    var googleApiKey = CONFIG.googleApiKey;
    document.write("<script src=https://maps.googleapis.com/maps/api/js?key=" + googleApiKey + "&libraries=visualization&callback=initMap2><\/script>");
    </script>
    <script src=js/fb.js></script>
    <script src=js/script.js></script>


    </body>
</html>
