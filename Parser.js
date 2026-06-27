/**
 * ==========================================
 * Smokin Aces Command Center
 * Parser.gs
 * Version 2.0
 * ==========================================
 */

/**
 * Downloads the HTML for a PDGA tournament page.
 */
function getTournamentHTML(url) {

  if (!url) {
    throw new Error("getTournamentHTML() was called without a URL.");
  }

  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  return response.getContentText();

}


/**
 * Developer Test
 */
function testTournamentHTML() {

  const url = "https://www.pdga.com/tour/event/104782";

  const html = getTournamentHTML(url);

  SpreadsheetApp.getUi().alert(
    "Downloaded " + html.length + " characters."
  );

}


/**
 * Developer Tool
 */
function inspectPlayerProfile() {

  const url = "https://www.pdga.com/player/48445";

  const html = UrlFetchApp.fetch(url).getContentText();

  const searches = [
    "Derek",
    "48445",
    "Recent",
    "Results",
    "Tournament",
    "Rounds"
  ];

  let output = "";

  searches.forEach(function(item){

    output += item + " : " + html.indexOf(item) + "\n";

  });

  SpreadsheetApp.getUi().alert(output);

}