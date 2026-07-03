// Deploy this script bound to a Google Sheet to receive survey submissions.
// See README.md for step-by-step deployment instructions.

var HEADERS = [
  "timestamp",
  "id",
  "age",
  "gender",
  "height_cm",
  "weight_kg",
  "ethnicity",
  "comorbidities",
  "comorbidities_other",
  "on_medication",
  "medications",
  "medications_other",
  "smoking",
  "cigarettes_per_day",
  "years_smoked",
  "alcohol",
  "activity",
  "family_history",
];

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  var data = JSON.parse(e.postData.contents);
  var row = HEADERS.map(function (key) {
    return data[key] !== undefined ? data[key] : "";
  });

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "CV Health Demographics endpoint is live" })
  ).setMimeType(ContentService.MimeType.JSON);
}
