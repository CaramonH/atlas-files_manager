// Task 2 - First Api
// Controller file

// Import the dbClient and redisClient
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const AppController = {
  // Get status of Redis and MongoDB
  getStatus: (request, response) => {
    // Check if things are alive
    const redisAlive = redisClient.isAlive();
    const dbAlive = dbClient.isAlive();

    // Send status as JSON response
    if (redisAlive && dbAlive) {
      response.status(200).json({ redis: true, db: true });
    } else {
      response.status(500).json({ error: 'Service Not Available' });
    }
  },

  // Get statistics of users and files
  getStats: async (request, response) => {
    try {
      // Get number of users from MongoDB
      const usersCount = await dbClient.nbUsers();
      // Get number of files from MongoDB
      const filesCount = await dbClient.nbFiles();

      // Send statistics as JSON response
      response.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
      // Send error message if there's an error
      response.status(500).json({ message: 'Error retrieving statistics' });
    }
  },
};

module.exports = AppController;
