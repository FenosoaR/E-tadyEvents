# E-tadyEvents API

Backend REST API pour le projet **E-tadyEvents** — une plateforme de gestion d'événements locaux.

Construit avec **Symfony 7**, **Doctrine ORM** et **PostgreSQL 16**. Conçu pour être consommé par un frontend **React**.

---

## 🛠️ Stack technique

| Couche | Technologie |
|---|---|
| Langage | PHP 8.2+ |
| Framework | Symfony 7 |
| Base de données | PostgreSQL 16 |
| ORM | Doctrine |
| Authentification | JWT (LexikJWTAuthenticationBundle) |
| Sérialisation | Symfony Serializer |
| CORS | NelmioCorsBundle |
| Frontend (séparé) | React |

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine Windows :

- [PHP 8.2+](https://www.php.net/) (via XAMPP)
- [Composer](https://getcomposer.org/)
- [PostgreSQL 16](https://www.postgresql.org/download/windows/)
- [Symfony CLI](https://symfony.com/download)
- [Node.js](https://nodejs.org/) (pour le frontend React)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/e-tadyevents-api.git
cd e-tadyevents-api
```

### 2. Installer les dépendances

```bash
composer install
```

### 3. Configurer les variables d'environnement

Copiez le fichier `.env` en `.env.local` :

```bash
copy .env .env.local
```

Modifiez `.env.local` avec vos informations :

```dotenv
# Base de données PostgreSQL
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@127.0.0.1:5432/e_tadyevents?serverVersion=16&charset=utf8"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase
```

---

## ⚙️ Configuration de la base de données

### 1. Vérifier que PostgreSQL tourne

Ouvrez **pgAdmin 4** ou **SQL Shell (psql)** et connectez-vous avec votre mot de passe.

### 2. Activer le driver PostgreSQL dans XAMPP

Ouvrez `C:\xampp\php\php.ini` et décommentez ces deux lignes :

```ini
extension=pdo_pgsql
extension=pgsql
```

Redémarrez Apache dans le panneau XAMPP.

### 3. Créer la base de données

```bash
php bin/console doctrine:database:create
```

### 4. Lancer les migrations

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

## 🔐 Configuration JWT

### Générer les clés JWT

```bash
php bin/console lexik:jwt:generate-keypair
```

Cela crée automatiquement les fichiers `private.pem` et `public.pem` dans `config/jwt/`.

---

## 🌐 Configuration CORS

Dans `config/packages/nelmio_cors.yaml` :

```yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['http://localhost:3000']
        allow_methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
        allow_headers: ['Content-Type', 'Authorization']
        max_age: 3600
    paths:
        '^/api/': ~
```

---

## ▶️ Lancer le serveur

```bash
symfony serve
```

L'API sera disponible sur : **http://localhost:8000**

---

## 🗄️ Structure de la base de données

### Table `users`

| Colonne | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique (auto-généré) |
| name | VARCHAR(100) | Nom de l'organisateur |
| email | VARCHAR(180) | Email unique, sert à la connexion |
| password | VARCHAR(255) | Mot de passe hashé avec bcrypt |
| roles | JSON | Rôles : ROLE_USER, ROLE_ORGANIZER |
| is_verified | BOOLEAN | Compte vérifié par email |
| verification_token | VARCHAR(100) | Token de vérification email |
| token_expires_at | TIMESTAMP | Expiration du token (24h) |
| created_at | TIMESTAMP | Date de création |

### Table `events`

| Colonne | Type | Description |
|---|---|---|
| id | UUID | Identifiant unique (auto-généré) |
| title | VARCHAR(150) | Titre de l'événement |
| description | TEXT | Description complète |
| start_at | TIMESTAMP | Date et heure de début |
| end_at | TIMESTAMP | Date et heure de fin (optionnel) |
| address | VARCHAR(255) | Adresse complète |
| latitude | DECIMAL(10,7) | Coordonnée géographique |
| longitude | DECIMAL(10,7) | Coordonnée géographique |
| category | VARCHAR(50) | concert, marché, conférence, atelier, sport, autre |
| image | VARCHAR(255) | Nom du fichier image (optionnel) |
| organizer_id | UUID | Clé étrangère → users.id |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de dernière modification |

### Relation

```
users (1) ────────── (N) events
Un organisateur peut avoir plusieurs événements.
Si l'organisateur est supprimé, ses événements le sont aussi (CASCADE).
```

---

## 🔗 Endpoints API

### Authentification

| Méthode | URL | Description | Auth requise |
|---|---|---|---|
| POST | `/api/register` | Créer un compte | Non |
| POST | `/api/login` | Connexion → retourne JWT | Non |

### Événements

| Méthode | URL | Description | Auth requise |
|---|---|---|---|
| GET | `/api/events` | Liste de tous les événements | Non |
| GET | `/api/events/{id}` | Détail d'un événement | Non |
| POST | `/api/events` | Créer un événement | ✅ Oui |
| PUT | `/api/events/{id}` | Modifier un événement | ✅ Oui |
| DELETE | `/api/events/{id}` | Supprimer un événement | ✅ Oui |

---

## 📡 Exemples de requêtes

### Register

```http
POST /api/register
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

Réponse :
```json
{
  "message": "Compte créé avec succès. Vérifiez votre email."
}
```

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

Réponse :
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
}
```

### Créer un événement (avec JWT)

```http
POST /api/events
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...

{
  "title": "Concert Jazz",
  "description": "Un super concert de jazz en plein air.",
  "start_at": "2025-08-15T20:00:00",
  "address": "12 rue de la Paix, Paris",
  "category": "concert"
}
```

---

## 📁 Structure du projet

```
src/
├── Controller/
│   └── Api/
│       ├── AuthController.php       ← Register, Login
│       └── EventController.php      ← CRUD événements
├── Entity/
│   ├── User.php                     ← Table users
│   └── Event.php                    ← Table events
├── Repository/
│   ├── UserRepository.php
│   └── EventRepository.php
└── DTO/
    └── CreateEventDTO.php
```

---

## 👥 Équipe

| Rôle | Responsabilité |
|---|---|
| Backend | API Symfony, BDD PostgreSQL, Auth JWT |
| Frontend | Application React |

---

## 📄 Licence

Projet académique — E-tadyEvents © 2025