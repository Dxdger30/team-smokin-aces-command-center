function getSheet(name) {

  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(name);

}