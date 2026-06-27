/**
 * ==========================================
 * Smokin Aces Command Center
 * TournamentImporter.gs
 * Version 1.0
 * ==========================================
 */

/**
 * Imports a tournament into the Tournaments sheet.
 * (Version 1 - Tournament Information Only)
 */
function importTournament(url) {

  if (!url) {
    SpreadsheetApp.getUi().alert("Please provide a PDGA tournament URL.");
    return;
  }

  const html = UrlFetchApp.fetch(url).getContentText();

  // -------------------------------
  // Event ID
  // -------------------------------

  const eventMatch = url.match(/event\/(\d+)/);

  const eventId = eventMatch ? eventMatch[1] : "";

  // -------------------------------
  // Tournament Name
  // -------------------------------

  let tournamentName = "";

  const titleMatch = html.match(/<title>(.*?)\s*\|\s*Professional Disc Golf Association<\/title>/i);

  if (titleMatch) {
    tournamentName = titleMatch[1].trim();
  }

  // -------------------------------
  // Write to Sheet
  // -------------------------------

  const sheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  sheet.appendRow([
    eventId,
    tournamentName,
    "",
    "",
    "",
    url,
    true,
    new Date()
  ]);

  SpreadsheetApp.getUi().alert(
    "Tournament Imported!\n\n" +
    tournamentName
  );

}

/**
 * Temporary test function.
 */
function testTournamentImport() {

  importTournament(
    "https://www.pdga.com/tour/event/104782"
  );

}