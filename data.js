// SDABL Standings Data
// Multi-season support

const seasonsData = {
    currentSeason: 'fall2025',

    seasons: {
        spring2025: {
            id: 'spring2025',
            name: 'Spring 2025',
            division: '25A',
            divisionId: '1056065',
            status: 'completed',
            regularSeasonGames: 13,
            teams: [
                {
                    rank: 1, name: "Blue Mountains", wins: 12, losses: 1, ties: 0, winPct: 0.923, runDiff: 139, runsFor: 201, runsAgainst: 62,
                    games: [
                        { opponent: "@ Diamond Dogs", score: "24-2", result: "win", date: "Mar 2" },
                        { opponent: "@ San diego storm", score: "26-1", result: "win", date: "Mar 9" },
                        { opponent: "vs Players", score: "12-2", result: "win", date: "Mar 23" },
                        { opponent: "@ Lemon Grove Athletics", score: "11-3", result: "win", date: "Mar 30" },
                        { opponent: "vs Fighting Friars", score: "15-3", result: "win", date: "Apr 6" },
                        { opponent: "vs San Diego Banditos", score: "7-0", result: "win", date: "Apr 13" },
                        { opponent: "@ Bubblegum Boys", score: "9-6", result: "win", date: "May 18" },
                        { opponent: "vs Diamond Dogs", score: "11-7", result: "win", date: "Jun 1" },
                        { opponent: "vs Lemon Grove Athletics", score: "6-1", result: "win", date: "Jun 8" },
                        { opponent: "@ Reapers Baseball Club", score: "28-8", result: "win", date: "Jun 15" },
                        { opponent: "vs Happy Sox", score: "8-3", result: "win", date: "Jun 22" },
                        { opponent: "@ Fighting Friars", score: "34-15", result: "win", date: "Jun 22" },
                        { opponent: "@ Happy Sox", score: "10-11", result: "loss", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "vs San Diego Banditos", score: "13-1", result: "win", date: "Jul 20", round: "Playoff" },
                        { opponent: "vs Happy Sox", score: "20-5", result: "win", date: "Jul 27", round: "Playoff" }
                    ]
                },
                {
                    rank: 2, name: "Happy Sox", wins: 11, losses: 2, ties: 0, winPct: 0.846, runDiff: 122, runsFor: 202, runsAgainst: 80,
                    games: [
                        { opponent: "vs Fighting Friars", score: "22-3", result: "win", date: "Mar 9" },
                        { opponent: "@ San Diego Banditos", score: "14-2", result: "win", date: "Mar 23" },
                        { opponent: "@ Players", score: "22-3", result: "win", date: "Mar 30" },
                        { opponent: "vs San diego storm", score: "16-6", result: "win", date: "Apr 6" },
                        { opponent: "vs Reapers Baseball Club", score: "24-2", result: "win", date: "Apr 13" },
                        { opponent: "@ Diamond Dogs", score: "23-4", result: "win", date: "May 18" },
                        { opponent: "vs Lemon Grove Athletics", score: "3-17", result: "loss", date: "Jun 1" },
                        { opponent: "@ Lemon Grove Athletics", score: "11-9", result: "win", date: "Jun 1" },
                        { opponent: "vs Players", score: "10-6", result: "win", date: "Jun 8" },
                        { opponent: "vs Bubblegum Boys", score: "16-4", result: "win", date: "Jun 15" },
                        { opponent: "@ Blue Mountains", score: "3-8", result: "loss", date: "Jun 22" },
                        { opponent: "@ San diego storm", score: "27-6", result: "win", date: "Jun 22" },
                        { opponent: "vs Blue Mountains", score: "11-10", result: "win", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "vs Lemon Grove Athletics", score: "15-10", result: "win", date: "Jul 20", round: "Playoff" },
                        { opponent: "@ Blue Mountains", score: "5-20", result: "loss", date: "Jul 27", round: "Playoff" }
                    ]
                },
                {
                    rank: 3, name: "Lemon Grove Athletics", wins: 8, losses: 4, ties: 1, winPct: 0.654, runDiff: 38, runsFor: 125, runsAgainst: 87,
                    games: [
                        { opponent: "@ Players", score: "8-8", result: "tie", date: "Mar 9" },
                        { opponent: "@ Fighting Friars", score: "14-12", result: "win", date: "Mar 23" },
                        { opponent: "vs Blue Mountains", score: "3-11", result: "loss", date: "Mar 30" },
                        { opponent: "@ Diamond Dogs", score: "11-8", result: "win", date: "Apr 6" },
                        { opponent: "vs Bubblegum Boys", score: "8-10", result: "loss", date: "Apr 13" },
                        { opponent: "vs Reapers Baseball Club", score: "9-6", result: "win", date: "Apr 27" },
                        { opponent: "vs San Diego Banditos", score: "13-2", result: "win", date: "May 18" },
                        { opponent: "@ Happy Sox", score: "17-3", result: "win", date: "Jun 1" },
                        { opponent: "vs Happy Sox", score: "9-11", result: "loss", date: "Jun 1" },
                        { opponent: "@ Blue Mountains", score: "1-6", result: "loss", date: "Jun 8" },
                        { opponent: "vs San diego storm", score: "9-0", result: "win", date: "Jun 15" },
                        { opponent: "vs Diamond Dogs", score: "9-8", result: "win", date: "Jun 22" },
                        { opponent: "@ Reapers Baseball Club", score: "14-2", result: "win", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "vs Bubblegum Boys", score: "13-4", result: "win", date: "Jul 13", round: "Playoff" },
                        { opponent: "@ Happy Sox", score: "10-15", result: "loss", date: "Jul 20", round: "Playoff" }
                    ]
                },
                {
                    rank: 4, name: "San Diego Banditos", wins: 8, losses: 5, ties: 0, winPct: 0.615, runDiff: 25, runsFor: 129, runsAgainst: 104,
                    games: [
                        { opponent: "vs Happy Sox", score: "2-14", result: "loss", date: "Mar 23" },
                        { opponent: "@ San diego storm", score: "18-11", result: "win", date: "Mar 23" },
                        { opponent: "vs Bubblegum Boys", score: "13-10", result: "win", date: "Mar 30" },
                        { opponent: "@ Players", score: "19-7", result: "win", date: "Apr 6" },
                        { opponent: "@ Blue Mountains", score: "0-7", result: "loss", date: "Apr 13" },
                        { opponent: "@ Diamond Dogs", score: "5-4", result: "win", date: "Apr 27" },
                        { opponent: "@ Lemon Grove Athletics", score: "2-13", result: "loss", date: "May 18" },
                        { opponent: "vs San diego storm", score: "15-7", result: "win", date: "Jun 1" },
                        { opponent: "@ Bubblegum Boys", score: "1-8", result: "loss", date: "Jun 8" },
                        { opponent: "vs Fighting Friars", score: "9-13", result: "loss", date: "Jun 15" },
                        { opponent: "vs Players", score: "7-4", result: "win", date: "Jun 22" },
                        { opponent: "vs Reapers Baseball Club", score: "21-4", result: "win", date: "Jun 29" },
                        { opponent: "vs Diamond Dogs", score: "17-2", result: "win", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "vs Players", score: "7-4", result: "win", date: "Jul 13", round: "Playoff" },
                        { opponent: "@ Blue Mountains", score: "1-13", result: "loss", date: "Jul 20", round: "Playoff" }
                    ]
                },
                {
                    rank: 5, name: "Players", wins: 7, losses: 5, ties: 1, winPct: 0.577, runDiff: 44, runsFor: 169, runsAgainst: 125,
                    games: [
                        { opponent: "vs Lemon Grove Athletics", score: "8-8", result: "tie", date: "Mar 9" },
                        { opponent: "@ Blue Mountains", score: "2-12", result: "loss", date: "Mar 23" },
                        { opponent: "vs Happy Sox", score: "3-22", result: "loss", date: "Mar 30" },
                        { opponent: "vs San Diego Banditos", score: "7-19", result: "loss", date: "Apr 6" },
                        { opponent: "vs San diego storm", score: "17-2", result: "win", date: "Apr 13" },
                        { opponent: "@ Bubblegum Boys", score: "16-12", result: "win", date: "Apr 27" },
                        { opponent: "@ Fighting Friars", score: "17-13", result: "win", date: "May 18" },
                        { opponent: "vs Reapers Baseball Club", score: "14-2", result: "win", date: "Jun 1" },
                        { opponent: "@ Reapers Baseball Club", score: "28-6", result: "win", date: "Jun 1" },
                        { opponent: "@ Happy Sox", score: "6-10", result: "loss", date: "Jun 8" },
                        { opponent: "vs Diamond Dogs", score: "29-2", result: "win", date: "Jun 15" },
                        { opponent: "@ San Diego Banditos", score: "4-7", result: "loss", date: "Jun 22" },
                        { opponent: "vs Bubblegum Boys", score: "18-10", result: "win", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "@ San Diego Banditos", score: "4-7", result: "loss", date: "Jul 13", round: "Playoff" }
                    ]
                },
                {
                    rank: 6, name: "Bubblegum Boys", wins: 7, losses: 6, ties: 0, winPct: 0.538, runDiff: 35, runsFor: 171, runsAgainst: 136,
                    games: [
                        { opponent: "vs Diamond Dogs", score: "23-12", result: "win", date: "Mar 9" },
                        { opponent: "@ San diego storm", score: "20-6", result: "win", date: "Mar 23" },
                        { opponent: "@ San Diego Banditos", score: "10-13", result: "loss", date: "Mar 30" },
                        { opponent: "vs Reapers Baseball Club", score: "16-4", result: "win", date: "Apr 6" },
                        { opponent: "@ Lemon Grove Athletics", score: "10-8", result: "win", date: "Apr 13" },
                        { opponent: "vs Players", score: "12-16", result: "loss", date: "Apr 27" },
                        { opponent: "vs Blue Mountains", score: "6-9", result: "loss", date: "May 18" },
                        { opponent: "vs Fighting Friars", score: "8-17", result: "loss", date: "Jun 1" },
                        { opponent: "@ Fighting Friars", score: "22-9", result: "win", date: "Jun 1" },
                        { opponent: "vs San Diego Banditos", score: "8-1", result: "win", date: "Jun 8" },
                        { opponent: "@ Happy Sox", score: "4-16", result: "loss", date: "Jun 15" },
                        { opponent: "@ Reapers Baseball Club", score: "22-7", result: "win", date: "Jun 22" },
                        { opponent: "@ Players", score: "10-18", result: "loss", date: "Jun 29" }
                    ],
                    playoffGames: [
                        { opponent: "@ Lemon Grove Athletics", score: "4-13", result: "loss", date: "Jul 13", round: "Playoff" }
                    ]
                },
                {
                    rank: 7, name: "Fighting Friars", wins: 7, losses: 6, ties: 0, winPct: 0.538, runDiff: 19, runsFor: 197, runsAgainst: 178,
                    games: [
                        { opponent: "@ Happy Sox", score: "3-22", result: "loss", date: "Mar 9" },
                        { opponent: "vs Lemon Grove Athletics", score: "12-14", result: "loss", date: "Mar 23" },
                        { opponent: "@ Reapers Baseball Club", score: "25-8", result: "win", date: "Mar 30" },
                        { opponent: "@ Blue Mountains", score: "3-15", result: "loss", date: "Apr 6" },
                        { opponent: "@ Diamond Dogs", score: "23-11", result: "win", date: "Apr 13" },
                        { opponent: "vs San diego storm", score: "16-1", result: "win", date: "Apr 27" },
                        { opponent: "vs Players", score: "13-17", result: "loss", date: "May 18" },
                        { opponent: "@ Bubblegum Boys", score: "17-8", result: "win", date: "Jun 1" },
                        { opponent: "vs Bubblegum Boys", score: "9-22", result: "loss", date: "Jun 1" },
                        { opponent: "vs Reapers Baseball Club", score: "24-4", result: "win", date: "Jun 8" },
                        { opponent: "@ San Diego Banditos", score: "13-9", result: "win", date: "Jun 15" },
                        { opponent: "vs Blue Mountains", score: "15-34", result: "loss", date: "Jun 22" },
                        { opponent: "@ San diego storm", score: "24-13", result: "win", date: "Jun 29" }
                    ]
                },
                {
                    rank: 8, name: "Diamond Dogs", wins: 3, losses: 10, ties: 0, winPct: 0.231, runDiff: -88, runsFor: 115, runsAgainst: 203,
                    games: [
                        { opponent: "vs Blue Mountains", score: "2-24", result: "loss", date: "Mar 2" },
                        { opponent: "@ Bubblegum Boys", score: "12-23", result: "loss", date: "Mar 9" },
                        { opponent: "@ Reapers Baseball Club", score: "13-10", result: "win", date: "Mar 23" },
                        { opponent: "@ San diego storm", score: "24-5", result: "win", date: "Mar 30" },
                        { opponent: "vs Lemon Grove Athletics", score: "8-11", result: "loss", date: "Apr 6" },
                        { opponent: "vs Fighting Friars", score: "11-23", result: "loss", date: "Apr 13" },
                        { opponent: "vs San Diego Banditos", score: "4-5", result: "loss", date: "Apr 27" },
                        { opponent: "vs Happy Sox", score: "4-23", result: "loss", date: "May 18" },
                        { opponent: "@ Blue Mountains", score: "7-11", result: "loss", date: "Jun 1" },
                        { opponent: "vs San diego storm", score: "18-13", result: "win", date: "Jun 8" },
                        { opponent: "@ Players", score: "2-29", result: "loss", date: "Jun 15" },
                        { opponent: "@ Lemon Grove Athletics", score: "8-9", result: "loss", date: "Jun 22" },
                        { opponent: "@ San Diego Banditos", score: "2-17", result: "loss", date: "Jun 29" }
                    ]
                },
                {
                    rank: 9, name: "Reapers Baseball Club", wins: 1, losses: 12, ties: 0, winPct: 0.077, runDiff: -174, runsFor: 75, runsAgainst: 249,
                    games: [
                        { opponent: "vs Diamond Dogs", score: "10-13", result: "loss", date: "Mar 23" },
                        { opponent: "vs Fighting Friars", score: "8-25", result: "loss", date: "Mar 30" },
                        { opponent: "@ Bubblegum Boys", score: "4-16", result: "loss", date: "Apr 6" },
                        { opponent: "@ Happy Sox", score: "2-24", result: "loss", date: "Apr 13" },
                        { opponent: "@ Lemon Grove Athletics", score: "6-9", result: "loss", date: "Apr 27" },
                        { opponent: "vs San diego storm", score: "12-11", result: "win", date: "May 18" },
                        { opponent: "@ Players", score: "2-14", result: "loss", date: "Jun 1" },
                        { opponent: "vs Players", score: "6-28", result: "loss", date: "Jun 1" },
                        { opponent: "@ Fighting Friars", score: "4-24", result: "loss", date: "Jun 8" },
                        { opponent: "vs Blue Mountains", score: "8-28", result: "loss", date: "Jun 15" },
                        { opponent: "vs Bubblegum Boys", score: "7-22", result: "loss", date: "Jun 22" },
                        { opponent: "@ San Diego Banditos", score: "4-21", result: "loss", date: "Jun 29" },
                        { opponent: "vs Lemon Grove Athletics", score: "2-14", result: "loss", date: "Jun 29" }
                    ]
                },
                {
                    rank: 10, name: "San diego storm", wins: 0, losses: 13, ties: 0, winPct: 0.000, runDiff: -160, runsFor: 82, runsAgainst: 242,
                    games: [
                        { opponent: "vs Blue Mountains", score: "1-26", result: "loss", date: "Mar 9" },
                        { opponent: "vs Bubblegum Boys", score: "6-20", result: "loss", date: "Mar 23" },
                        { opponent: "vs San Diego Banditos", score: "11-18", result: "loss", date: "Mar 23" },
                        { opponent: "vs Diamond Dogs", score: "5-24", result: "loss", date: "Mar 30" },
                        { opponent: "@ Happy Sox", score: "6-16", result: "loss", date: "Apr 6" },
                        { opponent: "@ Players", score: "2-17", result: "loss", date: "Apr 13" },
                        { opponent: "@ Fighting Friars", score: "1-16", result: "loss", date: "Apr 27" },
                        { opponent: "@ Reapers Baseball Club", score: "11-12", result: "loss", date: "May 18" },
                        { opponent: "@ San Diego Banditos", score: "7-15", result: "loss", date: "Jun 1" },
                        { opponent: "@ Diamond Dogs", score: "13-18", result: "loss", date: "Jun 8" },
                        { opponent: "@ Lemon Grove Athletics", score: "0-9", result: "loss", date: "Jun 15" },
                        { opponent: "vs Happy Sox", score: "6-27", result: "loss", date: "Jun 22" },
                        { opponent: "vs Fighting Friars", score: "13-24", result: "loss", date: "Jun 29" }
                    ]
                }
            ],
            upcomingGames: [
                {
                    date: "Mar 16",
                    day: "Sun",
                    time: "9:30 am",
                    visitors: "Reapers Baseball Club",
                    home: "Bubblegum Boys",
                    venue: "Otay Ranch JV"
                },
                {
                    date: "Mar 16",
                    day: "Sun",
                    time: "9:30 am",
                    visitors: "San Diego Banditos",
                    home: "Players",
                    venue: "Presidio Field"
                },
                {
                    date: "Mar 16",
                    day: "Sun",
                    time: "9:30 am",
                    visitors: "San diego storm",
                    home: "Happy Sox",
                    venue: "Ramona"
                },
                {
                    date: "Mar 16",
                    day: "Sun",
                    time: "1:30 pm",
                    visitors: "Lemon Grove Athletics",
                    home: "Diamond Dogs",
                    venue: "Chollas"
                },
                {
                    date: "Mar 16",
                    day: "Sun",
                    time: "1:30 pm",
                    visitors: "Fighting Friars",
                    home: "Blue Mountains",
                    venue: "Presidio Field"
                }
            ]
        },

        fall2025: {
            id: 'fall2025',
            name: 'Fall 2025',
            division: '25A',
            divisionId: '1061524',
            status: 'active',
            regularSeasonGames: 10,
            teams: [
                {
                    rank: 1, name: "Heroes", wins: 8, losses: 1, ties: 0, winPct: 0.889, runDiff: 51, runsFor: 132, runsAgainst: 81,
                    games: [
                        { opponent: "vs SD Storm", score: "21-5", result: "win", date: "Sep 7" },
                        { opponent: "@ Reapers Baseball Club", score: "22-1", result: "win", date: "Sep 14" },
                        { opponent: "@ San Diego Banditos", score: "13-9", result: "win", date: "Sep 21" },
                        { opponent: "vs Lemon Grove Athletics", score: "12-11", result: "win", date: "Sep 28" },
                        { opponent: "vs Fighting Friars", score: "8-7", result: "win", date: "Oct 5" },
                        { opponent: "@ Happy Sox", score: "12-7", result: "win", date: "Oct 12" },
                        { opponent: "vs Diamond Dogs", score: "10-7", result: "win", date: "Oct 19" },
                        { opponent: "@ Beavers", score: "16-17", result: "loss", date: "Oct 19" },
                        { opponent: "vs SD Rip City", score: "18-17", result: "win", date: "Nov 2" }
                    ]
                },
                {
                    rank: 2, name: "Lemon Grove Athletics", wins: 6, losses: 1, ties: 1, winPct: 0.813, runDiff: 53, runsFor: 111, runsAgainst: 58,
                    games: [
                        { opponent: "vs Reapers Baseball Club", score: "10-5", result: "win", date: "Sep 7" },
                        { opponent: "@ SD Rip City", score: "12-6", result: "win", date: "Sep 14" },
                        { opponent: "vs SD Storm", score: "19-7", result: "win", date: "Sep 21" },
                        { opponent: "@ San Diego Banditos", score: "2-2", result: "tie", date: "Sep 28" },
                        { opponent: "@ Heroes", score: "11-12", result: "loss", date: "Sep 28" },
                        { opponent: "vs Happy Sox", score: "15-12", result: "win", date: "Oct 5" },
                        { opponent: "vs Diamond Dogs", score: "17-5", result: "win", date: "Oct 12" },
                        { opponent: "vs Fighting Friars", score: "25-9", result: "win", date: "Nov 2" }
                    ]
                },
                {
                    rank: 3, name: "Beavers", wins: 6, losses: 2, ties: 0, winPct: 0.750, runDiff: 14, runsFor: 70, runsAgainst: 56,
                    games: [
                        { opponent: "vs Diamond Dogs", score: "8-2", result: "win", date: "Sep 7" },
                        { opponent: "@ Fighting Friars", score: "7-6", result: "win", date: "Sep 14" },
                        { opponent: "vs Happy Sox", score: "10-8", result: "win", date: "Sep 21" },
                        { opponent: "@ SD Storm", score: "13-6", result: "win", date: "Sep 28" },
                        { opponent: "@ Reapers Baseball Club", score: "7-5", result: "win", date: "Oct 5" },
                        { opponent: "vs SD Rip City", score: "4-6", result: "loss", date: "Oct 12" },
                        { opponent: "vs Heroes", score: "17-16", result: "win", date: "Oct 19" },
                        { opponent: "@ San Diego Banditos", score: "4-7", result: "loss", date: "Nov 2" }
                    ]
                },
                {
                    rank: 4, name: "SD Rip City", wins: 6, losses: 3, ties: 0, winPct: 0.667, runDiff: 28, runsFor: 102, runsAgainst: 74,
                    games: [
                        { opponent: "vs Fighting Friars", score: "14-8", result: "win", date: "Sep 7" },
                        { opponent: "vs Lemon Grove Athletics", score: "6-12", result: "loss", date: "Sep 14" },
                        { opponent: "vs Reapers Baseball Club", score: "14-2", result: "win", date: "Sep 21" },
                        { opponent: "vs SD Storm", score: "13-6", result: "win", date: "Sep 21" },
                        { opponent: "vs Happy Sox", score: "4-8", result: "loss", date: "Sep 28" },
                        { opponent: "@ Diamond Dogs", score: "19-9", result: "win", date: "Oct 5" },
                        { opponent: "@ Beavers", score: "6-4", result: "win", date: "Oct 12" },
                        { opponent: "@ San Diego Banditos", score: "9-7", result: "win", date: "Nov 2" },
                        { opponent: "@ Heroes", score: "17-18", result: "loss", date: "Nov 2" }
                    ]
                },
                {
                    rank: 5, name: "Happy Sox", wins: 5, losses: 4, ties: 0, winPct: 0.556, runDiff: 22, runsFor: 115, runsAgainst: 93,
                    games: [
                        { opponent: "@ San Diego Banditos", score: "20-5", result: "win", date: "Sep 7" },
                        { opponent: "vs SD Storm", score: "18-13", result: "win", date: "Sep 14" },
                        { opponent: "@ Beavers", score: "8-10", result: "loss", date: "Sep 21" },
                        { opponent: "@ SD Rip City", score: "8-4", result: "win", date: "Sep 28" },
                        { opponent: "@ Diamond Dogs", score: "17-18", result: "loss", date: "Sep 28" },
                        { opponent: "@ Lemon Grove Athletics", score: "12-15", result: "loss", date: "Oct 5" },
                        { opponent: "vs Heroes", score: "7-12", result: "loss", date: "Oct 12" },
                        { opponent: "vs Fighting Friars", score: "11-9", result: "win", date: "Oct 19" },
                        { opponent: "vs Reapers Baseball Club", score: "14-7", result: "win", date: "Nov 2" }
                    ]
                },
                {
                    rank: 6, name: "San Diego Banditos", wins: 4, losses: 4, ties: 1, winPct: 0.500, runDiff: 18, runsFor: 95, runsAgainst: 77,
                    games: [
                        { opponent: "vs Happy Sox", score: "5-20", result: "loss", date: "Sep 7" },
                        { opponent: "@ Diamond Dogs", score: "11-13", result: "loss", date: "Sep 14" },
                        { opponent: "vs Heroes", score: "9-13", result: "loss", date: "Sep 21" },
                        { opponent: "vs Lemon Grove Athletics", score: "2-2", result: "tie", date: "Sep 28" },
                        { opponent: "@ Fighting Friars", score: "15-8", result: "win", date: "Sep 28" },
                        { opponent: "@ SD Storm", score: "22-2", result: "win", date: "Oct 5" },
                        { opponent: "@ Reapers Baseball Club", score: "17-6", result: "win", date: "Oct 12" },
                        { opponent: "vs SD Rip City", score: "7-9", result: "loss", date: "Nov 2" },
                        { opponent: "vs Beavers", score: "7-4", result: "win", date: "Nov 2" }
                    ]
                },
                {
                    rank: 7, name: "Diamond Dogs", wins: 4, losses: 5, ties: 0, winPct: 0.444, runDiff: -24, runsFor: 113, runsAgainst: 137,
                    games: [
                        { opponent: "@ Beavers", score: "2-8", result: "loss", date: "Sep 7" },
                        { opponent: "vs San Diego Banditos", score: "13-11", result: "win", date: "Sep 14" },
                        { opponent: "vs Fighting Friars", score: "23-32", result: "loss", date: "Sep 21" },
                        { opponent: "@ Reapers Baseball Club", score: "17-12", result: "win", date: "Sep 28" },
                        { opponent: "vs Happy Sox", score: "18-17", result: "win", date: "Sep 28" },
                        { opponent: "vs SD Rip City", score: "9-19", result: "loss", date: "Oct 5" },
                        { opponent: "@ Lemon Grove Athletics", score: "5-17", result: "loss", date: "Oct 12" },
                        { opponent: "@ Heroes", score: "7-10", result: "loss", date: "Oct 19" },
                        { opponent: "@ SD Storm", score: "19-11", result: "win", date: "Nov 2" }
                    ]
                },
                {
                    rank: 8, name: "Fighting Friars", wins: 3, losses: 6, ties: 0, winPct: 0.333, runDiff: -11, runsFor: 98, runsAgainst: 109,
                    games: [
                        { opponent: "@ SD Rip City", score: "8-14", result: "loss", date: "Sep 7" },
                        { opponent: "vs Beavers", score: "6-7", result: "loss", date: "Sep 14" },
                        { opponent: "@ Diamond Dogs", score: "32-23", result: "win", date: "Sep 21" },
                        { opponent: "vs Reapers Baseball Club", score: "4-3", result: "win", date: "Sep 21" },
                        { opponent: "vs San Diego Banditos", score: "8-15", result: "loss", date: "Sep 28" },
                        { opponent: "@ Heroes", score: "7-8", result: "loss", date: "Oct 5" },
                        { opponent: "vs SD Storm", score: "15-3", result: "win", date: "Oct 12" },
                        { opponent: "@ Happy Sox", score: "9-11", result: "loss", date: "Oct 19" },
                        { opponent: "@ Lemon Grove Athletics", score: "9-25", result: "loss", date: "Nov 2" }
                    ]
                },
                {
                    rank: 9, name: "Reapers Baseball Club", wins: 0, losses: 8, ties: 1, winPct: 0.056, runDiff: -64, runsFor: 48, runsAgainst: 112,
                    games: [
                        { opponent: "@ Lemon Grove Athletics", score: "5-10", result: "loss", date: "Sep 7" },
                        { opponent: "vs Heroes", score: "1-22", result: "loss", date: "Sep 14" },
                        { opponent: "@ SD Rip City", score: "2-14", result: "loss", date: "Sep 21" },
                        { opponent: "@ Fighting Friars", score: "3-4", result: "loss", date: "Sep 21" },
                        { opponent: "vs Diamond Dogs", score: "12-17", result: "loss", date: "Sep 28" },
                        { opponent: "vs Beavers", score: "5-7", result: "loss", date: "Oct 5" },
                        { opponent: "vs San Diego Banditos", score: "6-17", result: "loss", date: "Oct 12" },
                        { opponent: "@ SD Storm", score: "7-7", result: "tie", date: "Oct 19" },
                        { opponent: "@ Happy Sox", score: "7-14", result: "loss", date: "Nov 2" }
                    ]
                },
                {
                    rank: 10, name: "SD Storm", wins: 0, losses: 8, ties: 1, winPct: 0.056, runDiff: -87, runsFor: 60, runsAgainst: 147,
                    games: [
                        { opponent: "@ Heroes", score: "5-21", result: "loss", date: "Sep 7" },
                        { opponent: "@ Happy Sox", score: "13-18", result: "loss", date: "Sep 14" },
                        { opponent: "@ Lemon Grove Athletics", score: "7-19", result: "loss", date: "Sep 21" },
                        { opponent: "@ SD Rip City", score: "6-13", result: "loss", date: "Sep 21" },
                        { opponent: "vs Beavers", score: "6-13", result: "loss", date: "Sep 28" },
                        { opponent: "vs San Diego Banditos", score: "2-22", result: "loss", date: "Oct 5" },
                        { opponent: "@ Fighting Friars", score: "3-15", result: "loss", date: "Oct 12" },
                        { opponent: "vs Reapers Baseball Club", score: "7-7", result: "tie", date: "Oct 19" },
                        { opponent: "vs Diamond Dogs", score: "11-19", result: "loss", date: "Nov 2" }
                    ]
                }
            ],
            upcomingGames: [
                {
                    date: "Oct 19",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "Lemon Grove Athletics",
                    home: "Beavers",
                    venue: "Otay Ranch JV"
                },
                {
                    date: "Nov 9",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "Beavers",
                    home: "Diamond Dogs",
                    venue: "Chollas"
                },
                {
                    date: "Nov 9",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "Heroes",
                    home: "SD Storm",
                    venue: "San Ysidro JV"
                },
                {
                    date: "Nov 9",
                    day: "Sun",
                    time: "1:00 pm",
                    visitors: "SD Rip City",
                    home: "Fighting Friars",
                    venue: "Otay Ranch JV"
                },
                {
                    date: "Nov 9",
                    day: "Sun",
                    time: "1:00 pm",
                    visitors: "Lemon Grove Athletics",
                    home: "Reapers Baseball Club",
                    venue: "San Ysidro JV"
                },
                {
                    date: "Nov 9",
                    day: "Sun",
                    time: "1:30 pm",
                    visitors: "San Diego Banditos",
                    home: "Happy Sox",
                    venue: "Chollas"
                }
            ]
        },

        spring2026: {
            id: 'spring2026',
            name: 'Spring 2026',
            division: '25A',
            divisionId: null,
            status: 'upcoming',
            regularSeasonGames: 14,
            teams: [
            ],
            upcomingGames: [
            ]
        }
    }
};
