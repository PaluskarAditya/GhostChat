# 🚀 ChatGhost – Anonymous Chats, Disappear Fast

**ChatGhost** is a **minimalist, real-time, anonymous chat platform** built with the **MERN stack** and **Socket.IO.**

It allows users to **create instant chat rooms**, **share magic links or QR codes**, and **chat anonymously with no database storage.**
All messages disappear forever when the page reloads or closes.

---

## ✨ Features

* 💬 Real-time chat using **Socket.IO**
* 🚪 Create instant, unique chat rooms
* 🔗 Share magic room links & QR codes
* 🔄 Multi-room support via direct links
* ⚡ Messages vanish on reload/close (No storage)
* ✅ Simple, fast, and mobile-friendly UI
* 🔔 Toast notifications for new user joins

---

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, React Router, Sonner (Toast)
* **Backend:** Node.js, Express.js, Socket.IO
* **QR Code API:** QRServer (Dynamic QR code generation)

---

## 📂 Folder Structure

```txt
ChatGhost/
├── backend/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── vercel.json
├── README.md
└── package.json
```

---

## ⚙️ Setup Instructions

### 🔧 Backend

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   NODE_PORT=8000
   ```

4. Run the backend server:

   ```bash
   node server.js
   ```

---

### 🎨 Frontend

1. Go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Setup `.env` (if needed):

   ```env
   VITE_BACKEND_URI=http://localhost:8000
   ```

4. Start the React app:

   ```bash
   npm run dev
   ```

---

## ⚙️ Vercel Configuration (Important)

Add the following `vercel.json` file to the root to fix route handling:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🚀 Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway / Your server

---

## 📦 API Events

| Event        | Description                 |
| ------------ | --------------------------- |
| `joinRoom`   | Join a chat room by room ID |
| `message`    | Send and receive messages   |
| `room`       | Notify when a user joins    |
| `disconnect` | User leaves the room        |

---

## 🌟 Author

* **Developer:** [aid3n](https://github.com/PaluskarAditya)
* **GitHub Repo:** [ChatGhost](https://github.com/PaluskarAditya)

---

## 💡 License

This project is licensed under the MIT License — feel free to use and modify it.

---

> ✨ Built with passion by **aid3n**
