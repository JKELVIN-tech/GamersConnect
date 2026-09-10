# GamersConnect

A gaming community web application for discovering players, discussing games, sharing clips, and connecting with other gamers.

## Overview

GamersConnect is a React-based frontend for a social gaming experience. It includes authentication, player discovery, game categories, forums, clips, profiles, and gamer connections.

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
- Gaming clips, comments, and likes
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

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

The frontend expects API routes under `/api`. During development, Vite proxies these routes to the local backend.

## Security Notes

- Authentication tokens are currently stored in browser `localStorage`. A production deployment should consider a secure cookie-based session strategy where practical.
- Never commit API credentials, private tokens, environment files, or generated dependency directories.
- Upload authorization, file-type validation, storage permissions, and API authorization must be enforced by the backend.

## Development

This repository contains the frontend client. The backend is maintained separately.

## License

This project is currently maintained as a personal development project.
