# NextWatch 🎬✨

AI based movie recommendation built with modern web technologies (React/Go/gin-gonic/MongoDB) 

---

## About  

This project is a full-stack simulation of a modern **Movie Streaming Platform**, designed to showcase how different technologies can be combined to deliver a scalable, AI-powered application.  

The system brings together a **React-based frontend** for an engaging user experience, a **Go-based backend** for high-performance API services that runs on the gin (gin-gonic) web framework, and an **AI-powered recommendation engine** to personalize movie suggestions using **LangChainGo** and **OpenAI**.  

It also demonstrates how **MongoDB** can serve as a reliable, scalable database solution for managing media metadata and user preferences.  

---

## Features

- Movie  trailers streaming service simulated on the front end using React and React-Player
- Web API service written using GO and runs on the gin-gonic web framework 
- AI Recommendation service using LangChainGo, Go and OpenAI
- Scalable backend storage provided by MongoDB

**Project name change:** This repository has been renamed to **NextWatch** (previously MagicStream).

---

## Tech Stack

| Frontend / Client | JavaScript / React |
| Backend / Server | Go / gin-gonic |
| Storage / Database | MongoDB |
 
---


### Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/Priyam-Kesarwani/NextWatch.git
   cd NextWatch
### Seeding the Database (optional)

Seed data for genres, movies, users, and rankings is included in `magic-stream-seed-data/`. You can import them using MongoDB tools or the provided scripts:

- PowerShell (Windows):
  ```powershell
  pwsh Server/MagicStreamServer/scripts/seed-db.ps1 -MongoUri "mongodb://localhost:27017" -DatabaseName "magicstream"
  ```

- Bash (macOS/Linux):
  ```bash
  bash Server/MagicStreamServer/scripts/seed-db.sh mongodb://localhost:27017 magicstream
  ```

These scripts call `mongoimport` to import the JSON files into the database. Ensure `mongoimport` is available on your PATH (part of MongoDB Database Tools).
