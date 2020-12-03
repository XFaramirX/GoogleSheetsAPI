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
      range: "Runfulness Phase 1 LP!A2:G",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        // Print columns A and E, which correspond to indices 0 and 4.
        getGlycerine(spreadsheetToJson(rows));
        createFile(jsonTranslation);
      } else {
        console.log("No data found.");
      }
    }
  );

  function getGlycerine(json) {
    var pageJson = require("./runfulnessP1.json");

    //Create a new json file for each language and sets a property language.
    translations.forEach((lang) => {
      let idiom = JSON.parse(JSON.stringify(pageJson));
      idiom.language = lang.toString();
      jsonTranslation.push(idiom);
    });
    getHeroMedia(json);
  }

  function getHeroMedia(json) {
    translations.forEach((_, i) => {
      jsonTranslation[i].heroMedia.background.alt = json['Hero Media']['Alt text'][i];
      jsonTranslation[i].heroMedia.content.title.text = json['Hero Media'].Header[i];
      jsonTranslation[i].heroMedia.content.description = json['Hero Media'].Body[i];
      jsonTranslation[i].intro.copyBlock.eyebrow = json['Intro/CopyBlock'].Eyebrow[i];
      jsonTranslation[i].intro.copyBlock.headline = json['Intro/CopyBlock'].Header[i];
      jsonTranslation[i].intro.copyBlock.copy = json['Intro/CopyBlock'].Body[i];
      jsonTranslation[i].intro.mediaCard.images[0].image.alt = json['Intro/CopyBlock']['Alt text'][i];
    });
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

const spreadsheetToJson = (rows) => {
  let currentSection = '';
  const rowsCopy = rows.filter(row => row.length);
  return rowsCopy.reduce((acc, row) => {
    const section = row.shift();
    if (section) {
      currentSection = section;
      acc[currentSection] = {};
    }
    const attributes = row.shift();
    acc[currentSection][attributes] = row;
    return acc;
  }, {})
}

module.exports = glycerineLaunchPage;
