/**
 * ==========================================
 * Smokin Aces Command Center
 * ResultsImporter.gs
 * Version 6.1
 * ==========================================
 */

function importTournamentResults(url) {

  if (!url) {
    throw new Error("No tournament URL was supplied.");
  }

  const eventId = url.match(/event\/(\d+)/)[1];

  const tournament = getTournamentInfo(eventId);

  if (!tournament) {
    SpreadsheetApp.getUi().alert(
      "Tournament " + eventId + " was not found in the Tournaments sheet."
    );
    return;
  }

  const html = getTournamentHTML(url);

  const tables = getResultsTables(html);

  const roster = getRosterLookup();

  const sheet = getSheet(CONFIG.RESULTS_SHEET);

  const existing = getExistingResults(sheet);

  let imported = 0;
  let skipped = 0;

  tables.forEach(function(tableData) {

    const division = tableData.division;

    const rows = getPlayerRows(tableData.table);

    rows.forEach(function(row) {

      const player = parsePlayerRow(row);

      if (!player.pdga) return;

      if (!roster[player.pdga]) return;

      const key = tournament.eventId + "-" + player.pdga;

      if (existing[key]) {
        skipped++;
        return;
      }

      sheet.appendRow([

        tournament.eventId,
        tournament.name,
        tournament.date,

        player.name,
        player.pdga,

        division,

        player.place,
        player.score,
        player.roundRating,
        player.payout,
        player.points,

        player.place == "1",
        ["1","2","3"].includes(player.place),

        true,
        new Date()

      ]);

      existing[key] = true;

      imported++;

    });

  });

  // Automatically refresh season stats
  refreshStats();

  SpreadsheetApp.getUi().alert(

    "Import Complete\n\n" +

    "Imported: " + imported +

    "\nSkipped: " + skipped +

    "\n\nSeason statistics have been refreshed."

  );

}


/**
 * Reads every existing result so duplicates aren't imported.
 */
function getExistingResults(sheet){

  const values = sheet.getDataRange().getValues();

  const existing = {};

  for(let i = 1; i < values.length; i++){

    const eventId = values[i][0];
    const pdga = values[i][4];

    if(!eventId || !pdga) continue;

    existing[eventId + "-" + pdga] = true;

  }

  return existing;

}


/**
 * Reads one tournament from the Tournaments sheet.
 */
function getTournamentInfo(eventId) {

  const sheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {

    if (String(values[i][0]) == String(eventId)) {

      return {

        eventId: values[i][0],
        name: values[i][1],
        date: values[i][2],
        tier: values[i][3],
        location: values[i][4],
        url: values[i][5]

      };

    }

  }

  return null;

}


/**
 * Developer Test
 */
function testResultsImporter() {

  importTournamentResults(
    "https://www.pdga.com/tour/event/104782"
  );

}