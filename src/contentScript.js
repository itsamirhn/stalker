'use strict';

import TwitterScraper from './scrapers/twitter.js';

const scrapers = [new TwitterScraper(document)];
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
  scrapers.forEach(function (scraper) {
    scraper.scrape(mutations);
  });
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
