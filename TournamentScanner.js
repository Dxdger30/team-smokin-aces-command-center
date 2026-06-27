/**
 * ==========================================
 * Smokin Aces Command Center
 * TournamentScanner.gs
 * Version 1.0
 * ==========================================
 */

function addTournamentIfMissing(eventId) {

  const sheet = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const values = sheet.getDataRange().getValues();

  // Already imported?
  for (let i = 1; i < values.length; i++) {

    if (String(values[i][0]) === String(eventId)) {
      return false;
    }

  }

  const url = "https://www.pdga.com/tour/event/" + eventId;

  try {

    const html = UrlFetchApp.fetch(url).getContentText();

    // Tournament Name
    let tournamentName = "";

    const titleMatch = html.match(
      /<title>(.*?)\s*\|\s*Professional Disc Golf Association<\/title>/i
    );

    if (titleMatch) {
      tournamentName = titleMatch[1].trim();
    }

    // Tournament Date
    let tournamentDate = "";

    const dateMatch = html.match(
      /Date[^<]*<\/div>\s*<div[^>]*>(.*?)<\/div>/i
    );

    if (dateMatch) {
      tournamentDate = dateMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    // Tier
    let tier = "";

    const tierMatch = html.match(
      /Tier[^<]*<\/div>\s*<div[^>]*>(.*?)<\/div>/i
    );

    if (tierMatch) {
      tier = tierMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    // Location
    let location = "";

    const locationMatch = html.match(
      /Location[^<]*<\/div>\s*<div[^>]*>(.*?)<\/div>/i
    );

    if (locationMatch) {
      location = locationMatch[1].replace(/<[^>]+>/g, "").trim();
    }

    sheet.appendRow([
      eventId,
      tournamentName,
      tournamentDate,
      tier,
      location,
      url,
      false,
      new Date()
    ]);

    return true;

  } catch (e) {

    Logger.log(e);

    return false;

  }

}