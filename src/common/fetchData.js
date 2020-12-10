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
    jsonTranslations[i].landingRepeater.productHero.video.cover.alt = json['Hero Product']['Alt text'][i];
    jsonTranslations[i].landingRepeater.productHero.eyebrow = json['Hero Product'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.productHero.headline = json['Hero Product']['Header 2 - Tease'][i];

    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.eyebrow = json['Intro / Copy Block']['Eyebrow - Tease'][i],
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.headline = json['Intro / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.copy = json['Intro / Copy Block']['Body  - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.cta[0].text = json['Intro / Copy Block']['CTA - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.cta[1].text = json['Intro / Copy Block']['CTA2 - Tease'][i];

    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.alt = json['Section1 / Copy Block']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.headline = json['Section1 / Copy Block'].Subhead[i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.copy = json['Section1 / Copy Block'].Body[i];
    
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.media.partial.alt = json['Media-List']['Alt Text'][i];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[0].headline = json['Media-List'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[1].headline = json['Media-List'].Header2[i];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[1].copy = json['Media-List'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.image.alt = json.NewsLetterForm['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.header = json.NewsLetterForm['Header - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.description = json.NewsLetterForm['Body - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[0].newsletterInput.label = json.NewsLetterForm['Eyebrow - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[0].newsletterInput.placeholder = json.NewsLetterForm['Pre-populated form field copy - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[1].newsletterInput.label = json.NewsLetterForm['Eyebrow2 - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[1].newsletterInput.placeholder = json.NewsLetterForm['Pre-populated form field copy2 - Tease'][i];

    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.headline = json['Section2 / Copy Block']['Header - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.copy = json['Section2 / Copy Block']['Body - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.cta[0].text = json['Section2 / Copy Block']['CTA - Tease'][i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.cta[1].text = json['Section2 / Copy Block']['CTA2 - Tease'][i];
    // missing media card info
    jsonTranslations[i].landingRepeater.articleSections[6].copyBlock.headline = json['Section3 / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[6].copyBlock.copy = json['Section3 / Copy Block'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[6].copyBlock.cta[0].text = json['Section3 / Copy Block'].CTA[i];

    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.headline = json['Section4 / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.copy = json['Section4 / Copy Block'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.cta[0].text = json['Section4 / Copy Block'].CTA[i]
  });
  return jsonTranslations; 
}

const getRunfulnessTranslations = (json, jsonTranslations) => {
  translations.forEach((_, i) => {
    jsonTranslations[i].landingRepeater.heroMedia.background.alt = json['Hero Media']['Alt text'][i];
    jsonTranslations[i].landingRepeater.heroMedia.background.image = json['Hero Media']['Background image'][i] ? json['Hero Media']['Background image'][i] : json['Hero Media']['Background image'][0];
    jsonTranslations[i].landingRepeater.heroMedia.content.title.text = json['Hero Media'].Header[i];
    jsonTranslations[i].landingRepeater.heroMedia.content.description = json['Hero Media'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.eyebrow = json['Intro/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.headline = json['Intro/CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.copy = json['Intro/CopyBlock'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.alt = json['Intro/MediaCard']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['1x'] = json['Intro/MediaCard']['src1x'][i] ? json['Intro/MediaCard']['src1x'][i] : json['Intro/MediaCard']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['2x'] = json['Intro/MediaCard']['src2x'][i] ? json['Intro/MediaCard']['src2x'][i] : json['Intro/MediaCard']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['3x'] = json['Intro/MediaCard']['src3x'][i] ? json['Intro/MediaCard']['src3x'][i] : json['Intro/MediaCard']['src3x'][0];

    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.alt = json['section1/MediaCard']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['1x'] = json['section1/MediaCard']['src1x'][i] ? json['section1/MediaCard']['src1x'][i] : json['section1/MediaCard']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['2x'] = json['section1/MediaCard']['src2x'][i] ? json['section1/MediaCard']['src2x'][i] : json['section1/MediaCard']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['3x'] = json['section1/MediaCard']['src3x'][i] ? json['section1/MediaCard']['src3x'][i] : json['section1/MediaCard']['src3x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.eyebrow = json['section1/CopyBlock-Quote'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.headline = json['section1/CopyBlock-Quote']['Header (TBD)'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.copy = json['section1/CopyBlock-Quote']['Name (TBD)'][i];

    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.eyebrow = json['section2/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.headline = json['section2/CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[2].copyBlock.copy = json['section2/CopyBlock'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[0].copyBlock.eyebrow = json['section2/CopyOne-CopyBlock']['Subhead 1'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[0].copyBlock.headline = json['section2/CopyOne-CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[1].copyBlock.eyebrow = json['section2/CopyTwo-CopyBlock']['Subhead 2'][i];
    jsonTranslations[i].landingRepeater.articleSections[3].columnsContainer.columns[1].copyBlock.headline = json['section2/CopyTwo-CopyBlock'].Header[i];

    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.eyebrow = json['section3/CopyBlock-Media Card'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.headline = json['section3/CopyBlock-Media Card'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.copy = json['section3/CopyBlock-Media Card'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[4].copyBlock.cta[0].text = json['section3/CopyBlock-Media Card'].CTA[i];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.alt = json['section3/CopyBlock-Media Card']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['1x'] = json['section3/CopyBlock-Media Card']['src1x'][i] ? json['section3/CopyBlock-Media Card']['src1x'][i] : json['section3/CopyBlock-Media Card']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['2x'] = json['section3/CopyBlock-Media Card']['src2x'][i] ? json['section3/CopyBlock-Media Card']['src2x'][i] : json['section3/CopyBlock-Media Card']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['3x'] = json['section3/CopyBlock-Media Card']['src3x'][i] ? json['section3/CopyBlock-Media Card']['src3x'][i] : json['section3/CopyBlock-Media Card']['src3x'][0];
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