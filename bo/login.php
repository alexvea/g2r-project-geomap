<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Page protégée par mot de passe</title>
    </head>
    <body>
        <p>Veuillez entrer le mot de passe pour accéder au backoffice :</p>
        <form action="backoffice.php" method="post">
            <p>
            <input type="password" name="mot_de_passe" />
            <input type="submit" value="Valider" />
            </p>
        </form>
        <p>Cette page est réservée aux gestionnaires du site. Inutile d'insister vous ne trouverez jamais le mot de passe !</p>
    </body>
</html>
