/**
 * ==========================================
 * Smokin Aces Command Center
 * PlayerScanner.gs
 * Version 1.1
 * Tournament Discovery
 * ==========================================
 */

function importPlayerTournaments() {

  const players = getSheet(CONFIG.PLAYERS_SHEET)
    .getDataRange()
    .getValues();

  const allEvents = {};

  let playersScanned = 0;
  let playersFailed = 0;

  for (let i = 1; i < players.length; i++) {

    const pdga = String(players[i][1]).trim();

    if (!pdga) {
      continue;
    }

    playersScanned++;

    Logger.log("==================================");
    Logger.log("PLAYER: " + pdga);

    try {

      const events = scanPlayer(pdga);

      events.forEach(function(eventId) {
        allEvents[eventId] = true;
      });

    } catch (err) {

      playersFailed++;

      Logger.log("FAILED PLAYER: " + pdga);
      Logger.log(err);

    }

    // Slow down between players to reduce PDGA rate limiting.
    Utilities.sleep(1000);

  }

  const eventList = Object.keys(allEvents).sort();

  Logger.log("==================================");
  Logger.log("Players Scanned: " + playersScanned);
  Logger.log("Players Failed: " + playersFailed);
  Logger.log("Unique Events Found: " + eventList.length);

  SpreadsheetApp.getUi().alert(
    "Player Scan Complete\n\n" +
    "Players Scanned: " + playersScanned +
    "\nPlayers Failed: " + playersFailed +
    "\nUnique Events Found: " + eventList.length
  );

  return eventList;

}


function scanPlayer(pdga) {

  const url = "https://www.pdga.com/player/" + pdga;

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {

    try {

      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true
      });

      const code = response.getResponseCode();

      if (code === 200) {

        const html = response.getContentText();

        const matches =
          html.match(/\/tour\/event\/(\d+)/g) || [];

        const events = {};

        matches.forEach(function(match) {

          const eventId =
            match.replace("/tour/event/", "");

          events[eventId] = true;

        });

        Logger.log(Object.keys(events));

        return Object.keys(events);

      }

      if (code === 429) {

        Logger.log(
          "Rate limited for player " +
          pdga +
          " (attempt " +
          attempt +
          "/3). Waiting..."
        );

        Utilities.sleep(5000);

        continue;

      }

      throw new Error(
        "HTTP " + code + " for player " + pdga
      );

    } catch (err) {

      lastError = err;

      Logger.log(
        "Retry " +
        attempt +
        " for player " +
        pdga
      );

      Utilities.sleep(3000);

    }

  }

  throw lastError || new Error(
    "Unknown error scanning player " + pdga
  );

}