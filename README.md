# P7_Groupomania
Projet 7: Créez un réseau social d'entreprise

Étant développeur depuis plus d'un an chez CONNECT-E, ma tâche etait de developper un réseau social d'entreprise pour les employés de Groupomania.
Ce réseau social a été crée avec React pour le coté client et Express pour le coté backend.
Une base de donnée SQL a été utilisé pour ce projet sans orm.

Ce réseau social comporte les fonctionnalitées suivantes:

- Création de compte avec un minimum d'informations.
- Connexion avec une adresse email et un mot de passe.
- Changement de photo de profil.
- Chnagement de mot de passe.
- Crée, modifier, supprimer une publication contenant un text, une image ou les deux en même temps.
- Crée des commentaires en dessous d'une publication.
- Like ou Dislike une publication.
- Une page d'acceuil affichant les publications par ordre antéchronologique.
- Un compte administrateur ayant de droit de modifier/supprimer des publications.


Installation du projet

Base de donnée

- Mettre en place la base de donnée avec le SQL DUMP fournis dans les livrables.
- Les informations de connexion a la base de données sont dans le .env.example et le dossier config du backend

Backend

- A la racine du dossier backend du projet, lancez la commande npm install (installation des packages).
- Dans le dossier backend vous trouverez un ficher .env.example et un dossier images.example .
- Vous devez les renommer en supprimant le .example.
- npm start dans le terminal pour lancer le serveur 

Frontend

- À la racine du dossier frontend du projet, lancez la commande npm install (installation des packages).
- Lancez la commande npm start pour lancer l'aplication.
- Le lancement se fait automatiquement sur le port 4200.
