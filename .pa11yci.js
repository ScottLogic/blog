/// This is a configuration file automatically picked up by pa11y-ci.

const relativeUrls = require('./pa11y-ci-urls');

const chromiumBin = process.env.CHROMIUM_BIN;
if (!chromiumBin) {
  throw new Error('CHROMIUM_BIN environment variable is not set');
}

const baseUrl = 'http://localhost:4000';

// Colour contrast is a known issue. If we ever fix the brand colours, this should be removed.
const colourContrastRuleIds = [
  // HTML CodeSniffer rule IDs come from section 1.4.3 of:
  // https://squizlabs.github.io/HTML_CodeSniffer/Standards/WCAG2/
  'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail', // normal text
  'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail', // large text
];

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      executablePath: chromiumBin,
    },
    ignore: [
      ...colourContrastRuleIds,
    ],
  },
  urls: relativeUrls.map((url) => `${baseUrl}${url}`),
};
