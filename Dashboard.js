/**
 * ==========================================
 * Smokin Aces Command Center
 * Dashboard.gs
 * Version 3.0
 * ==========================================
 */

function refreshDashboard() {

  const dashboard = getSheet(CONFIG.DASHBOARD_SHEET);
  const stats = getSheet(CONFIG.STATS_SHEET);
  const tournaments = getSheet(CONFIG.TOURNAMENTS_SHEET);

  const statsData = stats.getDataRange().getValues();
  const tournamentData = tournaments.getDataRange().getValues();

  const playerCount = statsData.length - 1;
  const tournamentCount = Math.max(tournamentData.length - 1, 0);

  let totalWins = 0;
  let totalPodiums = 0;

  let winsLeader = "";
  let winsLeaderWins = -1;

  let mostActive = "";
  let mostEvents = -1;

  let highestRoundPlayer = "";
  let highestRound = -1;

  let bestAveragePlayer = "";
  let bestAverage = 999;

  for (let i = 1; i < statsData.length; i++) {

    const row = statsData[i];

    const name = row[0];

    const events = Number(row[3]) || 0;
    const wins = Number(row[4]) || 0;
    const podiums = Number(row[5]) || 0;
    const averageFinish = Number(row[7]) || 0;
    const highestRatedRound = Number(row[9]) || 0;

    totalWins += wins;
    totalPodiums += podiums;

    if (wins > winsLeaderWins) {
      winsLeaderWins = wins;
      winsLeader = name;
    }

    if (events > mostEvents) {
      mostEvents = events;
      mostActive = name;
    }

    if (highestRatedRound > highestRound) {
      highestRound = highestRatedRound;
      highestRoundPlayer = name;
    }

    if (averageFinish > 0 && averageFinish < bestAverage) {
      bestAverage = averageFinish;
      bestAveragePlayer = name;
    }

  }

  let latestTournament = "";

  if (tournamentCount > 0) {
    latestTournament = tournamentData[tournamentData.length - 1][1];
  }

  // VALUE CELLS

  dashboard.getRange("A5").setValue(playerCount);

  dashboard.getRange("C5").setValue(totalWins);

  dashboard.getRange("E5").setValue(totalPodiums);

  dashboard.getRange("G5").setValue(tournamentCount);

  dashboard.getRange("A9").setValue(
    winsLeader + " (" + Math.max(winsLeaderWins,0) + ")"
  );

  dashboard.getRange("E9").setValue(
    mostActive + " (" + Math.max(mostEvents,0) + ")"
  );

  dashboard.getRange("A13").setValue(
    highestRoundPlayer + " (" + Math.max(highestRound,0) + ")"
  );

  dashboard.getRange("E13").setValue(
    bestAveragePlayer +
    (bestAverage < 999 ? " (" + bestAverage.toFixed(2) + ")" : "")
  );

  dashboard.getRange("A17").setValue(latestTournament);

  dashboard.getRange("A21").setValue(new Date());

  SpreadsheetApp.getUi().alert("Dashboard refreshed!");

}

/**
 * Developer Test
 */
function testDashboard() {
  refreshDashboard();
}