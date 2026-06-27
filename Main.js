/**
 * ==========================================
 * Smokin Aces Command Center
 * Main.gs
 * Version 2.0
 * ==========================================
 */

/**
 * Weekly Update
 * (This will become our one-click update button.)
 */
function weeklyUpdate() {

  const players = importPlayers();

  const sheet = getSheet(CONFIG.ACTIVITY_SHEET);

  sheet.clear();

  sheet.getRange(1,1,1,4).setValues([[
    "Player",
    "PDGA #",
    "Status",
    "Last Updated"
  ]]);

  const rows = players.map(player => [

    player.name,
    player.pdga,
    "Waiting to Scan",
    new Date()

  ]);

  if(rows.length){

    sheet.getRange(
      2,
      1,
      rows.length,
      rows[0].length
    ).setValues(rows);

  }

  SpreadsheetApp.getUi().alert(

    players.length +
    " players loaded into the Activity sheet."

  );

}


/**
 * Opens the Import dialog.
 */
function showImportDialog() {

  const html = HtmlService
    .createHtmlOutputFromFile("ImportResults")
    .setWidth(700)
    .setHeight(600);

  SpreadsheetApp.getUi()
    .showModalDialog(
      html,
      "Import PDGA Results"
    );

}