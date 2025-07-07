# Event Creation and Management Platform

## Introduction
This project is a modern and intuitive event creation and management platform designed for social networking app. It allows users to easily create events, manage RSVP responses, send invitations, and share event details—all with a sleek, guided frontend experience. The platform focuses on enhancing user interaction with features like event discussion threads, and dynamic maps for venue selection. 

# Project Type
Fullstack

# Deployed App
https://b46-rct-305-eventplanner-s48z.vercel.app/

# Directory Structure
my-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── config/
│   └── contexts/
│   └── hooks/
│   └── lib/
│   └── App.jsx
│   └── main.jsx
├── .env
├── README.md

# Video Walkthrough of the project
🎥 (https://youtu.be/YUTnew_1muE?si=Rp03sdL-yZMU_FMJ)

# Video Walkthrough of the codebase
💻 (https://youtu.be/uKlMNgNkSS8?si=-YX15XMoEoTkQPUW)

# Features
🧭 Interactive multi-step event creation wizard

📍 Google Maps integration for venue selection

⏰ Automated RSVP reminders

🗓️ Timeline view of all events with filters and search

📢 Social sharing to platforms like Twitter, Facebook

💬 Comment/discussion forum for each event

# Design Decisions or Assumptions

Events have three types: public, private, and RSVP-only.

Assumed authenticated users can create, edit, or delete their own events.

Integrated Google Maps API for location precision.

Built responsive design to work across desktop.

## Credentials
Demo User:

Email: demo@eventhub.com

Password: Demo@1234

## Installation & Getting started

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/vinit3200/B46_RCT305_eventplanner.git

# Step 2: Navigate to the project directory.
cd B46_RCT305_eventplanner

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## technology Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS