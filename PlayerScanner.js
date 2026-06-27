/**
 * ==========================================
 * Smokin Aces Command Center
 * PlayerScanner.gs
 * DEBUG VERSION
 * ==========================================
 */

function importPlayerTournaments() {

  const players = getSheet(CONFIG.PLAYERS_SHEET)
    .getDataRange()
    .getValues();

  let newEvents = 0;

  for (let i = 1; i < players.length; i++) {

    const pdga = String(players[i][1]).trim();

    if (!pdga) continue;

    newEvents += scanPlayer(pdga);

  }

  SpreadsheetApp.getUi().alert(

    "Player Scan Complete\n\n" +
    "New tournaments found: " + newEvents

  );

}



function scanPlayer(pdga) {

  const url =
    "https://www.pdga.com/player/" + pdga;

  const html = UrlFetchApp.fetch(url).getContentText();

  // DEBUG
  const regex = /event\/\d+/gi;

  const matches = html.match(regex);

  Logger.log("==================================");
  Logger.log("PLAYER: " + pdga);
  Logger.log(matches);

  return 0;

}