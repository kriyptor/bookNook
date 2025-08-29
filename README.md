# BookNook

BookNook is a full-stack web application for managing your personal library and reading lists. It allows users to track books, create and manage reading lists, mark favorites, and monitor reading progress.

---
### My Project

Check out this demo video: [Watch the demo video on Google Drive](https://drive.google.com/file/d/155A63G7iJpYiFAlRt68Cd2WW1f5Of3VH/view?usp=sharing)

## Features

- **User Authentication:** Secure login and registration using JWT.
- **Book Management:** Add, edit, delete, and search books. Mark books as read, reading, or favorite.
- **Reading Lists:** Create multiple reading lists, add/remove books, and track progress.
- **Dashboard:** View statistics about your reading habits and completion rates.
- **Responsive UI:** Built with React and Bootstrap for a modern, mobile-friendly experience.
- **API Integration:** Uses Google Books API for book search and details.

---

## Tech Stack

- **Frontend:** React, React Router, Bootstrap, Axios, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **Email:** Nodemailer (Gmail)
- **Other:** Google Books API

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/booknook.git
   cd booknook
   ```

2. **Setup Backend:**
   ```bash
   cd SERVER
   npm install
   ```

3. **Setup Frontend:**
   ```bash
   cd ../CLIENT
   npm install
   ```

4. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` in the `SERVER` folder.
   - Fill in your MongoDB URI, JWT secret, email credentials, and API keys.

5. **Start the Backend:**
   ```bash
   cd ../SERVER
   npm start
   ```

6. **Start the Frontend:**
   ```bash
   cd ../CLIENT
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in the `SERVER` directory with the following:

```
DB_URI=your_mongodb_atlas_uri
JWT_SECRET_KEY=your_jwt_secret
API_BASE_URL=your_api_base_url
GOOGLE_API=your_google_books_api_key
```

---

## Usage

- Register and log in to your account.
- Add books manually or search via Google Books API.
- Create reading lists and add multiple books.
- Track your reading progress and view stats on the dashboard.
- Mark books as favorite, read, or currently reading.

---

## Folder Structure

```
BookNook/
  ├── CLIENT/      # React frontend
  └── SERVER/      # Node.js/Express backend
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.
