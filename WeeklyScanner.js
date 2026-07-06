/**
 * ==========================================
 * Smokin Aces Command Center
 * WeeklyScanner.gs
 * Version 5.0
 * Feature 1 - Automatic Tournament Discovery
 * ==========================================
 */

function scanPlayersForNewEvents() {

  const playersSheet = getSheet(CONFIG.PLAYERS_SHEET);
  const tournamentsSheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const players = playersSheet.getDataRange().getValues();
  const tournaments = tournamentsSheet.getDataRange().getValues();

  const existingEvents = {};

  for (let i = 1; i < tournaments.length; i++) {

    const eventId = String(tournaments[i][0]).trim();

    if (eventId !== "") {
      existingEvents[eventId] = true;
    }

  }

  const discoveredEvents = {};

  let playersScanned = 0;
  let failedPlayers = 0;

  for (let i = 1; i < players.length; i++) {

    const playerName = String(players[i][0]).trim();
    const pdga = String(players[i][1]).trim();

    if (pdga === "") {
      continue;
    }

    playersScanned++;

    Logger.log("Scanning " + playerName + " (" + pdga + ")");

    try {

      const html = UrlFetchApp.fetch(
        "https://www.pdga.com/player/" + pdga,
        {
          muteHttpExceptions: true
        }
      ).getContentText();

      const section = html.match(
        /2026 Tournament Results([\s\S]*?)Recent Round Ratings/i
      );

      if (!section) {

        Logger.log("No 2026 results for " + playerName);

        Utilities.sleep(250);

        continue;

      }

      const matches = section[1].match(/\/tour\/event\/(\d+)/g);

      if (matches) {

        matches.forEach(function(match){

          const eventId = match.replace("/tour/event/","");

          if (!existingEvents[eventId]) {

            discoveredEvents[eventId] = true;

          }

        });

      }

      Utilities.sleep(250);

    } catch (err) {

      failedPlayers++;

      Logger.log(
        "Failed to scan player " +
        playerName +
        " (" +
        pdga +
        ")"
      );

    }

  }

  const events = Object.keys(discoveredEvents).sort();

  let added = 0;

  events.forEach(function(eventId){

    tournamentsSheet.appendRow([
      eventId,
      "",
      "",
      "",
      "",
      "https://www.pdga.com/tour/event/" + eventId,
      "No",
      new Date()
    ]);

    added++;

  });

  let message = "";

  message += "Weekly Tournament Discovery Complete\n\n";

  message +=
    "Players Scanned: " +
    playersScanned +
    "\n";
      message +=
    "Players Failed: " +
    failedPlayers +
    "\n";

  message +=
    "New Tournaments Found: " +
    added +
    "\n\n";

  if (events.length > 0) {

    message +=
      "New Event IDs\n";
    message +=
      "--------------------------\n";

    events.forEach(function(eventId){

      message += eventId + "\n";

    });

  } else {

    message +=
      "No new tournaments were discovered.";

  }

  SpreadsheetApp.getUi().alert(message);

}


/**
 * Developer Test
 */
function testWeeklyScanner() {

  scanPlayersForNewEvents();

}