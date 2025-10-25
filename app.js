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
    const totalSeasonGames = season.regularSeasonGames || 10;
    const playoffSpots = 6;

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

function getHeadToHead(team) {
    const h2h = {};

    team.games.forEach(game => {
        // Extract opponent name (remove @ or vs prefix)
        const opponent = game.opponent.replace(/^(@ |vs )/, '');

        if (!h2h[opponent]) {
            h2h[opponent] = { wins: 0, losses: 0, ties: 0 };
        }

        if (game.result === 'win') h2h[opponent].wins++;
        else if (game.result === 'loss') h2h[opponent].losses++;
        else h2h[opponent].ties++;
    });

    // Convert to array and sort by opponent name
    return Object.entries(h2h)
        .map(([opponent, record]) => ({ opponent, ...record }))
        .sort((a, b) => a.opponent.localeCompare(b.opponent));
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

    // Monte Carlo simulation of remaining games
    const numSimulations = 1000;
    const upcomingGames = season.upcomingGames || [];

    // Filter out past games (same logic as populateUpcomingGames)
    const today = new Date();
    const currentYear = new Date().getFullYear();

    const futureGames = upcomingGames.filter(game => {
        const gameDate = new Date(`${game.date}, ${currentYear}`);
        const dayAfterGame = new Date(gameDate);
        dayAfterGame.setDate(dayAfterGame.getDate() + 1);  // Add buffer for timezone
        return dayAfterGame >= today;
    });

    // Parse all remaining games (only iterate through games once, not per team)
    const remainingMatchups = [];

    futureGames.forEach(game => {
        const homeTeam = allTeams.find(t => t.name === game.home);
        const awayTeam = allTeams.find(t => t.name === game.visitors);

        if (homeTeam && awayTeam) {
            remainingMatchups.push({ homeTeam, awayTeam, game });
        }
    });

    // If no games remaining, fall back to simple calculation
    if (remainingMatchups.length === 0) {
        // No games to simulate - return based on current position
        if (team.rank <= playoffSpots) return 95;
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

            // Calculate win probability using Pythagorean expectation based on runs
            // This accounts for offensive strength vs defensive weakness

            // Get runs for/against from original team data
            const homeRF = homeTeam.runsFor || 1;
            const homeRA = homeTeam.runsAgainst || 1;
            const awayRF = awayTeam.runsFor || 1;
            const awayRA = awayTeam.runsAgainst || 1;

            // Pythagorean win% formula for baseball (exponent ~1.83)
            // Expected Win% = (Runs Scored)^1.83 / ((Runs Scored)^1.83 + (Runs Allowed)^1.83)
            const exponent = 1.83;
            const homePythWinPct = Math.pow(homeRF, exponent) / (Math.pow(homeRF, exponent) + Math.pow(homeRA, exponent));
            const awayPythWinPct = Math.pow(awayRF, exponent) / (Math.pow(awayRF, exponent) + Math.pow(awayRA, exponent));

            // Blend actual win% with Pythagorean win% (70% Pyth, 30% actual)
            // This accounts for both run differential AND actual results (luck, clutch, etc.)
            const homeExpWinPct = (homePythWinPct * 0.7) + (homeTeam.winPct * 0.3);
            const awayExpWinPct = (awayPythWinPct * 0.7) + (awayTeam.winPct * 0.3);

            // Matchup-specific prediction: home offense vs away defense, away offense vs home defense
            // Home team's scoring ability vs away team's runs allowed
            const homeOffenseVsAwayDefense = homeRF / awayRA;
            // Away team's scoring ability vs home team's runs allowed
            const awayOffenseVsHomeDefense = awayRF / homeRA;

            // Combined strength considering both overall ability and matchup
            // Home gets 5% boost for home field advantage
            const homeStrength = (homeExpWinPct * 0.6 + homeOffenseVsAwayDefense * 0.4) * 1.05;
            const awayStrength = (awayExpWinPct * 0.6 + awayOffenseVsHomeDefense * 0.4);

            // Calculate win probability
            const homeWinProb = homeStrength / (homeStrength + awayStrength);

            const rand = Math.random();
            const simHome = simStandings.find(t => t.name === homeTeam.name);
            const simAway = simStandings.find(t => t.name === awayTeam.name);

            if (rand < homeWinProb) {
                // Home team wins
                simHome.wins++;
                simAway.losses++;
            } else {
                // Away team wins
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

        // Check if this team made playoffs
        const teamFinish = simStandings.findIndex(t => t.name === team.name);
        if (teamFinish < playoffSpots) {
            playoffCount++;
        }
    }

    return Math.round((playoffCount / numSimulations) * 100);
}

function getRemainingSchedule(team, allTeams) {
    const season = getCurrentSeason();
    const totalSeasonGames = season.regularSeasonGames || 10;
    const teamGamesPlayed = team.wins + team.losses + team.ties;

    if (teamGamesPlayed >= totalSeasonGames) {
        return { games: [], difficulty: 0, difficultyLabel: 'Season Complete' };
    }

    const upcomingGames = season.upcomingGames || [];
    const remainingGames = upcomingGames.filter(game =>
        game.home === team.name || game.visitors === team.name
    );

    if (remainingGames.length === 0) {
        return { games: [], difficulty: 0, difficultyLabel: 'No Games Scheduled' };
    }

    // Calculate difficulty based on opponents' win percentage
    const opponents = remainingGames.map(game => {
        const opponentName = game.home === team.name ? game.visitors : game.home;
        const opponent = allTeams.find(t => t.name === opponentName);
        return {
            name: opponentName,
            game: game,
            winPct: opponent ? opponent.winPct : 0.500,
            rank: opponent ? opponent.rank : null
        };
    });

    const avgOpponentWinPct = opponents.reduce((sum, opp) => sum + opp.winPct, 0) / opponents.length;

    let difficultyLabel = '';
    if (avgOpponentWinPct >= 0.700) difficultyLabel = 'Very Hard';
    else if (avgOpponentWinPct >= 0.550) difficultyLabel = 'Hard';
    else if (avgOpponentWinPct >= 0.450) difficultyLabel = 'Average';
    else if (avgOpponentWinPct >= 0.300) difficultyLabel = 'Easy';
    else difficultyLabel = 'Very Easy';

    return {
        games: opponents,
        difficulty: avgOpponentWinPct,
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

    const h2hRecords = getHeadToHead(team);
    const h2hHtml = h2hRecords.map(record => `
        <div class="h2h-item">
            <div class="h2h-opponent">${record.opponent}</div>
            <div class="h2h-record ${record.wins > record.losses ? 'winning' : record.losses > record.wins ? 'losing' : 'even'}">
                ${record.wins}-${record.losses}${record.ties > 0 ? `-${record.ties}` : ''}
            </div>
        </div>
    `).join('');

    const allTeams = getCurrentTeamsData();
    const remaining = getRemainingSchedule(team, allTeams);
    const difficultyClass = remaining.difficulty >= 0.700 ? 'very-hard' :
                           remaining.difficulty >= 0.550 ? 'hard' :
                           remaining.difficulty >= 0.450 ? 'average' :
                           remaining.difficulty >= 0.300 ? 'easy' : 'very-easy';

    const remainingHtml = remaining.games.length > 0 ? remaining.games.map(opp => {
        const location = opp.game.home === team.name ? 'vs' : '@';
        const oppDiffClass = opp.winPct >= 0.700 ? 'very-hard' :
                            opp.winPct >= 0.550 ? 'hard' :
                            opp.winPct >= 0.450 ? 'average' :
                            opp.winPct >= 0.300 ? 'easy' : 'very-easy';
        return `
            <div class="remaining-game-item ${oppDiffClass}">
                <div class="remaining-game-info">
                    <div class="remaining-opponent">${location} ${opp.name}</div>
                    <div class="remaining-date">${opp.game.day}, ${opp.game.date} • ${opp.game.time}</div>
                </div>
                <div class="opponent-record">${opp.rank ? `#${opp.rank}` : ''} (${(opp.winPct * 100).toFixed(0)}%)</div>
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
                            Game Results (${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''})
                        </div>
                        <div class="games-list">
                            ${gamesHtml}
                        </div>
                    </div>
                    <div class="details-section">
                        <div class="games-header">
                            <span>🆚</span>
                            Head-to-Head Records
                        </div>
                        <div class="h2h-list">
                            ${h2hHtml}
                        </div>
                    </div>
                    <div class="details-section full-width">
                        <div class="games-header">
                            <span>📅</span>
                            Remaining Schedule
                            ${remaining.games.length > 0 ? `<span class="difficulty-badge ${difficultyClass}">${remaining.difficultyLabel}</span>` : ''}
                        </div>
                        <div class="remaining-games-list">
                            ${remainingHtml}
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

    // Get playoff data if it exists (for future seasons with completed playoffs)
    const playoffs = season.playoffs || {};

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

    // Check if teams have clinched playoffs
    const allTeams = getCurrentTeamsData();
    const team1Clinched = team1.rank && hasClinchedPlayoff(team1, allTeams) ? ' <span class="bracket-clinched">✓</span>' : '';
    const team2Clinched = team2.rank && hasClinchedPlayoff(team2, allTeams) ? ' <span class="bracket-clinched">✓</span>' : '';

    return `
        <div class="matchup-team ${team1Class}">
            <span class="team-seed">${team1Seed}</span>
            <span class="team-name-bracket">${team1Name}${team1Clinched}</span>
            ${team1Score ? `<span class="team-score">${team1Score}</span>` : ''}
        </div>
        <div class="matchup-team ${team2Class}">
            <span class="team-seed">${team2Seed}</span>
            <span class="team-name-bracket">${team2Name}${team2Clinched}</span>
            ${team2Score ? `<span class="team-score">${team2Score}</span>` : ''}
        </div>
    `;
}

function createByeHTML(team) {
    const allTeams = getCurrentTeamsData();
    const clinched = hasClinchedPlayoff(team, allTeams) ? ' <span class="bracket-clinched">✓</span>' : '';

    return `
        <div class="bye-label">
            <div class="bye-team-info">
                <span class="team-seed">${team.rank}</span>
                <span>${team.name}${clinched}</span>
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
