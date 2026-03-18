# Cahier des Charges — WhatsApp CRM Platform

**Version :** 1.0 | **Date :** Mars 2026 | **Statut :** Brouillon

---

## 1. Présentation du Projet

WhatsApp CRM Platform est une application web qui permet à des entreprises de gérer leurs communications WhatsApp depuis une interface simple et centralisée.

L'utilisateur connecte son compte WhatsApp via QR code, gère ses contacts en listes organisées par catégories, crée des modèles de messages, et envoie des campagnes en masse à ses contacts. Un admin supervise l'ensemble des utilisateurs de la plateforme.

La plateforme fonctionne avec deux niveaux d'accès :

- **Admin** — supervise tous les utilisateurs, consulte les statistiques d'usage, gère les comptes et envoie des notifications internes.
- **Utilisateur** — gère son propre compte WhatsApp, ses contacts, ses campagnes et ses templates.

---

## 2. Fonctionnalités Principales

### Connexion WhatsApp
L'utilisateur scanne un QR code pour lier son compte WhatsApp à la plateforme. La session est maintenue côté serveur. L'utilisateur peut voir son statut de connexion à tout moment et se déconnecter depuis les paramètres.

### Messagerie
Un inbox centralise toutes les conversations WhatsApp de l'utilisateur. Il peut rechercher par nom ou numéro, lire l'historique complet et envoyer des messages directement depuis l'interface.

### Gestion des Contacts
Les contacts sont organisés en **listes**, et chaque liste appartient à une **catégorie** (ex. : Clients, Prospects). L'utilisateur peut ajouter des contacts manuellement ou importer un fichier CSV. Une fonctionnalité de validation permet de vérifier quels numéros sont bien enregistrés sur WhatsApp, et de supprimer les invalides d'un clic.

### Templates de Messages
L'utilisateur crée des modèles de messages réutilisables avec des variables personnalisables (`{{nom}}`, `{{offre}}`...). Un aperçu en direct est disponible avant utilisation.

### Campagnes
L'utilisateur choisit un template et une liste de contacts, puis lance la campagne immédiatement ou la planifie. Pendant l'envoi, une barre de progression affiche l'avancement en temps réel. Il peut mettre en pause, reprendre ou stopper la campagne à tout moment. Un historique des campagnes est consultable avec les résultats (envoyés, échoués).

### Dashboard Utilisateur
L'utilisateur voit ses statistiques d'usage (messages envoyés, campagnes lancées) et reçoit les notifications de l'admin dans son espace.

### Panel Admin
L'admin accède à la liste de tous les utilisateurs avec leurs statistiques, peut créer, modifier ou désactiver des comptes, et envoyer des notifications à un utilisateur spécifique ou à tous.

---

## 3. Technologies Utilisées

| Couche | Technologie | Rôle |
|---|---|---|
| Frontend | **Next.js 14** | Interface utilisateur, rendu SSR/CSR, routing |
| Backend | **Express.js** | API REST, authentification, logique métier |
| Base de données | **MongoDB** | Stockage des données (users, contacts, campagnes…) |
| ODM | **Mongoose** | Modélisation des schémas MongoDB |
| WhatsApp | **whatsapp-web.js** | Connexion QR, envoi et réception de messages |
| Auth | **JWT + bcrypt** | Authentification sécurisée, hash des mots de passe |
| Styles | **Tailwind CSS** | Design de l'interface utilisateur |

---

## 4. User Stories

### Authentification

> **US-01** — En tant que visiteur, je veux créer un compte pour accéder à la plateforme.

> **US-02** — En tant qu'utilisateur, je veux me connecter avec mon email et mot de passe pour accéder à mon espace.

---

### Connexion WhatsApp

> **US-03** — En tant qu'utilisateur, je veux scanner un QR code pour lier mon WhatsApp à la plateforme sans configuration technique.

> **US-04** — En tant qu'utilisateur, je veux voir mon statut de connexion WhatsApp en permanence pour savoir si mon compte est actif.

> **US-05** — En tant qu'utilisateur, je veux être alerté si ma session se déconnecte pour pouvoir reconnecter rapidement.

---

### Messagerie

> **US-06** — En tant qu'utilisateur, je veux voir toutes mes conversations WhatsApp dans un inbox pour répondre depuis une seule interface.

> **US-07** — En tant qu'utilisateur, je veux rechercher une conversation par nom ou numéro pour trouver un contact rapidement.

> **US-08** — En tant qu'utilisateur, je veux envoyer et recevoir des messages en temps réel sans ouvrir WhatsApp.

---

### Contacts

> **US-09** — En tant qu'utilisateur, je veux créer des listes de contacts avec un nom et une catégorie pour organiser mes contacts.

> **US-10** — En tant qu'utilisateur, je veux ajouter un contact manuellement (nom, téléphone, notes) pour enrichir mes listes.

> **US-11** — En tant qu'utilisateur, je veux importer des contacts depuis un fichier CSV pour alimenter mes listes rapidement.

> **US-12** — En tant qu'utilisateur, je veux valider tous les numéros d'une liste pour savoir lesquels sont actifs sur WhatsApp.

> **US-13** — En tant qu'utilisateur, je veux supprimer les numéros invalides en un clic pour nettoyer mes listes.

---

### Templates

> **US-14** — En tant qu'utilisateur, je veux créer un template avec des variables (`{{nom}}`) pour personnaliser mes messages en masse.

> **US-15** — En tant qu'utilisateur, je veux prévisualiser mon template pour vérifier le rendu avant de l'utiliser en campagne.

---

### Campagnes

> **US-16** — En tant qu'utilisateur, je veux créer une campagne en choisissant un template et une liste pour envoyer des messages en masse.

> **US-17** — En tant qu'utilisateur, je veux lancer une campagne immédiatement ou la planifier pour une date future.

> **US-18** — En tant qu'utilisateur, je veux voir une barre de progression pendant l'envoi pour suivre l'avancement en temps réel.

> **US-19** — En tant qu'utilisateur, je veux pouvoir mettre en pause et reprendre une campagne pour contrôler l'envoi.

> **US-20** — En tant qu'utilisateur, je veux stopper définitivement une campagne en cas d'erreur.

> **US-21** — En tant qu'utilisateur, je veux consulter l'historique de mes campagnes pour analyser les résultats (envoyés, échoués).

---

### Dashboard & Notifications

> **US-22** — En tant qu'utilisateur, je veux voir mes statistiques d'usage pour mesurer mon activité sur la plateforme.

> **US-23** — En tant qu'utilisateur, je veux recevoir les notifications de l'admin dans mon espace pour rester informé.

---

### Admin

> **US-24** — En tant qu'admin, je veux voir la liste de tous les utilisateurs pour avoir une vue globale de la plateforme.

> **US-25** — En tant qu'admin, je veux voir le nombre de messages envoyés par chaque utilisateur pour surveiller l'usage.

> **US-26** — En tant qu'admin, je veux créer, modifier et supprimer des comptes utilisateurs pour gérer les accès.

> **US-27** — En tant qu'admin, je veux désactiver un compte utilisateur pour révoquer l'accès sans supprimer les données.

> **US-28** — En tant qu'admin, je veux envoyer une notification à un utilisateur ou à tous pour communiquer des informations importantes.

---

## 5. Modèles de Données

| Collection | Description |
|---|---|
| `users` | Comptes utilisateurs (email, mot de passe, rôle, statut) |
| `whatsapp_sessions` | Sessions WhatsApp par utilisateur |
| `categories` | Catégories de listes de contacts |
| `contact_lists` | Listes de contacts nommées |
| `contacts` | Contacts (nom, téléphone, statut de validation) |
| `templates` | Modèles de messages avec variables |
| `campaigns` | Campagnes (statut, compteurs, planification) |
| `campaign_logs` | Résultat d'envoi par contact |
| `notifications` | Messages de l'admin vers les utilisateurs |

---

## 6. Planning

| Phase | Contenu | Durée |
|---|---|---|
| Phase 1 | Auth, connexion WhatsApp QR, inbox messagerie | Semaines 1–4 |
| Phase 2 | Contacts, catégories, import CSV, validation, templates | Semaines 5–7 |
| Phase 3 | Campagnes — création, run, pause, stop, progression | Semaines 8–10 |
| Phase 4 | Panel admin, analytics, notifications | Semaines 11–13 |
| Phase 5 | Planification, QA, déploiement | Semaines 14–16 |

---

*© 2026 WhatsApp CRM Platform — Document confidentiel, usage interne.*
