/**
 * ==========================================
 * Smokin Aces Command Center
 * TournamentImporter.gs
 * Version 2.0
 * Queue-Based Tournament Importer
 * ==========================================
 */

/**
 * Imports every tournament currently waiting in the queue.
 *
 * Queue Rules:
 * Imported = FALSE  -> Import tournament
 * Imported = TRUE   -> Skip tournament
 */
function importQueuedTournaments() {

  const sheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const values = sheet.getDataRange().getValues();

  let imported = 0;

  for (let row = 1; row < values.length; row++) {

    const eventId = String(values[row][0]).trim();
    const url = String(values[row][5]).trim();
    const alreadyImported = values[row][6];

    if (!eventId) {
      continue;
    }

    if (String(alreadyImported).toUpperCase() === "TRUE") {
      continue;
    }

    if (!url) {
      Logger.log("Missing URL for Event " + eventId);
      continue;
    }

    Logger.log("Importing Event " + eventId);

    try {

      const html = getTournamentHTML(url);

      const tournament = parseTournament(html, url);

      // Column B
      sheet.getRange(row + 1, 2)
        .setValue(tournament.tournamentName);

      // Column C
      sheet.getRange(row + 1, 3)
        .setValue(tournament.tournamentDate);

      // Column D
      sheet.getRange(row + 1, 4)
        .setValue(tournament.tier);

      // Column E
      sheet.getRange(row + 1, 5)
        .setValue(tournament.location);

      // Column G
      sheet.getRange(row + 1, 7)
        .setValue(true);

      // Column H
      sheet.getRange(row + 1, 8)
        .setValue(new Date());

      imported++;

      Utilities.sleep(250);

    } catch (err) {

      Logger.log(
        "Failed Event " +
        eventId +
        " : " +
        err
      );

    }

  }

  SpreadsheetApp.getUi().alert(

    "Tournament Import Complete\n\n" +

    "Imported: " + imported

  );

}


/**
 * Developer Test
 */
function testTournamentImporter() {

  importQueuedTournaments();

}