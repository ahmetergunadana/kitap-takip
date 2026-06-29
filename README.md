# Kitap Takip — Personal Book Tracker

A minimal book tracking app built with React + Vite and Node.js + Express + SQLite.

## Features

- Add, edit, and delete books
- Star rating (1–5) for each book
- Filter by status: To Read / Reading / Read
- SQLite database auto-created on first run

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:9897`.

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/books       | List all books           |
| GET    | /api/books?status=X | Filter books by status |
| POST   | /api/books       | Add a new book           |
| PUT    | /api/books/:id   | Update a book            |
| DELETE | /api/books/:id   | Delete a book            |
