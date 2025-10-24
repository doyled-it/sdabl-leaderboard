const https = require('https');
const fs = require('fs');

/**
 * Baseball Schedule Scraper for SDABL
 * Fetches game results from leaguelineup.com and formats them for the leaderboard app
 */

// Load seasons configuration
const seasonsDataPath = './data.js';
let seasonsData = null;

try {
    let dataContent = fs.readFileSync(seasonsDataPath, 'utf8');
    // Replace 'const seasonsData' with assignment to make it accessible in VM context
    dataContent = dataContent.replace(/const seasonsData/m, 'seasonsData');

    // Execute the code in a sandboxed context to extract seasonsData
    const sandbox = { seasonsData: null };
    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(dataContent, sandbox);
    if (sandbox.seasonsData) {
        seasonsData = sandbox.seasonsData;
    }
} catch (error) {
    console.log('⚠️  Could not load seasons data, using default URL');
    console.log('Error:', error.message);
}

/**
 * Get division URL for a season
 */
function getSeasonUrl(seasonId) {
    if (seasonsData && seasonsData.seasons[seasonId]) {
        const season = seasonsData.seasons[seasonId];
        if (season.divisionId) {
            return `https://www.leaguelineup.com/schedules.asp?url=sdabl1&divisionid=${season.divisionId}`;
        }
    }
    // Default fallback
    return 'https://www.leaguelineup.com/schedules.asp?url=sdabl1&divisionid=1061524';
}

/**
 * Fetch HTML from URL using Node's built-in https module
 */
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Simple HTML parser - extracts table rows from the schedule table
 */
function parseScheduleTable(html) {
    const games = [];

    // Find all table rows with game data
    const rowPattern = /<tr[^>]*onmouseover="this\.bgColor = '#C0C0C0'"[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows = html.match(rowPattern) || [];

    for (const row of rows) {
        const game = parseGameRow(row);
        if (game) {
            games.push(game);
        }
    }

    return games;
}

/**
 * Parse individual game row
 */
function parseGameRow(rowHTML) {
    // Extract table cells
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let match;

    while ((match = tdPattern.exec(rowHTML)) !== null) {
        cells.push(match[1].trim());
    }

    if (cells.length < 9) return null;

    // Parse data from cells
    const day = stripHTML(cells[1]);
    const dateRaw = stripHTML(cells[2]);
    const time = stripHTML(cells[3]);
    const status = stripHTML(cells[5]);
    const scoreCell = cells[6];
    const visitors = stripHTML(cells[7]).replace(/&nbsp;/g, '').trim();
    const home = stripHTML(cells[8]).replace(/&nbsp;/g, '').trim();
    const venue = stripHTML(cells[9]);

    // Skip BYE weeks
    if (visitors === 'BYE' || home === 'BYE') {
        return null;
    }

    // Parse date (format: "9/7/2025" -> "Sep 7")
    const date = formatDate(dateRaw);

    // Handle completed games (status "F")
    if (status === 'F') {
        // Extract score from link
        const scoreMatch = scoreCell.match(/>([\d]+-[\d]+)</);
        const score = scoreMatch ? scoreMatch[1] : null;

        if (!score) return null;

        return {
            date,
            dateRaw,
            day,
            time,
            status: 'completed',
            score,
            visitors,
            home,
            venue
        };
    }

    // Handle upcoming games (status "TBP")
    if (status === 'TBP') {
        return {
            date,
            dateRaw,
            day,
            time,
            status: 'upcoming',
            visitors,
            home,
            venue
        };
    }

    // Skip other statuses (PPD, CAN, etc.)
    return null;
}

/**
 * Strip HTML tags from string
 */
function stripHTML(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

/**
 * Format date from "9/7/2025" to "Sep 7"
 */
function formatDate(dateStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;

    const month = months[parseInt(parts[0]) - 1];
    const day = parseInt(parts[1]);

    return `${month} ${day}`;
}

/**
 * Process games and group by team with statistics
 */
function processGames(games) {
    // Separate completed and upcoming games
    const completedGames = games.filter(g => g.status === 'completed');
    const upcomingGames = games.filter(g => g.status === 'upcoming');

    const teams = {};

    // Initialize teams
    for (const game of completedGames) {
        if (!teams[game.visitors]) {
            teams[game.visitors] = {
                name: game.visitors,
                wins: 0,
                losses: 0,
                ties: 0,
                runsFor: 0,
                runsAgainst: 0,
                games: []
            };
        }
        if (!teams[game.home]) {
            teams[game.home] = {
                name: game.home,
                wins: 0,
                losses: 0,
                ties: 0,
                runsFor: 0,
                runsAgainst: 0,
                games: []
            };
        }
    }

    // Process each completed game for standings
    for (const game of completedGames) {
        const [visitorScore, homeScore] = game.score.split('-').map(Number);

        // Add game to visitors' record
        let visitorResult, homeResult;
        if (visitorScore > homeScore) {
            visitorResult = 'win';
            homeResult = 'loss';
            teams[game.visitors].wins++;
            teams[game.home].losses++;
        } else if (homeScore > visitorScore) {
            visitorResult = 'loss';
            homeResult = 'win';
            teams[game.visitors].losses++;
            teams[game.home].wins++;
        } else {
            visitorResult = 'tie';
            homeResult = 'tie';
            teams[game.visitors].ties++;
            teams[game.home].ties++;
        }

        teams[game.visitors].runsFor += visitorScore;
        teams[game.visitors].runsAgainst += homeScore;
        teams[game.visitors].games.push({
            opponent: `@ ${game.home}`,
            score: game.score,
            result: visitorResult,
            date: game.date
        });

        teams[game.home].runsFor += homeScore;
        teams[game.home].runsAgainst += visitorScore;
        teams[game.home].games.push({
            opponent: `vs ${game.visitors}`,
            score: `${homeScore}-${visitorScore}`,
            result: homeResult,
            date: game.date
        });
    }

    // Calculate stats and rank
    const teamsArray = Object.values(teams).map(team => {
        const totalGames = team.wins + team.losses + team.ties;
        const winPct = totalGames > 0 ? ((team.wins + team.ties * 0.5) / totalGames) : 0;
        const runDiff = team.runsFor - team.runsAgainst;

        return {
            name: team.name,
            wins: team.wins,
            losses: team.losses,
            ties: team.ties,
            winPct: parseFloat(winPct.toFixed(3)),
            runDiff: runDiff,
            runsFor: team.runsFor,
            runsAgainst: team.runsAgainst,
            games: team.games
        };
    });

    // Sort by win percentage (descending), then by run differential (descending)
    teamsArray.sort((a, b) => {
        if (b.winPct !== a.winPct) return b.winPct - a.winPct;
        return b.runDiff - a.runDiff;
    });

    // Add rank
    teamsArray.forEach((team, index) => {
        team.rank = index + 1;
    });

    // Format upcoming games for output
    const formattedUpcomingGames = upcomingGames.map(game => ({
        date: game.date,
        day: game.day,
        time: game.time,
        visitors: game.visitors,
        home: game.home,
        venue: game.venue
    }));

    return {
        teams: teamsArray,
        upcomingGames: formattedUpcomingGames
    };
}

/**
 * Generate teams array JavaScript code
 */
function generateTeamsArray(teams, indent = '                ') {
    let output = '';

    teams.forEach((team, index) => {
        output += indent + '{\n';
        output += indent + `    rank: ${team.rank}, name: "${team.name}", `;
        output += `wins: ${team.wins}, losses: ${team.losses}, ties: ${team.ties}, `;
        output += `winPct: ${team.winPct.toFixed(3)}, runDiff: ${team.runDiff}, `;
        output += `runsFor: ${team.runsFor}, runsAgainst: ${team.runsAgainst},\n`;
        output += indent + '    games: [\n';

        team.games.forEach((game, gIndex) => {
            output += indent + `        { opponent: "${game.opponent}", score: "${game.score}", result: "${game.result}", date: "${game.date}" }`;
            if (gIndex < team.games.length - 1) output += ',';
            output += '\n';
        });

        output += indent + '    ]\n';
        output += indent + '}';
        if (index < teams.length - 1) output += ',';
        output += '\n';
    });

    return output;
}

/**
 * Generate full data.js file content with multi-season structure
 */
function generateDataJS(teams, upcomingGames, targetSeasonId) {
    // If we don't have seasonsData loaded, fall back to simple format
    if (!seasonsData) {
        let output = 'const teamsData = [\n';
        output += generateTeamsArray(teams, '    ');
        output += '];\n';
        return output;
    }

    // Update the specific season's teams and upcoming games
    const updatedSeasons = JSON.parse(JSON.stringify(seasonsData.seasons)); // Deep clone
    if (updatedSeasons[targetSeasonId]) {
        updatedSeasons[targetSeasonId].teams = teams;
        updatedSeasons[targetSeasonId].upcomingGames = upcomingGames;
    }

    // Generate full seasonsData structure
    let output = '// SDABL Standings Data\n';
    output += '// Multi-season support\n\n';
    output += 'const seasonsData = {\n';
    output += `    currentSeason: '${seasonsData.currentSeason}',\n\n`;
    output += '    seasons: {\n';

    const seasonKeys = Object.keys(updatedSeasons);
    seasonKeys.forEach((seasonKey, sIndex) => {
        const season = updatedSeasons[seasonKey];
        output += `        ${seasonKey}: {\n`;
        output += `            id: '${season.id}',\n`;
        output += `            name: '${season.name}',\n`;
        output += `            division: '${season.division}',\n`;
        output += `            divisionId: ${season.divisionId ? `'${season.divisionId}'` : 'null'},\n`;
        output += `            status: '${season.status}',\n`;
        output += '            teams: [\n';

        if (season.teams && season.teams.length > 0) {
            output += generateTeamsArray(season.teams, '                ');
        }

        output += '            ],\n';
        output += '            upcomingGames: [\n';

        if (season.upcomingGames && season.upcomingGames.length > 0) {
            season.upcomingGames.forEach((game, gIndex) => {
                output += '                {\n';
                output += `                    date: "${game.date}",\n`;
                output += `                    day: "${game.day}",\n`;
                output += `                    time: "${game.time}",\n`;
                output += `                    visitors: "${game.visitors}",\n`;
                output += `                    home: "${game.home}",\n`;
                output += `                    venue: "${game.venue}"\n`;
                output += '                }';
                if (gIndex < season.upcomingGames.length - 1) output += ',';
                output += '\n';
            });
        }

        output += '            ]\n';
        output += '        }';
        if (sIndex < seasonKeys.length - 1) output += ',';
        output += '\n';

        // Add blank line between seasons for readability
        if (sIndex < seasonKeys.length - 1) output += '\n';
    });

    output += '    }\n';
    output += '};\n';

    return output;
}

/**
 * Main scraper function
 * @param {string} seasonId - Optional season ID to scrape (defaults to current season)
 */
async function scrape(seasonId = null) {
    // Determine which season to scrape
    const targetSeasonId = seasonId || (seasonsData ? seasonsData.currentSeason : 'fall2025');
    const url = getSeasonUrl(targetSeasonId);

    console.log(`Fetching schedule for season: ${targetSeasonId}`);
    console.log('URL:', url);

    try {
        const html = await fetchHTML(url);
        console.log('✓ HTML fetched successfully');

        const games = parseScheduleTable(html);
        console.log(`✓ Parsed ${games.length} total games`);

        const result = processGames(games);
        const { teams, upcomingGames } = result;
        console.log(`✓ Processed ${teams.length} teams`);
        console.log(`✓ Found ${upcomingGames.length} upcoming games`);

        // Display standings
        console.log('\n=== STANDINGS ===');
        teams.forEach(team => {
            console.log(`${team.rank}. ${team.name.padEnd(25)} ${team.wins}-${team.losses}-${team.ties} (${(team.winPct * 100).toFixed(1)}%) RD: ${team.runDiff > 0 ? '+' : ''}${team.runDiff}`);
        });

        // Generate output
        const dataJS = generateDataJS(teams, upcomingGames, targetSeasonId);

        // Save to file
        fs.writeFileSync('data-scraped.js', dataJS);
        console.log('\n✓ Data saved to data-scraped.js');
        if (seasonsData) {
            console.log(`✓ Full seasonsData structure preserved (updated ${targetSeasonId})`);
        }

        // Also save raw JSON for inspection
        fs.writeFileSync('data-scraped.json', JSON.stringify(result, null, 2));
        console.log('✓ JSON data saved to data-scraped.json');

        return result;

    } catch (error) {
        console.error('Error scraping:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    // Check for command line argument
    const seasonArg = process.argv[2];
    scrape(seasonArg).catch(console.error);
}

module.exports = { scrape, parseScheduleTable, processGames };
