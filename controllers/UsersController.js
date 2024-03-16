// Task 3 - Create a new user
// Controller file

// Import the dbClient and redisClient
// import redisClient from '../utils/redis'; // might need redis but not now

const dbClient = require('../utils/db');
const sha1 = require('../node_modules/sha1');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is missing
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if email already exists in DB
      const userExists = await dbClient.getUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create the new user
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Save the new user in the collection users
      const savedUser = await dbClient.createUser(newUser);

      // Return the new user with only the email and the id
      return res.status(201).json({ email: savedUser.email, id: savedUser._id });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
