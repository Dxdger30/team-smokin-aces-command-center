/**
 * ==========================================
 * Smokin Aces Command Center
 * Stats.gs
 * Version 2.0
 * ==========================================
 */

/**
 * Represents one Smokin Aces player.
 */
class Player {

  constructor(name, pdgaNumber) {

    this.name = name;
    this.pdga = String(pdgaNumber);

    this.rating = "";
    this.eventsPlayed = 0;
    this.wins = 0;
    this.top3 = 0;
    this.bestFinish = "";
    this.averageFinish = "";
    this.ratingChange = "";
    this.highestRatedRound = "";
    this.averageEventRating = "";
    this.aces = 0;

  }

}


/**
 * Refreshes the entire 2026 Stats sheet.
 */
function refreshStats() {

  const playersSheet = getSheet(CONFIG.PLAYERS_SHEET);
  const resultsSheet = getSheet(CONFIG.RESULTS_SHEET);

  const playerValues = playersSheet.getDataRange().getValues();
  const resultValues = resultsSheet.getDataRange().getValues();

  const players = [];

  for (let i = 1; i < playerValues.length; i++) {

    const name = playerValues[i][0];
    const pdga = playerValues[i][1];

    if (!pdga) continue;

    const player = new Player(name, pdga);

    const results = resultValues.filter(function(r){

      return String(r[4]) == player.pdga;

    });

    const uniqueEvents = {};

    const finishes = [];
    const roundRatings = [];

    results.forEach(function(r){

      uniqueEvents[r[0]] = true;

      const place = Number(r[6]);

      if(place > 0){
        finishes.push(place);
      }

      const rating = Number(r[8]);

      if(rating > 0){
        roundRatings.push(rating);
      }

      if(r[11] === true){
        player.wins++;
      }

      if(r[12] === true){
        player.top3++;
      }

    });

    player.eventsPlayed = Object.keys(uniqueEvents).length;

    if(finishes.length){

      player.bestFinish = Math.min(...finishes);

      player.averageFinish =
        (finishes.reduce((a,b)=>a+b,0)/finishes.length).toFixed(2);

    }

    if(roundRatings.length){

      player.highestRatedRound = Math.max(...roundRatings);

      player.averageEventRating =
        Math.round(
          roundRatings.reduce((a,b)=>a+b,0)/roundRatings.length
        );

    }

    players.push(player);

  }

  buildStatsSheet(players);

  SpreadsheetApp.getUi().alert(
    "Stats refreshed for " + players.length + " players."
  );

}


/**
 * Writes player data to the Stats sheet.
 */
function buildStatsSheet(players) {

  const sheet = getSheet(CONFIG.STATS_SHEET);

  sheet.clearContents();

  const headers = [[

    "Player",
    "PDGA #",
    "Rating",
    "Events Played",
    "Wins",
    "Top 3",
    "Best Finish",
    "Average Finish",
    "Rating Change",
    "Highest Rated Round",
    "Average Event Rating",
    "Aces"

  ]];

  sheet.getRange(1,1,1,headers[0].length)
       .setValues(headers);

  const rows = players.map(function(player){

    return [

      player.name,
      player.pdga,
      player.rating,
      player.eventsPlayed,
      player.wins,
      player.top3,
      player.bestFinish,
      player.averageFinish,
      player.ratingChange,
      player.highestRatedRound,
      player.averageEventRating,
      player.aces

    ];

  });

  if(rows.length){

    sheet.getRange(
      2,
      1,
      rows.length,
      rows[0].length
    ).setValues(rows);

  }

}


/**
 * Developer Test
 */
function testRefreshStats(){

  refreshStats();

}