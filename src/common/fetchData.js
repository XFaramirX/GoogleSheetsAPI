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
 /* translations.forEach((_, i) => {
    jsonTranslations[i].productHero.eyebrow = json['Hero Product'].Eyebrow[i];
    jsonTranslations[i].productHero.headline = json['Hero Product']['Header 2 - Tease'][i];
    jsonTranslations[i].intro.copyBlock.eyebrow = json['Intro / Copy Block']['Eyebrow - Tease'][i],
    jsonTranslations[i].intro.copyBlock.headline = json['Intro / Copy Block'].Header[i];
    jsonTranslations[i].intro.copyBlock.copy = json['Intro / Copy Block']['Body  - Tease'][i];
    jsonTranslations[i].intro.copyBlock.cta[0].text = json['Intro / Copy Block']['CTA - Tease'][i];
    jsonTranslations[i].intro.copyBlock.cta[1].text = json['Intro / Copy Block']['CTA2 - Tease'][i];
    jsonTranslations[i].section1.copyBlock.headline = json['Section1 / Copy Block'].Subhead[i];
    jsonTranslations[i].section1.copyBlock.copy = json['Section1 / Copy Block'].Body[i];
    jsonTranslations[i].section1.mediaCard.images[0].image.alt = json['Section1 / Copy Block']['Alt text'][i];
    // missing media card info
    jsonTranslations[i].mediaWithList.items[0].headline = json['Media-List'].Header[i];
    jsonTranslations[i].mediaWithList.items[0].headline = json['Media-List'].Header2[i];
    jsonTranslations[i].mediaWithList.items[0].copy = json['Media-List'].Body[i];
    jsonTranslations[i].newsletterForm.header = json.NewsLetterForm['Header - Tease'][i];
    jsonTranslations[i].newsletterForm.description = json.NewsLetterForm['Body - Tease'][i];
    jsonTranslations[i].newsletterForm.forms[0].newsletterInput.label = json.NewsLetterForm['Eyebrow - Tease'][i];
    jsonTranslations[i].newsletterForm.forms[0].newsletterInput.placeholder = json.NewsLetterForm['Pre-populated form field copy - Tease'][i];
    jsonTranslations[i].section2.copyBlock.headline = json['Section2 / Copy Block']['Header - Tease'][i];
    jsonTranslations[i].section2.copyBlock.copy = json['Section2 / Copy Block']['Body - Tease'][i];
    jsonTranslations[i].section2.copyBlock.cta[0].text = json['Section2 / Copy Block']['CTA - Tease'][i];
    jsonTranslations[i].section2.copyBlock.cta[1].text = json['Section2 / Copy Block']['CTA2 - Tease'][i];
    // missing media card info
    jsonTranslations[i].section3.copyBlock.headline = json['Section3 / Copy Block'].Header[i];
    jsonTranslations[i].section3.copyBlock.copy = json['Section3 / Copy Block'].Body[i];
    jsonTranslations[i].section3.copyBlock.cta[0].text = json['Section3 / Copy Block'].CTA[i];
    jsonTranslations[i].section4.copyBlock.headline = json['Section4 / Copy Block'].Header[i];
    jsonTranslations[i].section4.copyBlock.copy = json['Section4 / Copy Block'].Body[i];
    jsonTranslations[i].section4.copyBlock.cta[0].text = json['Section4 / Copy Block'].CTA[i]
  });
  return jsonTranslations; */
}

const getRunfulnessTranslations = (json, jsonTranslations) => {
  translations.forEach((_, i) => {
    jsonTranslations[i].landingRepeater.heroMedia.background.alt = json['Hero Media']['Alt text'][i];
    jsonTranslations[i].landingRepeater.heroMedia.content.title.text = json['Hero Media'].Header[i];
    jsonTranslations[i].landingRepeater.heroMedia.content.description = json['Hero Media'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.eyebrow = json['Intro/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.headline = json['Intro/CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.copy = json['Intro/CopyBlock'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.alt = json['Intro/MediaCard']['Alt text'][i];

    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.alt = json['Intro/MediaCard']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.eyebrow = json['section1/CopyBlock-Quote'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.headline = json['section1/CopyBlock-Quote']['Header (TBD)'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.copy = json['section1/CopyBlock-Quote']['Name (TBD)'][i];

    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.eyebrow = json['section2/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.headline = json['section2/CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.copy = json['section2/CopyBlock'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[0].copyBlock.eyebrow = json['section2/CopyOne-CopyBlock']['Subhead 1'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[1].copyBlock.eyebrow = json['section2/CopyTwo-CopyBlock']['Subhead 2'][i];

    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.eyebrow = json['section3/CopyBlock-Media Card'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.headline = json['section3/CopyBlock-Media Card'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.copy = json['section3/CopyBlock-Media Card'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.cta[0].text = json['section3/CopyBlock-Media Card'].CTA[i];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.alt = json['section3/CopyBlock-Media Card']['Alt text'][i];
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