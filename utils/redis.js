// Task 0 - Redis Utils

const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Display any errors in the console
    this.client.on('error', (err) => {
      console.error(`Redis client error: ${err}`);
    });

    // Connect to the server
    this.client.connected = true;
  }

  // Check if the connection is alive
  isAlive() {
    return this.client.connected;
  }

  // Retrieve the value from Redis for the given key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Store the value in Redis with expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Remove the value from Redis for the given key
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
