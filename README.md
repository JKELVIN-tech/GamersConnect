# GamersConnect

A gaming community web application for discovering players, discussing games, sharing clips, and connecting with other gamers.

## Overview

GamersConnect is a React-based frontend designed around a social gaming experience. The current application includes authentication, player discovery, gaming categories, forums, clips, profiles, and connection features.

## Tech Stack

- React 18
- React Router 6
- Vite 5
- JavaScript / JSX
- CSS
- REST API integration

## Features

- User sign-up and login
- Player discovery and game filtering
- Gamer profiles
- Player connections
- Gaming forums and replies
- Gaming clips and comments
- Clip likes
- Linked gaming accounts
- Responsive navigation and mobile-oriented UI

## Project Structure

```text
GamersConnect/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api.js
│   ├── categories.js
│   ├── App.jsx
│   ├── main.jsx
│   └── theme.css
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

The frontend expects its API under `/api`. In development, the Vite configuration proxies this path to the local backend.

Do not commit API credentials, tokens, environment files, or generated dependency directories.

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Security Notes

- Authentication tokens are currently stored in browser `localStorage`; a production deployment should consider a secure, appropriately configured cookie-based session strategy where practical.
- Public frontend code must never contain private API secrets.
- Upload authorization, file type validation, storage permissions, and API authorization must be enforced by the backend rather than trusted to the frontend.

## Development

This repository contains the frontend client. Backend endpoints are expected to be provided separately and are not bundled into this repository.

## License

This project is currently maintained as a personal development project.
