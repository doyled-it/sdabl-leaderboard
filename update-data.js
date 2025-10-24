#!/usr/bin/env node

/**
 * SDABL Standings Update Script
 *
 * This script runs the scraper and automatically updates data.js with the latest standings.
 * It includes error handling and validation to ensure data quality.
 */

const fs = require('fs');
const { scrape } = require('./scraper.js');

const ORIGINAL_DATA_FILE = 'data.js';
const SCRAPED_DATA_FILE = 'data-scraped.js';
const BACKUP_FILE = 'data.js.backup';

/**
 * Create backup of current data.js
 */
function backupCurrentData() {
    if (fs.existsSync(ORIGINAL_DATA_FILE)) {
        console.log('📦 Creating backup of current data.js...');
        fs.copyFileSync(ORIGINAL_DATA_FILE, BACKUP_FILE);
        console.log('✓ Backup created: data.js.backup');
    }
}

/**
 * Validate scraped data
 */
function validateScrapedData(result) {
    if (!result || !result.teams) {
        throw new Error('Invalid scraper result format');
    }

    const { teams, upcomingGames } = result;

    if (!teams || teams.length === 0) {
        throw new Error('No teams found in scraped data');
    }

    // Check that we have the expected number of teams (should be 10)
    if (teams.length < 8 || teams.length > 12) {
        console.warn(`⚠️  Warning: Expected 10 teams, found ${teams.length}`);
    }

    // Validate each team has required fields
    for (const team of teams) {
        if (!team.name) {
            throw new Error('Team missing name field');
        }
        if (typeof team.wins !== 'number' || typeof team.losses !== 'number') {
            throw new Error(`Invalid stats for team ${team.name}`);
        }
        if (!Array.isArray(team.games)) {
            throw new Error(`Team ${team.name} missing games array`);
        }
    }

    console.log('✓ Scraped data validation passed');
    console.log(`  Teams: ${teams.length}, Upcoming games: ${upcomingGames ? upcomingGames.length : 0}`);
    return true;
}

/**
 * Update data.js with scraped data
 */
function updateDataFile() {
    if (!fs.existsSync(SCRAPED_DATA_FILE)) {
        throw new Error('Scraped data file not found. Run scraper first.');
    }

    console.log('📝 Updating data.js with scraped data...');
    fs.copyFileSync(SCRAPED_DATA_FILE, ORIGINAL_DATA_FILE);
    console.log('✓ data.js updated successfully');
}

/**
 * Display summary of changes
 */
function displaySummary(result) {
    const { teams, upcomingGames } = result;

    console.log('\n' + '='.repeat(50));
    console.log('📊 UPDATED STANDINGS');
    console.log('='.repeat(50));

    teams.forEach(team => {
        const record = `${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''}`;
        const winPct = (team.winPct * 100).toFixed(1);
        const runDiff = team.runDiff > 0 ? `+${team.runDiff}` : team.runDiff;

        console.log(
            `${String(team.rank).padStart(2)}. ${team.name.padEnd(25)} ` +
            `${record.padEnd(7)} (${winPct.padStart(4)}%) ` +
            `RD: ${String(runDiff).padStart(4)}`
        );
    });

    console.log('='.repeat(50));

    if (upcomingGames && upcomingGames.length > 0) {
        console.log(`\n📅 ${upcomingGames.length} upcoming games scheduled\n`);
    }
}

/**
 * Main update function
 */
async function main() {
    console.log('⚾ SDABL Standings Update Tool\n');

    try {
        // Step 1: Backup current data
        backupCurrentData();

        // Step 2: Run scraper
        console.log('🔍 Fetching latest standings...\n');
        const result = await scrape();

        // Step 3: Validate scraped data
        console.log('\n🔍 Validating scraped data...');
        validateScrapedData(result);

        // Step 4: Update data.js
        updateDataFile();

        // Step 5: Display summary
        displaySummary(result);

        console.log('✅ Update completed successfully!');
        console.log('💡 Refresh index.html in your browser to see the changes.\n');

        // Clean up backup on success
        if (fs.existsSync(BACKUP_FILE)) {
            fs.unlinkSync(BACKUP_FILE);
        }

    } catch (error) {
        console.error('\n❌ Error updating standings:', error.message);

        // Restore backup if it exists
        if (fs.existsSync(BACKUP_FILE)) {
            console.log('🔄 Restoring backup...');
            fs.copyFileSync(BACKUP_FILE, ORIGINAL_DATA_FILE);
            fs.unlinkSync(BACKUP_FILE);
            console.log('✓ Backup restored');
        }

        console.log('\n💡 Tips:');
        console.log('  - Check your internet connection');
        console.log('  - Verify the LeagueLineup website is accessible');
        console.log('  - Check if the HTML structure has changed\n');

        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
