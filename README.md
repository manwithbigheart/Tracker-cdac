# 🚀 PG-DAC Titan Elite

> **A production‑grade study tracker & focus timer built for serious exam preparation (PG‑DAC / CDAC C‑CEE)**

PG‑DAC Titan Elite is a **single‑page, cloud‑synced, installable web app (PWA)** that helps students **plan, focus, track progress, and revise intelligently**. It is designed with **real‑world engineering practices** and **interview‑ready architecture**—no backend server required.

---

## ✨ Key Highlights

* ✅ **Pomodoro Focus Timer** with alarm, vibration & wake‑lock
* 🔔 **System Notifications** (works even when tab is hidden)
* 📱 **PWA (Installable App)** – Add to Home Screen, fullscreen mode
* ☁️ **Firebase Auth + Firestore** – Secure cloud sync
* 🔐 **Single‑Session Lock** – Prevents multi‑device misuse
* 📊 **Syllabus Progress Tracker** with XP & gamification
* 🔁 **Spaced Revision System** (1‑3‑7‑15 day logic)
* ❌ **Mistake Notebook** for weak‑area tracking
* 🌙 **Dark / Light Mode**
* 🧩 **Modular, clean, interview‑grade codebase**

---

## 🧠 Why This Project Stands Out (Hiring Perspective)

This project demonstrates **much more than UI**:

* ✔️ **Web APIs**: Notification, Wake Lock, Vibration, Service Workers
* ✔️ **Progressive Web App (PWA)** concepts
* ✔️ **State management** without frameworks
* ✔️ **Security thinking** (single active session enforcement)
* ✔️ **Scalable architecture** (cloud‑synced user state)
* ✔️ **Real product thinking** (mobile vs desktop behavior)

> This is the kind of project interviewers expect when they ask:
> *“Show me something practical you’ve built.”*

---

## 🏗️ Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | HTML5, CSS3, TailwindCSS           |
| Logic    | Vanilla JavaScript (ES6+)          |
| Auth     | Firebase Google Authentication     |
| Database | Firebase Firestore                 |
| PWA      | Manifest + Service Worker          |
| APIs     | Notification, Wake Lock, Vibration |

---

## 📱 Progressive Web App (PWA)

The app is fully **installable** and behaves like a native app:

* Standalone fullscreen mode
* Better background reliability
* App icon on home screen

### Files involved:

```
manifest.json
service-worker.js
index.html
```

---

## ⏰ Focus Timer – Engineering Details

### Features:

* Custom focus / break durations
* Visual progress ring (SVG)
* High‑pitch alarm using Web Audio API
* Mobile vibration support
* Screen Wake Lock to prevent sleep

### Notification Logic:

* Requests permission once after login
* Fires system notification when timer ends
* Works even when tab is hidden or minimized

---

## 🔐 Authentication & Security

* Google Sign‑In via Firebase Authentication
* Firestore used for user state persistence
* **Single Active Session Enforcement**:

  * Each login creates a unique session ID
  * Old sessions auto‑lock when new login happens

This mimics **real production systems** (banking / SaaS behavior).

---

## 📊 Study Progress & Gamification

* Topic‑level completion tracking
* Difficulty levels (Easy / Medium / Hard)
* XP points system
* Daily target tracking
* Progress bars per subject

---

## 🔁 Spaced Revision System

Automatically schedules revision reminders based on:

* Day 1
* Day 3
* Day 7
* Day 15

This shows **domain understanding**, not just coding skills.

---

## ❌ Mistake Notebook

* Log mistakes while studying
* Link mistakes to topics
* Review weak areas before exams

A **very interview‑friendly feature** showing learning mindset.

---

## 🧩 Code Quality & Design Principles

* No frameworks → **core JavaScript mastery**
* Clear function boundaries
* Meaningful variable names
* Minimal global state
* Defensive checks for browser APIs
* Progressive enhancement (desktop vs mobile)

---

## 📂 Project Structure

```
/
├── index.html              # Main application
├── manifest.json           # PWA metadata
├── service-worker.js       # Offline & install support
├── icon-192.png            # App icon
├── icon-512.png            # App icon
```

---

## 🚀 How to Run Locally

1. Clone repository
2. Open `index.html` in browser
3. Sign in with Google
4. (Optional) Install as PWA from browser menu

> ⚠️ For full PWA features, use **Chrome / Edge**.

---

## 🧪 Tested On

* ✅ Chrome (Desktop & Android)
* ✅ Edge (Desktop)
* ⚠️ Firefox (limited PWA support)
* ⚠️ Safari (limited APIs)

---

## 🎯 Interview Talking Points (Use These)

* Why Notifications are better than PiP for mobile timers
* How Service Workers improve reliability
* How session locking prevents concurrent logins
* Why PWA is chosen instead of native app
* Trade‑offs of browser APIs across platforms

---

## 📌 Future Enhancements

* Background notifications when app is closed
* Analytics dashboard
* Cloud‑based revision recommendations
* Play Store deployment (Trusted Web Activity)

---

## 🙌 Author

**Abdul Rehman**
Computer Engineering Graduate | Full‑Stack & Cloud Enthusiast

---

> ⭐ If you are a recruiter or interviewer:
> This project reflects **real engineering decisions**, not tutorial code.

Feel free to ⭐ star the repository if you find it valuable.
