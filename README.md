# Student Search IITK

A modern, progressive web application for searching student information at IIT Kanpur. Built with Next.js, TypeScript, and Material-UI.

This is a remake of the [original Student Search](https://github.com/pclubiitk/student-search) with significant improvements and modern web technologies.

## Features

- 🔍 **Advanced Search** - Multi-field filtering with fuzzy name matching
- 📱 **PWA Support** - Full progressive web app functionality for offline access
- 🌳 **Family Tree** - Mentor-mentee relationship visualization (data from Counselling Service IITK)
- 🌙 **Dark Mode** - Eye-friendly interface
- ⚡ **Fast Performance** - Client-side search with IndexedDB caching
- 📴 **Offline Capable** - Works without internet after initial data load

## Tech Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Database**: MongoDB Atlas
- **Local Storage**: IndexedDB
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- MongoDB Atlas account (for production deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pclubiitk/student-search-new.git
   cd student-search-new
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_MONGODB_APP_ID=your_app_id
   NEXT_PUBLIC_MONGODB_API_KEY=your_api_key
   NEXT_PUBLIC_MONGODB_CLUSTER_NAME=your_cluster_name
   NEXT_PUBLIC_MONGODB_DB_NAME=your_db_name
   NEXT_PUBLIC_MONGODB_COLLECTION_NAME=your_collection_name
   NEXT_PUBLIC_BASE_PATH=
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
student-search-new/
├── components/
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── Display.tsx     # Search results display
│   ├── Options.tsx     # Search filters
│   ├── SCard.tsx       # Student card component
│   └── data_worker.tsx # Data fetching and caching logic
├── pages/
│   ├── _app.tsx        # App wrapper
│   ├── _document.tsx   # Document structure
│   └── index.tsx       # Home page
├── public/             # Static assets
├── styles/             # Global styles
└── next.config.js      # Next.js configuration
```

## Key Components

- **Display**: Shows filtered student results with infinite scroll
- **Options**: Multi-select filters for batch, hall, program, etc.
- **SCard**: Student card with three display modes (full, compact, ultra-compact)
- **data_worker**: Handles data fetching from MongoDB and local caching

## Data Management

Student data is:
1. Fetched from MongoDB Atlas on first load
2. Cached locally using IndexedDB
3. Refreshed weekly automatically
4. Searched entirely on the client side for instant results

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the existing code style
2. Add JSDoc comments for new functions
3. Test your changes thoroughly
4. Update documentation as needed

## Credits

- **Deven Gangwani** - Original developer
- **Krishnansh Agarwal** - Core contributor
- **Counselling Service IITK** - Family tree data

## License

This project is maintained by the Programming Club, IIT Kanpur.