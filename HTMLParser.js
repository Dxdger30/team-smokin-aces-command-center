/**
 * ==========================================
 * Smokin Aces Command Center
 * HTMLParser.gs
 * Version 2.0
 * ==========================================
 */

/**
 * Returns every division and its results table.
 */
function getResultsTables(html) {

  const tables = [];

  const regex = /<details[\s\S]*?<summary>[\s\S]*?<h3[^>]*id="([^"]+)"[^>]*>[\s\S]*?<\/summary>[\s\S]*?<table[^>]*id="tournament-stats-\d+"[\s\S]*?<\/table>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {

    const division = stripHTML(match[1]);

    const table = match[0].match(/<table[^>]*id="tournament-stats-\d+"[\s\S]*?<\/table>/i);

    tables.push({

      division: division,
      table: table ? table[0] : ""

    });

  }

  return tables;

}


/**
 * Removes HTML.
 */
function stripHTML(text) {

  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

}


/**
 * Returns every player row.
 */
function getPlayerRows(tableHTML) {

  const rows = [];

  const tbody = tableHTML.match(/<tbody>([\s\S]*?)<\/tbody>/i);

  if (!tbody) return rows;

  const regex = /<tr[\s\S]*?<\/tr>/gi;

  let match;

  while ((match = regex.exec(tbody[1])) !== null) {

    rows.push(match[0]);

  }

  return rows;

}


/**
 * Returns every cell.
 */
function getCells(rowHTML) {

  const cells = [];

  const regex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let match;

  while ((match = regex.exec(rowHTML)) !== null) {

    cells.push(stripHTML(match[1]));

  }

  return cells;

}


/**
 * Converts one player row into an object.
 */
function parsePlayerRow(rowHTML) {

  const c = getCells(rowHTML);

  return {

    place: c[0] || "",
    points: c[1] || "",
    name: c[2] || "",
    pdga: c[3] || "",
    rating: c[4] || "",
    score: c[5] || "",
    roundScore: c[6] || "",
    roundRating: c[7] || "",
    total: c[8] || "",
    payout: c[9] || ""

  };

}


/**
 * Developer Test
 */
function testHTMLParser() {

  const html = getTournamentHTML(
    "https://www.pdga.com/tour/event/104782"
  );

  const tables = getResultsTables(html);

  let output = "";

  tables.forEach(function(t){

    output += t.division + "\n";

  });

  SpreadsheetApp.getUi().alert(output);

}