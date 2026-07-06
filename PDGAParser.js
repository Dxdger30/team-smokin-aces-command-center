/**
 * ==========================================
 * Smokin Aces Command Center
 * PDGAParser.gs
 * Version 1.0
 * Tournament Metadata Parser
 * ==========================================
 */

/**
 * Parses tournament information from a PDGA event page.
 *
 * Returns:
 * {
 *   eventId,
 *   tournamentName,
 *   tournamentDate,
 *   tier,
 *   location
 * }
 */
function parseTournament(html, url) {

  const tournament = {

    eventId: "",
    tournamentName: "",
    tournamentDate: "",
    tier: "",
    location: ""

  };

  //------------------------------------------------
  // Event ID
  //------------------------------------------------

  if (url) {

    const match = url.match(/event\/(\d+)/i);

    if (match) {
      tournament.eventId = match[1];
    }

  }

  //------------------------------------------------
  // Tournament Name
  //------------------------------------------------

  const titleMatch = html.match(
    /<title>(.*?)\s*\|\s*Professional Disc Golf Association<\/title>/i
  );

  if (titleMatch) {
    tournament.tournamentName = cleanPDGAText(titleMatch[1]);
  }

  //------------------------------------------------
  // Tier
  //------------------------------------------------

  const tierMatch = html.match(
    /<h4[^>]*>(.*?)<\/h4>/i
  );

  if (tierMatch) {
    tournament.tier = cleanPDGAText(tierMatch[1]);
  }

  //------------------------------------------------
  // Date
  //------------------------------------------------

  const dateMatch = html.match(
    /<strong>Date<\/strong>:\s*([^<]+)/i
  );

  if (dateMatch) {
    tournament.tournamentDate = cleanPDGAText(dateMatch[1]);
  }

  //------------------------------------------------
  // Location
  //------------------------------------------------

  const locationMatch = html.match(
    /<strong>Location<\/strong>:\s*([^<]+)/i
  );

  if (locationMatch) {
    tournament.location = cleanPDGAText(locationMatch[1]);
  }

  return tournament;

}


/**
 * Cleans HTML entities.
 */
function cleanPDGAText(text) {

  if (!text) return "";

  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/\s+/g, " ")
    .trim();

}


/**
 * Developer Test
 */
function testPDGAParser() {

  const url = "https://www.pdga.com/tour/event/104782";

  const html = getTournamentHTML(url);

  const tournament = parseTournament(html, url);

  Logger.log(JSON.stringify(tournament, null, 2));

  SpreadsheetApp.getUi().alert(
    tournament.tournamentName +
    "\n\n" +
    tournament.tournamentDate +
    "\n" +
    tournament.tier +
    "\n" +
    tournament.location
  );

}