# Cerberus Backend

The Cerberus backend is a **NestJS API** responsible for handling:

- user authentication
- automation management
- trade history
- wallet encryption
- blockchain interaction
- WebSocket communication

---

# Tech Stack

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- MongoDB
- JWT Authentication

---

# Features

- Wallet authentication via MetaMask
- JWT based session management
- Automation creation and management
- Trade history tracking
- WebSocket integration
- Smart contract interaction
- Email notifications

---

# Environment Variables

Example in the file `.env.example`

---

# Running Backend

Install dependencies:

- npm install

Run development server:

- npm run start:dev

Run tests:

- npm test

---

# API Modules

Main modules:

auth
users
pools
automations
trades

---

# WebSocket

The backend communicates with the Engine and Frontend using WebSockets to provide **real-time updates**.

---

# Database

The backend uses **MongoDB** with Prisma.

Main entities:

- Users
- Automations
- Trades
- Pools
- Tokens
