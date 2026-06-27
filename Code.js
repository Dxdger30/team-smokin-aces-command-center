/**
 * ==========================================
 * Smokin Aces Command Center
 * Code.gs
 * Version 1.2
 * ==========================================
 */

function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("🥏 Smokin Aces Command Center")

    .addItem("Weekly Update", "weeklyUpdate")

    .addSeparator()

    .addItem("Import Tournament", "testTournamentImport")

    .addSeparator()

    .addItem("Refresh Stats", "refreshStats")

    .addSeparator()

    .addItem("Import Results", "showImportDialog")

    .addSeparator()

    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu("Developer")
        .addItem("Test PDGA Connection", "testPDGAConnection")
        .addItem("Test Parser", "testParser")
    )

    .addToUi();

}