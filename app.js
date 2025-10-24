let expandedTeam = null;
let currentSeasonId = seasonsData.currentSeason;

function getCurrentTeamsData() {
    return seasonsData.seasons[currentSeasonId].teams;
}

function getCurrentSeason() {
    return seasonsData.seasons[currentSeasonId];
}

function hasClinchedPlayoff(team, allTeams) {
    const totalSeasonGames = 10;
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

    row.innerHTML = `
        <td class="rank-cell ${hasClinched ? 'clinched' : ''}">${team.rank}</td>
        <td class="team-name-cell ${hasClinched ? 'clinched' : ''}">${team.name}${clinchedBadge}</td>
        <td class="stat-cell">${team.wins}</td>
        <td class="stat-cell">${team.losses}</td>
        <td class="stat-cell">${team.ties}</td>
        <td class="stat-cell pct-cell">${team.winPct.toFixed(3)}</td>
        <td class="stat-cell games-behind">${gamesBehind}</td>
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

    detailsRow.innerHTML = `
        <td colspan="10">
            <div class="team-details-content">
                <div class="games-header">
                    <span>📊</span>
                    ${team.name} - Game Results (${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''})
                </div>
                <div class="games-list">
                    ${gamesHtml}
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

    const totalSeasonGames = 10;
    const progressPercentage = (maxGamesPlayed / totalSeasonGames) * 100;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;

    // Update stats text
    const progressStats = document.getElementById('progressStats');
    progressStats.textContent = `${maxGamesPlayed} / ${totalSeasonGames} Games`;
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

    // Top Teams (by rank)
    const topTeams = teamsData.slice(0, 3);

    // Offensive Leaders (by runs scored)
    const offensiveLeaders = [...teamsData]
        .sort((a, b) => b.runsFor - a.runsFor)
        .slice(0, 3);

    // Defensive Leaders (by fewest runs allowed)
    const defensiveLeaders = [...teamsData]
        .sort((a, b) => a.runsAgainst - b.runsAgainst)
        .slice(0, 3);

    // Build HTML
    const topTeamsHtml = topTeams.map(team => {
        const record = `${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''}`;
        const runDiffClass = team.runDiff > 0 ? 'positive' : team.runDiff < 0 ? 'negative' : '';
        const runDiffSymbol = team.runDiff > 0 ? '+' : '';
        return `
            <li class="leader-item">
                <span><strong>${team.name}</strong> (${record})</span>
                <span class="${runDiffClass}">${runDiffSymbol}${team.runDiff} run diff</span>
            </li>
        `;
    }).join('');

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
                <span class="emoji">🏆</span>
                Top Teams
            </h3>
            <ul class="leader-list">
                ${topTeamsHtml}
            </ul>
        </div>

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
            cutoffRow.innerHTML = '<td colspan="10"><div class="playoff-line"><span class="playoff-label">Playoff Line</span></div></td>';
            tbody.appendChild(cutoffRow);
        }
    });

    // Populate upcoming games
    populateUpcomingGames();

    // Update season progress
    updateSeasonProgress();

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

    container.style.display = 'block';
    grid.innerHTML = '';

    // Group games by date
    const gamesByDate = {};
    season.upcomingGames.forEach(game => {
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
