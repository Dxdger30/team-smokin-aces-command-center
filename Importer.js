/**
 * ==========================================
 * Smokin Aces Stat Center
 * Importer.gs
 * Version 0.2
 * ==========================================
 */


/**
 * Reads the Players sheet and creates Player objects.
 */
function importPlayers() {

  const sheet = getSheet(CONFIG.PLAYERS_SHEET);
  const values = sheet.getDataRange().getValues();

  const players = [];

  for (let i = 1; i < values.length; i++) {

    const row = values[i];

    if (!row[0]) continue;

    players.push(
      new Player(
        row[0],
        row[1]
      )
    );

  }

  return players;

}


/**
 * Temporary import function.
 * (We'll replace this later with automatic importing.)
 */
function saveImportedResults(text){

  const sheet = getSheet("Log");

  sheet.appendRow([
    new Date(),
    "IMPORT",
    text
  ]);

  return "Results imported successfully!";

}


/**
 * Tests downloading a PDGA tournament page.
 */
function testPDGAConnection(){

  const url = "https://www.pdga.com/tour/event/104782";

  const html = UrlFetchApp.fetch(url).getContentText();

  const searches = [

    "Derek DG Green",
    "48445",
    "Chandler Murdock",
    "138979",
    "MP40"

  ];

  let output = "";

  searches.forEach(item => {

    output += item + " : " +
      (html.includes(item) ? "FOUND" : "NOT FOUND") +
      "\n";

  });

  SpreadsheetApp.getUi().alert(output);

}