// Task 4 AuthController

const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('../node_modules/uuid');
const sha1 = require('../node_modules/sha1');
const dbClient = require('../utils/db');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Splitting the authorization header on space then taking the second part
    const base64Credentials = authHeader.split(' ')[1];
    // This then decodes the part taken previously into a string
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    // This splits up the decoded string to get the email and password
    // as it is expecting them to be separated by a ':'
    const [email, password] = credentials.split(':');

    // This checks if the user put in a valid password
    try {
      const user = await dbClient.getUserByEmail(email);
      if (!user || user.password !== sha1(password)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Creates a token then attaches the user by _id to it and then sets it to expire in 1 day
      const token = uuidv4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60); // Expires in 24 hours

      // returns the token after creation and gives the good status
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error in getConnect:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    // looking for x-token
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // matching the userId to token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // deletes the token upon sign-out
    await redisClient.del(`auth_${token}`);
    // returns the status that it was deleted properly
    return res.sendStatus(204);
  }
}

module.exports = AuthController;
