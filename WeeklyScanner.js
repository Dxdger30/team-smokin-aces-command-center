/**
 * ==========================================
 * Smokin Aces Command Center
 * WeeklyScanner.gs
 * Version 6.0
 * Tournament Queue Builder
 * ==========================================
 */

function scanPlayersForNewEvents() {

  const tournamentsSheet = getSheet(CONFIG.TOURNAMENTS_SHEET);
  const tournaments = tournamentsSheet.getDataRange().getValues();

  const existingEvents = {};

  // Build a lookup of tournaments already in the sheet.
  for (let i = 1; i < tournaments.length; i++) {

    const eventId = String(tournaments[i][0]).trim();

    if (eventId) {
      existingEvents[eventId] = true;
    }

  }

  // Get every discovered event from the working PlayerScanner.
  const discoveredEvents = importPlayerTournaments();

  let added = 0;

  discoveredEvents.forEach(function(eventId) {

    if (existingEvents[eventId]) {
      return;
    }

    tournamentsSheet.appendRow([
      eventId,
      "",
      "",
      "",
      "",
      "https://www.pdga.com/tour/event/" + eventId,
      false,
      new Date()
    ]);

    existingEvents[eventId] = true;
    added++;

  });

  SpreadsheetApp.getUi().alert(
    "Weekly Tournament Discovery Complete\n\n" +
    "Events Discovered: " + discoveredEvents.length +
    "\nNew Tournaments Added: " + added
  );

}


/**
 * Developer Test
 */
function testWeeklyScanner() {

  scanPlayersForNewEvents();

}