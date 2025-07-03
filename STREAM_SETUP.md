# Configuration Stream.io pour Streamify

Ce guide explique comment configurer Stream.io pour le chat et les appels vidéo de groupe.

## 📋 Prérequis

1. Compte Stream.io (gratuit pour commencer)
2. Projet créé sur [Stream.io Dashboard](https://dashboard.getstream.io/)

## 🔑 Configuration des Variables d'Environnement

### Backend (.env)

```env
# Stream.io Configuration
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stream.io Configuration
VITE_STREAM_API_KEY=your_stream_api_key_here
```

## 🚀 Étapes de Configuration

### 1. Créer un projet Stream.io

1. Allez sur [Stream.io Dashboard](https://dashboard.getstream.io/)
2. Créez un nouveau projet
3. Notez votre `API Key` et `API Secret`

### 2. Configurer les Variables d'Environnement

1. **Backend** : Ajoutez les variables dans `backend/.env`
2. **Frontend** : Créez un fichier `.env` dans `frontend/` avec les variables

### 3. Redémarrer les Serveurs

```bash
# Backend
cd backend
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm run dev
```

## 🎯 Fonctionnalités Disponibles

### Chat de Groupe
- ✅ Messages en temps réel
- ✅ Interface personnalisée
- ✅ Gestion des erreurs
- ✅ Authentification automatique

### Appels Vidéo/Audio
- ✅ Appels de groupe
- ✅ Contrôles audio/vidéo
- ✅ Interface responsive
- ✅ Gestion des participants

## 🔧 Dépannage

### Erreur "Module not found"
- Vérifiez que les dépendances sont installées
- Redémarrez le serveur de développement

### Erreur "Authentication failed"
- Vérifiez vos clés API Stream.io
- Assurez-vous que les variables d'environnement sont correctes

### Erreur "Failed to load group chat"
- Vérifiez la connexion internet
- Vérifiez les permissions du projet Stream.io

## 📱 Test des Fonctionnalités

1. **Créer un groupe** : `/groups/create`
2. **Rejoindre un groupe** : `/groups`
3. **Chat de groupe** : Cliquez sur "Chat" dans un groupe
4. **Appel vidéo** : Boutons audio/vidéo dans le chat

## 🎨 Personnalisation

Les composants peuvent être personnalisés :
- `GroupChat.jsx` : Interface du chat
- `GroupCall.jsx` : Interface des appels
- Styles : Utilise DaisyUI et Tailwind CSS

## 📚 Ressources

- [Stream.io Documentation](https://getstream.io/docs/)
- [Stream Chat React](https://getstream.io/chat/docs/react/)
- [Stream Video React](https://getstream.io/video/docs/react/) 