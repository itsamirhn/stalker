'use strict';

import './popup.css';
import TwitterScraper from './scrapers/twitter.js';

(function () {
  function downloadData(objectURL, filename) {
    let a = document.createElement('a');
    a.setAttribute('href', objectURL);
    a.setAttribute('download', filename);
    a.click();
  }

  function downloadJSON(data, filename) {
    var url = window.webkitURL || window.URL || window.mozURL || window.msURL;
    let objectURL = url.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    );
    downloadData(objectURL, filename);
  }

  async function exportTwitter() {
    let twitterScraper = new TwitterScraper(document);
    twitterScraper.getTweets().then((tweets) => {
      downloadJSON(tweets, 'tweets.json');
    });
    twitterScraper.getConnections().then((connections) => {
      downloadJSON(connections, 'connections.json');
    });
  }

  async function clearTwitter() {
    let twitterScraper = new TwitterScraper(document);
    await Promise.all([
      twitterScraper.clearTweets(),
      twitterScraper.clearConnections(),
    ]);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document
      .getElementById('exportTwitterBtn')
      .addEventListener('click', exportTwitter);
    document
      .getElementById('clearTwitterBtn')
      .addEventListener('click', clearTwitter);
  });
})();
