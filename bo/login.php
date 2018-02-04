<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Page protégée par mot de passe</title>
    <!-- Bootstrap core CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous">
    <link href="css/bo-style.css" rel="stylesheet">
    <style media="screen">
      body {
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <form class="form-signin" action="backoffice.php" method="post">
        <h2 class="form-signin-heading">Backoffice</h2>
        <p>Veuillez entrer le mot de passe pour accéder au backoffice :</p>
        <label for="inputPassword" class="sr-only" ></label>
        <input type="password" id="inputPassword" name="mot_de_passe" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Valider</button>
        <p>Cette page est réservée aux gestionnaires du site. Inutile d'insister vous ne trouverez jamais le mot de passe !</p>
      </form>
    </div>
  </body>
</html>
