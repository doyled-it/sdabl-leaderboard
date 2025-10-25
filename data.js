// SDABL Standings Data
// Multi-season support

const seasonsData = {
    currentSeason: 'fall2025',

    seasons: {
        fall2025: {
            id: 'fall2025',
            name: 'Fall 2025',
            division: '25A',
            divisionId: '1061524',
            status: 'active',
            regularSeasonGames: 10,
            teams: [
                {
                    rank: 1, name: "Heroes", wins: 7, losses: 1, ties: 0, winPct: 0.875, runDiff: 50, runsFor: 114, runsAgainst: 64,
                    games: [
                        { opponent: "vs SD Storm", score: "21-5", result: "win", date: "Sep 7" },
                        { opponent: "@ Reapers Baseball Club", score: "22-1", result: "win", date: "Sep 14" },
                        { opponent: "@ San Diego Banditos", score: "13-9", result: "win", date: "Sep 21" },
                        { opponent: "vs Lemon Grove Athletics", score: "12-11", result: "win", date: "Sep 28" },
                        { opponent: "vs Fighting Friars", score: "8-7", result: "win", date: "Oct 5" },
                        { opponent: "@ Happy Sox", score: "12-7", result: "win", date: "Oct 12" },
                        { opponent: "vs Diamond Dogs", score: "10-7", result: "win", date: "Oct 19" },
                        { opponent: "@ Beavers", score: "16-17", result: "loss", date: "Oct 19" }
                    ]
                },
                {
                    rank: 2, name: "Beavers", wins: 6, losses: 1, ties: 0, winPct: 0.857, runDiff: 17, runsFor: 66, runsAgainst: 49,
                    games: [
                        { opponent: "vs Diamond Dogs", score: "8-2", result: "win", date: "Sep 7" },
                        { opponent: "@ Fighting Friars", score: "7-6", result: "win", date: "Sep 14" },
                        { opponent: "vs Happy Sox", score: "10-8", result: "win", date: "Sep 21" },
                        { opponent: "@ SD Storm", score: "13-6", result: "win", date: "Sep 28" },
                        { opponent: "@ Reapers Baseball Club", score: "7-5", result: "win", date: "Oct 5" },
                        { opponent: "vs SD Rip City", score: "4-6", result: "loss", date: "Oct 12" },
                        { opponent: "vs Heroes", score: "17-16", result: "win", date: "Oct 19" }
                    ]
                },
                {
                    rank: 3, name: "Lemon Grove Athletics", wins: 5, losses: 1, ties: 1, winPct: 0.786, runDiff: 37, runsFor: 86, runsAgainst: 49,
                    games: [
                        { opponent: "vs Reapers Baseball Club", score: "10-5", result: "win", date: "Sep 7" },
                        { opponent: "@ SD Rip City", score: "12-6", result: "win", date: "Sep 14" },
                        { opponent: "vs SD Storm", score: "19-7", result: "win", date: "Sep 21" },
                        { opponent: "@ San Diego Banditos", score: "2-2", result: "tie", date: "Sep 28" },
                        { opponent: "@ Heroes", score: "11-12", result: "loss", date: "Sep 28" },
                        { opponent: "vs Happy Sox", score: "15-12", result: "win", date: "Oct 5" },
                        { opponent: "vs Diamond Dogs", score: "17-5", result: "win", date: "Oct 12" }
                    ]
                },
                {
                    rank: 4, name: "SD Rip City", wins: 5, losses: 2, ties: 0, winPct: 0.714, runDiff: 27, runsFor: 76, runsAgainst: 49,
                    games: [
                        { opponent: "vs Fighting Friars", score: "14-8", result: "win", date: "Sep 7" },
                        { opponent: "vs Lemon Grove Athletics", score: "6-12", result: "loss", date: "Sep 14" },
                        { opponent: "vs Reapers Baseball Club", score: "14-2", result: "win", date: "Sep 21" },
                        { opponent: "vs SD Storm", score: "13-6", result: "win", date: "Sep 21" },
                        { opponent: "vs Happy Sox", score: "4-8", result: "loss", date: "Sep 28" },
                        { opponent: "@ Diamond Dogs", score: "19-9", result: "win", date: "Oct 5" },
                        { opponent: "@ Beavers", score: "6-4", result: "win", date: "Oct 12" }
                    ]
                },
                {
                    rank: 5, name: "San Diego Banditos", wins: 3, losses: 3, ties: 1, winPct: 0.500, runDiff: 17, runsFor: 81, runsAgainst: 64,
                    games: [
                        { opponent: "vs Happy Sox", score: "5-20", result: "loss", date: "Sep 7" },
                        { opponent: "@ Diamond Dogs", score: "11-13", result: "loss", date: "Sep 14" },
                        { opponent: "vs Heroes", score: "9-13", result: "loss", date: "Sep 21" },
                        { opponent: "vs Lemon Grove Athletics", score: "2-2", result: "tie", date: "Sep 28" },
                        { opponent: "@ Fighting Friars", score: "15-8", result: "win", date: "Sep 28" },
                        { opponent: "@ SD Storm", score: "22-2", result: "win", date: "Oct 5" },
                        { opponent: "@ Reapers Baseball Club", score: "17-6", result: "win", date: "Oct 12" }
                    ]
                },
                {
                    rank: 6, name: "Happy Sox", wins: 4, losses: 4, ties: 0, winPct: 0.500, runDiff: 15, runsFor: 101, runsAgainst: 86,
                    games: [
                        { opponent: "@ San Diego Banditos", score: "20-5", result: "win", date: "Sep 7" },
                        { opponent: "vs SD Storm", score: "18-13", result: "win", date: "Sep 14" },
                        { opponent: "@ Beavers", score: "8-10", result: "loss", date: "Sep 21" },
                        { opponent: "@ SD Rip City", score: "8-4", result: "win", date: "Sep 28" },
                        { opponent: "@ Diamond Dogs", score: "17-18", result: "loss", date: "Sep 28" },
                        { opponent: "@ Lemon Grove Athletics", score: "12-15", result: "loss", date: "Oct 5" },
                        { opponent: "vs Heroes", score: "7-12", result: "loss", date: "Oct 12" },
                        { opponent: "vs Fighting Friars", score: "11-9", result: "win", date: "Oct 19" }
                    ]
                },
                {
                    rank: 7, name: "Fighting Friars", wins: 3, losses: 5, ties: 0, winPct: 0.375, runDiff: 5, runsFor: 89, runsAgainst: 84,
                    games: [
                        { opponent: "@ SD Rip City", score: "8-14", result: "loss", date: "Sep 7" },
                        { opponent: "vs Beavers", score: "6-7", result: "loss", date: "Sep 14" },
                        { opponent: "@ Diamond Dogs", score: "32-23", result: "win", date: "Sep 21" },
                        { opponent: "vs Reapers Baseball Club", score: "4-3", result: "win", date: "Sep 21" },
                        { opponent: "vs San Diego Banditos", score: "8-15", result: "loss", date: "Sep 28" },
                        { opponent: "@ Heroes", score: "7-8", result: "loss", date: "Oct 5" },
                        { opponent: "vs SD Storm", score: "15-3", result: "win", date: "Oct 12" },
                        { opponent: "@ Happy Sox", score: "9-11", result: "loss", date: "Oct 19" }
                    ]
                },
                {
                    rank: 8, name: "Diamond Dogs", wins: 3, losses: 5, ties: 0, winPct: 0.375, runDiff: -32, runsFor: 94, runsAgainst: 126,
                    games: [
                        { opponent: "@ Beavers", score: "2-8", result: "loss", date: "Sep 7" },
                        { opponent: "vs San Diego Banditos", score: "13-11", result: "win", date: "Sep 14" },
                        { opponent: "vs Fighting Friars", score: "23-32", result: "loss", date: "Sep 21" },
                        { opponent: "@ Reapers Baseball Club", score: "17-12", result: "win", date: "Sep 28" },
                        { opponent: "vs Happy Sox", score: "18-17", result: "win", date: "Sep 28" },
                        { opponent: "vs SD Rip City", score: "9-19", result: "loss", date: "Oct 5" },
                        { opponent: "@ Lemon Grove Athletics", score: "5-17", result: "loss", date: "Oct 12" },
                        { opponent: "@ Heroes", score: "7-10", result: "loss", date: "Oct 19" }
                    ]
                },
                {
                    rank: 9, name: "Reapers Baseball Club", wins: 0, losses: 7, ties: 1, winPct: 0.063, runDiff: -57, runsFor: 41, runsAgainst: 98,
                    games: [
                        { opponent: "@ Lemon Grove Athletics", score: "5-10", result: "loss", date: "Sep 7" },
                        { opponent: "vs Heroes", score: "1-22", result: "loss", date: "Sep 14" },
                        { opponent: "@ SD Rip City", score: "2-14", result: "loss", date: "Sep 21" },
                        { opponent: "@ Fighting Friars", score: "3-4", result: "loss", date: "Sep 21" },
                        { opponent: "vs Diamond Dogs", score: "12-17", result: "loss", date: "Sep 28" },
                        { opponent: "vs Beavers", score: "5-7", result: "loss", date: "Oct 5" },
                        { opponent: "vs San Diego Banditos", score: "6-17", result: "loss", date: "Oct 12" },
                        { opponent: "@ SD Storm", score: "7-7", result: "tie", date: "Oct 19" }
                    ]
                },
                {
                    rank: 10, name: "SD Storm", wins: 0, losses: 7, ties: 1, winPct: 0.063, runDiff: -79, runsFor: 49, runsAgainst: 128,
                    games: [
                        { opponent: "@ Heroes", score: "5-21", result: "loss", date: "Sep 7" },
                        { opponent: "@ Happy Sox", score: "13-18", result: "loss", date: "Sep 14" },
                        { opponent: "@ Lemon Grove Athletics", score: "7-19", result: "loss", date: "Sep 21" },
                        { opponent: "@ SD Rip City", score: "6-13", result: "loss", date: "Sep 21" },
                        { opponent: "vs Beavers", score: "6-13", result: "loss", date: "Sep 28" },
                        { opponent: "vs San Diego Banditos", score: "2-22", result: "loss", date: "Oct 5" },
                        { opponent: "@ Fighting Friars", score: "3-15", result: "loss", date: "Oct 12" },
                        { opponent: "vs Reapers Baseball Club", score: "7-7", result: "tie", date: "Oct 19" }
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
                    date: "Nov 2",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "Diamond Dogs",
                    home: "SD Storm",
                    venue: "Chollas"
                },
                {
                    date: "Nov 2",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "Reapers Baseball Club",
                    home: "Happy Sox",
                    venue: "Hilton Head"
                },
                {
                    date: "Nov 2",
                    day: "Sun",
                    time: "9:00 am",
                    visitors: "SD Rip City",
                    home: "San Diego Banditos",
                    venue: "San Ysidro JV"
                },
                {
                    date: "Nov 2",
                    day: "Sun",
                    time: "1:00 pm",
                    visitors: "Fighting Friars",
                    home: "Lemon Grove Athletics",
                    venue: "East Clairemont"
                },
                {
                    date: "Nov 2",
                    day: "Sun",
                    time: "1:00 pm",
                    visitors: "SD Rip City",
                    home: "Heroes",
                    venue: "San Ysidro JV"
                },
                {
                    date: "Nov 2",
                    day: "Sun",
                    time: "1:30 pm",
                    visitors: "Beavers",
                    home: "San Diego Banditos",
                    venue: "Montgomery"
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
