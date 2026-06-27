/**
 * ==========================================
 * Smokin Aces Command Center
 * Leaderboards.gs
 * Version 1.0
 * ==========================================
 */

function refreshLeaderboards() {

  const statsSheet = getSheet(CONFIG.STATS_SHEET);
  const boardSheet = getSheet(CONFIG.LEADERBOARD_SHEET);

  const data = statsSheet.getDataRange().getValues();

  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert("No player statistics found.");
    return;
  }

  boardSheet.clearContents();

  const players = [];

  for (let i = 1; i < data.length; i++) {

    players.push({

      name: data[i][0],
      pdga: data[i][1],
      events: Number(data[i][3]) || 0,
      wins: Number(data[i][4]) || 0,
      podiums: Number(data[i][5]) || 0,
      bestFinish: Number(data[i][6]) || 999,
      averageFinish: Number(data[i][7]) || 999,
      highestRound: Number(data[i][9]) || 0,
      averageRound: Number(data[i][10]) || 0

    });

  }

  writeLeaderboard(
    boardSheet,
    1,
    "MOST WINS",
    [...players].sort((a,b)=>b.wins-a.wins),
    p=>p.wins
  );

  writeLeaderboard(
    boardSheet,
    6,
    "MOST PODIUMS",
    [...players].sort((a,b)=>b.podiums-a.podiums),
    p=>p.podiums
  );

  writeLeaderboard(
    boardSheet,
    11,
    "MOST EVENTS",
    [...players].sort((a,b)=>b.events-a.events),
    p=>p.events
  );

  writeLeaderboard(
    boardSheet,
    16,
    "HIGHEST RATED ROUND",
    [...players].sort((a,b)=>b.highestRound-a.highestRound),
    p=>p.highestRound
  );

  writeLeaderboard(
    boardSheet,
    21,
    "BEST AVERAGE FINISH",
    [...players].sort((a,b)=>a.averageFinish-b.averageFinish),
    p=>p.averageFinish
  );

  boardSheet.autoResizeColumns(1,3);

  SpreadsheetApp.getUi().alert(
    "Leaderboards refreshed successfully!"
  );

}


/**
 * Writes one leaderboard section.
 */
function writeLeaderboard(sheet, row, title, players, valueFunction){

  sheet.getRange(row,1).setValue(title);

  sheet.getRange(row+1,1,1,3).setValues([[
    "Rank",
    "Player",
    "Value"
  ]]);

  const rows = [];

  const top = Math.min(10, players.length);

  for(let i=0;i<top;i++){

    rows.push([

      i+1,

      players[i].name,

      valueFunction(players[i])

    ]);

  }

  sheet.getRange(
    row+2,
    1,
    rows.length,
    3
  ).setValues(rows);

}


/**
 * Developer Test
 */
function testLeaderboards(){

  refreshLeaderboards();

}