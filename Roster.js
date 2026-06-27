/**
 * ==========================================
 * Smokin Aces Command Center
 * Roster.gs
 * Version 1.1
 * ==========================================
 */

/**
 * Builds a lookup table of every player on the roster.
 * The PDGA number is used as the unique key.
 */
function getRosterLookup() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  SpreadsheetApp.getUi().alert("Spreadsheet Connected");

  const sheet = ss.getSheetByName(CONFIG.PLAYERS_SHEET);

  if (!sheet) {
    SpreadsheetApp.getUi().alert("Players sheet NOT found.");
    return {};
  }

  SpreadsheetApp.getUi().alert("Players sheet found.");

  const values = sheet.getDataRange().getValues();

  SpreadsheetApp.getUi().alert(values.length + " rows read.");

  const roster = {};

  for (let i = 1; i < values.length; i++) {

    const name = values[i][0];
    const pdga = String(values[i][1]).trim();

    if (!pdga) continue;

    roster[pdga] = {
      name: name,
      pdga: pdga
    };

  }

  return roster;

}

/**
 * Returns TRUE if a PDGA number belongs to
 * a Smokin Aces player.
 */
function isRosterPlayer(pdgaNumber) {

  const roster = getRosterLookup();

  return roster.hasOwnProperty(
    String(pdgaNumber).trim()
  );

}

/**
 * Developer Test
 */
function testRoster() {

  const roster = getRosterLookup();

  SpreadsheetApp.getUi().alert(
    "Players Loaded: " +
    Object.keys(roster).length
  );

}