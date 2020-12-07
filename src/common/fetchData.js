const fs = require("fs");
const { google } = require("googleapis");
const runfulnessP1 = require("../RunfulnessP1/runfulnessP1.json");
const glycerin19 = require("../glycerin19Launch/glycerin19.json");
const translations = ["english", "german", "french", "italian", "Spanish"];

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

const getGlycerinTranslations = (json, jsonTranslations) => {
  translations.forEach((_, i) => {
    jsonTranslations[i].productHero.eyebrow = json['Hero Product'].Eyebrow[i];
    jsonTranslations[i].productHero.headline = json['Hero Product']['Header 1'][i];
    jsonTranslations[i].productHero.textOne = json['Hero Product']['Header 2 - Tease'][i];
  });
  return jsonTranslations;
}

const getRunfulnessTranslations = (json, jsonTranslations) => {
  translations.forEach((_, i) => {
    jsonTranslations[i].heroMedia.background.alt = json['Hero Media']['Alt text'][i];
    jsonTranslations[i].heroMedia.content.title.text = json['Hero Media'].Header[i];
    jsonTranslations[i].heroMedia.content.description = json['Hero Media'].Body[i];
    jsonTranslations[i].intro.copyBlock.eyebrow = json['Intro/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].intro.copyBlock.headline = json['Intro/CopyBlock'].Header[i];
    jsonTranslations[i].intro.copyBlock.copy = json['Intro/CopyBlock'].Body[i];
    jsonTranslations[i].intro.mediaCard.images[0].image.alt = json['Intro/CopyBlock']['Alt text'][i];
  });
  return jsonTranslations;
}

const getJsonTranslations = (pageJson) => {
  const jsonTranslations = [];
  translations.forEach((lang) => {
    let idiom = JSON.parse(JSON.stringify(pageJson));
    idiom.language = lang.toString();
    jsonTranslations.push(idiom);
  });
  return jsonTranslations;
}

const createFile = (jsonTranslation, path) => {
  translations.forEach((_, i) => {
    fs.writeFile(
      `${path}${jsonTranslation[i].language}.json`,
      JSON.stringify(jsonTranslation[i]),
      (err) => {
        if (err) throw err;
        console.log("Translation completed");
      }
    );
  })
}

const glycerineLaunch = (auth) => {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1VneH5neC5OPKnUEICXCsDJHxtgnIGw6H1zwtFGpWuH8",
      range: "Glycerin 19 Tease LP!A2:G",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (!rows.length) return console.log("No data found.");
      const jsonTranslations = getJsonTranslations(glycerin19);
      const glycerinTranslations = getGlycerinTranslations(spreadsheetToJson(rows), jsonTranslations);
      createFile(glycerinTranslations, './languages/glycerin19Launch/');
    }
  );
}

const runfulnessLaunch = (auth) => {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1VneH5neC5OPKnUEICXCsDJHxtgnIGw6H1zwtFGpWuH8",
      range: "Runfulness Phase 1 LP!A2:G",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (!rows.length) return console.log("No data found.");
      const jsonTranslations = getJsonTranslations(runfulnessP1);
      const runfulnessTranslations = getRunfulnessTranslations(spreadsheetToJson(rows), jsonTranslations);
      createFile(runfulnessTranslations, './languages/runfulnessP1/');
    });
}

module.exports = { runfulnessLaunch, glycerineLaunch }