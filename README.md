# SDABL Baseball Leaderboard

A dynamic, interactive baseball standings leaderboard application for the San Diego Adult Baseball League (SDABL) 25A Division with advanced analytics, playoff tracking, and multi-season support.

## Features

### Core Features
- **Multi-Season Support** - Track multiple seasons with tab-based navigation (Spring 2025, Fall 2025, Spring 2026)
- **Live Standings Table** - Real-time team rankings with comprehensive statistics
- **Interactive Game History** - Click any team row to expand and view complete game-by-game results
- **Playoff Bracket** - Visual bracket showing playoff matchups with automatic result population
- **Upcoming Games** - Schedule of future games with win probability predictions

### Advanced Analytics
- **Playoff Probability** - Monte Carlo simulation (1,000 iterations) calculating each team's playoff chances
- **Probability History Graph** - Interactive chart showing how playoff chances evolved throughout the season
- **Win Predictions** - Game-by-game win probabilities using Pythagorean expectation
- **Remaining Schedule Analysis** - Difficulty ratings (Very Easy to Very Hard) based on opponent strength
- **Team Streaks (STRK)** - Current winning/losing streak tracker
- **Last 5 Games (L5)** - Visual indicator with colored dots for recent form
- **Playoff Clinching** - Automatic detection when teams mathematically clinch playoff spots

### UI/UX
- **Animated Gradients** - Smooth background animations and hover effects
- **Sparkle Cursor Trail** - Interactive visual effect following mouse movement
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **No Dependencies** - Pure HTML/CSS/JavaScript with no external frameworks

## Quick Start

1. **Open the app** - Simply open `index.html` in any web browser
2. **View standings** - See current team rankings and advanced stats
3. **Switch seasons** - Click season tabs to view different seasons
4. **Explore teams** - Click any team row to see games, playoff probability, and remaining schedule
5. **View bracket** - Scroll down to see playoff bracket and upcoming games

That's it! No build process, no server, no installation required.

## File Structure

```
sdabl-leaderboard/
├── index.html          # Main HTML structure and page layout
├── styles.css          # All CSS styling and animations
├── data.js             # Multi-season team standings and game results
├── app.js              # Application logic and analytics engine
├── scraper.js          # Web scraper to fetch latest results
├── update-data.js      # Update script with validation
├── .github/
│   └── workflows/
│       └── update-standings.yml  # GitHub Actions automation
└── README.md           # This file
```

## Advanced Analytics Explained

### Playoff Probability Calculation

Uses **Monte Carlo simulation** to calculate playoff chances:

1. **Simulate 1,000 seasons** - For each simulation, play out all remaining games
2. **Game Predictions** - Each game uses Pythagorean expectation formula:
   - `Expected Win% = (Runs For^1.83) / (Runs For^1.83 + Runs Against^1.83)`
   - Blends 70% Pythagorean expectation with 30% actual win%
3. **Random Outcomes** - Determine winner based on calculated probability
4. **Playoff Counting** - Count simulations where team finishes in top 6
5. **Final Probability** - (Playoff simulations / 1,000) × 100%

**Special Cases:**
- Teams that mathematically clinch: 100%
- Teams eliminated from contention: 0%
- No remaining games: 95% if in top 6, 5% otherwise

### Probability History Graph

Shows how playoff chances evolved game-by-game:
- **Reconstruction** - For each past game, recreates league state at that moment
- **Historical Simulation** - Runs same Monte Carlo with games remaining at that point
- **Visualization** - Line chart with wins (green dots), losses (red dots), ties (gray dots)
- **50% Reference Line** - Shows the "coin flip" threshold

### Remaining Schedule Difficulty

Analyzes upcoming games to rate schedule difficulty:

**Difficulty Ratings:**
- **Very Hard**: Average win probability ≤ 35%
- **Hard**: 35-50%
- **Average**: 50-65%
- **Easy**: 65-80%
- **Very Easy**: > 80%

Each game shows individual win probability based on team strength matchup.

## Data Structure

### Multi-Season Format

```javascript
const seasonsData = {
    currentSeason: 'fall2025',  // Default season to display

    seasons: {
        spring2025: {
            id: 'spring2025',
            name: 'Spring 2025',
            division: '25A',
            divisionId: '1056065',  // LeagueLineup division ID
            status: 'completed',     // 'active' | 'completed' | 'upcoming'
            regularSeasonGames: 13,  // Regular season length
            teams: [...],            // Team objects
            upcomingGames: [...]     // Scheduled games
        },
        fall2025: {
            // Current season
        },
        spring2026: {
            // Future season
        }
    }
}
```

### Team Object

```javascript
{
    rank: 1,
    name: "Blue Mountains",
    wins: 12,
    losses: 1,
    ties: 0,
    winPct: 0.923,
    runDiff: 139,
    runsFor: 201,
    runsAgainst: 62,
    games: [
        { opponent: "vs Happy Sox", score: "8-3", result: "win", date: "Jun 22" }
    ],
    playoffGames: [  // Optional: only for playoff teams in completed seasons
        { opponent: "vs Happy Sox", score: "20-5", result: "win", date: "Jul 27", round: "Championship" }
    ]
}
```

### Upcoming Game Object

```javascript
{
    date: "Nov 2",
    day: "Sun",
    time: "1:00 pm",
    visitors: "Beavers",
    home: "Lemon Grove Athletics",
    venue: "Chollas"
}
```

## Updating Data

### Method 1: Fully Automatic (GitHub Actions)

Automatically updates every Thursday at midnight Pacific Time:

- **Schedule**: Every Thursday at 8:00 AM UTC (12:00 AM PST / 1:00 AM PDT)
- **What it does**: Fetches latest results, validates data, updates data.js, and commits changes
- **Setup**: See "GitHub Actions Setup" section below
- **Manual trigger**: Can trigger updates anytime from GitHub Actions tab

### Method 2: Manual Update (Using Scraper)

Run the scraper locally to fetch the latest results:

```bash
# Update specific season (recommended)
node scraper.js fall2025

# Update current season (default)
node scraper.js

# Copy scraped data to main data file
cp data-scraped.js data.js

# Refresh index.html in your browser to see updates
```

The scraper:
- Fetches data from LeagueLineup.com using configured `divisionId`
- Parses all completed games (status "F")
- Separates regular season from playoff games based on `regularSeasonGames` setting
- Calculates statistics and generates properly formatted data.js
- Requires only Node.js (no dependencies)

### Method 3: Manual Edit

Edit `data.js` directly following the structure above.

**Important Notes:**
- Use `vs` for home games, `@` for away games
- Score format: `"runsFor-runsAgainst"` from that team's perspective (not home-away)
- Date format: `"Mon DD"` (e.g., "Sep 7", "Oct 12")
- Playoff games are tracked separately in `playoffGames` array for completed seasons

## Managing Seasons

### Adding a New Season

1. **Add season to data.js:**
```javascript
spring2026: {
    id: 'spring2026',
    name: 'Spring 2026',
    division: '25A',
    divisionId: null,  // Get from LeagueLineup URL when available
    status: 'upcoming',
    regularSeasonGames: 13,
    teams: [],
    upcomingGames: []
}
```

2. **Add tab to index.html:**
```html
<button class="season-tab" data-season="spring2026">Spring 2026</button>
```

3. **When season starts:**
   - Update `divisionId` with LeagueLineup division ID
   - Change `status` to `'active'`
   - Run scraper: `node scraper.js spring2026`

### Season Status Values

- **`upcoming`**: Season hasn't started, shows "hasn't started yet" message
- **`active`**: Current/ongoing season, updated weekly via scraper
- **`completed`**: Finished season with playoff results, kept for historical reference

### Switching Active Season

When a new season begins:
1. Change `seasonsData.currentSeason` to new season ID
2. Update previous season `status` to `'completed'`
3. Add playoff game results to completed season teams
4. Scraper will auto-update the current season weekly

## GitHub Actions Setup

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

The workflow will now run automatically every Thursday. You can also trigger it manually anytime.

### 4. Optional: Deploy to GitHub Pages

To publish your leaderboard online:

1. Go to **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Select **main** branch, **/ (root)** folder
4. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/sdabl-leaderboard/`

Every time the workflow updates data.js, GitHub Pages automatically redeploys!

## Customization

### Changing Division

To track a different SDABL division:

1. Update `divisionId` in the season object in `data.js`
2. Division IDs can be found in the LeagueLineup URL for that division

### Adjusting Analytics Parameters

In `app.js`, you can modify:

**Difficulty Thresholds:**
```javascript
// Line ~450
if (avgWinProb <= 0.350) difficultyLabel = 'Very Hard';
else if (avgWinProb <= 0.500) difficultyLabel = 'Hard';
// Adjust thresholds as desired
```

**Monte Carlo Iterations:**
```javascript
// Line ~100
const numSimulations = 1000;  // Increase for more accuracy (slower)
```

**Pythagorean Exponent:**
```javascript
// Line ~144
const exponent = 1.83;  // Baseball-specific, don't change without research
```

### Styling

Edit CSS variables and colors in `styles.css`:

```css
/* Main gradient colors */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);

/* Accent colors */
.leader-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

/* Playoff game highlighting */
.playoff-game { background: linear-gradient(90deg, rgba(255,193,7,0.1), rgba(255,152,0,0.05)); }
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript to be enabled.

## Technical Details

### Win Probability Formula

```
Pythagorean Win% = (RF^1.83) / (RF^1.83 + RA^1.83)
Expected Win% = (70% × Pythagorean) + (30% × Actual Win%)
Game Win Probability = Team Expected Win% / (Team Expected Win% + Opponent Expected Win%)
```

**No Home Field Advantage** - Recreational league with rotating venues, minimal tactical advantage

### Playoff Tracking

For completed seasons:
- Scraper automatically separates playoff games from regular season
- Based on `regularSeasonGames` setting - games beyond this count are marked as playoff games
- Playoff games tracked in separate `playoffGames` array
- Playoff bracket auto-generates from playoff game results
- Only top 6 teams qualify for playoffs (quarterfinals, semifinals, championship)

## Development

No build process or dependencies required! Just edit and refresh.

### Local Development
1. Edit files in your code editor
2. Open `index.html` in a browser
3. Make changes and refresh to see results

### Hosting
Deploy to any static host:
- GitHub Pages (recommended - free and automatic updates)
- Netlify
- Vercel
- Any traditional web hosting

## Credits

- **League**: San Diego Adult Baseball League (SDABL)
- **Division**: 25A Division
- **Data Source**: LeagueLineup.com
- **Analytics**: Pythagorean expectation, Monte Carlo simulation

## License

This is a personal project for displaying SDABL standings. All team names, scores, and league data belong to their respective owners.
