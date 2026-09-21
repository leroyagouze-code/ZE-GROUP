# Mettre le site en ligne sur LWS (cPanel)

Guide pas-à-pas pour publier AgriWin Togo sur un hébergement **LWS cPanel**
(offre cPanel M, L ou XL — Node.js n'est pas disponible sur l'hébergement
mutualisé classique sans cPanel).

## 1. Envoyer les fichiers du site sur l'hébergement

1. Connectez-vous à votre **cPanel** LWS (identifiants reçus par e-mail à
   l'achat de l'hébergement).
2. Ouvrez **Gestionnaire de fichiers** (File Manager).
3. À la racine de votre compte (pas dans `public_html`), créez un dossier,
   par exemple `agriwintogo`.
4. Envoyez-y **tout le contenu** du dossier `agriwintogo/` de votre projet
   (les pages HTML, `css/`, `js/`, `images/`, et le dossier `server/`)
   — vous pouvez zipper le dossier avant envoi puis l'extraire depuis le
   Gestionnaire de fichiers (bouton "Extraire").

Le résultat doit ressembler à :
```
agriwintogo/                (dans votre compte, PAS dans public_html)
├── index.html
├── css/
├── js/
├── images/
├── server/
│   ├── server.js
│   ├── package.json
│   └── ...
```

## 2. Créer l'application Node.js

1. Dans cPanel, ouvrez **Setup Node.js App**.
2. Cliquez **Create Application** et remplissez :
   - **Node.js version** : la plus récente proposée (20 ou plus)
   - **Application mode** : `Production`
   - **Application root** : `agriwintogo/server` (le chemin vers le dossier
     que vous avez envoyé à l'étape 1)
   - **Application URL** : votre domaine, ex. `agriwintogo.com` (racine `/`)
   - **Application startup file** : `server.js`
3. Cliquez **Create**.

## 3. Configurer les mots de passe (variables d'environnement)

Toujours dans **Setup Node.js App**, sur votre application, section
**Environment variables**, ajoutez :

| Nom | Valeur |
|---|---|
| `ADMIN_USER` | `admin` (ou ce que vous préférez) |
| `ADMIN_PASSWORD` | **un vrai mot de passe secret** |
| `SESSION_SECRET` | une longue phrase aléatoire, gardée secrète |
| `NODE_ENV` | `production` |

⚠️ Ne mettez jamais le mot de passe de test (`test1234`) en ligne.

## 4. Installer les briques nécessaires (dépendances)

Toujours sur la page de votre application Node.js, cliquez sur
**Run NPM Install**. Attendez que ça se termine (ça installe Express et
les autres outils listés dans `server/package.json`).

## 5. Démarrer / redémarrer l'application

Cliquez **Restart**. Votre site est maintenant en ligne, avec le panneau
d'administration accessible sur :

```
https://agriwintogo.com/admin/connexion
```

## 6. Vérifier que tout fonctionne

- Ouvrez `https://agriwintogo.com/` → le site s'affiche normalement.
- Ouvrez `https://agriwintogo.com/admin/connexion` → connectez-vous avec
  l'identifiant/mot de passe mis à l'étape 3.
- Ajoutez un produit test dans `/admin/produits`, puis vérifiez qu'il
  apparaît sur `https://agriwintogo.com/catalogue.html`.

## Si quelque chose ne fonctionne pas

- **Le site affiche une erreur ou une page blanche** : retournez dans
  *Setup Node.js App*, ouvrez les logs de l'application (souvent un bouton
  "Logs" ou un fichier dans le dossier de l'app) pour voir le message
  d'erreur exact.
- **`/admin` redirige en boucle vers la connexion** : vérifiez que
  `SESSION_SECRET` est bien renseigné et que vous n'avez pas de bloqueur
  de cookies actif dans le navigateur.
- **Les photos ne s'affichent pas après un ajout produit** : vérifiez que
  le dossier `agriwintogo/images/products/` a bien les droits d'écriture
  (dans le Gestionnaire de fichiers, clic droit → Permissions → 755).

## Renouvellement du domaine et de l'hébergement

Pensez à activer le renouvellement automatique chez LWS pour ne pas perdre
le nom de domaine `agriwintogo.com` à l'échéance.
