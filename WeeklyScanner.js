/**
 * ==========================================
 * Smokin Aces Command Center
 * WeeklyScanner.gs
 * Version 4.0
 * ==========================================
 */

function scanPlayersForNewEvents() {

  const playersSheet = getSheet(CONFIG.PLAYERS_SHEET);
  const tournamentsSheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const players = playersSheet.getDataRange().getValues();
  const tournaments = tournamentsSheet.getDataRange().getValues();

  // Existing tournaments already imported
  const existingEvents = {};

  for (let i = 1; i < tournaments.length; i++) {

    const eventId = String(tournaments[i][0]).trim();

    if (eventId) {
      existingEvents[eventId] = true;
    }

  }

  // New events discovered
  const newEvents = {};

  let playersScanned = 0;

  for (let i = 1; i < players.length; i++) {

    const pdga = players[i][1];

    if (!pdga) continue;

    playersScanned++;

    try {

      const url =
        "https://www.pdga.com/player/" + pdga;

      const html = UrlFetchApp.fetch(url).getContentText();

      // Find ONLY the 2026 Tournament Results section
      const section = html.match(
        /2026 Tournament Results([\s\S]*?)Recent Round Ratings/i
      );

      if (!section) {

        Utilities.sleep(300);
        continue;

      }

      const matches = section[1].match(/\/tour\/event\/(\d+)/g);

      if (matches) {

        matches.forEach(function(match){

          const eventId = match.replace("/tour/event/","");

          if (!existingEvents[eventId]) {

            newEvents[eventId] = true;

          }

        });

      }

      Utilities.sleep(300);

    } catch(err){

      Logger.log("Failed Player " + pdga);

    }

  }

  const events = Object.keys(newEvents).sort();

  let output =
    "Players scanned: " + playersScanned +
    "\n\n";

  if(events.length === 0){

    output +=
      "No new 2026 tournaments found.";

  }else{

    output +=
      "New 2026 tournaments found: " +
      events.length +
      "\n\n";

    output += events.join("\n");

  }

  SpreadsheetApp.getUi().alert(output);

}


/**
 * Developer Test
 */
function testWeeklyScanner(){

  scanPlayersForNewEvents();

}