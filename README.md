# SDABL Baseball Leaderboard

A dynamic, interactive baseball standings leaderboard application for the San Diego Adult Baseball League (SDABL) Fall 25 - 25A Division.

## Features

- **Live Standings Table** - Real-time team rankings with win-loss records, win percentages, and run differentials
- **Interactive Game History** - Click any team row to expand and view their complete game-by-game results
- **Leader Cards** - Highlights for Undefeated Teams, Offensive Leaders (runs scored), and Defensive Leaders (runs against)
- **Animated UI** - Smooth gradient backgrounds, hover effects, and sparkle cursor trail
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **No Dependencies** - Pure HTML/CSS/JavaScript with no external frameworks

## Quick Start

1. **Open the app** - Simply open `index.html` in any web browser
2. **View standings** - See current team rankings and stats
3. **Explore game history** - Click any team row to see all their games

That's it! No build process, no server, no installation required.

## File Structure

```
sdabl-leaderboard/
├── index.html          # Main HTML structure and page layout
├── styles.css          # All CSS styling and animations
├── data.js             # Team standings and game results data
├── app.js              # JavaScript application logic
├── scraper.js          # Web scraper to fetch latest results
└── README.md           # This file
```

## Project Architecture

The app follows a clean modular design with separation of concerns:

### HTML (`index.html`)
- Semantic page structure
- Static leader cards for top performers
- Empty table container populated by JavaScript
- Minimal inline JavaScript, logic delegated to `app.js`

### CSS (`styles.css`)
- Animated gradient backgrounds
- Responsive table design
- Hover effects and transitions
- Sparkle cursor trail animations
- Mobile-friendly breakpoints

### Data (`data.js`)
- Single source of truth for all team/game data
- Each team object contains:
  - Basic stats: `rank`, `name`, `wins`, `losses`, `ties`, `winPct`, `runDiff`, `runsFor`, `runsAgainst`
  - Games array with `opponent`, `score`, `result`, `date` for each game

### Application Logic (`app.js`)
Key functions:
- `populateStandings()` - Initializes the standings table on page load
- `createTeamRow(team, index)` - Generates table rows with team stats and styling
- `createTeamDetails(team)` - Creates expandable game details section
- `toggleTeamDetails(team, clickedRow)` - Handles expand/collapse interactions
- `createSparkle(x, y)` - Creates decorative sparkle effects on mouse movement

## Updating Data

### Method 1: Fully Automatic (GitHub Actions)

If this project is hosted on GitHub, it automatically updates every Thursday at midnight Pacific Time:

- **Schedule**: Every Thursday at midnight PST/1 AM PDT
- **What it does**: Fetches latest results, updates data.js, and commits changes
- **Setup**: See "GitHub Actions Setup" section below
- **Manual trigger**: You can also trigger updates anytime from the GitHub Actions tab

### Method 2: Manual Update (Using Scraper)

Run the scraper locally to fetch the latest results:

```bash
# Run the update script (recommended - includes validation)
node update-data.js

# Or run the scraper directly
node scraper.js
cp data-scraped.js data.js

# Refresh index.html in your browser to see updates
```

The scraper:
- Fetches data from `https://www.leaguelineup.com/schedules.asp?url=sdabl1&divisionid=1061524`
- Parses all completed games (status "F")
- Calculates win-loss records, run differentials, and win percentages
- Generates properly formatted data.js file
- Requires only Node.js (no dependencies)

### Method 3: Manual Edit

Edit `data.js` directly following this structure:

```javascript
{
    rank: 1,
    name: "Team Name",
    wins: 4,
    losses: 0,
    ties: 0,
    winPct: 1.000,
    runDiff: 42,
    runsFor: 68,
    runsAgainst: 26,
    games: [
        { opponent: "vs Opponent", score: "21-5", result: "win", date: "Sep 7" },
        { opponent: "@ Opponent", score: "10-5", result: "win", date: "Sep 14" }
    ]
}
```

**Important Notes:**
- Use `vs` for home games, `@` for away games
- Score format: `"runs-allowed"` from that team's perspective
- Result must be: `"win"`, `"loss"`, or `"tie"`
- The leader cards in `index.html` are static HTML and must be manually updated

## GitHub Actions Setup

To enable automatic weekly updates when hosting on GitHub:

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sdabl-leaderboard.git
git push -u origin main
```

### 2. Enable Workflow Permissions

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Actions** → **General**
3. Scroll to **Workflow permissions**
4. Select **Read and write permissions**
5. Check **Allow GitHub Actions to create and approve pull requests**
6. Click **Save**

### 3. Test the Workflow

1. Go to the **Actions** tab
2. Click **Update SDABL Standings** in the left sidebar
3. Click **Run workflow** → **Run workflow**
4. Wait for completion (~30 seconds)
5. Check the **Commits** tab to see if data.js was updated

The workflow will now run automatically every Thursday at midnight Pacific Time. You can also trigger it manually anytime from the Actions tab.

### 4. Optional: Deploy to GitHub Pages

To publish your leaderboard online:

1. Go to **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Select **main** branch, **/ (root)** folder
4. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/sdabl-leaderboard/`

Every time the workflow updates data.js, GitHub Pages automatically redeploys your site!

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
/* Main gradient colors */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);

/* Accent colors */
.leader-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
```

### Changing Team Display

Modify the table headers or column order in `app.js` in the `createTeamRow()` function.

### Different Division

To track a different SDABL division, update the URL in `scraper.js`:

```javascript
const SCHEDULE_URL = 'https://www.leaguelineup.com/schedules.asp?url=sdabl1&divisionid=YOUR_DIVISION_ID';
```

Division IDs can be found in the dropdown on the LeagueLineup schedule page.

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript to be enabled for full functionality.

## Development

No build process or dependencies required! Just edit the files and refresh your browser.

### Local Development
1. Edit files in your favorite code editor
2. Open `index.html` in a browser
3. Make changes and refresh to see results

### Hosting
To deploy online, simply upload all files to any web host:
- GitHub Pages
- Netlify
- Vercel
- Any traditional web hosting

## Data Format Reference

### Team Object
```javascript
{
    rank: Number,           // Team's current standing (1-10)
    name: String,          // Team name
    wins: Number,          // Number of wins
    losses: Number,        // Number of losses
    ties: Number,          // Number of ties
    winPct: Number,        // Win percentage (0.000-1.000)
    runDiff: Number,       // Run differential (runsFor - runsAgainst)
    runsFor: Number,       // Total runs scored
    runsAgainst: Number,   // Total runs allowed
    games: Array           // Array of game objects
}
```

### Game Object
```javascript
{
    opponent: String,      // "vs Team" (home) or "@ Team" (away)
    score: String,         // "runs-allowed" (e.g., "21-5")
    result: String,        // "win", "loss", or "tie"
    date: String          // "Mon DD" format (e.g., "Sep 7")
}
```

## Credits

- **League**: San Diego Adult Baseball League (SDABL)
- **Division**: Fall 25 - 25A
- **Data Source**: LeagueLineup.com

## License

This is a personal project for displaying SDABL standings. All team names, scores, and league data belong to their respective owners.
