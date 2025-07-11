const e = require("express");

const label = `KIPP-MALLERY
PHARMACY
Phone:
273 VICTORIA ST., KAMLOOPS, B.C. 372-2531
Rx: 13078669 Faliszewski, Lyla
Dr. Guttman, Orlee R SS 27-May-2025
300 ML Tacrolimus 1 mg/ml Suspension (Sand...
DIN: 22123266
BUD: 24-Sep-2020
Mfr: MIX Refills: 1
(TACROLIMUS 1MG/ML).. SHAKE
WELL.. GIVE LYLA 2.5ML (=2.5MG
TACROLIMUS) ORALLY EVERY 12
HOURS ***DO NOT REFRIGERATE
All Refills Expire: 18-Oct-2026
SHAKE WELL
@1976
1984
STORE AT
ROOM TEMPERATURE
DO NOT REFRIGERA`;

const administerVerbs = [
  "take",
  "give",
  "use",
  "swallow",
  "inject",
  "administer",
  "apply",
  "chew",
  "ingest",
];

const administerAdverbs = [
  "orally",
  "subcutaneously",
  "rectally",
  "lightly",
  "liberally",
  "generously",
];

const frequencyWords = [
  "daily",
  "days",
  "day",
  "every day",
  "every",
  "weekly",
  "weeks",
  "week",
  "monthly",
  "months",
  "month",
  "hourly",
  "hours",
  "hour",
  "times per day",
  "times a day",
  "times per week",
  "times a week",
  "times per month",
  "times a month",
  "times",
  "per day",
  "per week",
  "per month",
  "a day",
  "a week",
  "a month",
  "once",
  "twice",
  "per",
  "bid",
  "tid",
  "qid",
];

const units = [
  "ml",
  "mg",
  "cc",
  "milligrams",
  "milligram",
  "milliliters",
  "milliliter",
  "micrograms",
  "microgram",
  "grams",
  "gram",
  "units",
  "unit",
  "mcg",
  "g",
  "capsules",
  "capsule",
  "pills",
  "pill",
  "tablets",
  "tablet",
  "tsp",
  "teaspoons",
  "teaspoon",
  "tbsp",
  "tbs",
  "tb",
  "tablespoons",
  "tablespoon",
  "oz",
  "fl oz",
  "ounces",
  "ounce",
  "µg",
  "µ",
];

// Regex patterns
// const numberPattern = /[-+]?(\d*\.\d+|\d+\/\d+|\d+)/g;
// const numberPattern = /[-+]?(\d*\.\d+|\d+\/\d+|\d+)/;
const numberPattern = `[-+]?(\\d*\\.\\d+|\\d+\\/\\d+|\\d+)`;
const anyWordPattern = `\\b\\w+\\b`;

const bracketedPattern = `\\([^)]*\\)`;

const administerVerbsPattern = administerVerbs.join("|");
const administerAdverbsPattern = administerAdverbs.join("|");
const frequencyWordsPattern = frequencyWords.join("|");
const unitsPattern = units.join("|");

// const numberReg = new RegExp(numberPattern, "g");

// Sentence patterns
const directionsPatterns = [
  `(${administerVerbsPattern})\\s*(${anyWordPattern})*\\s*(${numberPattern})\\s*(${unitsPattern})\\s*(${bracketedPattern})?\\s*(${administerAdverbsPattern})?\\s*(${frequencyWordsPattern})?\\s*(${numberPattern})?\\s*(${frequencyWordsPattern})?`,
  `(${administerVerbsPattern})\\s*(${anyWordPattern})\\s*(${anyWordPattern})\\s*(${numberPattern})\\s*(${unitsPattern})`,
];

const dirPat = new RegExp(directionsPatterns[0], "gi");

const result = label.match(dirPat);

console.log(result);

/* const testNames = ["steve", "lyla", "Cecy"];
const testNamesPattern = testNames.join("|");

const example = "Give Steve 2.5ML twice daily";

const smaller = new RegExp(
  `(${testNamesPattern})\\s*(${numberPattern})\\s*(${unitsPattern})`,
  "gi"
);

const smallRes = example.match(smaller);
console.log(smallRes[0]); */

// const text = "GIVE LYLA 2.5ML (=2.5MG TACROLIMUS) ORALLY EVERY 12 HOURS";

// const bracketed = /\([^)]*\)/;

// const matchi = text.match(bracketed);
// console.log(matchi);
