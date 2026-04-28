# Diary Perspective

A personal journaling app where you can write daily entries or ad-hoc pieces, organize them by type, and selectively share them publicly.

## Features

- 📝 **Two writing modes**: Daily entries and ad-hoc writing
- 📚 **Article management**: Organized view with dropdowns for daily and ad-hoc articles
- 🌐 **Public sharing**: Make articles public and share shareable links
- 🔒 **Privacy control**: Toggle public/private status for each article
- 📱 **Responsive design**: Works on desktop, tablet, and mobile
- 💰 **Completely free**: Self-hosted or deployed to free services

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (file-based, zero setup)
- **Styling**: CSS3 with responsive design

## Local Development

### Prerequisites

- Node.js 16+ and npm

### Setup

1. **Clone and install dependencies**:
   ```bash
   cd "Diary Perspective"
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

   Or run them separately:
   ```bash
   npm run dev:server  # Terminal 1
   npm run dev:client  # Terminal 2
   ```

3. **Open in browser**:
   - Main app: http://localhost:5173 (client Vite dev server)
   - Public article: http://localhost:5000/article/{slug}

## Deployment (Free)

### Option 1: Render.com (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render account** at [render.com](https://render.com)

3. **Create new Web Service**:
   - Connect your GitHub repo
   - Select "Node"
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Region: Choose closest to you

4. **Done!** Your app is live at `https://your-app-name.onrender.com`

### Option 2: Railway.app

1. **Push to GitHub** (same as above)

2. **Go to [railway.app](https://railway.app)**

3. **New Project** → Connect GitHub repo

4. **Railway auto-detects** Node.js and deploys

### Option 3: Fly.io

1. **Install flyctl**: https://fly.io/docs/getting-started/installing-flyctl/

2. **Deploy**:
   ```bash
   flyctl launch
   flyctl deploy
   ```

## Usage

### Writing an Article

1. Click **"✏️ Pen It Down"** button
2. Choose article type: **Daily Entry** or **Ad-hoc Writing**
3. Add title and write your content
4. Click **"Save Article"**

### Managing Articles

- **View**: Click any article in the right panel to view it
- **Edit**: Click **"Edit"** button while viewing
- **Delete**: Click **"Delete"** button
- **Share**: Toggle **"Public"** checkbox and copy the share link

### Accessing Public Articles

Anyone with the share link can view public articles:
- Format: `https://your-app-url.com/article/{slug}`
- Private articles cannot be accessed even with direct link

## Project Structure

```
Diary Perspective/
├── server/
│   ├── index.js          # Express app & API routes
│   ├── db.js             # SQLite setup
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── components/   # React components
│   │   ├── styles/       # Component styles
│   │   └── index.css     # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json          # Root scripts
├── render.yaml          # Render deployment config
└── README.md
```

## Database

SQLite database is stored at `server/db/diary.sqlite`. The database is created automatically on first run.

### Schema

```sql
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,        -- 'daily' or 'adhoc'
  isPublic INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  slug TEXT UNIQUE
)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles?owner=true` | Get all articles (private + public) |
| GET | `/api/articles?owner=true` | Get only public articles |
| GET | `/api/articles/:slug` | Get single public article |
| POST | `/api/articles` | Create new article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |

## Data Privacy

- **Your articles are stored locally** in the SQLite database
- **Private articles** are never exposed, even with direct link
- **Public articles** are accessible via unique slug URLs
- **No tracking**: No analytics, cookies, or telemetry

## Tips

- **Daily Entry**: Use for your day-to-day reflections
- **Ad-hoc Writing**: Use for longer thoughts, essays, or special pieces
- **Sharing**: Only make articles public if you're comfortable sharing them
- **Backup**: The SQLite database file (`server/db/diary.sqlite`) contains all your data

## Troubleshooting

### Port already in use
```bash
PORT=5001 npm run dev:server
```

### SQLite errors
Ensure write permissions in the project directory.

### Frontend not connecting to API
In development, Vite proxies `/api` to `http://localhost:5000`. Ensure both servers are running.

## Future Ideas

- Search functionality
- Tags and categories
- Word count statistics
- Dark mode
- Export articles as PDF
- Mobile app (React Native)

## License

MIT - Use this for whatever you want!
