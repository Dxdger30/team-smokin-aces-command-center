/**
 * ==========================================
 * Smokin Aces Command Center
 * Discovery.gs
 * Version 1.0
 * ==========================================
 */

/**
 * Downloads a player's PDGA profile.
 */
function getPlayerProfileHTML(pdgaNumber) {

  const url = "https://www.pdga.com/player/" + pdgaNumber;

  const html = UrlFetchApp.fetch(url).getContentText();

  return html;

}


/**
 * Developer Test
 */
function testDiscovery() {

  // Derek DG Green
  const html = getPlayerProfileHTML(48445);

  const searches = [

    "Recent Events",
    "/tour/event/",
    "event/",
    "Results",
    "Tournament"

  ];

  let output = "";

  searches.forEach(function(item){

    output += item + " : " +

      (html.indexOf(item) >= 0 ? "FOUND" : "NOT FOUND")

      + "\n";

  });

  SpreadsheetApp.getUi().alert(output);

}