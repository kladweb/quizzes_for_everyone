# 🧠 Quizzes for Everyone

**Quizzes for Everyone** is an open-source web application that lets anyone create, share, and take interactive quizzes — no account required to participate. Powered by AI-assisted question generation and a real-time database, it makes quiz creation fast and quiz-taking fun.

---

## 🎯 Who Is This For?

| Audience | Use Case |
|---|---|
| **Teachers & educators** | Create topic-based quizzes for students and share them with a single link |
| **Content creators** | Engage your audience with interactive knowledge tests |
| **Teams & companies** | Run internal knowledge checks or onboarding assessments |
| **Curious learners** | Take quizzes on any subject and track your progress |
| **Developers** | Explore or extend a modern full-stack React app as a learning resource |

---

## ✨ Features

- **AI-powered quiz generation** — generate quiz questions automatically using OpenAI
- **Real-time data** — quizzes and results are stored and synced via Firebase
- **Shareable quizzes** — every quiz gets a unique link for easy distribution
- **No login required** to take a quiz — just open the link and start
- **Modern UI** — fast, responsive interface built with React and Vite
- **Serverless functions** — backend logic via Netlify Functions

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, React Router v7
- **State management:** Zustand
- **Build tool:** Vite
- **Backend / DB:** Firebase (Firestore)
- **AI integration:** OpenAI API
- **Serverless:** Netlify Functions
- **Deployment:** Netlify

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- An [OpenAI](https://platform.openai.com/) API key
- (Optional) A [Netlify](https://www.netlify.com/) account for deployment

### 1. Clone the repository

```bash
git clone https://github.com/kladweb/quizzes_for_everyone.git
cd quizzes_for_everyone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## 📦 Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite frontend dev server only |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `netlify dev` | Start frontend + Netlify Functions together (**recommended**) |

---

## 💻 Local Development Modes

### Frontend only

```bash
npm run dev
```

Starts the Vite development server. The app will be available at `http://localhost:5173` by default. Use this mode when you only need to work on the UI and don't require AI quiz generation.

### Frontend + Netlify Functions ✅ Recommended

```bash
netlify dev
```

Starts both the Vite frontend and the Netlify Functions runtime together. **This is the recommended mode for full local development** — it is required if you want AI quiz generation to work locally, since the OpenAI integration runs inside a Netlify Function.

To use this mode, install the Netlify CLI first:

```bash
npm install -g netlify-cli
```

Then log in to your Netlify account:

```bash
netlify login
```

And start the full local environment:

```bash
netlify dev
```

The app will be available at `http://localhost:8888` by default, with Functions served alongside it automatically.

> **Note:** Make sure your `.env` file contains all required variables (including `VITE_OPENAI_API_KEY`) before running `netlify dev`.

---

### Build for production

```bash
npm run build
```

The compiled output will be placed in the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can verify the production build before deploying.

---

## ☁️ Deployment

The project is pre-configured for deployment on **Netlify** (`netlify.toml` is included). To deploy:

1. Push your repository to GitHub
2. Connect the repository to your Netlify account
3. Add your environment variables in the Netlify dashboard under **Site settings → Environment variables**
4. Netlify will build and deploy automatically on every push to `main`

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an [issue](https://github.com/kladweb/quizzes_for_everyone/issues) or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software.
