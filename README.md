Project Name: Time Tide

Introduction:
Time Tide is a productivity application designed to help users manage their time effectively by facilitating focused work/study sessions. The application allows users to create custom focus sessions with specific titles, types, and durations. It includes a countdown timer feature to track the progress of each session and provides summaries of past sessions for reflection and planning.

Key Features:

Custom Focus Sessions: Users can create personalized focus sessions by specifying the title, type, and duration of the session.
Countdown Timer: The application includes a countdown timer to track the progress of each focus session accurately.
Session Summaries: Time Tide provides summaries of past focus sessions, including the number of sessions, total planned time, and total actual time spent.
Data Persistence: The application utilizes Airtable as a backend service to store and retrieve focus session data, ensuring data persistence and accessibility across multiple devices.

Usage:

Creating Focus Sessions:

Users can navigate to the "New Focus Session" page and fill out the form with the session details.
They can specify the title, type, and duration of the session before submitting the form.

Tracking Progress:

Once a focus session is created, users can track its progress using the countdown timer.
The timer accurately displays the remaining time, allowing users to stay focused and productive.
Reviewing Session Summaries:

Users can review summaries of past focus sessions on the main dashboard.
The summary includes essential metrics such as the number of sessions, total planned time, and total actual time spent.

Technology Stack:

Frontend: React.js
Routing: react-router-dom
State Management: useState hook
Backend: Airtable API
Styling: CSS


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
