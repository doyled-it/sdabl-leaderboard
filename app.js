let expandedTeam = null;
let currentSeasonId = seasonsData.currentSeason;

function getCurrentTeamsData() {
    return seasonsData.seasons[currentSeasonId].teams;
}

function getCurrentSeason() {
    return seasonsData.seasons[currentSeasonId];
}

function hasClinchedPlayoff(team, allTeams) {
    const season = getCurrentSeason();
    const playoffSpots = 6;

    // For completed seasons, top 6 teams automatically clinched
    if (season.status === 'completed') {
        return team.rank <= playoffSpots;
    }

    const totalSeasonGames = season.regularSeasonGames || 10;

    // Calculate games remaining for this team
    const teamGamesPlayed = team.wins + team.losses + team.ties;
    const teamGamesRemaining = totalSeasonGames - teamGamesPlayed;

    // Team's minimum possible wins (if they lose all remaining games)
    const teamMinWins = team.wins;

    // Find teams below playoff line
    const teamsOutsidePlayoffs = allTeams.filter(t => t.rank > playoffSpots);

    // Check if any team outside playoffs can catch this team
    for (const outsideTeam of teamsOutsidePlayoffs) {
        const outsideGamesPlayed = outsideTeam.wins + outsideTeam.losses + outsideTeam.ties;
        const outsideGamesRemaining = totalSeasonGames - outsideGamesPlayed;

        // Maximum possible wins for outside team (if they win all remaining games)
        const outsideMaxWins = outsideTeam.wins + outsideGamesRemaining;

        // If outside team can match or exceed this team's minimum wins, not clinched
        if (outsideMaxWins >= teamMinWins) {
            return false;
        }
    }

    // If no team outside playoffs can catch this team, they've clinched
    return true;
}

function getStreak(team) {
    if (!team.games || team.games.length === 0) return '-';

    const games = [...team.games].reverse(); // Most recent first
    const currentResult = games[0].result;
    let streakCount = 0;

    for (const game of games) {
        if (game.result === currentResult) {
            streakCount++;
        } else {
            break;
        }
    }

    const streakLetter = currentResult === 'win' ? 'W' : currentResult === 'loss' ? 'L' : 'T';
    return `${streakLetter}${streakCount}`;
}

function getLast5Games(team) {
    if (!team.games || team.games.length === 0) return '';

    const games = [...team.games].reverse().slice(0, 5); // Most recent 5
    return games.map(game => {
        if (game.result === 'win') return '<span class="form-dot win">●</span>';
        if (game.result === 'loss') return '<span class="form-dot loss">●</span>';
        return '<span class="form-dot tie">●</span>';
    }).join('');
}

function parseDateToComparable(dateStr, year = new Date().getFullYear()) {
    // Parse "Sep 7" or "Oct 19" format into a comparable Date
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    const parts = dateStr.split(' ');
    if (parts.length === 2) {
        const month = months[parts[0]];
        const day = parseInt(parts[1]);
        return new Date(year, month, day);
    }
    return null;
}

function runMonteCarloSimulation(targetTeam, allTeams, upcomingGames, season) {
    const totalSeasonGames = season.regularSeasonGames || 10;
    const playoffSpots = 6;
    const numSimulations = 1000;

    // Parse all remaining games
    const remainingMatchups = [];

    upcomingGames.forEach(game => {
        const homeTeam = allTeams.find(t => t.name === game.home);
        const awayTeam = allTeams.find(t => t.name === game.visitors);

        if (homeTeam && awayTeam) {
            remainingMatchups.push({ homeTeam, awayTeam, game });
        }
    });

    // If no games remaining, fall back to simple calculation
    if (remainingMatchups.length === 0) {
        // No games to simulate - return based on current position
        if (targetTeam.rank <= playoffSpots) return 95;
        return 5;
    }

    let playoffCount = 0;

    for (let sim = 0; sim < numSimulations; sim++) {
        // Create simulation standings with current records
        const simStandings = allTeams.map(t => ({
            name: t.name,
            wins: t.wins,
            losses: t.losses,
            ties: t.ties,
            winPct: t.winPct
        }));

        // Simulate each remaining game
        remainingMatchups.forEach(matchup => {
            const { homeTeam, awayTeam } = matchup;

            // Get runs for/against from original team data
            const homeRF = homeTeam.runsFor || 1;
            const homeRA = homeTeam.runsAgainst || 1;
            const awayRF = awayTeam.runsFor || 1;
            const awayRA = awayTeam.runsAgainst || 1;

            // Pythagorean win% formula for baseball (exponent ~1.83)
            const exponent = 1.83;
            const homePythWinPct = Math.pow(homeRF, exponent) / (Math.pow(homeRF, exponent) + Math.pow(homeRA, exponent));
            const awayPythWinPct = Math.pow(awayRF, exponent) / (Math.pow(awayRF, exponent) + Math.pow(awayRA, exponent));

            // Blend Pythagorean win% with actual win% (70% Pyth, 30% actual)
            const homeExpWinPct = (homePythWinPct * 0.7) + (homeTeam.winPct * 0.3);
            const awayExpWinPct = (awayPythWinPct * 0.7) + (awayTeam.winPct * 0.3);

            // Calculate win probability (no home field advantage for recreational league)
            const homeWinProb = homeExpWinPct / (homeExpWinPct + awayExpWinPct);

            const rand = Math.random();
            const simHome = simStandings.find(t => t.name === homeTeam.name);
            const simAway = simStandings.find(t => t.name === awayTeam.name);

            if (rand < homeWinProb) {
                simHome.wins++;
                simAway.losses++;
            } else {
                simAway.wins++;
                simHome.losses++;
            }
        });

        // Recalculate win percentages and sort
        simStandings.forEach(t => {
            const totalGames = t.wins + t.losses + t.ties;
            t.winPct = totalGames > 0 ? (t.wins + t.ties * 0.5) / totalGames : 0;
        });

        simStandings.sort((a, b) => {
            if (b.winPct !== a.winPct) return b.winPct - a.winPct;
            // Tiebreaker: use current run differential (from original data)
            const aTeam = allTeams.find(t => t.name === a.name);
            const bTeam = allTeams.find(t => t.name === b.name);
            return (bTeam.runDiff || 0) - (aTeam.runDiff || 0);
        });

        // Check if target team made playoffs
        const teamFinish = simStandings.findIndex(t => t.name === targetTeam.name);
        if (teamFinish < playoffSpots) {
            playoffCount++;
        }
    }

    return Math.round((playoffCount / numSimulations) * 100);
}

function calculatePlayoffProbabilityHistory(team, allTeams) {
    const history = [];
    const season = getCurrentSeason();
    const currentYear = new Date().getFullYear();

    // Get all completed and upcoming games from the season data
    const allScheduledGames = [];

    // Add completed games from team data
    allTeams.forEach(t => {
        t.games.forEach(g => {
            const isHome = g.opponent.startsWith('vs ');
            const opponentName = g.opponent.replace(/^(vs |@ )/, '');

            allScheduledGames.push({
                date: g.date,
                home: isHome ? t.name : opponentName,
                visitors: isHome ? opponentName : t.name,
                completed: true
            });
        });
    });

    // Add upcoming games
    (season.upcomingGames || []).forEach(g => {
        allScheduledGames.push({
            date: g.date,
            home: g.home,
            visitors: g.visitors,
            completed: false
        });
    });

    // For each game this team played, calculate what their playoff % was at that point
    team.games.forEach((game, gameIndex) => {
        const gameDate = parseDateToComparable(game.date, currentYear);

        // Reconstruct all teams' records at this point in the season (after this game)
        // IMPORTANT: Use DATE to determine which games to include, not index!
        const teamsAtThisPoint = allTeams.map(t => {
            // Include all games played by this team up to and including the current date
            const gamesUpToNow = t.games.filter(g => {
                const gDate = parseDateToComparable(g.date, currentYear);
                return gDate && gameDate && gDate <= gameDate;
            });

            let wins = 0, losses = 0, ties = 0, runsFor = 0, runsAgainst = 0;

            gamesUpToNow.forEach(g => {
                if (g.result === 'win') wins++;
                else if (g.result === 'loss') losses++;
                else ties++;

                // Score format is ALWAYS "ThisTeam-Opponent", regardless of home/away
                const scoreParts = g.score.split('-');
                if (scoreParts.length === 2) {
                    const teamScore = parseInt(scoreParts[0]);
                    const opponentScore = parseInt(scoreParts[1]);
                    runsFor += teamScore;
                    runsAgainst += opponentScore;
                }
            });

            const totalGames = wins + losses + ties;
            const winPct = totalGames > 0 ? (wins + ties * 0.5) / totalGames : 0;

            return {
                name: t.name,
                wins,
                losses,
                ties,
                winPct,
                runsFor: runsFor || 1,
                runsAgainst: runsAgainst || 1,
                runDiff: runsFor - runsAgainst,
                rank: 0
            };
        });

        // Sort teams by win percentage to get rankings at this point
        teamsAtThisPoint.sort((a, b) => {
            if (b.winPct !== a.winPct) return b.winPct - a.winPct;
            return b.runDiff - a.runDiff;
        });

        teamsAtThisPoint.forEach((t, idx) => {
            t.rank = idx + 1;
        });

        // Find this team in the reconstructed standings
        const teamAtThisPoint = teamsAtThisPoint.find(t => t.name === team.name);

        // Get games that were still upcoming at this point in time
        const upcomingAtThisPoint = allScheduledGames.filter(g => {
            const scheduledGameDate = parseDateToComparable(g.date, currentYear);
            return scheduledGameDate && gameDate && scheduledGameDate > gameDate;
        }).map(g => ({ date: g.date, home: g.home, visitors: g.visitors }));

        // Calculate playoff probability using the SAME Monte Carlo logic
        const hadClinched = hasClinchedPlayoff(teamAtThisPoint, teamsAtThisPoint);

        let probability;
        if (hadClinched) {
            probability = 100;
        } else {
            const gamesPlayed = teamAtThisPoint.wins + teamAtThisPoint.losses + teamAtThisPoint.ties;
            const gamesRemaining = (season.regularSeasonGames || 10) - gamesPlayed;
            const maxWins = teamAtThisPoint.wins + gamesRemaining;
            const sixthPlace = teamsAtThisPoint[5];

            if (sixthPlace && maxWins < sixthPlace.wins) {
                probability = 0;
            } else {
                // Run the same Monte Carlo simulation with the games that were upcoming at that time
                probability = runMonteCarloSimulation(teamAtThisPoint, teamsAtThisPoint, upcomingAtThisPoint, season);
            }
        }

        history.push({
            gameNumber: gameIndex + 1,
            date: game.date,
            probability: probability,
            result: game.result,
            opponent: game.opponent,
            score: game.score
        });
    });

    return history;
}

function calculatePlayoffProbability(team, allTeams) {
    const season = getCurrentSeason();
    const totalSeasonGames = season.regularSeasonGames || 10;
    const playoffSpots = 6;

    // If clinched, 100%
    if (hasClinchedPlayoff(team, allTeams)) {
        return 100;
    }

    const teamGamesPlayed = team.wins + team.losses + team.ties;
    const teamGamesRemaining = totalSeasonGames - teamGamesPlayed;

    // If mathematically eliminated, 0%
    const teamMaxWins = team.wins + teamGamesRemaining;
    const sixthPlaceTeam = allTeams[playoffSpots - 1];
    if (sixthPlaceTeam && teamMaxWins < sixthPlaceTeam.wins) {
        return 0;
    }

    // Filter out past games
    const today = new Date();
    const currentYear = new Date().getFullYear();

    const upcomingGames = season.upcomingGames || [];
    const futureGames = upcomingGames.filter(game => {
        const gameDate = new Date(`${game.date}, ${currentYear}`);
        const dayAfterGame = new Date(gameDate);
        dayAfterGame.setDate(dayAfterGame.getDate() + 1);  // Add buffer for timezone
        return dayAfterGame >= today;
    });

    // Use the same Monte Carlo simulation logic
    return runMonteCarloSimulation(team, allTeams, futureGames, season);
}

function getRemainingSchedule(team, allTeams) {
    const season = getCurrentSeason();
    const totalSeasonGames = season.regularSeasonGames || 10;
    const teamGamesPlayed = team.wins + team.losses + team.ties;

    if (teamGamesPlayed >= totalSeasonGames) {
        return { games: [], difficulty: 0, difficultyLabel: 'Season Complete' };
    }

    // Filter to only future games (same logic as playoff probability calculation)
    const today = new Date();
    const currentYear = new Date().getFullYear();

    const upcomingGames = season.upcomingGames || [];
    const futureGames = upcomingGames.filter(game => {
        const gameDate = new Date(`${game.date}, ${currentYear}`);
        const dayAfterGame = new Date(gameDate);
        dayAfterGame.setDate(dayAfterGame.getDate() + 1);  // Add buffer for timezone
        return dayAfterGame >= today;
    });

    const remainingGames = futureGames.filter(game =>
        game.home === team.name || game.visitors === team.name
    );

    if (remainingGames.length === 0) {
        return { games: [], difficulty: 0, difficultyLabel: 'No Games Scheduled' };
    }

    // Calculate difficulty based on opponents' win percentage
    const opponents = remainingGames.map(game => {
        const opponentName = game.home === team.name ? game.visitors : game.home;
        const opponent = allTeams.find(t => t.name === opponentName);
        const isHome = game.home === team.name;

        // Calculate win probability for this specific game using Pythagorean expectation
        let winProbability = 0.500;
        if (opponent) {
            const teamRF = team.runsFor || 1;
            const teamRA = team.runsAgainst || 1;
            const oppRF = opponent.runsFor || 1;
            const oppRA = opponent.runsAgainst || 1;

            // Pythagorean win%
            const exponent = 1.83;
            const teamPythWinPct = Math.pow(teamRF, exponent) / (Math.pow(teamRF, exponent) + Math.pow(teamRA, exponent));
            const oppPythWinPct = Math.pow(oppRF, exponent) / (Math.pow(oppRF, exponent) + Math.pow(oppRA, exponent));

            // Blend Pythagorean win% with actual win% (70% Pyth, 30% actual)
            const teamExpWinPct = (teamPythWinPct * 0.7) + (team.winPct * 0.3);
            const oppExpWinPct = (oppPythWinPct * 0.7) + (opponent.winPct * 0.3);

            // Calculate win probability (no home field advantage for recreational league)
            winProbability = teamExpWinPct / (teamExpWinPct + oppExpWinPct);
        }

        return {
            name: opponentName,
            game: game,
            winPct: opponent ? opponent.winPct : 0.500,
            winProbability: winProbability,
            rank: opponent ? opponent.rank : null
        };
    });

    // Calculate average win probability (lower = harder schedule)
    const avgWinProb = opponents.reduce((sum, opp) => sum + opp.winProbability, 0) / opponents.length;

    let difficultyLabel = '';
    if (avgWinProb <= 0.350) difficultyLabel = 'Very Hard';
    else if (avgWinProb <= 0.500) difficultyLabel = 'Hard';
    else if (avgWinProb <= 0.650) difficultyLabel = 'Average';
    else if (avgWinProb <= 0.800) difficultyLabel = 'Easy';
    else difficultyLabel = 'Very Easy';

    return {
        games: opponents,
        difficulty: avgWinProb,
        difficultyLabel: difficultyLabel
    };
}

function createTeamRow(team, index) {
    const teamsData = getCurrentTeamsData();
    const hasClinched = hasClinchedPlayoff(team, teamsData);

    const row = document.createElement('tr');
    row.className = hasClinched ? 'clinched' : '';
    row.style.animationDelay = `${index * 0.1}s`;
    row.dataset.teamName = team.name;
    row.addEventListener('click', () => toggleTeamDetails(team, row));

    const runDiffClass = team.runDiff > 0 ? 'positive' : team.runDiff < 0 ? 'negative' : '';
    const runDiffSymbol = team.runDiff > 0 ? '+' : '';

    const firstPlaceWinPct = teamsData[0].winPct;
    const totalGames = team.wins + team.losses + team.ties;
    const gamesBehind = team.rank === 1 ? '-' :
        ((firstPlaceWinPct - team.winPct) * totalGames / 2).toFixed(1);

    const clinchedBadge = hasClinched ? ' <span class="clinched-badge">✓ CLINCHED</span>' : '';
    const streak = getStreak(team);
    const last5 = getLast5Games(team);
    const playoffProb = calculatePlayoffProbability(team, teamsData);
    const probClass = playoffProb >= 75 ? 'high-prob' : playoffProb >= 25 ? 'med-prob' : 'low-prob';

    row.innerHTML = `
        <td class="rank-cell ${hasClinched ? 'clinched' : ''}">${team.rank}</td>
        <td class="team-name-cell ${hasClinched ? 'clinched' : ''}">${team.name}${clinchedBadge}</td>
        <td class="stat-cell">${team.wins}</td>
        <td class="stat-cell">${team.losses}</td>
        <td class="stat-cell">${team.ties}</td>
        <td class="stat-cell pct-cell">${team.winPct.toFixed(3)}</td>
        <td class="stat-cell games-behind">${gamesBehind}</td>
        <td class="stat-cell streak-cell">${streak}</td>
        <td class="stat-cell form-cell">${last5}</td>
        <td class="stat-cell playoff-prob ${probClass}">${playoffProb}%</td>
        <td class="stat-cell">${team.runsFor}</td>
        <td class="stat-cell">${team.runsAgainst}</td>
        <td class="stat-cell ${runDiffClass}">${runDiffSymbol}${team.runDiff}</td>
    `;

    return row;
}

function createPlayoffProbabilityChart(history) {
    if (history.length === 0) return '<div class="no-data">No game history available</div>';

    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scale
    const maxGame = history.length;
    const xScale = (gameNum) => padding.left + (gameNum - 1) * (chartWidth / (maxGame - 1));
    const yScale = (prob) => padding.top + chartHeight - (prob / 100) * chartHeight;

    // Create SVG path for the line
    const pathData = history.map((point, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${xScale(point.gameNumber)} ${yScale(point.probability)}`
    ).join(' ');

    // Create points for each game
    const pointsHtml = history.map((point, idx) => {
        const cx = xScale(point.gameNumber);
        const cy = yScale(point.probability);
        const colorClass = point.result === 'win' ? 'win' : point.result === 'loss' ? 'loss' : 'tie';

        return `
            <circle cx="${cx}" cy="${cy}" r="4" class="chart-point ${colorClass}"
                    data-game="${point.gameNumber}"
                    data-opponent="${point.opponent}"
                    data-score="${point.score}"
                    data-prob="${point.probability}">
                <title>Game ${point.gameNumber}: ${point.opponent} (${point.score}) - ${point.probability}% playoff chance</title>
            </circle>
        `;
    }).join('');

    return `
        <svg class="playoff-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${yScale(0)}" x2="${width - padding.right}" y2="${yScale(0)}" class="grid-line" />
            <line x1="${padding.left}" y1="${yScale(25)}" x2="${width - padding.right}" y2="${yScale(25)}" class="grid-line" />
            <line x1="${padding.left}" y1="${yScale(50)}" x2="${width - padding.right}" y2="${yScale(50)}" class="grid-line playoff-line" />
            <line x1="${padding.left}" y1="${yScale(75)}" x2="${width - padding.right}" y2="${yScale(75)}" class="grid-line" />
            <line x1="${padding.left}" y1="${yScale(100)}" x2="${width - padding.right}" y2="${yScale(100)}" class="grid-line" />

            <!-- Y-axis labels -->
            <text x="${padding.left - 10}" y="${yScale(0)}" class="axis-label" text-anchor="end" alignment-baseline="middle">0%</text>
            <text x="${padding.left - 10}" y="${yScale(50)}" class="axis-label" text-anchor="end" alignment-baseline="middle">50%</text>
            <text x="${padding.left - 10}" y="${yScale(100)}" class="axis-label" text-anchor="end" alignment-baseline="middle">100%</text>

            <!-- X-axis labels -->
            <text x="${padding.left}" y="${height - 10}" class="axis-label" text-anchor="middle">Game 1</text>
            <text x="${width - padding.right}" y="${height - 10}" class="axis-label" text-anchor="middle">Game ${maxGame}</text>

            <!-- The line -->
            <path d="${pathData}" class="playoff-chart-line" fill="none" stroke="#FFC107" stroke-width="2" />

            <!-- Points -->
            ${pointsHtml}
        </svg>
    `;
}

function createTeamDetails(team) {
    const detailsRow = document.createElement('tr');
    detailsRow.className = 'team-details';
    detailsRow.dataset.teamName = team.name;

    const gamesHtml = team.games.map(game => `
        <div class="game-item ${game.result}">
            <div class="game-info">
                <div class="game-matchup">${game.opponent}</div>
                <div class="game-date">${game.date}</div>
            </div>
            <div class="game-score ${game.result}">${game.score}</div>
        </div>
    `).join('');

    // Playoff games section
    const playoffGamesHtml = (team.playoffGames && team.playoffGames.length > 0) ? team.playoffGames.map(game => `
        <div class="game-item ${game.result} playoff-game">
            <div class="game-info">
                <div class="game-matchup">${game.opponent}</div>
                <div class="game-date">${game.date} • ${game.round}</div>
            </div>
            <div class="game-score ${game.result}">${game.score}</div>
        </div>
    `).join('') : '';

    // Calculate playoff probability history
    const allTeams = getCurrentTeamsData();
    const playoffHistory = calculatePlayoffProbabilityHistory(team, allTeams);
    const chartHtml = createPlayoffProbabilityChart(playoffHistory);

    const remaining = getRemainingSchedule(team, allTeams);
    // Difficulty class based on average win probability (lower = harder)
    const difficultyClass = remaining.difficulty <= 0.350 ? 'very-hard' :
                           remaining.difficulty <= 0.500 ? 'hard' :
                           remaining.difficulty <= 0.650 ? 'average' :
                           remaining.difficulty <= 0.800 ? 'easy' : 'very-easy';

    const remainingHtml = remaining.games.length > 0 ? remaining.games.map(opp => {
        const location = opp.game.home === team.name ? 'vs' : '@';
        const winProb = opp.winProbability;

        // Difficulty class based on team's win probability (low % = hard, high % = easy)
        const oppDiffClass = winProb <= 0.300 ? 'very-hard' :
                            winProb <= 0.450 ? 'hard' :
                            winProb <= 0.550 ? 'average' :
                            winProb <= 0.700 ? 'easy' : 'very-easy';
        return `
            <div class="remaining-game-item ${oppDiffClass}">
                <div class="remaining-game-info">
                    <div class="remaining-opponent">${location} ${opp.name}</div>
                    <div class="remaining-date">${opp.game.day}, ${opp.game.date} • ${opp.game.time}</div>
                </div>
                <div class="opponent-record">${opp.rank ? `#${opp.rank}` : ''} (${(winProb * 100).toFixed(0)}% win)</div>
            </div>
        `;
    }).join('') : `<div class="no-games">${remaining.difficultyLabel}</div>`;

    detailsRow.innerHTML = `
        <td colspan="13">
            <div class="team-details-content">
                <div class="team-details-grid">
                    <div class="details-section">
                        <div class="games-header">
                            <span>📊</span>
                            Regular Season (${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''})
                        </div>
                        <div class="games-list">
                            ${gamesHtml}
                        </div>
                    </div>
                    ${playoffGamesHtml ? `
                    <div class="details-section">
                        <div class="games-header playoff-header">
                            <span>🏆</span>
                            Playoffs
                        </div>
                        <div class="games-list">
                            ${playoffGamesHtml}
                        </div>
                    </div>
                    ` : `
                    <div class="details-section">
                        <div class="games-header">
                            <span>📅</span>
                            Remaining Schedule
                            ${remaining.games.length > 0 ? `<span class="difficulty-badge ${difficultyClass}">${remaining.difficultyLabel}</span>` : ''}
                        </div>
                        <div class="remaining-games-list">
                            ${remainingHtml}
                        </div>
                    </div>
                    `}
                    <div class="details-section full-width">
                        <div class="games-header">
                            <span>📈</span>
                            Playoff Probability Over Season
                        </div>
                        <div class="chart-container">
                            ${chartHtml}
                        </div>
                    </div>
                </div>
            </div>
        </td>
    `;

    return detailsRow;
}

function toggleTeamDetails(team, clickedRow) {
    if (expandedTeam && expandedTeam !== team.name) {
        const existingDetails = document.querySelector(`.team-details[data-team-name="${expandedTeam}"]`);
        if (existingDetails) {
            existingDetails.remove();
        }
    }

    const existingDetails = document.querySelector(`.team-details[data-team-name="${team.name}"]`);

    if (existingDetails) {
        existingDetails.remove();
        expandedTeam = null;
    } else {
        const detailsRow = createTeamDetails(team);
        clickedRow.parentNode.insertBefore(detailsRow, clickedRow.nextSibling);

        setTimeout(() => {
            detailsRow.classList.add('expanded');
        }, 10);

        expandedTeam = team.name;
    }
}

function updateSeasonProgress() {
    const season = getCurrentSeason();
    const progressContainer = document.getElementById('seasonProgressContainer');

    // Hide progress for upcoming seasons
    if (season.status === 'upcoming' || season.teams.length === 0) {
        progressContainer.style.display = 'none';
        return;
    }

    progressContainer.style.display = 'block';

    // Calculate games played (max games any team has played)
    const maxGamesPlayed = Math.max(...season.teams.map(team =>
        team.wins + team.losses + team.ties
    ));

    const totalSeasonGames = season.regularSeasonGames || 10;
    const progressPercentage = (maxGamesPlayed / totalSeasonGames) * 100;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;

    // Update stats text
    const progressStats = document.getElementById('progressStats');
    progressStats.textContent = `${maxGamesPlayed} / ${totalSeasonGames} Games`;
}

function buildPlayoffResults(teamsData) {
    // Build playoff results from playoffGames data
    const playoffs = {};
    const playoffTeams = teamsData.slice(0, 6);

    // Helper to find a playoff game for a team against a specific opponent
    const findPlayoffGame = (team, opponentName, round) => {
        if (!team.playoffGames) return null;
        return team.playoffGames.find(g =>
            g.opponent.includes(opponentName) &&
            (!round || (round === 'QF' && g.date.includes('Jul 13')) ||
                      (round === 'SF' && g.date.includes('Jul 20')) ||
                      (round === 'Championship' && g.date.includes('Jul 27')))
        );
    };

    // QF1: #3 vs #6
    const qf1_team3Game = findPlayoffGame(playoffTeams[2], playoffTeams[5].name, 'QF');
    if (qf1_team3Game) {
        const [score1, score2] = qf1_team3Game.score.split('-').map(Number);
        playoffs.qf1 = {
            winner: qf1_team3Game.result === 'win' ? playoffTeams[2] : playoffTeams[5],
            score1,
            score2
        };
    }

    // QF2: #4 vs #5
    const qf2_team4Game = findPlayoffGame(playoffTeams[3], playoffTeams[4].name, 'QF');
    if (qf2_team4Game) {
        const [score1, score2] = qf2_team4Game.score.split('-').map(Number);
        playoffs.qf2 = {
            winner: qf2_team4Game.result === 'win' ? playoffTeams[3] : playoffTeams[4],
            score1,
            score2
        };
    }

    // SF1: #1 vs QF2 winner
    if (playoffs.qf2) {
        const sf1_team1Game = findPlayoffGame(playoffTeams[0], playoffs.qf2.winner.name, 'SF');
        if (sf1_team1Game) {
            const [score1, score2] = sf1_team1Game.score.split('-').map(Number);
            playoffs.sf1 = {
                winner: sf1_team1Game.result === 'win' ? playoffTeams[0] : playoffs.qf2.winner,
                score1,
                score2
            };
        }
    }

    // SF2: #2 vs QF1 winner
    if (playoffs.qf1) {
        const sf2_team2Game = findPlayoffGame(playoffTeams[1], playoffs.qf1.winner.name, 'SF');
        if (sf2_team2Game) {
            const [score1, score2] = sf2_team2Game.score.split('-').map(Number);
            playoffs.sf2 = {
                winner: sf2_team2Game.result === 'win' ? playoffTeams[1] : playoffs.qf1.winner,
                score1,
                score2
            };
        }
    }

    // Championship: SF1 winner vs SF2 winner
    if (playoffs.sf1 && playoffs.sf2) {
        const champSF1Game = findPlayoffGame(playoffs.sf1.winner, playoffs.sf2.winner.name, 'Championship');
        if (champSF1Game) {
            const [score1, score2] = champSF1Game.score.split('-').map(Number);
            playoffs.championship = {
                winner: champSF1Game.result === 'win' ? playoffs.sf1.winner : playoffs.sf2.winner,
                score1,
                score2
            };
        }
    }

    return playoffs;
}

function populatePlayoffBracket() {
    const season = getCurrentSeason();
    const bracketContainer = document.getElementById('playoffBracketContainer');
    const bracket = document.getElementById('playoffBracket');

    // Hide bracket for upcoming seasons or if less than 6 teams
    if (season.status === 'upcoming' || season.teams.length < 6) {
        bracketContainer.style.display = 'none';
        return;
    }

    bracketContainer.style.display = 'block';

    const teamsData = getCurrentTeamsData();
    const playoffTeams = teamsData.slice(0, 6); // Top 6 teams

    // Get playoff data - build from playoffGames if available, otherwise use manual playoffs object
    const playoffs = season.playoffs || buildPlayoffResults(teamsData);

    bracket.innerHTML = `
        <div class="bracket-column">
            <div class="round-header">Quarterfinals</div>
            <div class="bracket-games">
                <div class="matchup">
                    ${createMatchupHTML(playoffTeams[2], playoffTeams[5], playoffs.qf1)}
                    <div class="matchup-status">${playoffs.qf1 ? '' : 'To Be Played'}</div>
                </div>
                <div class="bracket-spacer"></div>
                <div class="matchup">
                    ${createMatchupHTML(playoffTeams[3], playoffTeams[4], playoffs.qf2)}
                    <div class="matchup-status">${playoffs.qf2 ? '' : 'To Be Played'}</div>
                </div>
            </div>
        </div>

        <div class="bracket-column">
            <div class="round-header">Semifinals</div>
            <div class="bracket-games">
                <div class="matchup ${!playoffs.qf1 ? 'bye' : ''}">
                    ${playoffs.qf1 ? createMatchupHTML(playoffTeams[0], playoffs.qf1.winner, playoffs.sf1) : createByeHTML(playoffTeams[0])}
                    ${playoffs.qf1 ? `<div class="matchup-status">${playoffs.sf1 ? '' : 'To Be Played'}</div>` : ''}
                </div>
                <div class="bracket-spacer"></div>
                <div class="matchup ${!playoffs.qf2 ? 'bye' : ''}">
                    ${playoffs.qf2 ? createMatchupHTML(playoffTeams[1], playoffs.qf2.winner, playoffs.sf2) : createByeHTML(playoffTeams[1])}
                    ${playoffs.qf2 ? `<div class="matchup-status">${playoffs.sf2 ? '' : 'To Be Played'}</div>` : ''}
                </div>
            </div>
        </div>

        <div class="bracket-column">
            <div class="round-header">Championship</div>
            <div class="bracket-games championship-game">
                <div class="matchup ${!playoffs.sf1 || !playoffs.sf2 ? 'bye' : ''}">
                    ${playoffs.sf1 && playoffs.sf2 ? createMatchupHTML(playoffs.sf1.winner, playoffs.sf2.winner, playoffs.championship) + `<div class="matchup-status">${playoffs.championship ? '' : 'To Be Played'}</div>` : createChampionshipTBD()}
                </div>
            </div>
        </div>
    `;
}

function createMatchupHTML(team1, team2, result) {
    if (!team1 || !team2) return '';

    const team1Seed = team1.rank || '?';
    const team2Seed = team2.rank || '?';
    const team1Name = team1.name || team1;
    const team2Name = team2.name || team2;

    const team1Class = result?.winner?.name === team1Name ? 'winner' : result ? 'loser' : '';
    const team2Class = result?.winner?.name === team2Name ? 'winner' : result ? 'loser' : '';

    const team1Score = result?.score1 || '';
    const team2Score = result?.score2 || '';

    return `
        <div class="matchup-team ${team1Class}">
            <span class="team-seed">${team1Seed}</span>
            <span class="team-name-bracket">${team1Name}</span>
            ${team1Score ? `<span class="team-score">${team1Score}</span>` : ''}
        </div>
        <div class="matchup-team ${team2Class}">
            <span class="team-seed">${team2Seed}</span>
            <span class="team-name-bracket">${team2Name}</span>
            ${team2Score ? `<span class="team-score">${team2Score}</span>` : ''}
        </div>
    `;
}

function createByeHTML(team) {
    return `
        <div class="bye-label">
            <div class="bye-team-info">
                <span class="team-seed">${team.rank}</span>
                <span>${team.name}</span>
            </div>
            <div class="bye-text">First Round BYE</div>
        </div>
    `;
}

function createChampionshipTBD() {
    return `
        <div class="championship-tbd">
            Awaiting Semifinal Results
        </div>
    `;
}

function populateLeaders() {
    const season = getCurrentSeason();
    const leadersContainer = document.getElementById('leadersSection');

    // Hide leaders for upcoming seasons
    if (season.status === 'upcoming' || season.teams.length === 0) {
        leadersContainer.style.display = 'none';
        return;
    }

    leadersContainer.style.display = 'grid';

    const teamsData = getCurrentTeamsData();

    // Offensive Leaders (by runs scored)
    const offensiveLeaders = [...teamsData]
        .sort((a, b) => b.runsFor - a.runsFor)
        .slice(0, 3);

    // Defensive Leaders (by fewest runs allowed)
    const defensiveLeaders = [...teamsData]
        .sort((a, b) => a.runsAgainst - b.runsAgainst)
        .slice(0, 3);

    // Build HTML
    const offensiveHtml = offensiveLeaders.map(team => `
        <li class="leader-item">
            <span><strong>${team.name}</strong></span>
            <span>${team.runsFor} runs scored</span>
        </li>
    `).join('');

    const defensiveHtml = defensiveLeaders.map(team => `
        <li class="leader-item">
            <span><strong>${team.name}</strong></span>
            <span>${team.runsAgainst} runs allowed</span>
        </li>
    `).join('');

    leadersContainer.innerHTML = `
        <div class="leader-card">
            <h3 class="leader-title">
                <span class="emoji">🔥</span>
                Offensive Leaders
            </h3>
            <ul class="leader-list">
                ${offensiveHtml}
            </ul>
        </div>

        <div class="leader-card">
            <h3 class="leader-title">
                <span class="emoji">🛡️</span>
                Defensive Leaders
            </h3>
            <ul class="leader-list">
                ${defensiveHtml}
            </ul>
        </div>
    `;
}

function populateStandings() {
    const container = document.querySelector('.standings-container');
    const season = getCurrentSeason();

    // Clear expanded team state
    expandedTeam = null;

    // Check if season is upcoming (no teams yet)
    if (season.status === 'upcoming' || season.teams.length === 0) {
        container.innerHTML = `
            <div class="upcoming-message">
                <span class="emoji">📅</span>
                <div><strong>${season.name}</strong> season hasn't started yet.</div>
                <div style="margin-top: 10px; font-size: 0.9rem;">Check back soon for standings!</div>
            </div>
        `;
        // Hide upcoming games for upcoming seasons
        hideUpcomingGames();
        // Hide progress indicator
        updateSeasonProgress();
        // Hide playoff bracket
        populatePlayoffBracket();
        // Hide leader cards
        populateLeaders();
        return;
    }

    // Restore table structure if it was replaced
    if (!document.querySelector('.standings-table')) {
        container.innerHTML = `
            <table class="standings-table">
                <thead>
                    <tr>
                        <th>RK</th>
                        <th>TEAM <span class="click-hint">(click to view games)</span></th>
                        <th>W</th>
                        <th>L</th>
                        <th>T</th>
                        <th>PCT</th>
                        <th>GB</th>
                        <th>RF</th>
                        <th>RA</th>
                        <th>DIFF</th>
                    </tr>
                </thead>
                <tbody id="standingsBody"></tbody>
            </table>
        `;
    }

    // Clear and populate table body
    const tbody = document.getElementById('standingsBody');
    tbody.innerHTML = '';

    // Populate with teams
    const teamsData = getCurrentTeamsData();
    teamsData.forEach((team, index) => {
        tbody.appendChild(createTeamRow(team, index));

        // Add playoff cutoff line after 6th team
        if (index === 5 && teamsData.length > 6) {
            const cutoffRow = document.createElement('tr');
            cutoffRow.className = 'playoff-cutoff';
            cutoffRow.innerHTML = '<td colspan="13"><div class="playoff-line"><span class="playoff-label">Playoff Line</span></div></td>';
            tbody.appendChild(cutoffRow);
        }
    });

    // Populate upcoming games
    populateUpcomingGames();

    // Update season progress
    updateSeasonProgress();

    // Populate playoff bracket
    populatePlayoffBracket();

    // Populate leader cards
    populateLeaders();
}

function populateUpcomingGames() {
    const season = getCurrentSeason();
    const container = document.getElementById('upcomingGamesContainer');
    const grid = document.getElementById('upcomingGamesGrid');

    if (!season.upcomingGames || season.upcomingGames.length === 0) {
        container.style.display = 'none';
        return;
    }

    // Filter out past games
    const today = new Date();
    const currentYear = new Date().getFullYear();

    const futureGames = season.upcomingGames.filter(game => {
        // Parse the date string (e.g., "Nov 2" or "Oct 19")
        const gameDate = new Date(`${game.date}, ${currentYear}`);
        // Add one day buffer to account for timezone differences
        const dayAfterGame = new Date(gameDate);
        dayAfterGame.setDate(dayAfterGame.getDate() + 1);
        return dayAfterGame >= today;
    });

    if (futureGames.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    grid.innerHTML = '';

    // Group games by date
    const gamesByDate = {};
    futureGames.forEach(game => {
        const dateKey = `${game.day}, ${game.date}`;
        if (!gamesByDate[dateKey]) {
            gamesByDate[dateKey] = [];
        }
        gamesByDate[dateKey].push(game);
    });

    // Create date sections
    Object.keys(gamesByDate).forEach(dateKey => {
        const games = gamesByDate[dateKey];

        // Create date header
        const dateSection = document.createElement('div');
        dateSection.className = 'upcoming-date-section';

        const dateHeader = document.createElement('div');
        dateHeader.className = 'upcoming-date-header';
        dateHeader.innerHTML = `
            <span class="date-icon">📅</span>
            <span class="date-text">${dateKey}</span>
            <span class="game-count">${games.length} game${games.length > 1 ? 's' : ''}</span>
        `;
        dateSection.appendChild(dateHeader);

        // Create games grid for this date
        const dateGamesGrid = document.createElement('div');
        dateGamesGrid.className = 'upcoming-games-grid';

        games.forEach(game => {
            const card = createUpcomingGameCard(game);
            dateGamesGrid.appendChild(card);
        });

        dateSection.appendChild(dateGamesGrid);
        grid.appendChild(dateSection);
    });
}

function hideUpcomingGames() {
    const container = document.getElementById('upcomingGamesContainer');
    if (container) {
        container.style.display = 'none';
    }
}

function createUpcomingGameCard(game) {
    const card = document.createElement('div');
    card.className = 'upcoming-game-card';

    // Calculate win probabilities for this matchup
    const allTeams = getCurrentTeamsData();
    const homeTeam = allTeams.find(t => t.name === game.home);
    const awayTeam = allTeams.find(t => t.name === game.visitors);

    let homeWinProb = 0.5;
    let awayWinProb = 0.5;

    if (homeTeam && awayTeam) {
        const homeRF = homeTeam.runsFor || 1;
        const homeRA = homeTeam.runsAgainst || 1;
        const awayRF = awayTeam.runsFor || 1;
        const awayRA = awayTeam.runsAgainst || 1;

        // Pythagorean win%
        const exponent = 1.83;
        const homePythWinPct = Math.pow(homeRF, exponent) / (Math.pow(homeRF, exponent) + Math.pow(homeRA, exponent));
        const awayPythWinPct = Math.pow(awayRF, exponent) / (Math.pow(awayRF, exponent) + Math.pow(awayRA, exponent));

        // Blend Pythagorean win% with actual win% (70% Pyth, 30% actual)
        const homeExpWinPct = (homePythWinPct * 0.7) + (homeTeam.winPct * 0.3);
        const awayExpWinPct = (awayPythWinPct * 0.7) + (awayTeam.winPct * 0.3);

        // Calculate win probability (no home field advantage for recreational league)
        homeWinProb = homeExpWinPct / (homeExpWinPct + awayExpWinPct);
        awayWinProb = 1 - homeWinProb;
    }

    const homeWinPct = Math.round(homeWinProb * 100);
    const awayWinPct = Math.round(awayWinProb * 100);

    card.innerHTML = `
        <div class="game-time-header">
            <span class="time-icon">🕐</span>
            <span class="game-time-display">${game.time}</span>
        </div>
        <div class="game-matchup-upcoming">
            <div class="game-team">
                <div class="team-name-upcoming">${game.visitors}</div>
                <div class="team-label">Visitor</div>
            </div>
            <div class="game-team">
                <div class="team-name-upcoming">${game.home}</div>
                <div class="team-label">Home</div>
            </div>
        </div>
        <div class="win-probability-container">
            <div class="win-prob-labels">
                <span class="win-prob-label visitor-label">VISITOR</span>
                <span class="win-prob-label home-label">HOME</span>
            </div>
            <div class="win-probability-bar">
                <div class="win-prob-section away" style="width: ${awayWinPct}%">
                    <span class="win-prob-text">${awayWinPct}%</span>
                </div>
                <div class="win-prob-section home" style="width: ${homeWinPct}%">
                    <span class="win-prob-text">${homeWinPct}%</span>
                </div>
            </div>
        </div>
        <div class="game-venue-display">${game.venue}</div>
    `;

    return card;
}

function switchSeason(seasonId) {
    if (seasonId === currentSeasonId) return;

    currentSeasonId = seasonId;

    // Update active tab
    document.querySelectorAll('.season-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.season === seasonId) {
            tab.classList.add('active');
        }
    });

    // Repopulate standings
    populateStandings();
}

function initializeSeasonTabs() {
    document.querySelectorAll('.season-tab').forEach(tab => {
        const seasonId = tab.dataset.season;
        const season = seasonsData.seasons[seasonId];

        // Add upcoming class if season hasn't started
        if (season.status === 'upcoming' || season.teams.length === 0) {
            tab.classList.add('upcoming');
        }

        tab.addEventListener('click', () => {
            switchSeason(seasonId);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSeasonTabs();
    populateStandings();
});

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.98) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#FFD700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    sparkle.style.zIndex = '1000';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}
