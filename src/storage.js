import AsyncLock from 'async-lock';

class Storage {
  constructor(identifier) {
    this.identifier = identifier;
    this.lock = new AsyncLock();
  }

  getKey(key) {
    return `${this.identifier}.${key}`;
  }

  async get(key) {
    let storedKey = this.getKey(key);
    return this.lock.acquire(storedKey, function () {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get([storedKey], (result) => {
          resolve(result[storedKey]);
        });
      });
    });
  }

  async set(key, value) {
    let storedKey = this.getKey(key);
    return this.lock.acquire(storedKey, function () {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [storedKey]: value }, () => {
          resolve();
        });
      });
    });
  }

  async append(key, value) {
    let storedKey = this.getKey(key);
    return this.lock.acquire(storedKey, function () {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get([storedKey], (result) => {
          let values = result[storedKey] || [];
          values.push(value);
          chrome.storage.local.set({ [storedKey]: values }, () => {
            resolve();
          });
        });
      });
    });
  }
}

export default Storage;
