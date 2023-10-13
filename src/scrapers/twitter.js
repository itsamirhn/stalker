import AbstractScraper from './abstract.js';
import Storage from '../storage.js';

class Tweet {
  constructor(obj) {
    this.username = obj.username;
    this.text = obj.text;
    this.date = obj.date;
  }
}

class Connection {
  constructor(obj) {
    this.username = obj.username;
    this.follows = obj.follows;
  }
}

class TwitterScraper extends AbstractScraper {
  constructor(document) {
    super(document);
    this.storage = new Storage('twitter');
  }

  async scrape(mutations) {
    const path = window.location.pathname;

    const followingRegex = /^\/([^/]+)\/following\/?$/;

    if (followingRegex.test(path)) {
      let username = followingRegex.exec(path)[1];
      return this.scrapeConnections(mutations, username, false);
    }

    const followersRegex =
      /^\/([^/]+)\/followers|verified_followers|verified_followers\/?$/;
    if (followersRegex.test(path)) {
      let username = followersRegex.exec(path)[1];
      return this.scrapeConnections(mutations, username, true);
    }

    return this.scrapeTweets(mutations);
  }

  async scrapeConnections(mutations, username, reverse) {
    for (let mutation of mutations)
      for (let node of mutation.addedNodes)
        if (
          node.nodeName == 'DIV' &&
          node.getAttribute('data-testid') == 'cellInnerDiv'
        ) {
          this.scrapeConnection(node, username, reverse);
        }
  }

  async scrapeConnection(node, username, reverse) {
    let follows = this.getUsername(node);
    if (!follows) return;

    if (reverse) {
      let temp = username;
      username = follows;
      follows = temp;
    }
    let connection = new Connection({ username, follows });
    console.log(
      `Scraped connection: ${connection.username} -> ${connection.follows}`
    );
    this.storeConnection(connection);
  }

  async scrapeTweets(mutations) {
    for (let mutation of mutations)
      for (let node of mutation.addedNodes)
        for (let article of this.getArticles(node)) this.scrapeArticle(article);
  }

  getArticles(node) {
    if (!node.querySelectorAll) return [];
    return node.querySelectorAll('article');
  }

  getUsername(node) {
    return node
      .querySelector("a[href^='/']")
      ?.getAttribute('href')
      ?.substring(1);
  }

  scrapeArticle(article) {
    let username = this.getUsername(article);
    let text = article.querySelector('div[lang]')?.textContent;
    let dateString = article.querySelector('time')?.getAttribute('datetime');

    if (!username || !text || !dateString) return;

    let date = new Date(dateString);
    let tweet = new Tweet({ username, text, date });

    this.storeTweet(tweet);
  }

  async storeTweet(tweet) {
    return this.storage.append('tweets', JSON.stringify(tweet));
  }

  async storeConnection(connection) {
    return this.storage.append('connections', JSON.stringify(connection));
  }

  async clearTweets() {
    return this.storage.set('tweets', []);
  }

  async clearConnections() {
    return this.storage.set('connections', []);
  }

  async getTweets() {
    let encodedTweets = await this.storage.get('tweets');
    let tweets = [];
    for (let encodedTweet of encodedTweets) {
      try {
        tweets.push(new Tweet(JSON.parse(encodedTweet)));
      } catch (e) {
        console.error(e);
      }
    }
    return tweets;
  }

  async getConnections() {
    let encodedConnections = await this.storage.get('connections');
    let connections = [];
    for (let encodedConnection of encodedConnections) {
      try {
        connections.push(new Connection(JSON.parse(encodedConnection)));
      } catch (e) {
        console.error(e);
      }
    }
    return connections;
  }
}

export default TwitterScraper;
