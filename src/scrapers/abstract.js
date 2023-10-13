class AbstractScraper {
  constructor(document) {
    this.document = document;
  }

  async scrape(_mutations) {
    throw new Error('Not implemented');
  }
}

export default AbstractScraper;
