const fs = require("fs");
const { google } = require("googleapis");
const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport");

const translations = ["eng", "ger", "fre", "ita", "spa"];
const urlPrefix = '../../images/landings/';

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
    jsonTranslations[i].landingRepeater.productHero.video.cover.large = json['Hero Product']['video/cover/large'][i] ? urlPrefix +  json['Hero Product']['video/cover/large'][i] : urlPrefix + json['Hero Product']['video/cover/large'][0];
    jsonTranslations[i].landingRepeater.productHero.video.cover.small = json['Hero Product']['video/cover/small'][i] ? urlPrefix +  json['Hero Product']['video/cover/small'][i] : urlPrefix + json['Hero Product']['video/cover/small'][0];
    jsonTranslations[i].landingRepeater.productHero.video.src.large = json['Hero Product']['video/src/large'][i] ? urlPrefix +  json['Hero Product']['video/src/large'][i] : urlPrefix + json['Hero Product']['video/src/large'][0];
    jsonTranslations[i].landingRepeater.productHero.video.src.small = json['Hero Product']['video/src/small'][i] ? urlPrefix +  json['Hero Product']['video/src/small'][i] : urlPrefix + json['Hero Product']['video/src/small'][0];
    jsonTranslations[i].landingRepeater.productHero.eyebrow = json['Hero Product'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.productHero.headline = json['Hero Product']['Header 1'][i];
    //jsonTranslations[i].landingRepeater.productHero.textOne = json['Hero Product']['Header 2'];

    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.eyebrow = json['Intro / Copy Block']['Eyebrow'] ? json['Intro / Copy Block']['Eyebrow'][i] : null;
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.headline = json['Intro / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.copy = json['Intro / Copy Block']['Body'][i];
    const cta = json['Intro / Copy Block']['CTA'] ? [
      {
        text: json['Intro / Copy Block']['CTA'][i],
        link: "#",
        type: "primary"
      },
      {
        text: json['Intro / Copy Block']['CTA2'][i],
        link: "#",
        type: "primary"
      }
    ] : null;
    jsonTranslations[i].landingRepeater.articleSections[0].copyBlock.cta = cta;

    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.alt = json['Section1 / Copy Block']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['1x'] = json['Section1 / Copy Block']['src1x'][i] ? urlPrefix +  json['Section1 / Copy Block']['src1x'][i] : urlPrefix + json['Section1 / Copy Block']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['2x'] = json['Section1 / Copy Block']['src2x'][i] ? urlPrefix +  json['Section1 / Copy Block']['src2x'][i] : urlPrefix + json['Section1 / Copy Block']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['3x'] = json['Section1 / Copy Block']['src3x'][i] ? urlPrefix +  json['Section1 / Copy Block']['src3x'][i] : urlPrefix + json['Section1 / Copy Block']['src3x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.headline = json['Section1 / Copy Block'].Subhead[i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[1].copyBlock.copy = json['Section1 / Copy Block'].Body[i];

    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.media.image.alt = json['Media-List']['Alt Text'][i];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.media.image.src['1x'] = json['Media-List']['src'][i] ? urlPrefix +  json['Media-List']['src'][i] : urlPrefix + json['Media-List']['src'][0];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.media.image.src['2x'] = json['Media-List']['src2'][i] ? urlPrefix +  json['Media-List']['src2'][i] : urlPrefix + json['Media-List']['src2'][0];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.media.image.src['3x'] = json['Media-List']['src3'][i] ? urlPrefix +  json['Media-List']['src3'][i] : urlPrefix + json['Media-List']['src3'][0];
    const items = [
      {
        headline: json['Media-List'].Header[i],
      },
      {
        icon: {
          url: json['Media-List']['items/icon/url'][i] ? urlPrefix +  json['Media-List']['items/icon/url'][i] : urlPrefix + json['Media-List']['items/icon/url'][0],
        },
        headline: json['Media-List']['Header2'][i],
        copy: json['Media-List']['Body'][i]
      },
      {
        icon: {
          url: json['Media-List']['items/icon2/url'][i] ? urlPrefix +  json['Media-List']['items/icon2/url'][i] : urlPrefix + json['Media-List']['items/icon2/url'][0],
        },
        headline: json['Media-List']['Subhead'][i],
        copy: json['Media-List']['BodySubhead'][i]
      },
      {
        icon: {
          url: json['Media-List']['items/icon3/url'][i] ? urlPrefix +  json['Media-List']['items/icon3/url'][i] : urlPrefix + json['Media-List']['items/icon3/url'][0],
        },
        headline: json['Media-List']['Subhead2'][i],
        copy: json['Media-List']['BodySubhead2'][i]
      }
    ];
    jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items = items;
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[1].icon.url = json['Media-List']['items/icon/url'][i] ? urlPrefix +  json['Media-List']['items/icon/url'][i] : urlPrefix + json['Media-List']['items/icon/url'][0];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[0].headline = json['Media-List'].Header[i];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[1].headline = json['Media-List'].Header2[i];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[1].copy = json['Media-List'].Body[i];

    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[2].icon.url = json['Media-List']['items/icon2/url'][i] ? urlPrefix + json['Media-List']['items/icon2/url'][i] : urlPrefix + json['Media-List']['items/icon2/url'][0];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[2].headline = json['Media-List'].Subhead[i];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[2].copy = json['Media-List'].BodySubhead[i];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[3].icon.url = json['Media-List']['items/icon3/url'][i] ? urlPrefix + json['Media-List']['items/icon3/url'][i] : urlPrefix + json['Media-List']['items/icon3/url'][0];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[3].headline = json['Media-List'].Subhead2[i];
    //jsonTranslations[i].landingRepeater.articleSections[2].mediaWithList.items[3].copy = json['Media-List'].BodySubhead[i];

    if (json.NewsLetterForm) {
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.image.alt = json.NewsLetterForm['Alt text'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.image.src['1x'] = json.NewsLetterForm['src1x'][i] ? urlPrefix +  json.NewsLetterForm['src1x'][i] : urlPrefix + json.NewsLetterForm['src1x'][0];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.image.src['2x'] = json.NewsLetterForm['src2x'][i] ? urlPrefix +  json.NewsLetterForm['src2x'][i] : urlPrefix + json.NewsLetterForm['src2x'][0];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.image.src['3x'] = json.NewsLetterForm['src3x'][i] ? urlPrefix +  json.NewsLetterForm['src3x'][i] : urlPrefix + json.NewsLetterForm['src3x'][0];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.header = json.NewsLetterForm['Header'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.description = json.NewsLetterForm['Body'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[0].newsletterInput.label = json.NewsLetterForm['Eyebrow'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[0].newsletterInput.complianceMessage = json.NewsLetterForm['Email message'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[0].newsletterInput.placeholder = json.NewsLetterForm['Pre-populated form field copy'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[1].newsletterInput.label = json.NewsLetterForm['Eyebrow2'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[1].newsletterInput.complianceMessage = json.NewsLetterForm['Phone message'][i];
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm.forms[1].newsletterInput.placeholder = json.NewsLetterForm['Pre-populated form field copy2'][i];
    } else {
      jsonTranslations[i].landingRepeater.articleSections[3].newsletterForm = null;
    };

    if (json['Col 1 / Copy Block']) {
      const cta = [
        {
          text: json['Col 1 / Copy Block'].Cta[i],
          type: "tertiary",
          link: "#"
        }
      ];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[0].copyBlock.headline = json['Col 1 / Copy Block'].Header[i];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[0].copyBlock.copy = json['Col 1 / Copy Block'].Body[i];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[0].copyBlock.cta = cta;
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[1].mediaCard.images[0].image.alt = json['Col 2 / Media Card']['Alt text'][i];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[1].mediaCard.images[0].image.src['1x'] = json['Col 2 / Media Card']['src1x'][i] ? urlPrefix + json['Col 2 / Media Card']['src1x'][i] : urlPrefix + json['Col 2 / Media Card']['src1x'][0];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[1].mediaCard.images[0].image.src['2x'] = json['Col 2 / Media Card']['src2x'][i] ? urlPrefix + json['Col 2 / Media Card']['src2x'][i] : urlPrefix + json['Col 2 / Media Card']['src2x'][0];
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer.columns[1].mediaCard.images[0].image.src['3x'] = json['Col 2 / Media Card']['src3x'][i] ? urlPrefix + json['Col 2 / Media Card']['src3x'][i] : urlPrefix + json['Col 2 / Media Card']['src3x'][0];
    } else {
      jsonTranslations[i].landingRepeater.articleSections[4].columnsContainer = null;
    };

    jsonTranslations[i].landingRepeater.articleSections[5].copyBlock.headline = json['Section2 / Copy Block']['Header'][i];
    jsonTranslations[i].landingRepeater.articleSections[5].copyBlock.copy = json['Section2 / Copy Block']['Body'][i];
    jsonTranslations[i].landingRepeater.articleSections[5].copyBlock.cta[0].text = json['Section2 / Copy Block']['CTA'][i];
    jsonTranslations[i].landingRepeater.articleSections[5].copyBlock.cta[1].text = json['Section2 / Copy Block']['CTA2'][i];
    jsonTranslations[i].landingRepeater.articleSections[5].copyBlock.theme = json['Section2 / Copy Block']['theme'][0];

    const images = [
      {
        image: {
          alt: json['Intro/MediaCard']['Alt text'][i],
          src: {
            '1x': json['Intro/MediaCard']['src1x'][i] ? urlPrefix + json['Intro/MediaCard']['src1x'][i] : urlPrefix + json['Intro/MediaCard']['src1x'][0],
            '2x': json['Intro/MediaCard']['src2x'][i] ? urlPrefix + json['Intro/MediaCard']['src2x'][i] : urlPrefix + json['Intro/MediaCard']['src2x'][0],
            '3x': json['Intro/MediaCard']['src3x'][i] ? urlPrefix + json['Intro/MediaCard']['src3x'][i] : urlPrefix + json['Intro/MediaCard']['src3x'][0]
          }
        }
      }
    ];

    jsonTranslations[i].landingRepeater.articleSections[6].mediaCard.images = images;
    jsonTranslations[i].landingRepeater.articleSections[6].mediaCard.theme = json['Intro/MediaCard']['theme'][0];

    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.headline = json['Section3 / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.copy = json['Section3 / Copy Block'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[7].copyBlock.cta[0].text = json['Section3 / Copy Block'].CTA[i];

    jsonTranslations[i].landingRepeater.articleSections[8].copyBlock.headline = json['Section4 / Copy Block'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[8].copyBlock.copy = json['Section4 / Copy Block']['Body'][i];
    jsonTranslations[i].landingRepeater.articleSections[8].copyBlock.cta[0].text = json['Section4 / Copy Block'].CTA[i];
  });
  return jsonTranslations;
}

const getRunfulnessTranslations = (json, jsonTranslations) => {
  translations.forEach((_, i) => {
    //jsonTranslations[i].landingRepeater.heroMedia.background.alt = json['Hero Media']['Alt text'][i];
    //jsonTranslations[i].landingRepeater.heroMedia.background.image = json['Hero Media']['Background image'][i] ? urlPrefix +  json['Hero Media']['Background image'][i] : urlPrefix + json['Hero Media']['Background image'][0];
    jsonTranslations[i].landingRepeater.heroMedia.content.title.text = json['Hero Media'].Header[i];
    jsonTranslations[i].landingRepeater.heroMedia.content.description = json['Hero Media'].Body[i];

    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.cover.src = json['Hero Media']['Cover src'][i] ? urlPrefix +  json['Hero Media']['Cover src'][i] : urlPrefix + json['Hero Media']['Cover src'][0];;
    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.cover.alt = json['Hero Media']['Alt text'][i];;
    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.src.large = json['Hero Media']['Src large'][i] ? urlPrefix +  json['Hero Media']['Src large'][i] : urlPrefix + json['Hero Media']['Src large'][0];;
    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.src.small = json['Hero Media']['Src small'][i] ? urlPrefix +  json['Hero Media']['Src small'][i] : urlPrefix + json['Hero Media']['Src small'][0];;
    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.playLabel = json['Hero Media']['Playlabel'][i];
    jsonTranslations[i].landingRepeater.heroMedia.ambientVideo.pauseLabel = json['Hero Media']['Pauselabel'][i];

    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.eyebrow = json['Intro/CopyBlock'].Eyebrow[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.headline = json['Intro/CopyBlock'].Header[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[0].copyBlock.copy = json['Intro/CopyBlock'].Body[i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.alt = json['Intro/MediaCard']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['1x'] = json['Intro/MediaCard']['src1x'][i] ? urlPrefix +  json['Intro/MediaCard']['src1x'][i] : urlPrefix + json['Intro/MediaCard']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['2x'] = json['Intro/MediaCard']['src2x'][i] ? urlPrefix +  json['Intro/MediaCard']['src2x'][i] : urlPrefix + json['Intro/MediaCard']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[0].columnsContainer.columns[1].mediaCard.images[0].image.src['3x'] = json['Intro/MediaCard']['src3x'][i] ? urlPrefix +  json['Intro/MediaCard']['src3x'][i] : urlPrefix + json['Intro/MediaCard']['src3x'][0];

    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.alt = json['section1/MediaCard']['Alt text'][i];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['1x'] = json['section1/MediaCard']['src1x'][i] ? urlPrefix +  json['section1/MediaCard']['src1x'][i] : urlPrefix + json['section1/MediaCard']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['2x'] = json['section1/MediaCard']['src2x'][i] ? urlPrefix +  json['section1/MediaCard']['src2x'][i] : urlPrefix + json['section1/MediaCard']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[1].columnsContainer.columns[0].mediaCard.images[0].image.src['3x'] = json['section1/MediaCard']['src3x'][i] ? urlPrefix +  json['section1/MediaCard']['src3x'][i] : urlPrefix + json['section1/MediaCard']['src3x'][0];
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
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['1x'] = json['section3/CopyBlock-Media Card']['src1x'][i] ? urlPrefix +  json['section3/CopyBlock-Media Card']['src1x'][i] : urlPrefix + json['section3/CopyBlock-Media Card']['src1x'][0];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['2x'] = json['section3/CopyBlock-Media Card']['src2x'][i] ? urlPrefix +  json['section3/CopyBlock-Media Card']['src2x'][i] : urlPrefix + json['section3/CopyBlock-Media Card']['src2x'][0];
    jsonTranslations[i].landingRepeater.articleSections[5].mediaCard.images[0].image.src['3x'] = json['section3/CopyBlock-Media Card']['src3x'][i] ? urlPrefix +  json['section3/CopyBlock-Media Card']['src3x'][i] : urlPrefix + json['section3/CopyBlock-Media Card']['src3x'][0];
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

const landingLaunch = (auth, spreadSheetSrc, defaultJson, translationCallback, destinationPath) => {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    spreadSheetSrc,
    (err, res) => {
      if (err) return
      const rows = res.data.values;
      if (!rows.length) return
      const jsonTranslations = getJsonTranslations(defaultJson);

      const landingTranslations = translationCallback(spreadsheetToJson(rows), jsonTranslations);
      createFile(landingTranslations, `./languages/${destinationPath}`);
    });
}

const parseLanding = (auth) => {
  const spreadsheetId = '1VneH5neC5OPKnUEICXCsDJHxtgnIGw6H1zwtFGpWuH8';
  const landingsParameters = {
    runfulnessP1: {
        range: 'Runfulness Phase 1 LP!A2:G',
        defaultJson: require("../RunfulnessP1/runfulnessP1.json"),
        destinationPath: 'runfulnessP1/landing-repeating~runfulness-p1_',
        translationCallback: getRunfulnessTranslations
    },
    runfulnessP2: {
        range: 'Runfulness Phase 2 LP!A2:G',
        defaultJson: require("../RunfulnessP1/runfulnessP1.json"),
        destinationPath: 'runfulnessP2/landing-repeating~runfulness-p2_',
        translationCallback: getRunfulnessTranslations,
    },
    glycerin19Tease: {
        range: 'Glycerin 19 Tease LP!A2:G',
        defaultJson: require("../glycerin19Launch/glycerin19.json"),
        destinationPath: 'glycerin19Tease/landing-repeating~glycerin19-tease_',
        translationCallback: getGlycerinTranslations
    },
    glycerin19Launch: {
        range: 'Glycerin 19 Launch LP!A2:G',
        defaultJson: require("../glycerin19Launch/glycerin19.json"),
        destinationPath: 'glycerin19Launch/landing-repeating~glycerin19-launch_',
        translationCallback: getGlycerinTranslations
    }
  };

  for (const [key, value] of Object.entries(landingsParameters)) {
    const spreadSheetSrc = {
      spreadsheetId,
      range: value.range
    };
    const { defaultJson, translationCallback } = value;
    const destinationPath = value.destinationPath;

    landingLaunch(auth, spreadSheetSrc, defaultJson, translationCallback, destinationPath);
  }
}

module.exports = { parseLanding }