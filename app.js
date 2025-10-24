let expandedTeam = null;
let currentSeasonId = seasonsData.currentSeason;

function getCurrentTeamsData() {
    return seasonsData.seasons[currentSeasonId].teams;
}

function getCurrentSeason() {
    return seasonsData.seasons[currentSeasonId];
}

function createTeamRow(team, index) {
    const row = document.createElement('tr');
    row.className = team.rank <= 3 ? 'top3' : '';
    row.style.animationDelay = `${index * 0.1}s`;
    row.dataset.teamName = team.name;
    row.addEventListener('click', () => toggleTeamDetails(team, row));

    const runDiffClass = team.runDiff > 0 ? 'positive' : team.runDiff < 0 ? 'negative' : '';
    const runDiffSymbol = team.runDiff > 0 ? '+' : '';

    const teamsData = getCurrentTeamsData();
    const firstPlaceWinPct = teamsData[0].winPct;
    const totalGames = team.wins + team.losses + team.ties;
    const gamesBehind = team.rank === 1 ? '-' :
        ((firstPlaceWinPct - team.winPct) * totalGames / 2).toFixed(1);

    row.innerHTML = `
        <td class="rank-cell ${team.rank <= 3 ? 'top3' : ''}">${team.rank}</td>
        <td class="team-name-cell ${team.rank <= 3 ? 'top3' : ''}">${team.name}</td>
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

function populateStandings() {
    const tbody = document.getElementById('standingsBody');
    const container = document.querySelector('.standings-container');

    // Clear existing content
    tbody.innerHTML = '';
    expandedTeam = null;

    const season = getCurrentSeason();

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

    // Populate with teams
    const teamsData = getCurrentTeamsData();
    const newTbody = document.getElementById('standingsBody');
    teamsData.forEach((team, index) => {
        newTbody.appendChild(createTeamRow(team, index));
    });

    // Populate upcoming games
    populateUpcomingGames();
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

    season.upcomingGames.forEach(game => {
        const card = createUpcomingGameCard(game);
        grid.appendChild(card);
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
        <div class="game-date-time">
            <div class="game-date-display">${game.day}, ${game.date}</div>
            <div class="game-time-display">${game.time}</div>
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
