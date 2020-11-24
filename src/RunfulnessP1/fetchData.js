var fs = require("fs");
const { google } = require("googleapis");
let translations = ["english", "german", "french", "italian", "Spanish"];

//The json files that will contain the translation for the above languages.
var jsonTranslation = [];

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

function glycerineLaunchPage(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1VneH5neC5OPKnUEICXCsDJHxtgnIGw6H1zwtFGpWuH8",
      range: "Runfulness Phase 1 LP!B2:G",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        // Print columns A and E, which correspond to indices 0 and 4.
        getGlycerine(rows);

        createFile(jsonTranslation);
      } else {
        console.log("No data found.");
      }
    }
  );

  function getGlycerine(rows) {
    var pageJson = require("./runfulnessP1.json");

    //Create a new json file for each language and sets a property language.
    translations.forEach((lang) => {
      let idiom = JSON.parse(JSON.stringify(pageJson));
      idiom.language = lang.toString();
      jsonTranslation.push(idiom);
    });
    getProductHero(rows);
  }

  function getProductHero(rows) {
    for (let i = 0; i < translations.length; i++) {
      jsonTranslation[i].productHero.eyebrow = rows[0][i + 1];
      jsonTranslation[i].productHero.headline = rows[1][i + 1];
      jsonTranslation[i].productHero.textOne = rows[2][i + 1];
      jsonTranslation[i].productHero.cta[0].text = rows[4][i + 1];
      jsonTranslation[i].productHero.cta[1].text = rows[5][i + 1];
      jsonTranslation[i].productHero.video.cover = rows[6][i + 1];
    }
  }
}

function createFile(jsonTranslation) {
  for (let i = 0; i < translations.length; i++) {
    fs.writeFile(
      "./languages/runfulnessP1/" + jsonTranslation[i].language + ".json",
      JSON.stringify(jsonTranslation[i]),
      function (err) {
        if (err) throw err;
        console.log("complete");
      }
    );
  }
}

module.exports = glycerineLaunchPage;
